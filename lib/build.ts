"use client";
import { useEffect, useState } from "react";
export type Build = { trim: string; paint: string; rim: number };
const KEY = "aeris-build", DEF: Build = { trim: "founders", paint: "silver", rim: 0 };
export function readBuild(): Build { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return DEF; } }
export function saveBuild(b: Build) { localStorage.setItem(KEY, JSON.stringify(b)); window.dispatchEvent(new Event("aeris-build")); }
export function useBuild() {
  const [b, setB] = useState<Build>(DEF);
  useEffect(() => { const f = () => setB(readBuild()); f(); window.addEventListener("aeris-build", f); window.addEventListener("storage", f); return () => { window.removeEventListener("aeris-build", f); window.removeEventListener("storage", f); }; }, []);
  return b;
}
