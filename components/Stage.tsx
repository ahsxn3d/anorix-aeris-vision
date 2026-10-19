"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lazy3D from "./kit/Lazy3D";
import { Arrow } from "./kit/ui";
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

const ch = [
  { k: "Aeris Vision One · Concept 2027", h: ["Light,", "given form."], p: "A grand tourer drawn with one continuous line of light. 4.9 metres, four seats, zero compromise on silence." },
  { k: "01 · Silhouette", h: ["One line,", "nose to tail."], p: "The body is a single lofted surface. No shut lines across the flank, no handles, no mirrors: the car reads as one stroke." },
  { k: "02 · Signature", h: ["Eyes that", "speak first."], p: "A 1,600-pixel light blade greets you, signals intent to pedestrians and dims to a heartbeat while charging." },
  { k: "03 · Stance", h: ["Wide, low,", "planted."], p: "Track widened by 90 mm, the cabin pulled rearwards. The proportions of a coupé with the room of a saloon." },
];
export default function Stage() {
  const root = useRef<HTMLElement>(null), progress = useRef(0);
  const [c, setC] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (s) => { const x = Math.min(3.999, s.progress * 4), seg = Math.floor(x), fr = x - seg, mv = Math.min(1, Math.max(0, (fr - 0.62) / 0.38)); progress.current = Math.min(3, seg + mv * mv * (3 - 2 * mv)) / 3; const v = Math.min(3, Math.floor(s.progress * 3.999)); setC((p) => (p === v ? p : v)); } });
    return () => st.kill();
  }, []);
  return (
    <section ref={root} className="relative h-[400vh] bg-void" aria-label="Aeris Vision One">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Lazy3D poster="/img/s0_0a0b0d_c9ccd1.webp" posterSm="/img/s0_0a0b0d_c9ccd1-m.webp" priority eager alt="Aeris Vision One concept car in silver, three-quarter front view, light blade lit" render={({ onReady, running }) => <CarScene progress={progress} running={running} onReady={onReady} />} />
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
                {i === 0 && <div className="kit-soft pointer-events-auto mt-9 flex flex-wrap gap-3"><a href="#reserve" className="btn bg-mist text-void hover:bg-ice">Reserve a viewing <Arrow /></a><a href="#configure" className="btn border border-mist/25 hover:border-ice hover:text-ice">Configure</a></div>}
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
