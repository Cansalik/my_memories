import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import PhotoManager from "@/components/admin/PhotoManager";
import { getPhotos } from "@/lib/data/photos";
import { seedPhotos } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const photos = await getPhotos();
  const resolved = photos.length > 0 ? photos : seedPhotos;
  return (
    <AdminShell active="fotograflar">
      <PhotoManager initial={resolved} />
    </AdminShell>
  );
}
