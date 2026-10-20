import ReserveForm from "@/components/ReserveForm";
import { Head, Demo } from "@/components/UI";
export const metadata = { title: "Reserve" };
export default function Page() { return (<main><Head k="Reserve" title={<>Hold your<br />build.</>} lead="Your last configuration is saved in this browser. Reserve it with a refundable deposit, then choose where you want to take the handover."><div className="mt-8 inline-block"><Demo /></div></Head><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><ReserveForm /></div></section></main>); }
