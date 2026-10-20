export type Trim = { slug: string; name: string; short: string; price: number; lead: string; specs: [string, string][]; includes: string[] };
export const trims: Trim[] = [
  { slug: "founders", name: "Vision One Founders", short: "Founders", price: 168000, lead: "The first 1,200 cars, numbered on the sill. Full dual-motor output, polished 21-inch rims and a Turin handover with the team that drew it.", specs: [["0–100 km/h", "2.9 s"], ["Output", "580 kW dual motor"], ["Range (WLTP, target)", "820 km"], ["10–80% charge", "11 min at 800 V"], ["Length / height", "4.36 m / 1.15 m"], ["Seats", "2"]], includes: ["Numbered sill plate and build book", "Polished 21″ rims", "Ember stitching on the cabin trim", "Handover at the Turin studio", "First claim on paint and options"] },
  { slug: "long-range", name: "Vision One Long Range", short: "Long Range", price: 142000, lead: "The same line of light, tuned for distance. Softer torque mapping, an aero wheel and the longest range we have drawn for the car.", specs: [["0–100 km/h", "3.6 s"], ["Output", "440 kW dual motor"], ["Range (WLTP, target)", "880 km"], ["10–80% charge", "12 min at 800 V"], ["Length / height", "4.36 m / 1.15 m"], ["Seats", "2"]], includes: ["Graphite 21″ aero rims", "Grand Tour drive mode tuned for efficiency", "Spatial audio, 32 speakers", "Handover at any Aeris studio"] },
];
export const paints = [
  { k: "silver", n: "Lunar Silver", css: "#b9bdc3", price: 0, note: "Satin liquid-metal finish over a silver base." },
  { k: "obsidian", n: "Obsidian", css: "#15171b", price: 0, note: "A deep black that lets the lamp blades stand out." },
  { k: "ember", n: "Ember", css: "#7a1f16", price: 3200, note: "Oxide red over a copper base, with charcoal interior trim." },
  { k: "glacier", n: "Glacier", css: "#9fb6c6", price: 2400, note: "Pale ice blue with a soft satin clear coat." },
];
export const rims = [{ n: "Graphite rims", price: 0 }, { n: "Polished rims", price: 2800 }];
export const DEPOSIT = 2500;
export type Acc = { slug: string; name: string; price: number; lead: string; points: string[]; view: "lamp" | "wheel" | "cabin" | "rear" };
export const accessories: Acc[] = [
  { slug: "home-charger", name: "Home charger", price: 1450, lead: "A 22 kW wall unit in brushed aluminium with a 7 m cable. Schedules charging for off-peak hours from the Aeris app.", points: ["22 kW AC, three-phase", "7 m cable with magnetic dock", "Off-peak scheduling", "Install booked through the studio"], view: "lamp" },
  { slug: "roof-box", name: "Roof box", price: 890, lead: "A low carbon pod shaped to the glass canopy. Fits two cabin bags and costs about 2% of range at motorway speed.", points: ["320 litres", "Carbon shell, 9 kg", "Tool-free mount", "Locks to the car key"], view: "rear" },
  { slug: "interior-pack", name: "Interior pack", price: 2400, lead: "Fitted luggage for the rear deck, a weave floor set and a cashmere throw in the cabin colour.", points: ["Two fitted weekend bags", "Recycled wool floor mats", "Cashmere throw", "Matched to your trim"], view: "cabin" },
];
export const studios = [
  { city: "Turin", note: "The design studio. Handover for Founders cars.", hours: "Tue–Sat · by appointment" },
  { city: "Munich", note: "Viewings and test seats.", hours: "Mon–Sat · by appointment" },
  { city: "Dubai", note: "Viewings and configuration.", hours: "Sun–Thu · by appointment" },
  { city: "Los Angeles", note: "Viewings and configuration.", hours: "Tue–Sun · by appointment" },
];
export const faq: [string, string][] = [
  ["Is Aeris a real car?", "No. Aeris Vision One is a design concept by Anorix. Nothing on this site can be bought, and the checkout is a demo that charges nothing."],
  ["What does the deposit do?", "In the concept, a refundable €2,500 deposit holds a build slot in order of reservation. On this site it is a demo line in your bag."],
  ["When would deliveries start?", "The story we tell is a Geneva reveal in March 2027 and first deliveries in 2028. It is a concept timeline, not a promise."],
  ["Can I change my build later?", "Yes. In the concept, paint, rims and trim stay open until production is scheduled. Here, your last build is saved in this browser."],
  ["How far does it go on one charge?", "The target is 820 km WLTP for Founders and 880 km for Long Range. These are design targets, not measured figures."],
  ["Where can I sit in one?", "The concept has four viewing studios: Turin, Munich, Dubai and Los Angeles. See Studios for the details."],
];
export const priceOf = (trim: string, paint: string, rim: number) => (trims.find((t) => t.slug === trim)?.price ?? 0) + (paints.find((p) => p.k === paint)?.price ?? 0) + (rims[rim]?.price ?? 0);
