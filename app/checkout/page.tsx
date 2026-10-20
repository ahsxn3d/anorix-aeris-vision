import { Checkout } from "@/components/Bag";
import { Head, Demo } from "@/components/UI";
export const metadata = { title: "Checkout" };
export default function Page() { return (<main><Head k="Checkout" title="Checkout."><div className="mt-8 inline-block"><Demo /></div></Head><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><Checkout /></div></section></main>); }
