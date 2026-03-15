import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import MemoryManager from "@/components/admin/MemoryManager";
import { getMemories } from "@/lib/data/memories";
import { seedMemories } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export default async function AdminMemoriesPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const memories = await getMemories();
  const resolved = memories.length > 0 ? memories : seedMemories;
  return (
    <AdminShell active="anilar">
      <MemoryManager initial={resolved} />
    </AdminShell>
  );
}
