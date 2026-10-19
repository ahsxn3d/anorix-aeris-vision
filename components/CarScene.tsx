"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildCar, STOPS, camAt } from "@/lib/car";
import FirstFrame from "./kit/FirstFrame";

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => { const pm = new THREE.PMREMGenerator(gl); const t = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = t; return () => { t.dispose(); pm.dispose(); }; }, [gl, scene]);
  return null;
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function Rig({ progress, paint, mobile, fixed }: { progress?: MutableRefObject<number>; paint?: MutableRefObject<number>; mobile: boolean; fixed?: number }) {
  const car = useMemo(() => buildCar(THREE, { paint: 0xc9ccd1 }), []);
  const ud = car.userData as { paint: THREE.MeshPhysicalMaterial; light: THREE.MeshBasicMaterial; tail: THREE.MeshBasicMaterial; wheels: THREE.Group[]; halos: THREE.Mesh[] };
  const st = useMemo(() => ({ p: fixed ?? 0, born: -1, col: new THREE.Color(0xc9ccd1), tgt: new THREE.Color(), lc: new THREE.Color(0xcdeeff), tc: new THREE.Color(0xff3d22), look: new THREE.Vector3() }), [fixed]);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime; if (st.born < 0) st.born = t;
    // light signature ignites over ~1.6s after the canvas appears
    const ign = Math.min(1, Math.max(0, (t - st.born - 0.3) / 1.6)); const flick = ign < 1 ? (Math.sin(t * 60) > 0.2 ? 1 : 0.35) : 1;
    ud.light.color.copy(st.lc).multiplyScalar(ign * flick); ud.tail.color.copy(st.tc).multiplyScalar(ign);
    ud.halos.forEach((h) => ((h.material as THREE.MeshBasicMaterial).opacity = 0.4 * ign * flick));
    if (paint) { st.tgt.setHex(paint.current); ud.paint.color.lerp(st.tgt, Math.min(1, dt * 4)); }
    // camera follows the stop path (one driver: the canvas camera, smoothed)
    const target = fixed ?? (progress ? progress.current : 0) * (STOPS.length - 1);
    st.p += (target - st.p) * Math.min(1, dt * 3.2);
    const i = Math.min(STOPS.length - 2, Math.floor(st.p)), f = ease(st.p - i);
    const A = STOPS[i], B = STOPS[i + 1];
    let da = B.a - A.a; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
    const c = camAt({ a: A.a + da * f, r: lerp(A.r, B.r, f), y: lerp(A.y, B.y, f), tx: lerp(A.tx, B.tx, f), ty: lerp(A.ty, B.ty, f) }, mobile);
    const px = mobile ? 0 : s.pointer.x * 0.25, py = mobile ? 0 : s.pointer.y * 0.12;
    s.camera.position.set(c.pos[0] + px, c.pos[1] + py, c.pos[2]);
    st.look.set(c.tgt[0], c.tgt[1], c.tgt[2]); s.camera.lookAt(st.look);
  });
  return <primitive object={car} />;
}

/** unlit studio floor: a baked light pool (canvas gradient) — no per-pixel lighting on the largest surface */
function Floor({ bg }: { bg: string }) {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 512; const x = c.getContext("2d")!; const base = new THREE.Color(bg); x.fillStyle = `#${base.getHexString()}`; x.fillRect(0, 0, 512, 512); const lit = base.clone().lerp(new THREE.Color(0x6a6e76), 0.55); const g = x.createRadialGradient(256, 256, 10, 256, 256, 256); g.addColorStop(0, `#${lit.getHexString()}`); g.addColorStop(1, `#${base.getHexString()}`); x.fillStyle = g; x.fillRect(0, 0, 512, 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }, [bg]);
  return <mesh rotation-x={-Math.PI / 2}><planeGeometry args={[60, 60]} /><meshBasicMaterial map={tex} /></mesh>;
}

/** baked soft contact shadow (radial gradient texture), replaces a real-time shadow map */
function Contact() {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = 256; c.height = 128; const x = c.getContext("2d")!; const g = x.createRadialGradient(128, 64, 4, 128, 64, 128); g.addColorStop(0, "rgba(0,0,0,.85)"); g.addColorStop(0.45, "rgba(0,0,0,.45)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 256, 128); return new THREE.CanvasTexture(c); }, []);
  return <mesh rotation-x={-Math.PI / 2} position-y={0.005}><planeGeometry args={[6.4, 2.9]} /><meshBasicMaterial map={tex} transparent depthWrite={false} /></mesh>;
}

export default function CarScene({ progress, paint, running, onReady, fixed, bg = "#0a0b0d" }: { progress?: MutableRefObject<number>; paint?: MutableRefObject<number>; running: boolean; onReady: () => void; fixed?: number; bg?: string }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas frameloop={running ? "always" : "demand"} dpr={[1, 1.25]} camera={{ fov: mobile ? 38 : 26, position: [6, 1.4, 6] }}
      gl={{ antialias: typeof window !== "undefined" && window.devicePixelRatio < 1.5, toneMapping: THREE.ACESFilmicToneMapping }} onCreated={({ scene }) => { scene.background = new THREE.Color(bg); scene.fog = new THREE.Fog(bg, 10, 26); }}>
      <Env />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-4, 9, 6]} intensity={1.4} />
      <directionalLight position={[6, 3, -6]} intensity={1.6} color="#9ad8ff" />
      <directionalLight position={[6, 2, 6]} intensity={0.5} />
      <Floor bg={bg} />
      <Contact />
      <Rig progress={progress} paint={paint} mobile={mobile} fixed={fixed} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}
