import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page is rendered outside this check
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#070F1E 0%,#0B1D3A 100%)" }}
    >
      {children}
    </div>
  );
}
