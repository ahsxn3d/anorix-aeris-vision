"use client";
import { useBuild } from "@/lib/build";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { DEPOSIT, paints, priceOf, rims, trims } from "@/lib/data";
import { Arrow } from "./kit/ui";
export default function ReserveForm() {
  const b = useBuild(), { add } = useCart(), t = trims.find((x) => x.slug === b.trim) ?? trims[0], p = paints.find((x) => x.k === b.paint) ?? paints[0];
  return (<div className="grid gap-5 lg:grid-cols-12">
    <div className="rounded-[24px] bg-carbon p-8 ring-1 ring-mist/10 lg:col-span-7"><p className="label text-mist/50">Build to hold</p><p className="display mt-4 text-[36px]">{t.name}</p><p className="mt-2 text-mist/60">{p.n} · {rims[b.rim]?.n}</p><p className="mt-6 text-mist/50">Estimated price <span className="text-mist tabular-nums">{money(priceOf(t.slug, p.k, b.rim))}</span></p><a href="/configure" className="label mt-6 inline-block text-ice">Change build →</a></div>
    <div className="flex flex-col justify-between rounded-[24px] bg-mist p-8 text-void lg:col-span-5"><div><p className="label text-void/50">Refundable deposit</p><p className="display mt-4 text-[56px] tabular-nums">{money(DEPOSIT)}</p><p className="mt-3 text-[14px] text-void/65">Holds a build slot in order of reservation. Change or cancel any time before production in the concept.</p></div>
      <button className="btn mt-8 justify-center bg-void text-mist hover:bg-ember" onClick={() => { add({ id: `deposit-${t.slug}`, name: `Deposit · ${t.name}`, price: DEPOSIT, opt: `${p.n} · ${rims[b.rim]?.n}` }); location.href = "/checkout"; }}>Reserve this build <Arrow /></button></div>
  </div>);
}
