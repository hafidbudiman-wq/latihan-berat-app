"use client";
import { useEffect, useRef, useState } from "react";
import { ruleBasedReply, type ChatMessage } from "@/lib/coach";

// Di GitHub Pages tidak ada server, jadi coach jalan offline di browser.
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
import { useProfile, useSessions } from "@/lib/storage";

const STARTERS = [
  "Buatkan jadwal latihan untuk minggu ini",
  "Otot mana yang masih kurang dilatih?",
  "Bagaimana teknik goblet squat yang benar?",
  "Berapa protein yang aku butuhkan?",
];

export default function CoachPage() {
  const [profile, setProfile] = useProfile();
  const [sessions] = useSessions();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "offline" | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    if (STATIC) {
      setMode("offline");
      setMessages([...next, { role: "assistant", content: ruleBasedReply(content, profile, sessions) }]);
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, profile, sessions }),
      });
      const data = await res.json();
      setMode(data.mode ?? null);
      setMessages([...next, { role: "assistant", content: data.reply ?? data.error ?? "Terjadi kesalahan." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Gagal terhubung ke server. Cek koneksi kamu." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Coach</h1>
          <p className="text-xs text-muted">
            Membaca riwayat latihan kamu ({sessions.length} sesi).
            {mode === "offline" && " Mode offline (berbasis aturan)."}
          </p>
        </div>
        <button className="btn-ghost text-sm" onClick={() => setShowProfile((v) => !v)}>Profil</button>
      </div>

      {showProfile && (
        <div className="card grid gap-2 sm:grid-cols-2">
          <label className="text-sm">Tujuan
            <select className="input mt-1" value={profile.goal ?? ""} onChange={(e) => setProfile({ ...profile, goal: e.target.value })}>
              <option value="">Pilih…</option>
              <option>Membesarkan otot (hipertrofi)</option>
              <option>Menambah kekuatan</option>
              <option>Turun lemak, otot tetap</option>
              <option>Kebugaran umum</option>
            </select>
          </label>
          <label className="text-sm">Pengalaman
            <select className="input mt-1" value={profile.experience ?? ""} onChange={(e) => setProfile({ ...profile, experience: e.target.value })}>
              <option value="">Pilih…</option>
              <option>pemula (&lt; 6 bulan)</option>
              <option>menengah (6 bulan - 2 tahun)</option>
              <option>mahir (&gt; 2 tahun)</option>
            </select>
          </label>
          <label className="text-sm">Hari latihan / minggu
            <input type="number" min={1} max={7} className="input mt-1" value={profile.daysPerWeek ?? ""}
              onChange={(e) => setProfile({ ...profile, daysPerWeek: e.target.value ? Number(e.target.value) : undefined })} />
          </label>
          <label className="text-sm">Alat yang tersedia
            <input className="input mt-1" placeholder="mis. dumbel 2-20 kg di rumah" value={profile.equipment ?? ""}
              onChange={(e) => setProfile({ ...profile, equipment: e.target.value })} />
          </label>
          <label className="text-sm sm:col-span-2">Cedera / keterbatasan
            <input className="input mt-1" placeholder="mis. lutut kiri sering nyeri" value={profile.injuries ?? ""}
              onChange={(e) => setProfile({ ...profile, injuries: e.target.value })} />
          </label>
        </div>
      )}

      <div className="card flex-1 space-y-3 overflow-y-auto">
        {!messages.length && (
          <div className="space-y-2">
            <p className="text-sm text-muted">Coba tanya:</p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s} className="chip hover:border-accent hover:text-accent" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-accent text-bg" : "bg-white/5"}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="w-fit rounded-2xl bg-white/5 px-3 py-2 text-sm text-muted">Coach sedang mengetik…</div>}
        <div ref={endRef} />
      </div>

      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya coach…" />
        <button className="btn-primary" disabled={busy || !input.trim()}>Kirim</button>
      </form>
      <p className="text-center text-[11px] text-muted">Saran coach bukan pengganti dokter atau pelatih bersertifikat.</p>
    </div>
  );
}
