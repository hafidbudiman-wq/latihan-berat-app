"use client";
import { useState } from "react";

interface Props {
  frames: string[];
  name: string;
  /** Tampilan kecil di kartu: tanpa kontrol. */
  compact?: boolean;
  /** Sembunyikan label GERAK (untuk thumbnail kecil). */
  hideBadge?: boolean;
  className?: string;
}

const SPEEDS = [
  { label: "Pelan", sec: 3.6 },
  { label: "Normal", sec: 2.4 },
  { label: "Cepat", sec: 1.4 },
];

/**
 * Demo gerakan beranimasi: dua frame dataset (posisi awal & akhir) diputar
 * bergantian dengan crossfade, seperti GIF. Tanpa JS kecuali tombol kontrol.
 */
export default function MotionDemo({ frames, name, compact, hideBadge, className = "" }: Props) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  if (!frames.length) return null;
  const [a, b] = frames;
  const anim = {
    animation: `frame-swap ${SPEEDS[speed].sec}s ease-in-out infinite`,
    animationPlayState: playing ? "running" : "paused",
  } as const;
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white ${className}`}>
      <div className="relative aspect-[4/3]" style={{ animation: playing && !compact ? "ken-burns 9s ease-in-out infinite" : undefined }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a} alt={`${name}: posisi awal`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        {b && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b} alt={`${name}: posisi akhir`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={anim} />
        )}
      </div>
      {b && !hideBadge && (
        <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          <span className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse bg-hot" : "bg-white/60"}`} />
          {playing ? "GERAK" : "JEDA"}
        </span>
      )}
      {!compact && b && (
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition active:scale-95"
          >
            {playing ? "❚❚ Jeda" : "▶ Putar"}
          </button>
          <div className="flex overflow-hidden rounded-full bg-black/60 text-[11px] text-white backdrop-blur">
            {SPEEDS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSpeed(i)}
                className={`px-2.5 py-1 transition ${i === speed ? "bg-accent text-bg" : "hover:bg-white/10"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
