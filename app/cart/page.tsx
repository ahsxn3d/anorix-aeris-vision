import { Bag } from "@/components/Bag";
import { Head } from "@/components/UI";
export const metadata = { title: "Bag" };
export default function Page() { return (<main><Head k="Bag" title="Your bag." /><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><Bag /></div></section></main>); }
