"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Lazy3D from "./kit/Lazy3D";
import { VIEWS, type View } from "./CarView";
const CarView = dynamic(() => import("./CarView"), { ssr: false });
/** Live car tile: a named camera station, optional drag-to-turn. */
export default function Live({ view = "center", paint = "silver", rim = 0, bg = "#121317", drag = false, label }: { view?: string | View; paint?: string; rim?: number; bg?: string; drag?: boolean; label?: string }) {
  const yaw = useRef(0), d = useRef<{ x: number; y0: number } | null>(null), [spun, setSpun] = useState(false);
  const v = typeof view === "string" ? VIEWS[view] : view;
  const h = drag ? { onPointerDown: (e: React.PointerEvent) => { d.current = { x: e.clientX, y0: yaw.current }; }, onPointerMove: (e: React.PointerEvent) => { if (!d.current) return; yaw.current = Math.max(-170, Math.min(170, d.current.y0 - (e.clientX - d.current.x) * .35)); if (!spun) setSpun(true); }, onPointerUp: () => { d.current = null; }, onPointerLeave: () => { d.current = null; } } : {};
  return (<div className="absolute inset-0 touch-pan-y" style={{ background: bg, cursor: drag ? "grab" : undefined }} {...h}>
    <Lazy3D render={({ onReady, running }) => <CarView paint={paint} rim={rim} yaw={yaw} running={running} onReady={onReady} bg={bg} view={v} />} />
    {drag && <p className={`label pointer-events-none absolute bottom-5 right-5 text-mist/50 transition-opacity ${spun ? "opacity-0" : ""}`}>{label ?? "Live 3D · drag to turn"}</p>}
  </div>);
}
