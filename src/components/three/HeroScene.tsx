// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// export default function HeroScene() {
//   const mount = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = mount.current;
//     if (!el) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setSize(el.clientWidth, el.clientHeight);
//     el.appendChild(renderer.domElement);

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
//     camera.position.set(0, 0, 13);

//     const primary = new THREE.Color("#0047AB");
//     const accent = new THREE.Color("#F28C28");

//     const group = new THREE.Group();
//     scene.add(group);

//     // Points distributed on a sphere-ish lattice
//     const count = 90;
//     const pts: THREE.Vector3[] = [];
//     for (let i = 0; i < count; i++) {
//       const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
//       const theta = Math.PI * (1 + Math.sqrt(5)) * i;
//       const r = 4 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.9;
//       pts.push(new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)));
//     }

//     const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
//     const nodeMat = new THREE.MeshBasicMaterial({ color: primary });
//     const accentMat = new THREE.MeshBasicMaterial({ color: accent });
//     pts.forEach((p, i) => {
//       const m = new THREE.Mesh(i % 17 === 0 ? new THREE.SphereGeometry(0.11, 16, 16) : nodeGeo, i % 17 === 0 ? accentMat : nodeMat);
//       m.position.copy(p);
//       group.add(m);
//     });

//     const linePos: number[] = [];
//     for (let i = 0; i < count; i++)
//       for (let j = i + 1; j < count; j++)
//         { const a = pts[i]!, b = pts[j]!; if (a.distanceTo(b) < 1.9) linePos.push(...a.toArray(), ...b.toArray()); }
//     const lineGeo = new THREE.BufferGeometry();
//     lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
//     const lineMat = new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.28 });
//     group.add(new THREE.LineSegments(lineGeo, lineMat));

//     // Inner ring
//     const ring = new THREE.Mesh(
//       new THREE.TorusGeometry(2.4, 0.008, 8, 160),
//       new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.5 }),
//     );
//     ring.rotation.x = Math.PI / 2.4;
//     group.add(ring);

//     const target = { x: 0, y: 0 };
//     const onMove = (e: PointerEvent) => {
//       const r = el.getBoundingClientRect();
//       target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
//       target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
//     };
//     window.addEventListener("pointermove", onMove, { passive: true });

//     let visible = true;
//     const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
//     io.observe(el);

//     const onResize = () => {
//       camera.aspect = el.clientWidth / el.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(el.clientWidth, el.clientHeight);
//     };
//     window.addEventListener("resize", onResize);

//     let raf = 0;
//     const clock = new THREE.Clock();
//     const tick = () => {
//       raf = requestAnimationFrame(tick);
//       if (!visible) return;
//       const t = clock.getElapsedTime();
//       if (!reduce) group.rotation.y = t * 0.06;
//       group.rotation.x += (target.y - group.rotation.x) * 0.04;
//       group.position.x += (target.x - group.position.x) * 0.04;
//       renderer.render(scene, camera);
//     };
//     tick();

//     return () => {
//       cancelAnimationFrame(raf);
//       io.disconnect();
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("resize", onResize);
//       scene.traverse((o) => {
//         const m = o as THREE.Mesh;
//         m.geometry?.dispose();
//         const mat = m.material as THREE.Material | undefined;
//         mat?.dispose?.();
//       });
//       renderer.dispose();
//       renderer.domElement.remove();
//     };
//   }, []);

//   return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
// }


import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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
 * Hero: a floating "tech stack" of three glass layers (infrastructure, platform, app)
 * with a beam of data running through it, and satellite nodes (cloud / devices / APIs)
 * connected to it by live data lines.
 */
