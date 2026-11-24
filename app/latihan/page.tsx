import LibraryBrowser from "@/components/LibraryBrowser";

export const metadata = { title: "Perpustakaan Latihan | Weight Training Agent" };

export default function LatihanPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Perpustakaan <span className="text-gradient">Latihan</span></h1>
        <p className="text-sm text-muted">876 latihan dengan demo gerakan, instruksi, dan otot yang dilatih.</p>
      </div>
      <LibraryBrowser />
    </div>
  );
}
