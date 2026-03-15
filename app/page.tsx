import StarField from "@/components/shared/StarField";
import HeroSection from "@/components/sections/HeroSection";
import RelationshipTimer from "@/components/sections/RelationshipTimer";
import StarMemorySection from "@/components/sections/StarMemorySection";
import PhotoGallery from "@/components/sections/PhotoGallery";
import VideoGallery from "@/components/sections/VideoGallery";
import SectionDivider from "@/components/ui/SectionDivider";
import { getMemories } from "@/lib/data/memories";
import { getFeaturedPhotos, getPhotos } from "@/lib/data/photos";
import { getFeaturedVideos, getVideos } from "@/lib/data/videos";
import { seedMemories, seedPhotos, seedVideos } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [memories, featuredPhotos, allPhotos, featuredVideos, allVideos] = await Promise.all([
    getMemories(),
    getFeaturedPhotos(),
    getPhotos(),
    getFeaturedVideos(),
    getVideos(),
  ]);

  // Supabase boşsa seed verisini göster
  const resolvedMemories       = memories.length       > 0 ? memories       : seedMemories;
  const resolvedFeaturedPhotos = featuredPhotos.length  > 0 ? featuredPhotos  : seedPhotos.filter(p => p.featured).slice(0, 3);
  const resolvedAllPhotos      = allPhotos.length       > 0 ? allPhotos       : seedPhotos;
  const resolvedFeaturedVideos = featuredVideos.length  > 0 ? featuredVideos  : seedVideos.filter(v => v.featured).slice(0, 3);
  const resolvedAllVideos      = allVideos.length       > 0 ? allVideos       : seedVideos;

  return (
    <main
      className="relative min-h-screen"
      style={{ background: "linear-gradient(180deg,#070F1E 0%,#0B1D3A 30%,#070F1E 70%,#050C16 100%)" }}
    >
      <StarField />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10">
        <HeroSection />
        <SectionDivider />
        <RelationshipTimer />
        <SectionDivider label="Anılar" />
        <StarMemorySection memories={resolvedMemories} />
        <SectionDivider />
        <PhotoGallery
          featured={resolvedFeaturedPhotos}
          total={resolvedAllPhotos.length}
        />
        <SectionDivider />
        <VideoGallery
          featured={resolvedFeaturedVideos}
          total={resolvedAllVideos.length}
        />
      </div>
    </main>
  );
}