export default function HeroScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 15);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(5, 8, 6);
    scene.add(key);
    const warm = new THREE.DirectionalLight(0xf28c28, 1.1);
    warm.position.set(-6, 2, 4);
    scene.add(warm);
    const cool = new THREE.DirectionalLight(0x3b82ff, 1.0);
    cool.position.set(6, -3, -4);
    scene.add(cool);

    const primary = new THREE.Color("#0047AB");
    const accent = new THREE.Color("#F28C28");
    const glowTex = makeGlowTexture();

    const root = new THREE.Group();
    scene.add(root);

    /* ---------- Glass stack ---------- */
    const stack = new THREE.Group();
    root.add(stack);

    const slabGeo = new RoundedBoxGeometry(4.4, 0.3, 4.4, 5, 0.12);
    const edgeGeo = new THREE.EdgesGeometry(slabGeo, 20);

    const glassMat = (tint: string, opacity: number) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(tint),
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity,
      });

    const layerMats = [glassMat("#dbe8ff", 0.5), glassMat("#0047AB", 0.92), glassMat("#eaf1ff", 0.55)];
    const layers: THREE.Group[] = [];
    layerMats.forEach((mat, i) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(slabGeo, mat));
      g.add(
        new THREE.LineSegments(
          edgeGeo,
          new THREE.LineBasicMaterial({ color: i === 1 ? 0x8fb4ff : primary, transparent: true, opacity: 0.55 }),
        ),
      );
      stack.add(g);
      layers.push(g);
    });

    // Little "server blocks" on the top layer
    const chipGeo = new RoundedBoxGeometry(0.62, 0.16, 0.62, 3, 0.05);
    const chipMatBlue = new THREE.MeshStandardMaterial({ color: primary, roughness: 0.25, metalness: 0.4 });
    const chipMatOrange = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const chips: THREE.Mesh[] = [];
    for (let x = -1; x <= 1; x++)
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && z === 0) continue;
        const hot = (x + z + 4) % 3 === 0;
        const chip = new THREE.Mesh(chipGeo, hot ? chipMatOrange : chipMatBlue);
        chip.position.set(x * 1.2, 0.23, z * 1.2);
        layers[2]!.add(chip);
        chips.push(chip);
      }

    // Vertical data beam through the middle
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 5, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.55 }),
    );
    stack.add(beam);

    // Packets that travel up the beam
    const beamPacketCount = 6;
    const beamPos = new Float32Array(beamPacketCount * 3);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    const beamPackets = new THREE.Points(
      beamGeo,
      new THREE.PointsMaterial({ size: 0.5, map: glowTex, color: 0xffb066, transparent: true, depthWrite: false }),
    );
    beamPackets.frustumCulled = false;
    stack.add(beamPackets);

    /* ---------- Satellites ---------- */
    const satGeo = new RoundedBoxGeometry(0.62, 0.62, 0.62, 4, 0.14);
    const satDefs = [
      { r: 4.6, y: 1.6, speed: 0.22, phase: 0.0, color: "#F28C28" },
      { r: 5.2, y: -1.4, speed: -0.18, phase: 1.3, color: "#0047AB" },
      { r: 4.2, y: 0.2, speed: 0.15, phase: 2.6, color: "#ffffff" },
      { r: 5.6, y: 2.4, speed: -0.12, phase: 3.9, color: "#0047AB" },
      { r: 4.9, y: -2.4, speed: 0.2, phase: 5.1, color: "#F28C28" },
    ];
    const sats = satDefs.map((d) => {
      const mesh = new THREE.Mesh(
        satGeo,
        new THREE.MeshStandardMaterial({
          color: d.color,
          roughness: 0.18,
          metalness: d.color === "#ffffff" ? 0.05 : 0.35,
        }),
      );
      root.add(mesh);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.35 }),
      );
      line.frustumCulled = false;
      root.add(line);
      return { ...d, mesh, line };
    });

    const satPacketPos = new Float32Array(satDefs.length * 3);
    const satPacketGeo = new THREE.BufferGeometry();
    satPacketGeo.setAttribute("position", new THREE.BufferAttribute(satPacketPos, 3));
    const satPackets = new THREE.Points(
      satPacketGeo,
      new THREE.PointsMaterial({ size: 0.4, map: glowTex, color: 0xf28c28, transparent: true, depthWrite: false }),
    );
    satPackets.frustumCulled = false;
    root.add(satPackets);

    /* ---------- Soft floor shadow blob ---------- */
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshBasicMaterial({ map: glowTex, color: primary, transparent: true, opacity: 0.25, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -3.2;
    root.add(shadow);

    /* ---------- Input ---------- */
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      // Disabled mouse tracking per user request
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);

    const onResize = () => {
      if (!el.clientHeight) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    /* ---------- Loop ---------- */
    let raf = 0;
    let time = 0;
    let last = performance.now();
    let spread = 1; // layer separation, grows when pointer is near
    const tmp = new THREE.Vector3();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      if (!reduce) time += dt;

      // isometric-style tilt that gently sways and follows the pointer
      root.rotation.x += (0.42 + target.y * 0.18 - root.rotation.x) * 0.05;
      root.rotation.y += (-0.65 + Math.sin(time * 0.3) * 0.3 + target.x * 0.45 - root.rotation.y) * 0.05;
      root.position.y = Math.sin(time * 0.8) * 0.12;

      // layers float apart when the pointer is near the centre
      const near = Math.max(0, 1 - Math.hypot(target.x, target.y));
      spread += (1 + near * 0.55 - spread) * 0.06;
      layers.forEach((l, i) => {
        l.position.y = (i - 1) * 1.15 * spread + Math.sin(time * 0.9 + i * 1.4) * 0.06;
        l.rotation.y = Math.sin(time * 0.4 + i) * 0.12 + i * 0.04;
      });
      beam.scale.y = 0.8 + spread * 0.25;

      // chips pulse
      chips.forEach((c, i) => {
        c.position.y = 0.23 + Math.max(0, Math.sin(time * 1.6 + i * 0.9)) * 0.08;
      });

      // packets climbing the beam
      for (let i = 0; i < beamPacketCount; i++) {
        const p = (time * 0.45 + i / beamPacketCount) % 1;
        beamPos[i * 3] = 0;
        beamPos[i * 3 + 1] = (p - 0.5) * 3.4 * spread;
        beamPos[i * 3 + 2] = 0;
      }
      beamGeo.attributes.position!.needsUpdate = true;

      // satellites orbit, connect to the stack, and send packets
      sats.forEach((s, i) => {
        const a = time * s.speed + s.phase;
        s.mesh.position.set(Math.cos(a) * s.r, s.y + Math.sin(time * 0.7 + i) * 0.2, Math.sin(a) * s.r);
        s.mesh.rotation.x = time * 0.3 + i;
        s.mesh.rotation.y = time * 0.4;

        const pos = s.line.geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, s.mesh.position.x, s.mesh.position.y, s.mesh.position.z);
        pos.setXYZ(1, 0, (i - 2) * 0.35, 0);
        pos.needsUpdate = true;

        const p = (time * 0.35 + i * 0.21) % 1;
        tmp.set(0, (i - 2) * 0.35, 0).lerp(s.mesh.position, 1 - p);
        satPacketPos.set([tmp.x, tmp.y, tmp.z], i * 3);
      });
      satPacketGeo.attributes.position!.needsUpdate = true;

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
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
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

// const orbVert = /* glsl */ `
//   uniform float uTime;
//   uniform float uAmp;
//   varying vec3 vNormal;
//   varying vec3 vView;
//   varying float vNoise;

//   ${SNOISE}

//   vec3 displace(vec3 p) {
//     float n  = snoise(p * 0.85 + vec3(0.0, 0.0, uTime * 0.28));
//     float n2 = snoise(p * 2.1 - vec3(uTime * 0.2)) * 0.22;
//     return p + normalize(p) * (n * 0.5 + n2) * uAmp;
//   }

//   void main() {
//     vec3 p = position;
//     vec3 nrm = normalize(p);
//     vec3 t = normalize(cross(nrm, abs(nrm.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
//     vec3 b = cross(nrm, t);
//     float e = 0.012;
//     float r = length(p);

//     // rebuild the normal from neighbouring displaced points
//     vec3 p0 = displace(p);
//     vec3 p1 = displace(normalize(p + t * e) * r);
//     vec3 p2 = displace(normalize(p + b * e) * r);
//     vec3 n = normalize(cross(p1 - p0, p2 - p0));
//     if (dot(n, nrm) < 0.0) n = -n;

//     vNoise = snoise(p * 0.85 + vec3(0.0, 0.0, uTime * 0.28));
//     vNormal = normalize(normalMatrix * n);
//     vec4 mv = modelViewMatrix * vec4(p0, 1.0);
//     vView = -mv.xyz;
//     gl_Position = projectionMatrix * mv;
//   }
// `;

// const orbFrag = /* glsl */ `
//   uniform float uTime;
//   varying vec3 vNormal;
//   varying vec3 vView;
//   varying float vNoise;

//   void main() {
//     vec3 N = normalize(vNormal);
//     vec3 V = normalize(vView);
//     float ndv = clamp(dot(N, V), 0.0, 1.0);
//     vec3 R = reflect(-V, N);

//     // studio-style reflection in the brand colours
//     float k = smoothstep(-0.7, 0.9, R.y + 0.45 * sin(R.x * 2.0 + uTime * 0.3));
//     vec3 env = mix(vec3(0.015, 0.04, 0.16), vec3(0.95, 0.55, 0.16), k);
//     env += vec3(0.0, 0.30, 0.75) * smoothstep(0.1, 1.0, R.x) * 0.9;
//     env += vec3(0.95, 0.30, 0.16) * smoothstep(0.4, 1.0, -R.x) * 0.5;

//     // thin-film rainbow that shifts with angle
//     vec3 iri = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + ndv * 1.1 + vNoise * 0.55 + uTime * 0.04));

//     float fres = pow(1.0 - ndv, 3.0);
//     vec3 col = mix(env, iri, 0.3 + fres * 0.5);

//     // glossy highlights
//     col += pow(max(dot(R, normalize(vec3(0.5, 0.8, 0.6))), 0.0), 70.0) * 1.1;
//     col += pow(max(dot(R, normalize(vec3(-0.7, 0.2, 0.7))), 0.0), 40.0) * 0.45 * vec3(1.0, 0.8, 0.6);
//     col += fres * vec3(0.45, 0.65, 1.0) * 0.4;

//     gl_FragColor = vec4(col, 1.0);
//   }
// `;

// function makeGlowTexture() {
//   const c = document.createElement("canvas");
//   c.width = c.height = 128;
//   const g = c.getContext("2d")!;
//   const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
//   grad.addColorStop(0, "rgba(255,255,255,1)");
//   grad.addColorStop(0.4, "rgba(255,255,255,0.35)");
//   grad.addColorStop(1, "rgba(255,255,255,0)");
//   g.fillStyle = grad;
//   g.fillRect(0, 0, 128, 128);
//   return new THREE.CanvasTexture(c);
// }

// /**
//  * Hero: a liquid, iridescent orb. It wobbles like jelly when the pointer moves,
//  * with a soft brand-colour glow, a thin halo ring and floating sparks.
//  */
// export default function HeroScene() {
//   const mount = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = mount.current;
//     if (!el) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const isMobile = window.innerWidth < 768;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setSize(el.clientWidth, el.clientHeight);
//     el.appendChild(renderer.domElement);

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 100);
//     camera.position.set(0, 0, 11);

