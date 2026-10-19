"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
/** Calls onReady after 2 rendered frames (so the poster->canvas crossfade never shows an empty canvas). */
export default function FirstFrame({ onReady }: { onReady: () => void }) {
  const n = useRef(0);
  useFrame(() => { if (n.current < 3 && ++n.current === 2) onReady(); });
  return null;
}
