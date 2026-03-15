export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#070F1E 0%,#0B1D3A 100%)" }}
    >
      {children}
    </div>
  );}