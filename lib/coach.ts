import type { WorkoutSession } from "./types.ts";
import { sessionVolume, weeklySetsByMuscle } from "./progression.ts";
import { MUSCLE_LABELS } from "./muscles.ts";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachProfile {
  goal?: string; // misal: "hipertrofi", "kekuatan", "turun lemak"
  experience?: string; // "pemula" | "menengah" | "mahir"
  daysPerWeek?: number;
  equipment?: string; // "gym lengkap" | "dumbel di rumah" | ...
  injuries?: string;
}

/** Target set mingguan per otot untuk hipertrofi (rentang umum 10-20). */
export const WEEKLY_SET_TARGET = { min: 10, max: 20 };

const MAJOR = ["chest", "lats", "middle back", "shoulders", "quadriceps", "hamstrings", "glutes", "biceps", "triceps"];

export function trainingSummary(sessions: WorkoutSession[], now = new Date()): string {
  if (!sessions.length) return "Belum ada sesi latihan yang tercatat.";
  const recent = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const weekly = weeklySetsByMuscle(sessions, now);
  const lines = [
    `Total sesi tercatat: ${sessions.length}.`,
    "Sesi terakhir:",
    ...recent.map((s) => {
      const ex = s.exercises
        .map((e) => {
          const done = e.sets.filter((x) => x.done);
          const sets = done.map((x) => `${x.weight}kg x ${x.reps}`).join(", ");
          return `${e.name} (target ${e.targetReps} reps): ${sets || "tidak ada set selesai"}`;
        })
        .join("; ");
      return `- ${s.date.slice(0, 10)} ${s.title} (volume ${Math.round(sessionVolume(s))} kg): ${ex}`;
    }),
    "Set per otot 7 hari terakhir: " +
      (Object.entries(weekly)
        .sort((a, b) => b[1] - a[1])
        .map(([m, n]) => `${MUSCLE_LABELS[m] ?? m} ${n}`)
        .join(", ") || "belum ada"),
  ];
  return lines.join("\n");
}

export function systemPrompt(profile: CoachProfile, summary: string): string {
  return [
    "Kamu adalah Weight Training Agent: pelatih angkat beban pribadi yang ramah, berbahasa Indonesia santai (boleh pakai 'kamu').",
    "Tugasmu: menyusun dan menyesuaikan program latihan beban, menjelaskan teknik, memberi saran progressive overload berdasarkan data latihan user, dan menjaga keselamatan.",
    "Aturan:",
    "- Jawab singkat dan praktis (maksimal sekitar 200 kata) kecuali user minta detail. Pakai daftar bila membantu.",
    "- Dasarkan saran pada data latihan di bawah. Sebut angka konkret (beban, set, repetisi, istirahat) bila relevan.",
    "- Target umum hipertrofi: 10-20 set per otot per minggu, 6-15 repetisi, sisakan 1-3 repetisi (RIR).",
    "- Jika user menyebut nyeri tajam, pusing, sesak, atau cedera: sarankan berhenti latihan yang memicu dan konsultasi dokter/fisioterapis. Jangan mendiagnosis.",
    "- Jangan memberi saran obat, steroid, atau diet ekstrem.",
    "",
    `Profil user: tujuan=${profile.goal || "belum diisi"}, pengalaman=${profile.experience || "belum diisi"}, hari/minggu=${profile.daysPerWeek ?? "belum diisi"}, alat=${profile.equipment || "belum diisi"}, cedera/keterbatasan=${profile.injuries || "tidak ada"}.`,
    "",
    "Data latihan user:",
    summary,
  ].join("\n");
}

/** Coach offline berbasis aturan, dipakai jika API key AI belum diset. */
export function ruleBasedReply(
  message: string,
  profile: CoachProfile,
  sessions: WorkoutSession[],
  now = new Date(),
): string {
  const text = message.toLowerCase();
  if (/(nyeri|sakit|cedera|keseleo|pusing|sesak)/.test(text)) {
    return "Kalau ada nyeri tajam, pusing, atau sesak: stop dulu latihan yang memicunya. Nyeri otot biasa (pegal 1-3 hari) itu normal, tapi nyeri sendi atau nyeri tajam sebaiknya dicek ke dokter atau fisioterapis sebelum lanjut. Sementara itu latih bagian tubuh lain yang tidak sakit.";
  }
  if (/(protein|makan|diet|nutrisi|kalori)/.test(text)) {
    return "Patokan umum: protein 1,6-2,2 g per kg berat badan per hari, dibagi 3-5 kali makan. Untuk naik massa otot, makan sedikit di atas kebutuhan kalori (+200-300 kkal). Untuk turun lemak, defisit ringan (-300-500 kkal) sambil tetap latihan beban supaya otot terjaga.";
  }
  if (/(program|jadwal|mulai|pemula|rutinitas)/.test(text)) {
    const days = profile.daysPerWeek ?? 3;
    return days >= 4
      ? "Dengan 4 hari/minggu, coba program Upper / Lower Menengah di menu Program: Upper-Lower-istirahat-Upper-Lower. Mulai dengan beban yang menyisakan 2-3 repetisi."
      : "Untuk mulai, pakai program Full Body Pemula di menu Program: 3x seminggu (misal Senin-Rabu-Jumat), selang-seling hari A dan B. Fokus teknik dulu 2-3 minggu, lalu naikkan beban tiap kali semua set tuntas.";
  }
  const weekly = weeklySetsByMuscle(sessions, now);
  if (!sessions.length) {
    return "Belum ada latihan yang tercatat. Pilih program di menu Program lalu mulai sesi pertama kamu. Setelah ada data, aku bisa kasih saran beban dan otot mana yang masih kurang dilatih.";
  }
  const low = MAJOR.filter((m) => (weekly[m] ?? 0) < WEEKLY_SET_TARGET.min);
  const high = MAJOR.filter((m) => (weekly[m] ?? 0) > WEEKLY_SET_TARGET.max);
  const parts = [`Minggu ini kamu sudah latihan dengan total ${Object.values(weekly).reduce((a, b) => a + b, 0)} set.`];
  if (low.length)
    parts.push(
      `Otot yang masih di bawah ${WEEKLY_SET_TARGET.min} set/minggu: ${low.map((m) => MUSCLE_LABELS[m]).join(", ")}. Tambahkan 2-4 set untuk otot ini di sesi berikutnya.`,
    );
  if (high.length)
    parts.push(`Otot yang sudah lebih dari ${WEEKLY_SET_TARGET.max} set: ${high.map((m) => MUSCLE_LABELS[m]).join(", ")}. Tidak perlu ditambah lagi.`);
  parts.push("Saran beban per latihan muncul otomatis di halaman Workout saat kamu mulai sesi.");
  parts.push("(Mode offline. Pasang ANTHROPIC_API_KEY supaya coach bisa menjawab pertanyaan bebas.)");
  return parts.join(" ");
}
