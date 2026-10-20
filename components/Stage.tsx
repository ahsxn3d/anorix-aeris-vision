"use client";
import dynamic from "next/dynamic";
import Lazy3D from "./kit/Lazy3D";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const CarView = dynamic(() => import("./CarView"), { ssr: false });
import { Arrow } from "./kit/ui";

// Chapters follow the camera's orbit: 3/4 front -> nose -> profile -> rear 3/4 (frames 0, 24, 48, 72)
const ch = [
  { k: "Aeris Vision One · Concept 2027", h: ["Light,", "given form."], p: "A two-seat electric grand tourer, 4.36 metres long and 1.15 metres tall. Built to cross a continent on one charge stop and arrive rested." },
  { k: "01 · Signature", h: ["Eyes that", "speak first."], p: "Two blade lamps cut into the nose. They greet you as you walk up, signal intent to pedestrians and pulse slowly while the car charges." },
  { k: "02 · Silhouette", h: ["One line,", "nose to tail."], p: "A low bonnet, a glass canopy that runs from the windscreen to the rear deck, and a two-tone sill that keeps the flank visually light." },
  { k: "03 · Stance", h: ["Wide, low,", "planted."], p: "Wheels pushed to the corners on 21-inch rims, a full-width rear light and a body only 1.15 metres from the road. It looks fast standing still." },
];
export default function Stage() {
  const root = useRef<HTMLElement>(null), progress = useRef(0), yaw = useRef(0);
  const [c, setC] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (s) => { const x = Math.min(3.999, s.progress * 4), seg = Math.floor(x), fr = x - seg, mv = Math.min(1, Math.max(0, (fr - 0.62) / 0.38)); progress.current = Math.min(3, seg + mv * mv * (3 - 2 * mv)) / 3; const q = progress.current * 3, K = [0, -40, -130, -182], i0 = Math.min(2, Math.floor(q)); yaw.current = K[i0] + (K[i0 + 1] - K[i0]) * (q - i0); const v = Math.min(3, Math.floor(s.progress * 3.999)); setC((p) => (p === v ? p : v)); } });
    return () => st.kill();
  }, []);
  return (
    <section ref={root} className="relative h-[400vh] bg-void" aria-label="Aeris Vision One">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* live studio car: the camera orbits with scroll (3/4 front → nose → profile → rear 3/4) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,#1b1d22,#0a0b0d_70%)]" />
        <Lazy3D eager render={({ onReady, running }) => <CarView paint="silver" rim={1} yaw={yaw} running={running} onReady={onReady} bg="#0a0b0d" />} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-void/40 md:bg-gradient-to-r md:from-void/85 md:via-void/0 md:to-transparent" />
        <div className="wrap relative flex h-full flex-col justify-end pb-[12vh] md:justify-center md:pb-0">
          <div className="relative min-h-[320px] md:min-h-[440px]">
            {ch.map((x, i) => (
              <div key={x.k} className={`absolute inset-x-0 bottom-0 max-w-[600px] transition-[opacity,transform,filter] duration-1000 ease-[cubic-bezier(.16,1,.3,1)] md:top-0 md:bottom-auto ${c === i ? "translate-y-0 opacity-100" : c > i ? "pointer-events-none -translate-y-10 opacity-0" : "pointer-events-none translate-y-10 opacity-0"}`}>
                <p className="label text-ice">{x.k}</p>
                {i === 0
                  ? <h1 className="display mt-6 text-[clamp(52px,7.4vw,124px)]">{x.h.map((l, j) => <span key={l} className="kit-mask"><span className="kit-line" style={{ animationDelay: `${0.15 + j * 0.12}s` }}>{l}</span></span>)}</h1>
                  : <h2 className="display mt-6 text-[clamp(48px,6.6vw,112px)]">{x.h.map((l) => <span key={l} className="block">{l}</span>)}</h2>}
                <p className={`mt-7 max-w-[42ch] text-[15px] leading-[1.7] text-mist/70 ${i === 0 ? "kit-soft" : ""}`}>{x.p}</p>
                {i === 0 && <div className="kit-soft pointer-events-auto mt-9 flex flex-wrap gap-3"><a href="/reserve" className="btn bg-mist text-void hover:bg-ice">Reserve a viewing <Arrow /></a><a href="/configure" className="btn border border-mist/25 hover:border-ice hover:text-ice">Configure</a></div>}
              </div>
            ))}
          </div>
        </div>
        <div className="wrap absolute inset-x-0 bottom-6 flex items-center gap-6">
          {ch.map((x, i) => <div key={x.k} className="flex-1"><div className="h-px bg-mist/15"><div className="h-px origin-left bg-ice transition-transform duration-700" style={{ transform: `scaleX(${c >= i ? 1 : 0})` }} /></div><p className={`label mt-3 hidden transition-colors duration-500 md:block ${c === i ? "text-mist" : "text-mist/40"}`}>{x.k.split("·")[1] ?? "Intro"}</p></div>)}
        </div>
      </div>
    </section>
  );
}
