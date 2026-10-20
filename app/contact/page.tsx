import ContactForm from "@/components/ContactForm";
import { Head } from "@/components/UI";
export const metadata = { title: "Contact" };
export default function Page() { return (<main><Head k="Contact" title={<>Talk to<br />a studio.</>} lead="Viewings, reservations or press. Pick a topic and we will route it." /><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap max-w-[900px]"><ContactForm /></div></section></main>); }
