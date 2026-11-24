// Template dipasang ulang tiap pindah halaman -> transisi halus antar halaman.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-in">{children}</div>;
}
