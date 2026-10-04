import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Global3DBackground() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 15);

    const primary = new THREE.Color("#0047AB");
    const accent = new THREE.Color("#F28C28");
    const highlight = new THREE.Color("#F24C28");

    const group = new THREE.Group();
    scene.add(group);

    // 1. Deep background starfield
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for(let i = 0; i < starCount * 3; i++) {
       starPos[i] = (Math.random() - 0.5) * 120;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.5, sizeAttenuation: true });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 2. Interactive InstancedMesh Nodes
    const count = 400;
    const nodeGeo = new THREE.IcosahedronGeometry(0.06, 1);
    const nodeMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.8, wireframe: true });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, count);
    
    const dummy = new THREE.Object3D();
    const originalPositions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 10 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 4.0;
      
      const p = new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi), 
        r * Math.sin(theta) * Math.sin(phi), 
        r * Math.cos(phi)
      );
      
      // Scramble positions slightly
      p.x += (Math.random() - 0.5) * 2;
      p.y += (Math.random() - 0.5) * 2;
      p.z += (Math.random() - 0.5) * 2;

      originalPositions.push(p.clone());
      velocities.push(new THREE.Vector3(0, 0, 0));
      
      dummy.position.copy(p);
      
      const scale = Math.random() > 0.95 ? 1.5 : Math.random() * 0.5 + 0.5;
      dummy.scale.setScalar(scale);
      
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
      
      const randColor = Math.random();
      if (randColor > 0.9) instancedNodes.setColorAt(i, highlight);
      else if (randColor > 0.8) instancedNodes.setColorAt(i, accent);
      else instancedNodes.setColorAt(i, primary);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    if(instancedNodes.instanceColor) instancedNodes.instanceColor.needsUpdate = true;
    group.add(instancedNodes);

    // 3. Wavy Energy Ribbons
    const ribbons = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-20, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
        new THREE.Vector3(-10, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
        new THREE.Vector3(0, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
        new THREE.Vector3(10, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
        new THREE.Vector3(20, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: i === 0 ? accent : primary, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      ribbons.add(tube);
    }
    group.add(ribbons);

    const target = { x: 0, y: 0 };
    let scrollY = 0;
    
    // Raycaster for mouse repulsion
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(999, 999);
    
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
      
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
        group.rotation.y = t * 0.04;
        group.rotation.x = Math.sin(t * 0.02) * 0.15;
        stars.rotation.y = t * 0.015;
        
        ribbons.rotation.y = -t * 0.05;
        ribbons.rotation.z = Math.sin(t * 0.1) * 0.1;
      }
      
      // Mouse Repulsion Logic
      raycaster.setFromCamera(mouse, camera);
      const intersectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(intersectionPlane, intersectPoint);
      
      for (let i = 0; i < count; i++) {
        instancedNodes.getMatrixAt(i, dummy.matrix);
        dummy.position.setFromMatrixPosition(dummy.matrix);
        
        // Convert local position to world to check against mouse
        const worldPos = dummy.position.clone().applyMatrix4(group.matrixWorld);
        const dist = worldPos.distanceTo(intersectPoint);
        
        // Repulsion force
        if (dist < 4.0) {
          const force = (4.0 - dist) * 0.02;
          const dir = worldPos.clone().sub(intersectPoint).normalize();
          velocities[i]!.add(dir.multiplyScalar(force));
        }
        
        // Return to original position
        const spring = originalPositions[i]!.clone().sub(dummy.position).multiplyScalar(0.01);
        velocities[i]!.add(spring);
        velocities[i]!.multiplyScalar(0.92); // Friction
        
        dummy.position.add(velocities[i]!);
        
        // Rotate instances
        dummy.rotation.x += 0.01;
        dummy.rotation.y += 0.02;
        
        dummy.updateMatrix();
        instancedNodes.setMatrixAt(i, dummy.matrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;
      
      // Make scroll spin the globe instead of moving the camera away
      group.rotation.x = Math.sin(t * 0.02) * 0.15 + (scrollY * 0.001);
      
      // Keep the camera locked at a consistent distance
      camera.position.y = 0;
      camera.position.z = 25; 
      
      // Mouse sway on camera
      camera.position.x += (target.x * 10 - camera.position.x) * 0.05;
      camera.position.y += (-target.y * 10 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      
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
