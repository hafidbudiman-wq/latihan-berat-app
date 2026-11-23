"use client";
import { useCallback, useEffect, useState } from "react";
import type { WorkoutSession } from "./types";
import type { CoachProfile } from "./coach";

// MVP: data disimpan di browser (localStorage). Nanti bisa dipindah ke database + login.
const KEYS = {
  sessions: "wta.sessions.v1",
  active: "wta.active.v1",
  profile: "wta.profile.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("wta-storage"));
  } catch {
    /* storage penuh / diblokir: abaikan */
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const sync = () => setValue(read(key, fallback));
    sync();
    setLoaded(true);
    window.addEventListener("wta-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wta-storage", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const save = useCallback((v: T) => write(key, v), [key]);
  return [value, save, loaded] as const;
}

export const useSessions = () => useStored<WorkoutSession[]>(KEYS.sessions, []);
export const useActiveSession = () => useStored<WorkoutSession | null>(KEYS.active, null);
export const useProfile = () => useStored<CoachProfile>(KEYS.profile, {});

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
