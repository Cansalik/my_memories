import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import SongManager from "@/components/admin/SongManager";
import { getSong } from "@/lib/data/song";
import { seedSong } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export default async function AdminSongPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const song = await getSong();
  const resolved = song ?? seedSong;
  return (
    <AdminShell active="sarki">
      <SongManager initial={resolved} />
    </AdminShell>
  );
}
