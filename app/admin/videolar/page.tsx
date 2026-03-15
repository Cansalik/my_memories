import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import VideoManager from "@/components/admin/VideoManager";
import { getVideos } from "@/lib/data/videos";
import { seedVideos } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const videos = await getVideos();
  const resolved = videos.length > 0 ? videos : seedVideos;
  return (
    <AdminShell active="videolar">
      <VideoManager initial={resolved} />
    </AdminShell>
  );
}
