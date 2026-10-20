import { notFound } from "next/navigation";
import Live from "@/components/Live";
import { AddBag } from "@/components/Bag";
import { accessories } from "@/lib/data";
import { money } from "@/lib/commerce/money";
export function generateStaticParams() { return accessories.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return { title: accessories.find((x) => x.slug === slug)?.name ?? "Accessory" }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const a = accessories.find((x) => x.slug === slug); if (!a) notFound();
  return (<main className="pt-[clamp(110px,10vw,140px)]"><div className="wrap grid gap-10 pb-[clamp(80px,9vw,140px)] lg:grid-cols-12 lg:items-center">
    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-mist/10 lg:col-span-7"><Live view={a.view} paint="obsidian" rim={1} /></div>
    <div className="lg:col-span-5"><p className="label text-ice">Accessory</p><h1 className="display mt-5 text-[clamp(44px,5vw,80px)]">{a.name}</h1><p className="mt-6 text-[16px] leading-[1.7] text-mist/65">{a.lead}</p>
      <ul className="mt-8 divide-y divide-mist/10 border-y border-mist/10 text-[14px]">{a.points.map((p) => <li key={p} className="py-3.5">{p}</li>)}</ul>
      <div className="mt-8 flex items-center justify-between gap-4"><span className="display text-[36px] tabular-nums">{money(a.price)}</span><AddBag id={a.slug} name={a.name} price={a.price} /></div>
      <p className="mt-6 text-[13px] text-mist/45">Other accessories: {accessories.filter((x) => x.slug !== a.slug).map((x, i) => <span key={x.slug}>{i ? " · " : ""}<a className="text-mist/75 underline-offset-4 hover:underline" href={`/accessories/${x.slug}`}>{x.name}</a></span>)}</p></div>
  </div></main>);
}
