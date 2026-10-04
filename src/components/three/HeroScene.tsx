import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

    const primary = new THREE.Color("#0047AB");
    const accent = new THREE.Color("#F28C28");

    const group = new THREE.Group();
    scene.add(group);

    // Points distributed on a sphere-ish lattice
    const count = 90;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 4 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.9;
      pts.push(new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)));
    }

    const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: primary });
    const accentMat = new THREE.MeshBasicMaterial({ color: accent });
    pts.forEach((p, i) => {
      const m = new THREE.Mesh(i % 17 === 0 ? new THREE.SphereGeometry(0.11, 16, 16) : nodeGeo, i % 17 === 0 ? accentMat : nodeMat);
      m.position.copy(p);
      group.add(m);
    });

    const linePos: number[] = [];
    for (let i = 0; i < count; i++)
      for (let j = i + 1; j < count; j++)
        { const a = pts[i]!, b = pts[j]!; if (a.distanceTo(b) < 1.9) linePos.push(...a.toArray(), ...b.toArray()); }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.28 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Inner ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.008, 8, 160),
      new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.5 }),
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduce) group.rotation.y = t * 0.06;
      group.rotation.x += (target.y - group.rotation.x) * 0.04;
      group.position.x += (target.x - group.position.x) * 0.04;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
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

  return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
}
