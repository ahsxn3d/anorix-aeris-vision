import { notFound } from "next/navigation";
import Live from "@/components/Live";
import { AddBag } from "@/components/Bag";
import { trims, DEPOSIT } from "@/lib/data";
import { money } from "@/lib/commerce/money";
export function generateStaticParams() { return trims.map((t) => ({ trim: t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ trim: string }> }) { const { trim } = await params; const t = trims.find((x) => x.slug === trim); return { title: t?.name ?? "Model" }; }
export default async function Page({ params }: { params: Promise<{ trim: string }> }) {
  const { trim } = await params; const t = trims.find((x) => x.slug === trim); if (!t) notFound();
  return (<main className="pt-[clamp(110px,10vw,140px)]"><div className="wrap grid gap-10 pb-[clamp(80px,9vw,140px)] lg:grid-cols-12">
    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-mist/10 lg:col-span-7 lg:aspect-auto lg:min-h-[640px]"><Live drag view="center" paint={t.slug === "founders" ? "ember" : "glacier"} rim={t.slug === "founders" ? 1 : 0} /></div>
    <div className="lg:col-span-5"><p className="label text-ice">Vision One · {t.short}</p><h1 className="display mt-5 text-[clamp(44px,5vw,80px)]">{t.name}</h1><p className="mt-6 text-[16px] leading-[1.7] text-mist/65">{t.lead}</p>
      <p className="mt-8"><span className="label block text-mist/45">From</span><span className="display text-[44px] tabular-nums">{money(t.price)}</span></p>
      <div className="mt-6 flex flex-wrap gap-3"><AddBag id={`deposit-${t.slug}`} name={`Deposit · ${t.name}`} price={DEPOSIT} label={`Reserve · ${money(DEPOSIT)} deposit`} /><a href="/configure" className="btn border border-mist/25 hover:border-ice hover:text-ice">Configure</a></div>
      <dl className="mt-10 divide-y divide-mist/10 border-y border-mist/10">{t.specs.map(([k, v]) => <div key={k} className="flex justify-between py-3.5 text-[14px]"><dt className="text-mist/50">{k}</dt><dd>{v}</dd></div>)}</dl>
      <ul className="mt-8 space-y-2 text-[14px] text-mist/75">{t.includes.map((x) => <li key={x} className="flex gap-3"><span className="text-ice">+</span>{x}</li>)}</ul></div>
  </div></main>);
}
