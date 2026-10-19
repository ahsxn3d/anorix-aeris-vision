"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export const PAINTS: Record<string, [number, number, number]> = { silver: [0xb9bdc3, 1, 0.3], obsidian: [0x0d0e11, 0.6, 0.3], ember: [0x7a1f16, 0.9, 0.3], glacier: [0x9fb6c6, 0.85, 0.32] };
const RIMS: [number, number, number][] = [[0x1c1d21, 0.7, 0.4], [0xd6d9de, 1, 0.14]];

/** Same studio as the offline renders: strip softboxes + side walls baked into a PMREM environment (no HDR download). */
function studioEnv(gl: THREE.WebGLRenderer) {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ color: 0x45464b, side: THREE.BackSide })));
  const lf = (w: number, h: number, x: number, y: number, z: number, i: number, col = 0xffffff) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  for (const z of [-6, -2, 2, 6]) lf(14, 1.2, 0, 9, z, 3);
  lf(16, 3, -14, 3, 0, 1.6, 0xdfeeff); lf(16, 3, 14, 3, 0, 1.2); lf(20, 1.4, -12, 0.9, 0, 0.9); lf(20, 1.4, 12, 0.9, 0, 0.7); lf(6, 5, 0, 4, 16, 0.8); lf(6, 5, 0, 4, -16, 0.6);
  const pm = new THREE.PMREMGenerator(gl); const t = pm.fromScene(s, 0.02).texture; pm.dispose(); return t;
}
function blob(stops: [number, string][]) { const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d")!; const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

function Car({ paint, rim, yaw, mobile, onReady, bg, running }: { paint: string; rim: number; yaw: MutableRefObject<number>; mobile: boolean; onReady: () => void; bg: string; running: boolean }) {
  const { gl, scene, camera, invalidate } = useThree();
  const root = useMemo(() => new THREE.Group(), []);
  const [loaded, setLoaded] = useState(false);
  const ready = useRef(onReady); ready.current = onReady;
  const mats = useRef<{ p1: THREE.MeshPhysicalMaterial[]; rim: THREE.MeshStandardMaterial[] }>({ p1: [], rim: [] });
  useEffect(() => {
    RectAreaLightUniformsLib.init();
    const env = studioEnv(gl); scene.environment = env; scene.environmentIntensity = 1.2; scene.background = new THREE.Color(bg);
    const top = new THREE.RectAreaLight(0xffffff, 5, 8, 1.2); top.position.set(0, 4.2, 0.2); top.lookAt(0, 0, 0.2);
    const side = new THREE.RectAreaLight(0xcfe8ff, 1.4, 1, 6); side.position.set(-4.5, 1.6, 0.2); side.lookAt(0, 0.6, 0.2);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshBasicMaterial({ color: bg, toneMapped: false })); floor.rotation.x = -Math.PI / 2;
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.4), new THREE.MeshBasicMaterial({ map: blob([[0, "rgba(0,0,0,.9)"], [0.5, "rgba(0,0,0,.55)"], [1, "rgba(0,0,0,0)"]]), transparent: true, depthWrite: false })); ao.rotation.x = -Math.PI / 2; ao.position.set(0, 0.003, 0.24);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: blob([[0, "rgba(255,255,255,.1)"], [1, "rgba(255,255,255,0)"]]), transparent: true, depthWrite: false })); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.001;
    const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(0.6, 8, 1.2);
    root.add(top, side, key, floor, pool, ao); scene.add(root);
    const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
    let alive = true;
    loader.load("/models/aeris.glb", (g) => {
      if (!alive) return;
      g.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return;
        for (const mt of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshPhysicalMaterial[]) { const n = mt.name || "";
          if (/^Paint 1/.test(n)) { mt.normalMap = null; mt.clearcoat = 1; mt.clearcoatRoughness = 0.04; mt.iridescence = 0; mt.envMapIntensity = 1.5; mt.needsUpdate = true; mats.current.p1.push(mt); }
          if (/^Paint 2/.test(n)) { mt.color.setHex(0x0c0d10); mt.metalness = 0.5; mt.roughness = 0.35; mt.iridescence = 0; }
          if (/^Interior 3/.test(n)) { mt.color.setHex(0x6b4a33); mt.roughness = 0.6; mt.metalness = 0; }
          if (n === "Glass") { mt.transmission = 0; mt.transparent = true; mt.opacity = 0.62; mt.color.setHex(0x07090c); mt.roughness = 0.04; mt.metalness = 0.2; mt.depthWrite = false; }
          if (/^Rim/.test(n)) mats.current.rim.push(mt);
          if (/Headlight/.test(n)) { mt.emissive = new THREE.Color(0xdff3ff); mt.emissiveIntensity = 14; }
          if (/Brakelight/.test(n)) { mt.emissive = new THREE.Color(0xff2a1a); mt.emissiveIntensity = 3; }
        } });
      root.add(g.scene); setLoaded(true); invalidate();
      requestAnimationFrame(() => requestAnimationFrame(() => ready.current()));
    });
    return () => { alive = false; scene.remove(root); root.clear(); mats.current = { p1: [], rim: [] }; env.dispose(); };
  }, [gl, scene, root, bg, invalidate]);
  // paint + rims: set once per change, then render one frame (demand loop)
  useEffect(() => { const p = PAINTS[paint]; mats.current.p1.forEach((m) => { m.color.setHex(p[0]); m.metalness = p[1]; m.roughness = p[2]; }); invalidate(); }, [paint, invalidate, loaded]);
  useEffect(() => { const r = RIMS[rim]; mats.current.rim.forEach((m) => { m.color.setHex(r[0]); m.metalness = r[1]; m.roughness = r[2]; }); invalidate(); }, [rim, invalidate, loaded]);
  // camera: orbit by yaw (drag), then shift along the view's right vector so the car sits beside the copy
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera; const T = new THREE.Vector3(0, 0.55, 0.24);
    let raf = 0, cur = yaw.current;
    const place = () => { const deg = 40 + cur, el = mobile ? 9 : 7, d = mobile ? 10 : 7.6; const r = THREE.MathUtils.degToRad(deg), e = THREE.MathUtils.degToRad(el);
      cam.fov = mobile ? 36 : 30; cam.updateProjectionMatrix(); cam.position.set(T.x + Math.sin(r) * Math.cos(e) * d, T.y + Math.sin(e) * d, T.z + Math.cos(r) * Math.cos(e) * d); cam.lookAt(T); if (!mobile) cam.translateX(-1.4); invalidate(); };
    const loop = () => { const dlt = yaw.current - cur; if (Math.abs(dlt) > 0.05) { cur += dlt * 0.14; place(); } raf = requestAnimationFrame(loop); };
    place(); if (running) loop(); return () => cancelAnimationFrame(raf);
  }, [camera, mobile, yaw, invalidate, running]);
  return null;
}

export default function CarView(p: { paint: string; rim: number; yaw: MutableRefObject<number>; running: boolean; onReady: () => void; bg: string }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 30, near: 0.1, far: 120 }} gl={{ antialias: dpr < 1.5, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.AgXToneMapping; gl.toneMappingExposure = 1.18; }} style={{ pointerEvents: "none" }}>
      <Car {...p} mobile={mobile} />
    </Canvas>
  );
}