//     const root = new THREE.Group();
//     scene.add(root);
//     const glowTex = makeGlowTexture();

//     /* Soft colour glow behind the orb */
//     const makeGlow = (color: string, scale: number, x: number, y: number, opacity: number) => {
//       const s = new THREE.Sprite(
//         new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false }),
//       );
//       s.scale.setScalar(scale);
//       s.position.set(x, y, -2);
//       root.add(s);
//       return s;
//     };
//     const glowBlue = makeGlow("#0047AB", 11, -0.8, -0.4, 0.55);
//     const glowOrange = makeGlow("#F28C28", 8, 1.6, 1.2, 0.4);

//     /* The orb */
//     const orbUniforms = { uTime: { value: 0 }, uAmp: { value: 0.55 } };
//     const orb = new THREE.Mesh(
//       new THREE.IcosahedronGeometry(2.1, isMobile ? 24 : 40),
//       new THREE.ShaderMaterial({ vertexShader: orbVert, fragmentShader: orbFrag, uniforms: orbUniforms }),
//     );
//     root.add(orb);

//     /* Thin halo rings */
//     const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false });
//     const ring = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.008, 8, 220), ringMat);
//     ring.rotation.set(1.25, 0.25, 0);
//     root.add(ring);
//     const ring2 = new THREE.Mesh(
//       new THREE.TorusGeometry(3.9, 0.006, 8, 220),
//       new THREE.MeshBasicMaterial({ color: 0xf28c28, transparent: true, opacity: 0.4, depthWrite: false }),
//     );
//     ring2.rotation.set(0.5, -0.6, 0);
//     root.add(ring2);

