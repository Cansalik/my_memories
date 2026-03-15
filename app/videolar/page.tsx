import StarField from "@/components/shared/StarField";
import VideoPageClient from "@/components/sections/VideoPageClient";
import { getVideos } from "@/lib/data/videos";
import { seedVideos } from "@/lib/data/seed";
import { COUPLE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: `Tüm Videolar · ${COUPLE_NAME}` };
export const dynamic = "force-dynamic";

export default async function VideolarPage() {
  const videos = await getVideos();
  const resolved = videos.length > 0 ? videos : seedVideos;
  return (
    <main className="relative min-h-screen" style={{ background: "linear-gradient(180deg,#070F1E 0%,#0B1D3A 40%,#070F1E 100%)" }}>
      <StarField />
      <div className="relative z-10">
        <VideoPageClient videos={resolved} />
      </div>
    </main>
  );
}
