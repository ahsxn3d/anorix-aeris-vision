"use client";
import { useState } from "react";
export default function ContactForm() {
  const [ok, setOk] = useState(false), f = "w-full border-b border-mist/20 bg-transparent pb-3 pt-2 text-[17px] outline-none placeholder:text-mist/35 focus:border-ice";
  if (ok) return <p className="display text-[34px]">Noted. <span className="text-mist/45">This is a concept, so nobody will call.</span></p>;
  return (<form onSubmit={(e) => { e.preventDefault(); setOk(true); }} className="grid gap-7 sm:grid-cols-2"><input required placeholder="Name" className={f} /><input required type="email" placeholder="Email" className={f} /><select className={`${f} sm:col-span-2`}>{["Request a viewing", "Reservation question", "Press", "Something else"].map((x) => <option key={x} className="bg-carbon">{x}</option>)}</select><textarea required rows={4} placeholder="Message" className={`${f} sm:col-span-2`} /><p className="text-[12px] text-mist/45 sm:col-span-2">Concept form. Nothing is sent or stored.</p><button className="btn w-fit bg-mist text-void hover:bg-ice">Send</button></form>);
}
