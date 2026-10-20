export function Head({ k, title, lead, children }: { k: string; title: React.ReactNode; lead?: string; children?: React.ReactNode }) {
  return (<section className="bg-void pb-[clamp(40px,5vw,72px)] pt-[clamp(130px,13vw,190px)]"><div className="wrap"><p className="label text-ice">{k}</p><h1 className="display mt-5 text-[clamp(44px,7vw,124px)]">{title}</h1>{lead && <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.7] text-mist/65">{lead}</p>}{children}</div></section>);
}
export function Demo() { return <p className="label rounded-full border border-ember/40 px-4 py-2 text-ember">Demo — no payment taken</p>; }
