"use client";
import { useBuild } from "@/lib/build";
import { paints, priceOf, rims, trims } from "@/lib/data";
import { money } from "@/lib/commerce/money";
import { Arrow } from "./kit/ui";
/** Configurator recap footer: your saved build, one CTA, the sitemap in a thin row. */
const map = [["Models", "/models"], ["Configure", "/configure"], ["Home charger", "/accessories/home-charger"], ["Roof box", "/accessories/roof-box"], ["Interior pack", "/accessories/interior-pack"], ["Reserve", "/reserve"], ["Studios", "/studios"], ["About", "/about"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Bag", "/cart"]];
export default function Recap() {
  const b = useBuild(), t = trims.find((x) => x.slug === b.trim) ?? trims[0], p = paints.find((x) => x.k === b.paint) ?? paints[0];
  return (<footer className="relative overflow-hidden border-t border-mist/10 bg-void">
    <div className="wrap grid gap-10 py-[clamp(72px,8vw,120px)] lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-5"><p className="label text-ice">Your build</p><h2 className="display mt-5 text-[clamp(40px,5vw,80px)]">{t.short}<br /><span className="text-mist/45">in {p.n}.</span></h2></div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-mist/10 sm:grid-cols-4 lg:col-span-7">
        {[["Trim", t.short], ["Paint", <span key="p" className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full ring-1 ring-mist/30" style={{ background: p.css }} />{p.n}</span>], ["Wheels", rims[b.rim]?.n ?? rims[0].n], ["Est. from", money(priceOf(t.slug, p.k, b.rim))]].map(([k, v]) => <div key={k as string} className="bg-carbon p-5"><dt className="label text-mist/45">{k}</dt><dd className="mt-3 text-[15px]">{v}</dd></div>)}
      </dl>
      <div className="flex flex-wrap gap-3 lg:col-span-12 lg:justify-end"><a href="/configure" className="btn border border-mist/25 hover:border-ice hover:text-ice">Change build</a><a href="/reserve" className="btn bg-mist text-void hover:bg-ice">Reserve this build <Arrow /></a></div>
    </div>
    <nav aria-label="Sitemap" className="border-y border-mist/10"><div className="wrap flex flex-wrap gap-x-7 gap-y-3 py-5">{map.map(([l, h]) => <a key={h} href={h} className="label text-mist/55 transition-colors hover:text-ice">{l}</a>)}</div></nav>
    <div className="wrap flex flex-col justify-between gap-2 py-6 text-[12px] text-mist/45 md:flex-row"><span>© 2026 Aeris. A concept by Anorix, not a real car or brand. Prices and figures are design targets.</span><span>Car model: Khronos “Car Concept”, CC BY 4.0</span></div>
  </footer>);
}
