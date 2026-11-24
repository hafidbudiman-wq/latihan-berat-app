"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Render ke <body>. Perlu untuk overlay `fixed`, karena wrapper animasi halaman
 * (transform) membuat `fixed` jadi relatif ke wrapper, bukan ke layar.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
