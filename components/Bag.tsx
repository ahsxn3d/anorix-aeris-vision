"use client";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { Arrow } from "./kit/ui";
export function AddBag({ id, name, price, opt, label = "Add to bag", go, className = "btn bg-mist text-void hover:bg-ice" }: { id: string; name: string; price: number; opt?: string; label?: string; go?: string; className?: string }) {
  const { add } = useCart();
  return <button className={className} onClick={() => { add({ id, name, price, opt }); location.href = go ?? "/cart"; }}>{label} <Arrow /></button>;
}
export function Bag() {
  const { lines, total, setQty, ready } = useCart();
  if (ready && !lines.length) return (<div className="rounded-[24px] border border-mist/10 p-10"><p className="display text-[34px]">Nothing reserved yet.</p><p className="mt-3 text-mist/60">Start with a trim, or add an accessory.</p><div className="mt-6 flex gap-3"><a href="/models" className="btn bg-mist text-void">See models</a><a href="/configure" className="btn border border-mist/25">Configure</a></div></div>);
  return (<div className="grid gap-8 lg:grid-cols-12">
    <ul className="divide-y divide-mist/10 border-y border-mist/10 lg:col-span-8">{lines.map((l) => <li key={l.id + (l.opt ?? "")} className="flex flex-wrap items-center justify-between gap-4 py-6"><div><p className="display text-[24px]">{l.name}</p>{l.opt && <p className="label mt-2 text-mist/50">{l.opt}</p>}</div><div className="flex items-center gap-6"><div className="flex items-center rounded-full border border-mist/20"><button aria-label="Less" className="px-4 py-2" onClick={() => setQty(l.id, l.opt, l.qty - 1)}>−</button><span className="w-6 text-center tabular-nums">{l.qty}</span><button aria-label="More" className="px-4 py-2" onClick={() => setQty(l.id, l.opt, l.qty + 1)}>+</button></div><span className="w-28 text-right tabular-nums">{money(l.price * l.qty)}</span></div></li>)}</ul>
    <aside className="h-fit rounded-[24px] bg-carbon p-7 ring-1 ring-mist/10 lg:col-span-4"><p className="label text-mist/50">Due today</p><p className="display mt-3 text-[44px] tabular-nums">{money(total)}</p><p className="mt-2 text-[13px] text-mist/50">Deposits are refundable in the concept. Accessories ship with the car.</p><a href="/checkout" className="btn mt-6 w-full justify-center bg-mist text-void hover:bg-ice">Checkout <Arrow /></a></aside>
  </div>);
}
export function Checkout() {
  const { lines, total, clear, ready } = useCart();
  const f = "w-full border-b border-mist/20 bg-transparent pb-3 pt-2 text-[17px] outline-none placeholder:text-mist/35 focus:border-ice";
  if (ready && !lines.length) return <p className="text-mist/70">Your bag is empty. <a className="text-ice underline" href="/models">See models</a></p>;
  return (<form className="grid gap-12 lg:grid-cols-12" onSubmit={(e) => { e.preventDefault(); clear(); location.href = "/checkout/done"; }}>
    <div className="grid gap-7 sm:grid-cols-2 lg:col-span-7"><p className="label text-ice sm:col-span-2">01 · Driver</p><input required placeholder="Full name" autoComplete="name" className={`${f} sm:col-span-2`} /><input required type="email" placeholder="Email" autoComplete="email" className={f} /><input required placeholder="Phone" autoComplete="tel" className={f} />
      <label className="sm:col-span-2"><span className="label text-mist/50">Handover studio</span><select className={`${f} mt-1`}>{["Turin", "Munich", "Dubai", "Los Angeles"].map((c) => <option key={c} className="bg-carbon">{c}</option>)}</select></label>
      <p className="label mt-4 text-ice sm:col-span-2">02 · Payment (demo)</p><input required inputMode="numeric" placeholder="4242 4242 4242 4242" className={`${f} sm:col-span-2`} /><input required placeholder="MM / YY" className={f} /><input required placeholder="CVC" className={f} /><p className="text-[12px] text-mist/45 sm:col-span-2">Demo form. Nothing is sent or stored, and no card is charged.</p></div>
    <aside className="h-fit rounded-[24px] bg-carbon p-7 ring-1 ring-mist/10 lg:col-span-5"><p className="label text-mist/50">Summary</p><ul className="mt-5 space-y-3 text-[14px]">{lines.map((l) => <li key={l.id + (l.opt ?? "")} className="flex justify-between gap-4"><span>{l.name} × {l.qty}{l.opt && <span className="block text-mist/45">{l.opt}</span>}</span><span className="tabular-nums">{money(l.price * l.qty)}</span></li>)}</ul><div className="mt-6 flex justify-between border-t border-mist/10 pt-5 text-[18px]"><span>Total</span><span className="tabular-nums">{money(total)}</span></div><button className="btn mt-6 w-full justify-center bg-mist text-void hover:bg-ice">Place demo reservation</button></aside>
  </form>);
}
