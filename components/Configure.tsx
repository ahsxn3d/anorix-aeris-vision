"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import Lazy3D from "./kit/Lazy3D";
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });
const paints = [
  { n: "Lunar Silver", hex: 0xc9ccd1, css: "#c9ccd1", img: "s0_121317_c9ccd1", note: "Liquid-metal flake, six coats." },
  { n: "Obsidian", hex: 0x15171b, css: "#15171b", img: "s0_121317_15171b", note: "A black that holds the light blade." },
  { n: "Ember", hex: 0x8a2f22, css: "#8a2f22", img: "s0_121317_8a2f22", note: "Deep oxide red over a copper base." },
  { n: "Glacier", hex: 0x9fb8c9, css: "#9fb8c9", img: "s0_121317_9fb8c9", note: "Pale ice blue, satin clear coat." },
];
const wheels = ["21″ Aero Blade", "22″ Turbine"];
export default function Configure() {
  const [i, setI] = useState(0), [w, setW] = useState(0);
  const paint = useRef(paints[0].hex);
  const pick = (k: number) => { setI(k); paint.current = paints[k].hex; };
  return (
    <section id="configure" className="relative bg-carbon">
      <div className="relative overflow-hidden md:h-[100svh] md:min-h-[640px]">
        <div className="relative h-[54svh] md:absolute md:inset-0 md:h-auto">
        {/* fallback posters crossfade per paint; the live canvas sits above them once ready */}
        <div className="absolute inset-0">{paints.map((p, k) => <Image key={p.n} src={`/img/${p.img}.webp`} alt={k === i ? `Aeris Vision One in ${p.n}` : ""} fill sizes="100vw" className={`object-cover transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`} />)}</div>
        <Lazy3D poster={`/img/${paints[0].img}.webp`} alt="" className="[&>img]:hidden" render={({ onReady, running }) => <CarScene fixed={0} paint={paint} running={running} onReady={onReady} bg="#121317" />} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/50 md:bg-gradient-to-r md:from-carbon/90 md:via-carbon/0" />
        </div>
        <div className="wrap relative flex flex-col pb-20 md:h-full md:justify-center md:pb-0">
          <div className="max-w-[460px]">
            <p className="label text-ice">Configure</p>
            <h2 className="display mt-5 text-[clamp(44px,5vw,84px)]" data-reveal="lines">Make it yours.</h2>
            <fieldset className="mt-10">
              <legend className="label text-mist/60">Paint · <span className="text-mist">{paints[i].n}</span></legend>
              <div className="mt-4 flex gap-3">{paints.map((p, k) => <button key={p.n} onClick={() => pick(k)} aria-label={p.n} aria-pressed={k === i} className={`h-12 w-12 rounded-full ring-1 ring-offset-4 ring-offset-carbon transition-[box-shadow,transform] duration-500 ${k === i ? "ring-ice" : "ring-mist/20 hover:ring-mist/60"}`} style={{ background: `radial-gradient(circle at 30% 30%, #fff8, transparent 45%), ${p.css}` }} />)}</div>
              <p className="mt-4 text-[14px] text-mist/60">{paints[i].note}</p>
            </fieldset>
            <fieldset className="mt-8">
              <legend className="label text-mist/60">Wheels</legend>
              <div className="mt-4 flex gap-2">{wheels.map((x, k) => <button key={x} onClick={() => setW(k)} aria-pressed={k === w} className={`rounded-full border px-5 py-2.5 text-[14px] transition-colors duration-300 ${k === w ? "border-ice bg-ice text-void" : "border-mist/20 hover:border-mist/60"}`}>{x}</button>)}</div>
            </fieldset>
            <div className="mt-10 flex items-end justify-between border-t border-mist/10 pt-6"><div><p className="label text-mist/50">Est. from</p><p className="display mt-2 text-[40px] tabular-nums">€ {w ? "164,900" : "158,400"}</p></div><a href="#reserve" className="btn bg-mist text-void hover:bg-ice">Reserve</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
