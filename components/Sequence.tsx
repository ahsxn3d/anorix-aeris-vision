"use client";
import { useEffect, useRef, type MutableRefObject } from "react";
import { gsap } from "gsap";

/** Scroll-scrubbed, pre-rendered image sequence on a 2D canvas.
 *  Frames are rendered offline from the licensed car model (see CREDITS.md), so the hero costs one drawImage per changed frame.
 *  Loading is progressive: chapter keyframes first, then every 4th frame, then the rest; the nearest loaded frame is drawn. */
export default function Sequence({ frame, count, dir, mdir, className = "" }: { frame: MutableRefObject<number>; count: number; dir: string; mdir: string; className?: string }) {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!; const ctx = c.getContext("2d", { alpha: false })!;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const base = mobile ? mdir : dir;
    const imgs: (HTMLImageElement | null)[] = Array(count).fill(null);
    let alive = true, drawn = -1, w = 0, h = 0;
    const order: number[] = []; const seen = new Set<number>(); const push = (i: number) => { if (i < count && !seen.has(i)) { seen.add(i); order.push(i); } };
    [0, 24, 48, 72].forEach(push); for (let i = 0; i < count; i += 4) push(i); for (let i = 0; i < count; i += 2) push(i); for (let i = 0; i < count; i++) push(i);
    let q = 0; const load = () => { if (!alive || q >= order.length) return; const i = order[q++]; const im = new Image(); im.decoding = "async"; im.src = `${base}/${i}.webp`;
      im.onload = () => { imgs[i] = im; drawn = -1; load(); }; im.onerror = () => load(); };
    for (let k = 0; k < 4; k++) load(); // 4 parallel lanes
    const size = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.5); w = c.clientWidth; h = c.clientHeight; c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); drawn = -1; };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const nearest = (f: number) => { if (imgs[f]) return imgs[f]; for (let d = 1; d < count; d++) { if (imgs[f - d]) return imgs[f - d]; if (imgs[f + d]) return imgs[f + d]; } return null; };
    const tick = () => {
      const f = Math.max(0, Math.min(count - 1, Math.round(frame.current)));
      if (f === drawn) return; const im = nearest(f); if (!im) return;
      // object-fit: cover
      const s = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight); const iw = im.naturalWidth * s, ih = im.naturalHeight * s;
      ctx.drawImage(im, (c.width - iw) / 2, (c.height - ih) / 2, iw, ih); if (imgs[f]) drawn = f; if (c.style.opacity !== "1") c.style.opacity = "1";
    };
    gsap.ticker.add(tick);
    return () => { alive = false; gsap.ticker.remove(tick); ro.disconnect(); };
  }, [count, dir, mdir, frame]);
  return <canvas ref={cv} className={`absolute inset-0 h-full w-full opacity-0 ${className}`} aria-hidden="true" />;
}
