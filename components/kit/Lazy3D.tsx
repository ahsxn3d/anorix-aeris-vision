"use client";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

/** Static poster is ALWAYS painted first; the canvas fades in over it once its first frame has rendered.
 *  If WebGL is missing / context lost / chunk fails, the poster simply stays. */
export default function Lazy3D({ poster, posterSm, alt = "", render, className = "", priority = false, eager = false }: {
  poster: string; posterSm?: string; alt?: string; className?: string; priority?: boolean; eager?: boolean;
  render: (p: { onReady: () => void; running: boolean }) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [dead, setDead] = useState(false);
  useEffect(() => {
    if (!webglOK()) { setDead(true); return; }
    const el = ref.current!;
    // Progressive enhancement: the (identical) poster is the first paint; WebGL boots on the visitor's
    // first interaction, so it never competes with first load / LCP.
    let near = false, woke = false;
    const evs = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    const wake = () => { woke = true; evs.forEach((e) => window.removeEventListener(e, wake)); if (near) setMount(true); };
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near && woke) setMount(true); }, { rootMargin: eager ? "200% 0px" : "150% 0px" });
    io.observe(el);
    // render loop only while actually on screen (mount stays warm off-screen, frames stop)
    const vis = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { rootMargin: "5% 0px" });
    vis.observe(el);
    return () => { io.disconnect(); vis.disconnect(); evs.forEach((e) => window.removeEventListener(e, wake)); };
  }, [eager]);
  useEffect(() => {
    if (!mount) return;
    const c = ref.current?.querySelector("canvas");
    if (!c) return;
    const lost = (e: Event) => { e.preventDefault(); setDead(true); };
    c.addEventListener("webglcontextlost", lost);
    return () => c.removeEventListener("webglcontextlost", lost);
  }, [mount, ready]);
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      <Image src={poster} alt={alt} fill priority={priority} sizes="100vw" className={`object-cover transition-opacity duration-700 ${posterSm ? "max-md:hidden" : ""} ${ready && !dead ? "opacity-0" : "opacity-100"}`} />
      {posterSm && <Image src={posterSm} alt={alt} fill priority={priority} sizes="100vw" className={`object-cover transition-opacity duration-700 md:hidden ${ready && !dead ? "opacity-0" : "opacity-100"}`} />}
      {mount && !dead && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Boundary onError={() => setDead(true)}>{render({ onReady: () => setReady(true), running })}</Boundary>
        </div>
      )}
    </div>
  );
}
