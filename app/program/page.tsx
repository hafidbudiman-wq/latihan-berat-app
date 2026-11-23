import Link from "next/link";
import { PROGRAMS } from "@/lib/programs";
import { getExercise, toSummary } from "@/lib/exercises";
import { muscleLabel } from "@/lib/muscles";
import StartDayButton, { type DayItem } from "@/components/StartDayButton";

export const metadata = { title: "Program | Weight Training Agent" };

export default function ProgramPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Program Latihan</h1>
        <p className="text-sm text-muted">
          Pilih program, lalu tekan Mulai. Beban awal diisi otomatis dari riwayat kamu (progressive overload).
        </p>
      </div>
      {PROGRAMS.map((p) => (
        <section key={p.id} className="card space-y-3">
          <div>
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-sm text-muted">{p.daysPerWeek}x / minggu · {p.description}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {p.days.map((d) => {
              const items: DayItem[] = d.exercises.flatMap((x) => {
                const e = getExercise(x.exerciseId);
                return e ? [{ ...x, exercise: toSummary(e) }] : [];
              });
              return (
                <div key={d.key} className="rounded-xl border border-line p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{d.title}</p>
                      <p className="text-xs text-muted">{d.focus}</p>
                    </div>
                    <StartDayButton title={`${p.name}: ${d.title}`} items={items} />
                  </div>
                  <ul className="divide-y divide-line text-sm">
                    {items.map((x) => (
                      <li key={x.exerciseId} className="flex items-center justify-between gap-2 py-1.5">
                        <Link href={`/latihan/${x.exerciseId}`} className="hover:text-accent">
                          {x.exercise.name}
                          <span className="block text-xs text-muted">
                            {x.exercise.primaryMuscles.map(muscleLabel).join(", ")}
                          </span>
                        </Link>
                        <span className="shrink-0 text-muted">
                          {x.sets} × {x.reps}{x.exerciseId === "Plank" ? " dtk" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
