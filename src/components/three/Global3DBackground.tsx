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

import { useTheme } from "next-themes";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Site-wide background: a perspective grid floor, a floating data network with packets
 * flowing along its links, and drifting glass cubes. Scrolling flies the camera forward
 * through the scene. Uses normal blending, so it reads on both light and dark pages.
 *
 * NEW effects: horizon glow, rotating wireframe core with orbit rings, aurora ribbons,
 * shooting stars, pulse ripples on the floor, twinkling starfield, node pulsing,
 * and a gentle camera sway.
 */
export default function Global3DBackground() {
  const mount = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

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

    const isDark = resolvedTheme === "dark";
    const primary = new THREE.Color(isDark ? "#6EACDA" : "#0047AB");
    const accent = new THREE.Color(isDark ? "#E2E2B6" : "#F28C28");
    const blueGlow = primary.clone().lerp(new THREE.Color("#ffffff"), 0.2);
    const glowTex = makeGlowTexture();

    // Adjust opacities based on theme
    const lineOpacity = isDark ? 0.35 : 0.22;
    const cubeOpacityBase = isDark ? 0.6 : 0.4;
    const cubeWarmOpacity = isDark ? 0.8 : 0.9;
    const dustOpacity = isDark ? 0.7 : 1.0;

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
    const nodeBaseSize = isDark ? 2.5 : 1.1;
    const nodeMat = new THREE.PointsMaterial({
      size: nodeBaseSize,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      opacity: isDark ? 1.0 : 0.8,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);

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
    const lineMat = new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: lineOpacity });
    const lines = new THREE.LineSegments(lineGeo, lineMat);

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
      new THREE.PointsMaterial({
        size: isDark ? 2.2 : 0.9,
        map: glowTex,
        color: accent,
        transparent: true,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        opacity: isDark ? 1.0 : 0.8
      }),
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
        color: warm ? primary : (isDark ? "#03346E" : "#cfe0ff"),
        metalness: warm ? 0.35 : 0.1,
        roughness: 0.12,
        transparent: true,
        opacity: warm ? cubeWarmOpacity : cubeOpacityBase,
      });
      const g = new THREE.Group();
      g.add(new THREE.Mesh(cubeGeo, mat));
      g.add(new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: lineOpacity + 0.1 })));
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
      size: isDark ? 2.5 : 1.2,
      color: primary,
      transparent: true,
      opacity: isDark ? 1.0 : dustOpacity,
      map: glowTex,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    /* ============================ NEW EFFECTS ============================ */

    /* 5. Horizon glow ("sun") that slowly breathes */
    const sunMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: accent,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const sun = new THREE.Sprite(sunMat);
    sun.scale.set(80, 80, 1);
    sun.position.set(0, FLOOR_Y + 8, -120);
    scene.add(sun);

    /* 6. Wireframe core: icosahedron + torus knot + orbit rings */
    const core = new THREE.Group();
    core.position.set(0, 3, -45);
    const coreWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(6, 1)),
      new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: lineOpacity + 0.1 }),
    );
    const coreKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.2, 0.4, isMobile ? 64 : 140, isMobile ? 8 : 16),
      new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: isDark ? 0.4 : 0.3 }),
    );
    const orbitRings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(9 + i * 2.2, 0.04, 8, 160),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? accent : primary,
          transparent: true,
          opacity: isDark ? 0.5 : 0.35,
        }),
      );
      ring.rotation.set(rand(0, Math.PI), rand(0, Math.PI), 0);
      orbitRings.push(ring);
      core.add(ring);
    }
    core.add(coreWire, coreKnot);
    scene.add(core);

    /* 7. Aurora ribbons (waving light lines) */
    const ribbonCount = isMobile ? 2 : 4;
    const ribbonPts = isMobile ? 60 : 140;
    const ribbons = Array.from({ length: ribbonCount }, (_, i) => {
      const arr = new Float32Array(ribbonPts * 3);
      const geo = new THREE.BufferGeometry();
      const attr = new THREE.BufferAttribute(arr, 3);
      geo.setAttribute("position", attr);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: i % 2 ? accent : blueGlow,
          transparent: true,
          opacity: isDark ? 0.45 : 0.28,
          depthWrite: false,
          blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        }),
      );
      line.frustumCulled = false;
      scene.add(line);
      return { line, arr, attr, baseY: 9 + i * 2.2, z: -55 - i * 9, phase: i * 1.7 };
    });

    /* 8. Shooting stars */
    type Meteor = {
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      attr: THREE.BufferAttribute;
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      life: number;
      max: number;
      delay: number;
    };
    const meteorCount = isMobile ? 2 : 6;
    const meteors: Meteor[] = Array.from({ length: meteorCount }, () => {
      const attr = new THREE.BufferAttribute(new Float32Array(6), 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", attr);
      const mat = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      scene.add(line);
      return {
        line, mat, attr,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        max: 1,
        delay: rand(0, 6),
      };
    });
    const spawnMeteor = (m: Meteor) => {
      m.pos.set(rand(-10, 35), rand(8, 16), rand(-45, -8));
      m.vel.set(-rand(14, 24), -rand(4, 9), 0);
      m.life = 0;
      m.max = rand(0.9, 1.7);
      m.delay = rand(1, 6);
    };
    meteors.forEach(spawnMeteor);
    meteors.forEach((m) => (m.delay = rand(0, 5)));

    /* 9. Pulse ripples expanding across the floor */
    const rippleCount = isMobile ? 2 : 4;
    const ripples = Array.from({ length: rippleCount }, (_, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 ? accent : primary,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(rand(-25, 25), FLOOR_Y + 0.05, rand(-40, 0));
      scene.add(mesh);
      return { mesh, mat, t: i / rippleCount };
    });

    /* 10. Twinkling starfield (two layers fading out of phase) */
    const makeStars = (count: number) => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3] = rand(-110, 110);
        arr[i * 3 + 1] = rand(-4, 60);
        arr[i * 3 + 2] = rand(-130, -30);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const mat = new THREE.PointsMaterial({
        size: isDark ? 1.6 : 0.9,
        map: glowTex,
        color: isDark ? "#ffffff" : primary,
        transparent: true,
        depthWrite: false,
        opacity: 0.8,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      return mat;
    };
    const starsA = makeStars(isMobile ? 60 : 180);
    const starsB = makeStars(isMobile ? 60 : 180);

    /* ============================ MORE EFFECTS ============================ */

    /* 11. Rotating DNA double helix (right side of the scene) */
    const helixN = isMobile ? 50 : 140;
    const helixHeight = 26;
    const helixArr = new Float32Array(helixN * 2 * 3);
    const helixGeo = new THREE.BufferGeometry();
    const helixAttr = new THREE.BufferAttribute(helixArr, 3);
    helixGeo.setAttribute("position", helixAttr);
    const helixPts = new THREE.Points(
      helixGeo,
      new THREE.PointsMaterial({
        size: isDark ? 2.2 : 1.0,
        map: glowTex,
        color: accent,
        transparent: true,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        opacity: isDark ? 0.95 : 0.8,
      }),
    );
    helixPts.frustumCulled = false;
    const rungStep = 4;
    const rungCount = Math.floor(helixN / rungStep);
    const rungArr = new Float32Array(rungCount * 2 * 3);
    const rungGeo = new THREE.BufferGeometry();
    const rungAttr = new THREE.BufferAttribute(rungArr, 3);
    rungGeo.setAttribute("position", rungAttr);
    const rungs = new THREE.LineSegments(
      rungGeo,
      new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: lineOpacity + 0.05 }),
    );
    rungs.frustumCulled = false;
    const helix = new THREE.Group();
    helix.add(helixPts, rungs);
    helix.position.set(isMobile ? 14 : 27, 2, -30);
    helix.rotation.z = 0.15;
    scene.add(helix);

    /* 12. Rising embers drifting up from the floor */
    const emberN = isMobile ? 40 : 130;
    const emberArr = new Float32Array(emberN * 3);
    const emberBaseX = new Float32Array(emberN);
    const emberSpeed = new Float32Array(emberN);
    for (let i = 0; i < emberN; i++) {
      emberBaseX[i] = rand(-40, 40);
      emberSpeed[i] = rand(0.6, 2.2);
      emberArr[i * 3] = emberBaseX[i]!;
      emberArr[i * 3 + 1] = rand(FLOOR_Y, 14);
      emberArr[i * 3 + 2] = rand(-40, 8);
    }
    const emberGeo = new THREE.BufferGeometry();
    const emberAttr = new THREE.BufferAttribute(emberArr, 3);
    emberGeo.setAttribute("position", emberAttr);
    const embers = new THREE.Points(
      emberGeo,
      new THREE.PointsMaterial({
        size: isDark ? 1.8 : 0.9,
        map: glowTex,
        color: accent,
        transparent: true,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        opacity: isDark ? 0.9 : 0.7,
      }),
    );
    embers.frustumCulled = false;
    scene.add(embers);

    /* 13. Energy arcs (lightning) that zap between linked nodes */
    const ARC_SEG = 14;
    const arcCount = isMobile ? 1 : 3;
    const arcs = Array.from({ length: arcCount }, () => {
      const arr = new Float32Array(ARC_SEG * 3);
      const attr = new THREE.BufferAttribute(arr, 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", attr);
      const mat = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      network.add(line); // lives inside the network so it follows its sway
      return { mat, arr, attr, from: 0, to: 0, wait: rand(0.3, 2.5), on: 0 };
    });

    /* 14. Wireframe mountain range on the horizon */
    const mtnGeo = new THREE.PlaneGeometry(240, 60, isMobile ? 30 : 60, isMobile ? 8 : 14);
    {
      const p = mtnGeo.attributes.position!;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const valley = Math.pow(Math.min(Math.abs(x) / 110, 1), 1.3); // low in the centre, high at the sides
        const h =
          valley * 22 * (0.55 + 0.45 * Math.sin(x * 0.16 + y * 0.35)) +
          Math.abs(Math.sin(x * 0.37 + y * 0.21)) * 2.2 * valley;
        p.setZ(i, h);
      }
      mtnGeo.computeVertexNormals();
      mtnGeo.rotateX(-Math.PI / 2);
    }
    const mountains = new THREE.Mesh(
      mtnGeo,
      new THREE.MeshBasicMaterial({
        color: primary,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.28 : 0.18,
        depthWrite: false,
      }),
    );
    mountains.position.set(0, FLOOR_Y, -115);
    scene.add(mountains);

    /* 15. Pulsing light beams rising from the floor */
    const beamCount = isMobile ? 2 : 5;
    const beams = Array.from({ length: beamCount }, (_, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 ? accent : primary,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 44, 6, 1, true), mat);
      mesh.position.set(rand(-36, 36), FLOOR_Y + 22, rand(-55, -15));
      scene.add(mesh);
      return { mat, phase: i * 2.1 };
    });

    /* 16. Satellites orbiting the core along its rings */
    const satellites = orbitRings.map((ring, i) => {
      const R = 9 + i * 2.2;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: i === 1 ? primary : accent,
          transparent: true,
          depthWrite: false,
          blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
          opacity: 0.95,
        }),
      );
      sprite.scale.set(1.8, 1.8, 1);
      ring.add(sprite);
      return { sprite, R, speed: 0.5 + i * 0.25, phase: i * 2 };
    });

    /* 17. Floating wireframe polyhedra (second parallax layer) */
    const polyGeos = [
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(1.2),
      new THREE.DodecahedronGeometry(1),
      new THREE.IcosahedronGeometry(1),
    ].map((g) => new THREE.EdgesGeometry(g));
    const polyCount = isMobile ? 3 : 9;
    const polys = Array.from({ length: polyCount }, (_, i) => {
      const line = new THREE.LineSegments(
        polyGeos[i % polyGeos.length]!,
        new THREE.LineBasicMaterial({
          color: i % 3 === 0 ? accent : primary,
          transparent: true,
          opacity: isDark ? 0.55 : 0.4,
        }),
      );
      line.scale.setScalar(rand(0.9, 2.2));
      const base = new THREE.Vector3(rand(-34, 34), rand(-3, 12), rand(-30, 6));
      line.position.copy(base);
      scene.add(line);
      return { line, base, spin: rand(-0.6, 0.6), bob: rand(0.5, 1.4) };
    });

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
      const mdt = reduce ? 0 : dt; // motion delta (0 when reduced motion)

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

      // NEW: nodes pulse like a heartbeat, links breathe
      nodeMat.size = nodeBaseSize * (1 + 0.18 * Math.sin(time * 2.2));
      lineMat.opacity = lineOpacity * (0.8 + 0.4 * Math.sin(time * 1.1));

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

      /* ---- NEW: horizon glow breathes ---- */
      const sunPulse = 80 + Math.sin(time * 0.6) * 6;
      sun.scale.set(sunPulse, sunPulse, 1);

      /* ---- NEW: core spins, rings orbit, scroll makes it grow/rotate ---- */
      coreWire.rotation.y = time * 0.15 + scrollSmooth * 0.0008;
      coreWire.rotation.x = time * 0.07;
      coreKnot.rotation.x = -time * 0.25;
      coreKnot.rotation.y = time * 0.18;
      orbitRings.forEach((r, i) => {
        r.rotation.z = time * (0.12 + i * 0.07) * (i % 2 ? -1 : 1);
        r.rotation.x += mdt * 0.05;
      });
      core.position.y = 3 + Math.sin(time * 0.4) * 1.2;
      core.scale.setScalar(1 + Math.sin(time * 0.8) * 0.04);

      /* ---- NEW: aurora ribbons wave ---- */
      ribbons.forEach((r) => {
        for (let i = 0; i < ribbonPts; i++) {
          const x = -70 + (i / (ribbonPts - 1)) * 140;
          r.arr[i * 3] = x;
          r.arr[i * 3 + 1] =
            r.baseY +
            Math.sin(x * 0.07 + time * 0.55 + r.phase) * 3.2 +
            Math.sin(x * 0.19 - time * 0.9 + r.phase) * 0.9;
          r.arr[i * 3 + 2] = r.z;
        }
        r.attr.needsUpdate = true;
      });

      /* ---- NEW: shooting stars ---- */
      meteors.forEach((m) => {
        if (m.delay > 0) {
          m.delay -= mdt;
          m.mat.opacity = 0;
          return;
        }
        m.life += mdt;
        m.pos.addScaledVector(m.vel, mdt);
        a.copy(m.pos).addScaledVector(m.vel, -0.14); // tail
        m.attr.array[0] = m.pos.x; m.attr.array[1] = m.pos.y; m.attr.array[2] = m.pos.z;
        m.attr.array[3] = a.x; m.attr.array[4] = a.y; m.attr.array[5] = a.z;
        m.attr.needsUpdate = true;
        m.mat.opacity = Math.max(0, Math.sin(Math.PI * Math.min(m.life / m.max, 1))) * 0.95;
        if (m.life >= m.max) spawnMeteor(m);
      });

      /* ---- NEW: floor ripples ---- */
      ripples.forEach((r) => {
        r.t += mdt / 6;
        if (r.t >= 1) {
          r.t -= 1;
          r.mesh.position.x = rand(-25, 25);
          r.mesh.position.z = rand(-40, 0);
        }
        r.mesh.scale.setScalar(1 + r.t * 45);
        r.mat.opacity = Math.pow(1 - r.t, 2) * (isDark ? 0.55 : 0.4);
      });

      /* ---- NEW: stars twinkle ---- */
      starsA.opacity = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(time * 1.7));
      starsB.opacity = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(time * 1.7 + Math.PI));

      /* ---- MORE: DNA helix ---- */
      for (let i = 0; i < helixN; i++) {
        const y = (i / (helixN - 1) - 0.5) * helixHeight;
        const ang = i * 0.38 + time * 0.8;
        const r = 2.4;
        helixArr[i * 6] = Math.cos(ang) * r;
        helixArr[i * 6 + 1] = y;
        helixArr[i * 6 + 2] = Math.sin(ang) * r;
        helixArr[i * 6 + 3] = Math.cos(ang + Math.PI) * r;
        helixArr[i * 6 + 4] = y;
        helixArr[i * 6 + 5] = Math.sin(ang + Math.PI) * r;
        if (i % rungStep === 0) {
          const k = (i / rungStep) * 6;
          if (k + 5 < rungArr.length) {
            rungArr[k] = helixArr[i * 6]!;
            rungArr[k + 1] = y;
            rungArr[k + 2] = helixArr[i * 6 + 2]!;
            rungArr[k + 3] = helixArr[i * 6 + 3]!;
            rungArr[k + 4] = y;
            rungArr[k + 5] = helixArr[i * 6 + 5]!;
          }
        }
      }
      helixAttr.needsUpdate = true;
      rungAttr.needsUpdate = true;
      helix.position.y = 2 + Math.sin(time * 0.3) * 1.5;

      /* ---- MORE: embers rise and wobble ---- */
      for (let i = 0; i < emberN; i++) {
        let y = emberArr[i * 3 + 1]! + emberSpeed[i]! * mdt;
        if (y > 14) y = FLOOR_Y;
        emberArr[i * 3 + 1] = y;
        emberArr[i * 3] = emberBaseX[i]! + Math.sin(time * 0.7 + i) * 0.7;
      }
      emberAttr.needsUpdate = true;

      /* ---- MORE: lightning arcs ---- */
      arcs.forEach((arc) => {
        if (arc.on > 0) {
          arc.on -= mdt;
          const A = nodes[arc.from]!;
          const B = nodes[arc.to]!;
          for (let k = 0; k < ARC_SEG; k++) {
            const t = k / (ARC_SEG - 1);
            const edge = k === 0 || k === ARC_SEG - 1;
            arc.arr[k * 3] = A.x + (B.x - A.x) * t + (edge ? 0 : rand(-0.6, 0.6));
            arc.arr[k * 3 + 1] = A.y + (B.y - A.y) * t + (edge ? 0 : rand(-0.6, 0.6));
            arc.arr[k * 3 + 2] = A.z + (B.z - A.z) * t + (edge ? 0 : rand(-0.6, 0.6));
          }
          arc.attr.needsUpdate = true;
          arc.mat.opacity = 0.5 + Math.random() * 0.5;
          if (arc.on <= 0) {
            arc.mat.opacity = 0;
            arc.wait = rand(0.5, 2.5);
          }
        } else {
          arc.wait -= mdt;
          if (arc.wait <= 0 && edges.length) {
            const e = edges[Math.floor(Math.random() * edges.length)]!;
            arc.from = e[0];
            arc.to = e[1];
            arc.on = rand(0.15, 0.35);
          }
        }
      });

      /* ---- MORE: beams pulse ---- */
      beams.forEach((bm) => {
        bm.mat.opacity = (isDark ? 0.28 : 0.18) * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.2 + bm.phase)));
      });

      /* ---- MORE: satellites orbit ---- */
      satellites.forEach((s) => {
        const ang = time * s.speed + s.phase;
        s.sprite.position.set(Math.cos(ang) * s.R, Math.sin(ang) * s.R, 0);
      });

      /* ---- MORE: polyhedra tumble and bob ---- */
      polys.forEach((p, i) => {
        p.line.rotation.x = time * p.spin + i;
        p.line.rotation.y = time * p.spin * 1.4;
        p.line.position.y = p.base.y + Math.sin(time * p.bob + i) * 0.7 + scrollSmooth * 0.0008;
      });

      // mountains drift very slightly for parallax
      mountains.position.x = Math.sin(time * 0.1) * 3;

      // scrolling flies the camera forward through the network
      const travel = Math.min(scrollSmooth * 0.006, 14);
      const zTarget = 20 - travel;
      camera.position.z += (zTarget - camera.position.z) * 0.15;
      // NEW: gentle idle camera sway
      const swayX = Math.sin(time * 0.22) * 1.4;
      const swayY = Math.cos(time * 0.17) * 0.5;
      camera.position.x += (camTarget.x * 2.2 + swayX - camera.position.x) * 0.08;
      camera.position.y += (1 - camTarget.y * 1.2 + swayY - camera.position.y) * 0.08;
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
    // re-create the scene when the theme changes so colours update
  }, [resolvedTheme]);

  return <div ref={mount} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />;
}