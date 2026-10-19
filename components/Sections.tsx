"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Marquee } from "./kit/ui";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="wrap flex items-center justify-between pt-6 text-mist">
        <a href="#" aria-label="Aeris home" className="flex items-center gap-3"><svg viewBox="0 0 40 12" className="h-3 w-10" aria-hidden="true"><path d="M1 11 20 1l19 10" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg><span className="display text-[17px] tracking-[0.18em]">AERIS</span></a>
        <nav aria-label="Primary" className="label hidden gap-10 md:flex">{[["Design", "#"], ["Configure", "#configure"], ["Cockpit", "#cockpit"], ["Specs", "#specs"]].map(([l, h]) => <a key={l} href={h} className="transition-opacity hover:opacity-60">{l}</a>)}</nav>
        <a href="#reserve" className="label rounded-full border border-current px-4 py-2.5 transition-colors hover:bg-mist hover:text-void">Reserve</a>
      </div>
    </header>
  );
}

const specs = [[2.9, "s", "0–100 km/h", 1], [820, "km", "WLTP range", 0], [580, "kW", "Dual-motor output", 0], [11, "min", "10–80% at 800 V", 0]];
export function Specs() {
  return (
    <section id="specs" className="border-y border-mist/10 bg-void">
      <div className="wrap grid grid-cols-2 lg:grid-cols-4">
        {specs.map(([v, u, l, d], i) => (
          <div key={l as string} className={`py-14 md:py-20 ${i % 2 ? "pl-6 md:pl-10" : ""} ${i > 0 ? "lg:border-l lg:border-mist/10 lg:pl-10" : ""} ${i > 1 ? "border-t border-mist/10 lg:border-t-0" : ""}`}>
            <p className="display text-[clamp(48px,6vw,104px)] tabular-nums"><span data-count={v as number} data-dec={d as number}>0</span><span className="ml-2 text-[0.32em] tracking-normal text-ice">{u as string}</span></p>
            <p className="label mt-4 text-mist/50">{l as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cockpit() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(0);
  useEffect(() => {
    const el = ref.current!; const io = new IntersectionObserver(([e]) => el.classList.toggle("in", e.isIntersecting), { threshold: 0.35 }); io.observe(el);
    return () => io.disconnect();
  }, []);
  const modes = [["Glide", 412, "#9ad8ff"], ["Grand Tour", 186, "#e7e6e2"], ["Pursuit", 94, "#ff5a36"]] as const;
  return (
    <section id="cockpit" className="bg-carbon py-[clamp(96px,11vw,170px)]">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-ice">Cockpit</p>
          <h2 className="display mt-5 text-[clamp(44px,5vw,84px)]" data-reveal="lines">Calm by default.</h2>
          <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.7] text-mist/70" data-fade>One 48-inch pane runs pillar to pillar, showing only what the moment needs. Pick a drive mode: the interface, the light blade and the sound shift with it.</p>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Drive mode">{modes.map(([n], k) => <button key={n} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-full border px-5 py-2.5 text-[14px] transition-colors duration-300 ${mode === k ? "border-mist bg-mist text-void" : "border-mist/20 hover:border-mist/60"}`}>{n}</button>)}</div>
        </div>
        <div ref={ref} className="relative lg:col-span-7" data-fade>
          <div className="relative overflow-hidden rounded-[28px] bg-void p-6 ring-1 ring-mist/10 md:p-10">
            <div className="hairline absolute inset-x-0 top-0" />
            <div className="flex items-center justify-between"><span className="label text-mist/50">AERIS OS 3.0</span><span className="label flex items-center gap-2" style={{ color: modes[mode][2] }}><span className="blink h-1.5 w-1.5 rounded-full bg-current" />{modes[mode][0]}</span></div>
            <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
              <svg viewBox="0 0 220 220" className="mx-auto w-full max-w-[300px]" aria-label={`Range ${modes[mode][1]} kilometres`}>
                <circle cx="110" cy="110" r="92" fill="none" stroke="#2a2d33" strokeWidth="2" />
                <circle cx="110" cy="110" r="92" fill="none" stroke={modes[mode][2]} strokeWidth="2" strokeLinecap="round" className="hud-ring" pathLength={1000} strokeDasharray={`${(modes[mode][1] / 820) * 1000} 1000`} transform="rotate(-90 110 110)" style={{ transition: "stroke-dasharray .9s cubic-bezier(.16,1,.3,1), stroke .6s" }} />
                {Array.from({ length: 60 }, (_, k) => <line key={k} x1="110" y1="8" x2="110" y2={k % 5 ? 12 : 16} stroke="#e7e6e2" strokeOpacity={k % 5 ? 0.15 : 0.4} transform={`rotate(${k * 6} 110 110)`} />)}
                <text x="110" y="112" textAnchor="middle" className="display" fill="#e7e6e2" fontSize="54" fontWeight="300">{modes[mode][1]}</text>
                <text x="110" y="140" textAnchor="middle" fill="#9a9ca1" fontSize="10" letterSpacing="3">KM TO DESTINATION</text>
              </svg>
              <ul className="space-y-4 text-[14px]">
                {[["Next charge", "Ionity Lyon-Nord · 11 min"], ["Cabin", "21 °C · air purified"], ["Audio", "Spatial · 32 speakers"], ["Assist", "Hands-off on motorway"]].map(([a, b]) => <li key={a} className="flex items-center justify-between border-b border-mist/10 pb-4"><span className="text-mist/50">{a}</span><span>{b}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const shots = [["c1_e7e6e2_c9ccd1", "Profile", "A single stroke from nose to tail"], ["top_e7e6e2_c9ccd1", "Plan", "The glasshouse pulled rearwards"], ["c2_0a0b0d_c9ccd1", "Blade", "1,600 pixels of light"], ["c3_0a0b0d_1b1d22", "Obsidian", "Stance, from behind"]];
export function Gallery() {
  return (
    <section className="bg-void py-[clamp(96px,11vw,170px)]">
      <div className="wrap">
        <div className="flex items-end justify-between gap-6"><h2 className="display text-[clamp(44px,5vw,84px)]" data-reveal="lines">Every angle.</h2><p className="label hidden text-mist/50 md:block">Studio, Turin · 2026</p></div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {shots.map(([img, t, d], i) => (
            <figure key={img} className={`hov-wrap ${i % 2 ? "md:mt-24" : ""}`}>
              <div data-clip className="relative aspect-[16/10] overflow-hidden rounded-[20px]"><div data-clip-img className="absolute inset-0"><div className="hov absolute inset-0"><Image src={`/img/${img}.webp`} alt={`Aeris Vision One, ${t.toLowerCase()} view`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></div></div></div>
              <figcaption className="mt-4 flex items-baseline justify-between"><span className="display text-[26px]">{t}</span><span className="text-[14px] text-mist/50">{d}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reserve() {
  const [ok, setOk] = useState(false);
  return (
    <footer id="reserve" className="overflow-hidden bg-mist text-void">
      <div className="border-b border-void/10 py-6"><Marquee items={["Geneva · March 2027", "Turin studio viewings", "Deliveries from 2028", "Limited to 1,200 founders"]} className="display text-[clamp(24px,2.6vw,40px)]" sep="—" /></div>
      <div className="wrap grid gap-12 py-[clamp(80px,9vw,140px)] lg:grid-cols-12">
        <div className="lg:col-span-6"><p className="label text-void/50">Founders edition</p><h2 className="display mt-5 text-[clamp(52px,7vw,120px)]" data-reveal="lines">Sit in it first.</h2></div>
        <form className="self-end lg:col-span-5 lg:col-start-8" onSubmit={(e) => { e.preventDefault(); setOk(true); }}>
          <div className="grid gap-6">
            <label className="block"><span className="label text-void/50">Name</span><input required className="mt-2 w-full border-b border-void/25 bg-transparent pb-3 text-[20px] outline-none focus:border-void" /></label>
            <label className="block"><span className="label text-void/50">Email</span><input type="email" required className="mt-2 w-full border-b border-void/25 bg-transparent pb-3 text-[20px] outline-none focus:border-void" /></label>
            <label className="block"><span className="label text-void/50">Studio</span><select className="mt-2 w-full border-b border-void/25 bg-transparent pb-3 text-[20px] outline-none"><option>Turin</option><option>Munich</option><option>Dubai</option><option>Los Angeles</option></select></label>
          </div>
          <button className="btn mt-10 bg-void text-mist hover:bg-ember">{ok ? "Request received" : "Request a viewing"} <Arrow /></button>
        </form>
      </div>
      <p className="display select-none px-[clamp(16px,3.4vw,48px)] text-[24vw] leading-[.78] tracking-[0.04em] text-void/[0.08]" aria-hidden="true">AERIS</p>
      <div className="wrap flex flex-col justify-between gap-3 border-t border-void/10 py-8 text-[12px] text-void/60 md:flex-row"><span>© 2026 Aeris. A concept project by Anorix, not a real car or brand.</span><span>Designed &amp; built by Anorix</span></div>
    </footer>
  );
}
