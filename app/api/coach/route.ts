import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  ruleBasedReply,
  systemPrompt,
  trainingSummary,
  type ChatMessage,
  type CoachProfile,
} from "@/lib/coach";
import type { WorkoutSession } from "@/lib/types";

const MODEL = process.env.COACH_MODEL || "claude-opus-5-5";
const MAX_HISTORY = 20;
const MAX_CHARS = 4000;

interface CoachRequest {
  messages: ChatMessage[];
  profile?: CoachProfile;
  sessions?: WorkoutSession[];
}

export async function POST(req: Request) {
  let body: CoachRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON yang valid" }, { status: 400 });
  }
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return NextResponse.json({ error: "Pesan terakhir harus dari user" }, { status: 400 });
  }
  // Riwayat percakapan harus diawali pesan user.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const profile = body.profile ?? {};
  const sessions = Array.isArray(body.sessions) ? body.sessions.slice(-60) : [];

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: ruleBasedReply(last.content, profile, sessions), mode: "offline" });
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: systemPrompt(profile, trainingSummary(sessions)),
      messages,
    });
    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply: "Maaf, pertanyaan itu tidak bisa aku jawab. Coba tanyakan hal lain seputar latihan.",
        mode: "ai",
      });
    }
    const reply = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    return NextResponse.json({ reply: reply || "(tidak ada jawaban)", mode: "ai" });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Coach lagi sibuk, coba lagi sebentar." }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "API key AI tidak valid." }, { status: 500 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Coach API error", err.status, err.message);
      return NextResponse.json({ error: "Gagal menghubungi AI coach." }, { status: 502 });
    }
    console.error("Coach error", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