//     /* Floating sparks */
//     const sparkCount = isMobile ? 70 : 160;
//     const sparkPos = new Float32Array(sparkCount * 3);
//     const sparkCol = new Float32Array(sparkCount * 3);
//     const sparkSeed = new Float32Array(sparkCount);
//     const cBlue = new THREE.Color("#5b9bff");
//     const cOrange = new THREE.Color("#F28C28");
//     const cWhite = new THREE.Color("#ffffff");
//     for (let i = 0; i < sparkCount; i++) {
//       const r = 3.4 + Math.random() * 3.2;
//       const u = Math.random() * 2 - 1;
//       const th = Math.random() * Math.PI * 2;
//       const s = Math.sqrt(1 - u * u);
//       sparkPos.set([r * s * Math.cos(th), r * u * 0.8, r * s * Math.sin(th)], i * 3);
//       const c = Math.random() > 0.7 ? cOrange : Math.random() > 0.5 ? cBlue : cWhite;
//       sparkCol.set([c.r, c.g, c.b], i * 3);
//       sparkSeed[i] = Math.random() * 10;
//     }
//     const sparkBase = sparkPos.slice();
//     const sparkGeo = new THREE.BufferGeometry();
//     sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
//     sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkCol, 3));
//     const sparks = new THREE.Points(
//       sparkGeo,
//       new THREE.PointsMaterial({
//         size: 0.22,
//         map: glowTex,
//         vertexColors: true,
//         transparent: true,
//         opacity: 0.9,
//         depthWrite: false,
//       }),
//     );
//     root.add(sparks);

