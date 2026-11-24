import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Weight Training Agent",
  description: "Perpustakaan latihan, log workout, peta otot, dan AI coach angkat beban.",
};

export const viewport: Viewport = { themeColor: "#0b1020", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen font-sans antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-28 pt-4 sm:pb-10">{children}</main>
      </body>
    </html>
  );
}
