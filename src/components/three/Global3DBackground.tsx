import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const gridVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const gridFrag = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec3  uColor;
  uniform vec3  uAccent;
  varying vec3 vWorld;

  float gridLine(vec2 uv, float scale) {
    vec2 c = uv / scale;
    vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    vec2 uv = vWorld.xz;
    uv.y += uTime * 1.6;                           // grid flows toward the viewer

    float minor = gridLine(uv, 2.0);
    float major = gridLine(uv, 10.0);

    float dist = distance(vWorld.xz, cameraPosition.xz);
    float fade = smoothstep(90.0, 8.0, dist);

    float spot = smoothstep(9.0, 0.0, distance(vWorld.xz, uMouse));   // glow under the cursor
    vec3 col = mix(uColor, uAccent, spot);
    float a = (minor * 0.16 + major * 0.3) * fade + spot * (minor + major) * 0.5 * fade;
    gl_FragColor = vec4(col, a);
  }
`;

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/**
 * Site-wide background: a perspective grid floor, a floating data network with packets
 * flowing along its links, and drifting glass cubes. Scrolling flies the camera forward
 * through the scene. Uses normal blending, so it reads on both light and dark pages.
 */
export default function Global3DBackground() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    // Keep pixel ratio at native, but cap at 2 for performance on mobile while keeping anti-aliasing
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 1, 20);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 10, 8);
    scene.add(key);

    const primary = new THREE.Color("#0047AB");
    const accent = new THREE.Color("#F28C28");
    const blueGlow = primary.clone().lerp(new THREE.Color("#ffffff"), 0.2);
    const glowTex = makeGlowTexture();

    /* 1. Perspective grid floor */
    const mouseGrid = new THREE.Vector2(999, 999);
    const mouseGridTarget = new THREE.Vector2(999, 999);
    const gridMat = new THREE.ShaderMaterial({
      vertexShader: gridVert,
      fragmentShader: gridFrag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: mouseGrid },
        uColor: { value: primary },
        uAccent: { value: accent },
      },
    });
    const FLOOR_Y = -7;
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, FLOOR_Y, -60);
    scene.add(grid);

    /* 2. Data network */
    const nodeCount = isMobile ? 22 : 70;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3((Math.random() - 0.5) * 46, -4 + Math.random() * 14, -28 + Math.random() * 30),
      );
    }
    const nodePos = new Float32Array(nodeCount * 3);
    const nodeCol = new Float32Array(nodeCount * 3);
    nodes.forEach((n, i) => {
      nodePos.set(n.toArray(), i * 3);
      const c = Math.random() > 0.82 ? accent : blueGlow;
      nodeCol.set([c.r, c.g, c.b], i * 3);
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
    const nodePoints = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({
        size: 1.1,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );

    const edges: [number, number][] = [];
    const linePos: number[] = [];
    for (let i = 0; i < nodeCount; i++)
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i]!.distanceTo(nodes[j]!) < 10) {
          edges.push([i, j]);
          linePos.push(...nodes[i]!.toArray(), ...nodes[j]!.toArray());
        }
      }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.22 }),
    );

    // packets travelling along random links
    const packetCount = isMobile ? 8 : 34;
    const packetPos = new Float32Array(packetCount * 3);
    const packets = Array.from({ length: packetCount }, () => ({
      edge: Math.floor(Math.random() * Math.max(edges.length, 1)),
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.65,
      rev: Math.random() > 0.5,
    }));
    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    const packetPoints = new THREE.Points(
      packetGeo,
      new THREE.PointsMaterial({ size: 0.9, map: glowTex, color: accent, transparent: true, depthWrite: false }),
    );
    packetPoints.frustumCulled = false;

    const network = new THREE.Group();
    network.add(lines, nodePoints, packetPoints);
    scene.add(network);

    /* 3. Floating glass cubes (parallax layer) */
    const cubeCount = isMobile ? 3 : 12;
    const cubeGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.18);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo, 20);
    const cubes: { g: THREE.Group; base: THREE.Vector3; depth: number; spin: number }[] = [];
    for (let i = 0; i < cubeCount; i++) {
      const warm = i % 4 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: warm ? primary : "#cfe0ff",
        metalness: warm ? 0.35 : 0.1,
        roughness: 0.12,
        transparent: true,
        opacity: warm ? 0.9 : 0.4,
      });
      const g = new THREE.Group();
      g.add(new THREE.Mesh(cubeGeo, mat));
      g.add(new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.45 })));
      const s = 0.8 + Math.random() * 1.8;
      g.scale.setScalar(s);
      const base = new THREE.Vector3((Math.random() - 0.5) * 40, -3 + Math.random() * 11, -22 + Math.random() * 28);
      g.position.copy(base);
      scene.add(g);
      cubes.push({ g, base, depth: 0.3 + Math.random() * 0.9, spin: (Math.random() - 0.5) * 0.5 });
    }

    /* 4. Deep space ambient dust/particles */
    const dustCount = isMobile ? 150 : 400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPos[i] = (Math.random() - 0.5) * 100;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.3,
      color: blueGlow,
      transparent: true,
      opacity: 0.4,
      map: glowTex,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    /* ---------- Input ---------- */
    const camTarget = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollSmooth = 0;

    const onMove = (e: PointerEvent) => {
      // Disabled mouse tracking per user request
    };
    const onScroll = () => {
      scrollTarget = window.scrollY;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* ---------- Loop ---------- */
    let raf = 0;
    let time = 0;
    let last = performance.now();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;
      if (!reduce) time += dt;

      scrollSmooth += (scrollTarget - scrollSmooth) * 0.15;
      mouseGrid.lerp(mouseGridTarget, 0.15);
      gridMat.uniforms.uTime!.value = time;

      // packets glide along their links
      if (edges.length) {
        for (let i = 0; i < packetCount; i++) {
          const p = packets[i]!;
          p.t += dt * p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.edge = Math.floor(Math.random() * edges.length);
            p.rev = Math.random() > 0.5;
          }
          const [ia, ib] = edges[p.edge]!;
          a.copy(nodes[p.rev ? ib : ia]!);
          b.copy(nodes[p.rev ? ia : ib]!);
          a.lerp(b, p.t);
          packetPos.set([a.x, a.y, a.z], i * 3);
        }
        packetGeo.attributes.position!.needsUpdate = true;
      }

      network.rotation.y = Math.sin(time * 0.12) * 0.12;

      // dust slowly drifts and spins
      dustParticles.rotation.y = time * 0.05;
      dustParticles.rotation.x = time * 0.02;
      dustParticles.position.y = Math.sin(time * 0.2) * 2;

      // cubes tumble and drift at different depths
      cubes.forEach((c, i) => {
        c.g.rotation.x = time * c.spin + i;
        c.g.rotation.y = time * c.spin * 1.3;
        c.g.position.y = c.base.y + Math.sin(time * 0.5 + i * 1.7) * 0.5 + scrollSmooth * 0.0012 * c.depth;
      });

      // scrolling flies the camera forward through the network
      const travel = Math.min(scrollSmooth * 0.006, 14);
      const zTarget = 20 - travel;
      camera.position.z += (zTarget - camera.position.z) * 0.15;
      camera.position.x += (camTarget.x * 2.2 - camera.position.x) * 0.08;
      camera.position.y += (1 - camTarget.y * 1.2 - camera.position.y) * 0.08;
      camera.lookAt(camTarget.x * 0.6, 1.5, camera.position.z - 20);

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
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />;
}


