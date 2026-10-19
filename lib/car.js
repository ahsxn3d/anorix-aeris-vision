// Aeris Vision One: procedural concept coupe (parametric lofted body). Shared by the live R3F scene and the poster renders.
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const spow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);
function loft(THREE, nu, nv, f) {
  const pos = new Float32Array((nu + 1) * (nv + 1) * 3), idx = [];
  let k = 0;
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const p = f(i / nu, j / nv); pos[k++] = p[0]; pos[k++] = p[1]; pos[k++] = p[2]; }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
export const L = 4.9;
// body: t 0 = tail, 1 = nose
const bodyTop = (t) => 0.7 + 0.34 * sm(0.0, 0.25, t) - 0.24 * sm(0.62, 1.0, t) + 0.06 * Math.sin(t * Math.PI);
const arch = (t, c) => { const d = (t - c) / 0.108; return Math.abs(d) < 1 ? 0.62 * Math.sqrt(1 - d * d) : 0; };
const bodyBot = (t) => 0.24 + 0.08 * sm(0.88, 1, t) + 0.06 * (1 - sm(0, 0.1, t)) + Math.max(arch(t, 0.1776), arch(t, 0.8224));
const bodyW = (t) => 0.98 - 0.12 * sm(0.75, 1, t) - 0.06 * (1 - sm(0, 0.2, t));
const ends = (t, k = 6) => Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1), k)), 1 / k);
export function bodyPoint(t, th) {
  const e = ends(t, 7), top = bodyTop(t), bot = bodyBot(t), mid = (top + bot) / 2, hh = (top - bot) / 2;
  const c = Math.cos(th), s = Math.sin(th);
  const x = (t - 0.5) * L;
  return [x, mid + hh * e * spow(s, 0.42) - (1 - e) * 0.0, bodyW(t) * e * spow(c, 0.38) * (s > 0 ? 1 - 0.08 * s : 1)];
}
export function buildCar(THREE, o = {}) {
  const paint = new THREE.MeshStandardMaterial({ color: o.paint ?? 0xc9ccd1, metalness: 0.88, roughness: 0.2, envMapIntensity: 1.25 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x07090c, metalness: 0.6, roughness: 0.05, envMapIntensity: 1.4 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.3, roughness: 0.55 });
  const tyre = new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.85 });
  const rimM = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 1, roughness: 0.22 });
  const light = new THREE.MeshBasicMaterial({ color: o.light ?? 0xcdeeff, toneMapped: false });
  const tail = new THREE.MeshBasicMaterial({ color: 0xff3d22, toneMapped: false });
  const car = new THREE.Group();
  const body = new THREE.Mesh(loft(THREE, 140, 56, (u, v) => bodyPoint(u, v * Math.PI * 2)), paint); car.add(body);
  // cabin / glass canopy: t 0.16 .. 0.7
  const cab = loft(THREE, 120, 48, (u, v) => {
    const t = 0.14 + u * 0.56, e = ends(u, 3.2), th = v * Math.PI;           // upper half only
    const top = 0.98 + 0.36 * e * (1 - 0.25 * sm(0.5, 1, u)), base = 0.88;
    const w = 0.8 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * u - 1), 6)), 1 / 6) * bodyW(t);
    return [(t - 0.5) * L, base + (top - base) * spow(Math.sin(th), 0.6), w * spow(Math.cos(th), 0.7)];
  });
  const gl = new THREE.Mesh(cab, glass); car.add(gl);
  // black lower cladding band
  const clad = new THREE.Mesh(loft(THREE, 140, 4, (u, v) => { const t = 0.03 + u * 0.94; const p = bodyPoint(t, Math.PI * 2 * 0); const yb = bodyBot(t) + 0.02; const w = bodyW(t) * ends(t, 7) * 1.004; const th = (v - 0.5) * 2; return [(t - 0.5) * L, yb + 0.05 + Math.abs(th) * 0.0, w * th]; }), black); clad.visible = false; car.add(clad);
  // light signature: curved front bar + rear bar following the plan outline
  const planX = (z, front) => { let best = front ? 1 : 0; for (let i = 0; i <= 400; i++) { const t = front ? 1 - i / 1600 : i / 1600; if (bodyW(t) * ends(t, 7) >= Math.abs(z)) { best = t; break; } } return (best - 0.5) * L; };
  const bar = (front, y, span, mat, r) => { const pts = []; for (let i = 0; i <= 40; i++) { const z = (i / 40 - 0.5) * 2 * span; pts.push(new THREE.Vector3(planX(z, front) + (front ? 0.012 : -0.012), y, z)); } return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, r, 8, false), mat); };
  const fb = bar(true, 0.62, 0.66, light, 0.014); car.add(fb);
  const rb = bar(false, 0.64, 0.6, tail, 0.016); car.add(rb);
  // wheels (partly covered by the body skirt)
  const wheels = []; const wb = 1.58, wr = 0.4;
  for (const x of [wb, -wb]) for (const z of [0.76, -0.76]) {
    const wg = new THREE.Group(); wg.position.set(x, wr, z);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, 0.24, 48), tyre); t.rotation.x = Math.PI / 2; wg.add(t);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(wr * 0.74, wr * 0.74, 0.27, 48), rimM); face.rotation.x = Math.PI / 2; wg.add(face);
    for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.07, wr * 1.3, 0.02), black); sp.rotation.z = i * Math.PI / 5; sp.position.z = z > 0 ? 0.137 : -0.137; wg.add(sp); }
    car.add(wg); wheels.push(wg);
  }
  // soft halo behind the light bars (cheap fake bloom, additive sprite)
  const halo = (() => { const c = typeof document !== "undefined" ? document.createElement("canvas") : null; if (!c) return null; c.width = c.height = 128; const x = c.getContext("2d"); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
  const halos = [];
  if (halo) for (const [front, y, col] of [[true, 0.62, o.light ?? 0xcdeeff], [false, 0.64, 0xff3d22]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.34), new THREE.MeshBasicMaterial({ map: halo, color: col, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    m.position.set(front ? L / 2 + 0.06 : -L / 2 - 0.06, y, 0); m.rotation.y = front ? Math.PI / 2 : -Math.PI / 2; car.add(m); halos.push(m);
  }
  car.traverse((m) => { if (m.isMesh) { m.castShadow = !m.material.blending || m.material.blending === THREE.NormalBlending; m.receiveShadow = true; } });
  car.userData = { paint, light, tail, wheels, fb, rb, glass, halos };
  return car;
}
// camera stops (orbit on a circle around the car); shared by poster renders and the scroll scene
export const STOPS = [
  { a: 0.62, r: 9.2, y: 1.45, tx: -0.62, ty: 0.55 },  // hero: 3/4 front, car sits right of copy
  { a: 1.5708, r: 11.2, y: 0.85, tx: -0.95, ty: 0.62 },     // silhouette: pure side
  { a: 0.12, r: 7.6, y: 1.0, tx: -0.62, ty: 0.55 },     // light: nose close-up
  { a: -2.35, r: 9.6, y: 1.7, tx: -0.8, ty: 0.6 },        // stance: 3/4 rear
];
export function camAt(st, mobile) { // pan (camera + target) along the view's right vector so the car sits beside the copy
  const r = st.r * (mobile ? 1.45 : 1), ox = mobile ? 0 : st.tx * Math.sin(st.a), oz = mobile ? 0 : -st.tx * Math.cos(st.a);
  return { pos: [Math.cos(st.a) * r + ox, st.y * (mobile ? 1.25 : 1), Math.sin(st.a) * r + oz], tgt: [ox, mobile ? st.ty - 1.15 : st.ty, oz] }; }
