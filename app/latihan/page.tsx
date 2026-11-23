import LibraryBrowser from "@/components/LibraryBrowser";

export const metadata = { title: "Perpustakaan Latihan | Weight Training Agent" };

export default function LatihanPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Perpustakaan Latihan</h1>
        <p className="text-sm text-muted">876 latihan dengan foto, instruksi, dan otot yang dilatih.</p>
      </div>
      <LibraryBrowser />
    </div>
  );
}
