"use client";
import Model, { type IExerciseData } from "react-body-highlighter";
import { toMapMuscles } from "@/lib/muscles";

interface Props {
  primary?: string[];
  secondary?: string[];
  /** Mode heatmap: jumlah set per otot (nama otot free-exercise-db). */
  heat?: Record<string, number>;
  size?: number;
}

// Warna: index = frekuensi - 1
const COLORS = ["#2f8f8a", "#55d8d0", "#ffc77b", "#ff8b91"];

export default function BodyMap({ primary = [], secondary = [], heat, size = 160 }: Props) {
  let data: IExerciseData[];
  if (heat) {
    // 1-4 set: level 1, 5-9: level 2, 10-20: level 3 (zona ideal), >20: level 4
    data = Object.entries(heat).flatMap(([m, n]) => {
      const lvl = n >= 20.5 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : n > 0 ? 1 : 0;
      return Array.from({ length: lvl }, (_, i) => ({ name: `${m}-${i}`, muscles: toMapMuscles([m]) }));
    });
  } else {
    data = [
      { name: "sekunder", muscles: toMapMuscles(secondary) },
      // primer dihitung 2x supaya warnanya lebih kuat
      { name: "primer", muscles: toMapMuscles(primary) },
      { name: "primer2", muscles: toMapMuscles(primary) },
    ];
  }
  const style = { width: size };
  return (
    <div className="flex justify-center gap-4">
      <figure className="text-center">
        <Model type="anterior" data={data} highlightedColors={COLORS} bodyColor="#3a4763" style={style} />
        <figcaption className="mt-1 text-xs text-muted">Depan</figcaption>
      </figure>
      <figure className="text-center">
        <Model type="posterior" data={data} highlightedColors={COLORS} bodyColor="#3a4763" style={style} />
        <figcaption className="mt-1 text-xs text-muted">Belakang</figcaption>
      </figure>
    </div>
  );
}
