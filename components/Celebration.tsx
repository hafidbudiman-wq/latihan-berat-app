"use client";
import Portal from "./Portal";
import { useMemo } from "react";

const EMOJI = ["🎉", "💪", "🔥", "⭐", "🏆", "✨"];

/** Overlay perayaan dengan ledakan emoji (CSS murni). */
export default function Celebration({ title, subtitle }: { title: string; subtitle?: string }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 120 + ((i * 37) % 90);
        return {
          e: EMOJI[i % EMOJI.length],
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          rot: `${(i * 47) % 360}deg`,
          delay: `${(i % 5) * 40}ms`,
        };
      }),
    [],
  );
  return (
    <Portal>
    <div className="fixed inset-0 z-40 grid place-items-center bg-bg/80 backdrop-blur-sm">
      <div className="relative">
        {bits.map((b, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 text-2xl"
            style={{
              ["--dx" as string]: b.dx,
              ["--dy" as string]: b.dy,
              ["--rot" as string]: b.rot,
              animation: `burst 1.2s cubic-bezier(.2,.7,.2,1) ${b.delay} both`,
            }}
          >
            {b.e}
          </span>
        ))}
        <div className="card animate-pop-in relative px-8 py-6 text-center">
          <p className="text-2xl font-extrabold">{title}</p>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
    </Portal>
  );
}
