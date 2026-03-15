import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { GalleryPhoto, PhotoPayload } from "@/types";

const TABLE = "gallery_photos";

export async function getPhotos(): Promise<GalleryPhoto[]> {
  noStore();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) { console.error("[getPhotos]", error.message); return []; }
  return (data ?? []).map(normalizePhoto);
}

// Anasayfa için: featured olanları getir, yoksa ilk 3'ü getir
export async function getFeaturedPhotos(): Promise<GalleryPhoto[]> {
  noStore();
  // Önce featured olanları dene
  const { data: featured } = await supabase
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (featured && featured.length > 0) return featured.map(normalizePhoto);

  // Yoksa ilk 3 fotoğrafı göster
  const { data: first3 } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(3);

  return (first3 ?? []).map(normalizePhoto);
}

// Alan adı uyumsuzluklarını normalize et
function normalizePhoto(row: any): GalleryPhoto {
  return {
    id: row.id,
    url: row.url ?? row.photo_url ?? row.image_url ?? "",
    caption: row.caption ?? row.title ?? "",
    date: row.date ?? "",
    featured: row.featured ?? false,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  };
}

export async function createPhoto(payload: PhotoPayload): Promise<GalleryPhoto | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) { console.error("[createPhoto]", error.message); return null; }
  return normalizePhoto(data);
}

export async function updatePhoto(id: string, payload: Partial<PhotoPayload>): Promise<GalleryPhoto | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("[updatePhoto]", error.message); return null; }
  return normalizePhoto(data);
}

export async function deletePhoto(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) { console.error("[deletePhoto]", error.message); return false; }
  return true;
}

export async function uploadPhoto(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) { console.error("[uploadPhoto]", error.message); return null; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
