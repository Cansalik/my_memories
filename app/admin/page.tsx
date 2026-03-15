import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { COUPLE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: `Yönetim · ${COUPLE_NAME}` };

export default function AdminPage() {
  if (isAdminAuthenticated()) redirect("/admin/anilar");
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#070F1E 0%,#0B1D3A 100%)" }}
    >
      <AdminLoginForm />
    </main>
  );
}
