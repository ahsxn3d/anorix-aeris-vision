"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/commerce/cart";
/** Cockpit HUD header: transparent bar, a speedo arc in the centre that reads scroll progress, links as left/right readouts. */
const L = [["Models", "/models"], ["Configure", "/configure"], ["Studios", "/studios"]], R = [["Reserve", "/reserve"], ["About", "/about"]];
export default function Hud() {
  const path = usePathname(), { count } = useCart(), [p, setP] = useState(0), [open, setOpen] = useState(false);
  useEffect(() => { const f = () => { const h = document.documentElement.scrollHeight - innerHeight; setP(h > 0 ? Math.min(1, scrollY / h) : 0); }; f(); addEventListener("scroll", f, { passive: true }); addEventListener("resize", f); return () => { removeEventListener("scroll", f); removeEventListener("resize", f); }; }, []);
  const on = (h: string) => path === h || path.startsWith(h + "/");
  const kmh = Math.round(p * 260), A = 2 * Math.PI * 34 * (240 / 360);
  const Read = ({ l, h, i }: { l: string; h: string; i: number }) => <a href={h} className={`group flex flex-col leading-none transition-colors ${on(h) ? "text-ice" : "text-mist/70 hover:text-mist"}`}><span className="label !text-[9px] text-mist/35">{String(i).padStart(2, "0")}</span><span className="label mt-1.5">{l}</span></a>;
  return (<header className="fixed inset-x-0 top-0 z-50">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void/80 to-transparent" />
    <div className="wrap relative grid grid-cols-[1fr_auto_1fr] items-start pt-4">
      <nav aria-label="Primary left" className="hidden gap-9 pt-5 md:flex">{L.map(([l, h], i) => <Read key={h} l={l} h={h} i={i + 1} />)}</nav>
      <button onClick={() => setOpen(!open)} className="label justify-self-start pt-5 text-mist md:hidden" aria-expanded={open}>{open ? "Close" : "Menu"}</button>
      <a href="/" aria-label="Aeris home" className="relative block h-[78px] w-[96px]">
        <svg viewBox="0 0 96 78" className="absolute inset-0" aria-hidden="true">
          <g transform="translate(48 42) rotate(150)"><circle r="34" fill="none" stroke="#e7e6e2" strokeOpacity=".14" strokeWidth="2" strokeDasharray={`${A} 999`} />
            <circle r="34" fill="none" stroke="#9ad8ff" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${A * p} 999`} style={{ transition: "stroke-dasharray .25s" }} />
            {Array.from({ length: 13 }, (_, k) => <line key={k} x1="40" y1="0" x2={k % 3 ? 42 : 44} y2="0" stroke="#e7e6e2" strokeOpacity={k % 3 ? .25 : .55} transform={`rotate(${k * 20})`} />)}</g>
        </svg>
        <span className="display absolute inset-x-0 top-[26px] text-center text-[22px] tabular-nums">{kmh}</span>
        <span className="label absolute inset-x-0 top-[52px] text-center !text-[8px] !tracking-[.32em] text-mist/60">AERIS</span>
      </a>
      <nav aria-label="Primary right" className="flex items-start justify-end gap-9 pt-5">
        <span className="hidden gap-9 md:flex">{R.map(([l, h], i) => <Read key={h} l={l} h={h} i={i + 4} />)}</span>
        <a href="/cart" className={`flex flex-col leading-none ${on("/cart") ? "text-ice" : "text-mist"}`}><span className="label !text-[9px] text-mist/35">BAG</span><span className="label mt-1.5 tabular-nums">{String(count).padStart(2, "0")}</span></a>
      </nav>
    </div>
    {open && <nav className="wrap relative mt-4 grid gap-1 rounded-[20px] bg-carbon/95 py-4 backdrop-blur md:hidden">{[...L, ...R, ["FAQ", "/faq"], ["Contact", "/contact"]].map(([l, h]) => <a key={h} href={h} className="display py-2 text-[30px]">{l}</a>)}</nav>}
  </header>);
}
