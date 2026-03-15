import StarField from "@/components/shared/StarField";
import GalleryPageClient from "@/components/sections/GalleryPageClient";
import { getPhotos } from "@/lib/data/photos";
import { seedPhotos } from "@/lib/data/seed";
import { COUPLE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: `Tüm Fotoğraflar · ${COUPLE_NAME}` };
export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const photos = await getPhotos();
  const resolved = photos.length > 0 ? photos : seedPhotos;
  return (
    <main className="relative min-h-screen" style={{ background: "linear-gradient(180deg,#070F1E 0%,#0B1D3A 40%,#070F1E 100%)" }}>
      <StarField />
      <div className="relative z-10">
        <GalleryPageClient photos={resolved} />
      </div>
    </main>
  );
}
