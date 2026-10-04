import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Global3DBackground() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 15);

    const primary = new THREE.Color("#0047AB");
    const accent = new THREE.Color("#F28C28");

    const group = new THREE.Group();
    scene.add(group);

    // Points distributed on a sphere-ish lattice
    const count = 150;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 8 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 1.5;
      pts.push(new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)));
    }

    const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.7 });
    const accentMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.9 });
    
    pts.forEach((p, i) => {
      const m = new THREE.Mesh(i % 17 === 0 ? new THREE.SphereGeometry(0.15, 16, 16) : nodeGeo, i % 17 === 0 ? accentMat : nodeMat);
      m.position.copy(p);
      group.add(m);
    });

    const linePos: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) { 
        const a = pts[i]!, b = pts[j]!; 
        if (a.distanceTo(b) < 3.0) linePos.push(...a.toArray(), ...b.toArray()); 
      }
    }
    
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.15 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Outer rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.01, 8, 160),
      new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.2 })
    );
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);
    
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(6.5, 0.015, 8, 160),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.15 })
    );
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    const target = { x: 0, y: 0 };
    let scrollY = 0;
    
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      
      if (!reduce) {
        group.rotation.y = t * 0.03;
        ring1.rotation.z = t * 0.05;
        ring2.rotation.z = -t * 0.04;
      }
      
      // Add subtle parallax effect on scroll
      camera.position.y = 15 - (scrollY * 0.005);
      camera.lookAt(0, 0, 0);
      
      group.rotation.x += (target.y - group.rotation.x) * 0.02;
      group.position.x += (target.x - group.position.x) * 0.02;
      
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />;
}
