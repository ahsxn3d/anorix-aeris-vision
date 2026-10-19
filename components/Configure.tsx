"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import Lazy3D from "./kit/Lazy3D";
const CarView = dynamic(() => import("./CarView"), { ssr: false });
const paints = [
  { k: "silver", n: "Lunar Silver", css: "#b9bdc3", note: "Satin liquid-metal finish over a silver base." },
  { k: "obsidian", n: "Obsidian", css: "#15171b", note: "A deep black that lets the lamp blades stand out." },
  { k: "ember", n: "Ember", css: "#7a1f16", note: "Oxide red over a copper base, with charcoal interior trim." },
  { k: "glacier", n: "Glacier", css: "#9fb6c6", note: "Pale ice blue with a soft satin clear coat." },
];
const rims = [["Graphite rims", "158,400"], ["Polished rims", "161,200"]];
export default function Configure() {
  const [i, setI] = useState(0), [w, setW] = useState(0);
  const yaw = useRef(0), drag = useRef<{ x: number; y0: number } | null>(null);
  const [spun, setSpun] = useState(false);
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y0: yaw.current }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (!drag.current) return; yaw.current = Math.max(-160, Math.min(160, drag.current.y0 - (e.clientX - drag.current.x) * 0.35)); if (!spun) setSpun(true); };
  const onUp = () => { drag.current = null; };
  return (
    <section id="configure" className="relative bg-carbon">
      <div className="relative overflow-hidden md:h-[100svh] md:min-h-[640px]">
        <div className="relative h-[54svh] touch-pan-y md:absolute md:inset-0 md:h-auto" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} style={{ cursor: "grab" }}>
          {/* studio renders of every paint crossfade underneath; the live model takes over once loaded */}
          <div className="absolute inset-0">{paints.map((p, k) => (
            <div key={p.k} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`}>
              <Image src={`/img/cfg-${p.k}.webp`} alt={k === i ? `Aeris Vision One in ${p.n}` : ""} fill sizes="100vw" className="object-cover max-md:hidden" />
              <Image src={`/img/cfgm-${p.k}.webp`} alt="" fill sizes="100vw" className="object-cover md:hidden" />
            </div>))}
          </div>
          <Lazy3D poster={`/img/cfg-silver.webp`} alt="" className="[&>img]:hidden" render={({ onReady, running }) => <CarView paint={paints[i].k} rim={w} yaw={yaw} running={running} onReady={onReady} bg="#121317" />} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/50 md:bg-gradient-to-r md:from-carbon/90 md:via-carbon/0" />
          <p className={`label pointer-events-none absolute bottom-6 right-6 text-mist/50 transition-opacity duration-700 md:bottom-10 md:right-10 ${spun ? "opacity-0" : "opacity-100"}`}>Drag to turn</p>
        </div>
        <div className="wrap pointer-events-none relative flex flex-col pb-20 md:h-full md:justify-center md:pb-0">
          <div className="pointer-events-auto max-w-[460px]">
            <p className="label text-ice">Configure</p>
            <h2 className="display mt-5 text-[clamp(44px,5vw,84px)]" data-reveal="lines">Make it yours.</h2>
            <fieldset className="mt-10">
              <legend className="label text-mist/60">Paint · <span className="text-mist">{paints[i].n}</span></legend>
              <div className="mt-4 flex gap-3">{paints.map((p, k) => <button key={p.k} onClick={() => setI(k)} aria-label={p.n} aria-pressed={k === i} className={`h-12 w-12 rounded-full ring-1 ring-offset-4 ring-offset-carbon transition-[box-shadow] duration-500 ${k === i ? "ring-ice" : "ring-mist/20 hover:ring-mist/60"}`} style={{ background: `radial-gradient(circle at 30% 30%, #fff8, transparent 45%), ${p.css}` }} />)}</div>
              <p className="mt-4 min-h-[3em] text-[14px] text-mist/60">{paints[i].note}</p>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="label text-mist/60">21″ wheels</legend>
              <div className="mt-4 flex flex-wrap gap-2">{rims.map(([x], k) => <button key={x} onClick={() => setW(k)} aria-pressed={k === w} className={`rounded-full border px-5 py-2.5 text-[14px] transition-colors duration-300 ${k === w ? "border-ice bg-ice text-void" : "border-mist/20 hover:border-mist/60"}`}>{x}</button>)}</div>
            </fieldset>
            <div className="mt-10 flex items-end justify-between border-t border-mist/10 pt-6"><div><p className="label text-mist/50">Est. from</p><p className="display mt-2 text-[40px] tabular-nums">€ {rims[w][1]}</p></div><a href="#reserve" className="btn bg-mist text-void hover:bg-ice">Reserve</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
