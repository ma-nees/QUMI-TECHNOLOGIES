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
    uv.y += uTime * 0.8;                           // grid flows toward the viewer

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

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    // Cap pixel ratio to 1.5 to save fill rate on large displays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
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
    const nodeCount = isMobile ? 32 : 70;
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
    const packetCount = isMobile ? 14 : 34;
    const packetPos = new Float32Array(packetCount * 3);
    const packets = Array.from({ length: packetCount }, () => ({
      edge: Math.floor(Math.random() * Math.max(edges.length, 1)),
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.35,
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
    const cubeCount = isMobile ? 6 : 12;
    const cubeGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.18);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo, 20);
    const cubes: { g: THREE.Group; base: THREE.Vector3; depth: number; spin: number }[] = [];
    for (let i = 0; i < cubeCount; i++) {
      const warm = i % 4 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: warm ? accent : "#cfe0ff",
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

      scrollSmooth += (scrollTarget - scrollSmooth) * 0.07;
      mouseGrid.lerp(mouseGridTarget, 0.1);
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

      // cubes tumble and drift at different depths
      cubes.forEach((c, i) => {
        c.g.rotation.x = time * c.spin + i;
        c.g.rotation.y = time * c.spin * 1.3;
        c.g.position.y = c.base.y + Math.sin(time * 0.5 + i * 1.7) * 0.5 + scrollSmooth * 0.0012 * c.depth;
      });

      // scrolling flies the camera forward through the network
      const travel = Math.min(scrollSmooth * 0.006, 14);
      const zTarget = 20 - travel;
      camera.position.z += (zTarget - camera.position.z) * 0.08;
      camera.position.x += (camTarget.x * 2.2 - camera.position.x) * 0.04;
      camera.position.y += (1 - camTarget.y * 1.2 - camera.position.y) * 0.04;
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


// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// const SNOISE = /* glsl */ `
//   vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
//   vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
//   vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
//   vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
//   float snoise(vec3 v){
//     const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
//     vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
//     vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
//     vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
//     i=mod289(i);
//     vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
//     float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
//     vec4 j=p-49.*floor(p*ns.z*ns.z);
//     vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
//     vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
//     vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
//     vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
//     vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
//     vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
//     vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
//     p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
//     vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
//     return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
//   }
// `;

// const vert = /* glsl */ `
//   void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
// `;

// const frag = /* glsl */ `
//   precision highp float;
//   uniform float uTime;
//   uniform float uScroll;
//   uniform float uLight;
//   uniform vec2  uRes;
//   uniform vec2  uMouse;

//   ${SNOISE}

//   float fbm(vec3 p) {
//     float a = 0.5, s = 0.0;
//     for (int i = 0; i < 4; i++) { s += a * snoise(p); p *= 2.0; a *= 0.5; }
//     return s;
//   }
//   float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

//   void main() {
//     vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

//     // pointer acts like a soft lens that bends the flow
//     vec2 d = p - uMouse;
//     float lens = exp(-dot(d, d) * 5.0);
//     p += d * lens * 0.22;

//     float t = uTime * 0.07 + uScroll * 0.0006;
//     p.y += uScroll * 0.00025;

//     // domain-warped noise for a liquid look
//     vec3 q = vec3(p * 1.05, t);
//     float n1 = fbm(q);
//     float n2 = fbm(q + vec3(n1 * 1.6, 4.0, -t));
//     float n3 = fbm(vec3(p * 0.8 + n2 * 0.9, t * 1.3 + 10.0));

//     // brand palette (sRGB)
//     vec3 deep   = vec3(0.016, 0.027, 0.075);   // #040713
//     vec3 paper  = vec3(0.965, 0.972, 0.99);    // soft white
//     vec3 blue   = vec3(0.000, 0.278, 0.671);   // #0047AB
//     vec3 sky    = vec3(0.250, 0.560, 1.000);
//     vec3 orange = vec3(0.949, 0.549, 0.157);   // #F28C28
//     vec3 hot    = vec3(0.949, 0.298, 0.157);   // #F24C28

//     vec3 col = mix(deep, paper, uLight);
//     float s = mix(0.95, 0.55, uLight);

//     col = mix(col, blue,   smoothstep(-0.25, 0.55, n2) * s);
//     col = mix(col, sky,    smoothstep(0.25, 0.8, n1 + n2 * 0.5) * 0.45 * s);
//     col = mix(col, orange, smoothstep(0.28, 0.78, n3) * 0.85 * s);
//     col = mix(col, hot,    smoothstep(0.50, 0.95, n3 + n1 * 0.4) * 0.55 * s);
//     col += lens * vec3(0.10, 0.06, 0.02) * (1.0 - uLight);

//     // vignette keeps text areas calm
//     vec2 uv = gl_FragCoord.xy / uRes;
//     float vig = smoothstep(1.15, 0.25, length(uv - 0.5) * 1.35);
//     col = mix(mix(deep, paper, uLight), col, 0.55 + 0.45 * vig);

//     // fine film grain
//     float g = hash(gl_FragCoord.xy + fract(uTime * 0.7) * 100.0) - 0.5;
//     col += g * mix(0.045, 0.03, uLight);

//     gl_FragColor = vec4(col, 1.0);
//   }
// `;

// type Props = { theme?: "dark" | "light" };

// /**
//  * Full-screen fluid aurora background. Renders one shader on a fixed canvas
//  * (no geometry), so it is cheap, smooth, and sharp on any screen.
//  * Use theme="light" for a pastel version on light pages.
//  */
// export default function Global3DBackground({ theme = "dark" }: Props) {
//   const mount = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = mount.current;
//     if (!el) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const isMobile = window.innerWidth < 768;

//     const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
//     // the gradient is smooth, so a lower render resolution looks identical and runs faster
//     renderer.setPixelRatio(isMobile ? 0.6 : Math.min(window.devicePixelRatio, 1));
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     el.appendChild(renderer.domElement);

//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

//     const mouse = new THREE.Vector2(9, 9);
//     const mouseTarget = new THREE.Vector2(9, 9);
//     const res = new THREE.Vector2();

//     const material = new THREE.ShaderMaterial({
//       vertexShader: vert,
//       fragmentShader: frag,
//       depthTest: false,
//       depthWrite: false,
//       uniforms: {
//         uTime: { value: 0 },
//         uScroll: { value: 0 },
//         uLight: { value: theme === "light" ? 1 : 0 },
//         uRes: { value: res },
//         uMouse: { value: mouse },
//       },
//     });
//     const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
//     quad.frustumCulled = false;
//     scene.add(quad);

//     const updateRes = () => {
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.getDrawingBufferSize(res);
//     };
//     updateRes();

//     let scrollTarget = 0;
//     let scrollSmooth = 0;

//     const onMove = (e: PointerEvent) => {
//       if (reduce) return;
//       const w = window.innerWidth;
//       const h = window.innerHeight;
//       mouseTarget.set(((e.clientX / w) - 0.5) * (w / h), -(e.clientY / h - 0.5));
//     };
//     const onLeave = () => mouseTarget.set(9, 9);
//     const onScroll = () => {
//       scrollTarget = window.scrollY;
//     };
//     window.addEventListener("pointermove", onMove, { passive: true });
//     document.addEventListener("pointerleave", onLeave);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", updateRes);

//     let raf = 0;
//     let time = 0;
//     let last = performance.now();
//     const tick = () => {
//       raf = requestAnimationFrame(tick);
//       const now = performance.now();
//       const dt = Math.min((now - last) / 1000, 0.05);
//       last = now;
//       if (document.hidden) return;
//       if (!reduce) time += dt;

//       scrollSmooth += (scrollTarget - scrollSmooth) * 0.06;
//       mouse.lerp(mouseTarget, 0.06);

//       material.uniforms.uTime!.value = time;
//       material.uniforms.uScroll!.value = scrollSmooth;
//       renderer.render(scene, camera);
//     };
//     tick();

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("pointermove", onMove);
//       document.removeEventListener("pointerleave", onLeave);
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", updateRes);
//       quad.geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//       renderer.domElement.remove();
//     };
//   }, [theme]);

//   return <div ref={mount} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />;
// }

