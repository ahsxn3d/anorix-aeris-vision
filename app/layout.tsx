import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Motion from "@/components/kit/Motion";
import { CartProvider } from "@/lib/commerce/cart";
import Hud from "@/components/Hud";
import Recap from "@/components/Recap";

const display = localFont({ src: "../public/fonts/unbounded-latin-wght-normal.woff2", variable: "--f-display", weight: "100 900", display: "swap" });
const sans = localFont({ src: "../public/fonts/sora-latin-wght-normal.woff2", variable: "--f-sans", weight: "100 900", display: "swap" });
const mono = localFont({ src: "../public/fonts/jetbrains-mono-latin-wght-normal.woff2", variable: "--f-mono", weight: "100 900", display: "swap", preload: false });

export const metadata: Metadata = { title: { default: "Aeris Vision One — Light, given form", template: "%s — Aeris" }, description: "Aeris Vision One is a concept grand tourer drawn with a single line of light. A concept by Anorix.", openGraph: { title: "Aeris Vision One — Light, given form", description: "Aeris Vision One is a concept grand tourer drawn with a single line of light. A concept by Anorix.", type: "website" } };
export const viewport: Viewport = { themeColor: "#0a0b0d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /></head>
      <body><Motion /><CartProvider storeKey="aeris-bag"><Hud />{children}<Recap /></CartProvider></body>
    </html>
  );
}
