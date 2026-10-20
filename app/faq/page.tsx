import { Head } from "@/components/UI";
import { faq } from "@/lib/data";
export const metadata = { title: "FAQ" };
export default function Page() { return (<main><Head k="FAQ" title="Questions." /><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap max-w-[900px] divide-y divide-mist/10 border-y border-mist/10">{faq.map(([q, a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px]">{q}<span className="label text-ice transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 max-w-[60ch] text-mist/65">{a}</p></details>)}</div></section></main>); }