//     /* Input: position drives tilt, speed drives the jelly wobble */
//     const target = { x: 0, y: 0 };
//     let energy = 0;
//     let lastX = 0;
//     let lastY = 0;
//     const onMove = (e: PointerEvent) => {
//       if (reduce) return;
//       const r = el.getBoundingClientRect();
//       target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
//       target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
//       const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
//       lastX = e.clientX;
//       lastY = e.clientY;
//       energy = Math.min(1, energy + speed * 0.0025);
//     };
//     window.addEventListener("pointermove", onMove, { passive: true });

//     let visible = true;
//     const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
//     io.observe(el);

//     const onResize = () => {
//       if (!el.clientHeight) return;
//       camera.aspect = el.clientWidth / el.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(el.clientWidth, el.clientHeight);
//     };
//     window.addEventListener("resize", onResize);

//     let raf = 0;
//     let time = 0;
//     let last = performance.now();
//     const tick = () => {
//       raf = requestAnimationFrame(tick);
//       const now = performance.now();
//       const dt = Math.min((now - last) / 1000, 0.05);
//       last = now;
//       if (!visible || document.hidden) return;
//       if (!reduce) time += dt;

//       energy *= 0.95;
//       orbUniforms.uTime.value = time;
//       orbUniforms.uAmp.value += (0.5 + energy * 0.55 - orbUniforms.uAmp.value) * 0.08;

//       root.rotation.y += (target.x * 0.4 - root.rotation.y) * 0.05;
//       root.rotation.x += (target.y * 0.25 - root.rotation.x) * 0.05;
//       root.position.y = Math.sin(time * 0.7) * 0.12;

//       orb.rotation.y = time * 0.1;
//       ring.rotation.z = time * 0.12;
//       ring2.rotation.z = -time * 0.08;
//       glowBlue.position.x = -0.8 + Math.sin(time * 0.4) * 0.5;
//       glowOrange.position.y = 1.2 + Math.cos(time * 0.5) * 0.4;

//       // sparks drift and twinkle
//       for (let i = 0; i < sparkCount; i++) {
//         const sd = sparkSeed[i]!;
//         sparkPos[i * 3] = sparkBase[i * 3]! + Math.sin(time * 0.4 + sd) * 0.25;
//         sparkPos[i * 3 + 1] = sparkBase[i * 3 + 1]! + Math.sin(time * 0.6 + sd * 2) * 0.35;
//         sparkPos[i * 3 + 2] = sparkBase[i * 3 + 2]! + Math.cos(time * 0.4 + sd) * 0.25;
//       }
//       sparkGeo.attributes.position!.needsUpdate = true;
//       sparks.rotation.y = time * 0.03;

//       renderer.render(scene, camera);
//     };
//     tick();

//     return () => {
//       cancelAnimationFrame(raf);
//       io.disconnect();
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("resize", onResize);
//       scene.traverse((o) => {
//         const m = o as THREE.Mesh;
//         m.geometry?.dispose();
//         const mat = m.material as THREE.Material | THREE.Material[] | undefined;
//         if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
//         else mat?.dispose?.();
//       });
//       glowTex.dispose();
//       renderer.dispose();
//       renderer.domElement.remove();
//     };
//   }, []);

//   return <div ref={mount} className="absolute inset-0" aria-hidden="true" />;
// }