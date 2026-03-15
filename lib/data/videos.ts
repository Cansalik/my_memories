import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { GalleryVideo, VideoPayload } from "@/types";

const TABLE = "gallery_videos";

export async function getVideos(): Promise<GalleryVideo[]> {
  noStore();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) { console.error("[getVideos]", error.message); return []; }
  return (data ?? []).map(normalizeVideo);
}

// Anasayfa için: featured olanları getir, yoksa ilk 3'ü getir
export async function getFeaturedVideos(): Promise<GalleryVideo[]> {
  noStore();
  const { data: featured } = await supabase
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (featured && featured.length > 0) return featured.map(normalizeVideo);

  const { data: first3 } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(3);

  return (first3 ?? []).map(normalizeVideo);
}

function normalizeVideo(row: any): GalleryVideo {
  return {
    id: row.id,
    src: row.src ?? row.video_url ?? row.url ?? "",
    thumbnail_url: row.thumbnail_url ?? row.thumbnailUrl ?? row.thumbnail ?? null,
    title: row.title ?? "",
    date: row.date ?? "",
    duration: row.duration ?? null,
    featured: row.featured ?? false,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  };
}

export async function createVideo(payload: VideoPayload): Promise<GalleryVideo | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) { console.error("[createVideo]", error.message); return null; }
  return normalizeVideo(data);
}

export async function updateVideo(id: string, payload: Partial<VideoPayload>): Promise<GalleryVideo | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("[updateVideo]", error.message); return null; }
  return normalizeVideo(data);
}

export async function deleteVideo(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) { console.error("[deleteVideo]", error.message); return false; }
  return true;
}

export async function uploadVideo(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) { console.error("[uploadVideo]", error.message); return null; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
