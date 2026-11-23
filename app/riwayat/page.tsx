"use client";
import { useSessions } from "@/lib/storage";
import { estimate1RM, sessionVolume } from "@/lib/progression";

export default function RiwayatPage() {
  const [sessions, setSessions, loaded] = useSessions();
  if (!loaded) return <p className="text-muted">Memuat…</p>;
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `riwayat-latihan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Riwayat</h1>
        {sessions.length > 0 && <button className="btn-ghost text-sm" onClick={exportJson}>Ekspor JSON</button>}
      </div>
      {!sorted.length && <p className="card text-muted">Belum ada sesi tersimpan.</p>}
      {sorted.map((s) => (
        <section key={s.id} className="card space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-xs text-muted">
                {new Date(s.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                {" · "}volume {Math.round(sessionVolume(s))} kg
              </p>
            </div>
            <button
              className="text-xs text-danger"
              onClick={() => window.confirm("Hapus sesi ini?") && setSessions(sessions.filter((x) => x.id !== s.id))}
            >
              Hapus
            </button>
          </div>
          <ul className="text-sm">
            {s.exercises.map((e, i) => {
              const done = e.sets.filter((x) => x.done);
              const best = Math.max(0, ...done.map((x) => estimate1RM(x.weight, x.reps)));
              return (
                <li key={i} className="flex justify-between gap-2 border-t border-line py-1.5">
                  <span>{e.name}</span>
                  <span className="text-right text-muted">
                    {done.map((x) => `${x.weight}×${x.reps}`).join(", ")}
                    {best > 0 && <span className="block text-xs">1RM ≈ {best} kg</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
