import Live from "@/components/Live";
import { Head } from "@/components/UI";
import { studios } from "@/lib/data";
export const metadata = { title: "Studios" };
export default function Page() { return (<main><Head k="Studios" title={<>Sit in it<br />first.</>} lead="Four viewing studios in the concept. Each one has a car on the floor, a test seat and the full paint and trim library." />
  <section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><div className="relative aspect-[16/9] overflow-hidden rounded-[24px] ring-1 ring-mist/10"><Live drag view="profile" paint="obsidian" rim={1} bg="#0d0e11" /></div>
  <div className="mt-5 grid gap-px overflow-hidden rounded-[24px] bg-mist/10 sm:grid-cols-2 lg:grid-cols-4">{studios.map((s, i) => <div key={s.city} className="bg-void p-7"><p className="label text-ice">0{i + 1}</p><p className="display mt-4 text-[30px]">{s.city}</p><p className="mt-3 text-[14px] text-mist/60">{s.note}</p><p className="label mt-6 text-mist/45">{s.hours}</p></div>)}</div>
  <a href="/contact" className="btn mt-10 bg-mist text-void hover:bg-ice">Request a viewing</a></div></section></main>); }
