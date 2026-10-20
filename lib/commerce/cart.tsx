"use client";
/** Shared demo-commerce logic (visuals stay per-site). Cart lives in localStorage under a per-site key. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
export type Line = { id: string; name: string; price: number; qty: number; opt?: string };
type Ctx = { lines: Line[]; count: number; total: number; add: (l: Omit<Line, "qty">, qty?: number) => void; setQty: (id: string, opt: string | undefined, q: number) => void; clear: () => void; ready: boolean };
const C = createContext<Ctx | null>(null);
export function CartProvider({ storeKey, children }: { storeKey: string; children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]), [ready, setReady] = useState(false);
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem(storeKey) || "[]")); } catch {} setReady(true); }, [storeKey]);
  useEffect(() => { if (ready) localStorage.setItem(storeKey, JSON.stringify(lines)); }, [lines, ready, storeKey]);
  const add = useCallback((l: Omit<Line, "qty">, qty = 1) => setLines((ls) => { const i = ls.findIndex((x) => x.id === l.id && x.opt === l.opt); if (i < 0) return [...ls, { ...l, qty }]; const n = [...ls]; n[i] = { ...n[i], qty: n[i].qty + qty }; return n; }), []);
  const setQty = useCallback((id: string, opt: string | undefined, q: number) => setLines((ls) => ls.flatMap((x) => (x.id === id && x.opt === opt ? (q <= 0 ? [] : [{ ...x, qty: q }]) : [x]))), []);
  const clear = useCallback(() => setLines([]), []);
  const v = useMemo(() => ({ lines, add, setQty, clear, ready, count: lines.reduce((a, l) => a + l.qty, 0), total: lines.reduce((a, l) => a + l.qty * l.price, 0) }), [lines, add, setQty, clear, ready]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
export function useCart() { const c = useContext(C); if (!c) throw new Error("CartProvider missing"); return c; }
export { money } from "./money";
