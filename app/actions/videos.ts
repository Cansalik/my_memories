"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { GalleryVideo, VideoPayload } from "@/types";

const TABLE = "gallery_videos";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function normalize(row: any): GalleryVideo {
  return {
    id: row.id,
    src: row.src ?? "",
    thumbnail_url: row.thumbnail_url ?? null,
    title: row.title ?? "",
    date: row.date ?? "",
    duration: row.duration ?? null,
    featured: row.featured ?? false,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  };
}

export async function actionCreateVideo(payload: VideoPayload): Promise<{ data: GalleryVideo | null; error: string | null }> {
  const insert = {
    src: payload.src ?? "",
    thumbnail_url: payload.thumbnail_url ?? null,
    title: payload.title,
    date: payload.date,
    duration: payload.duration ?? null,
    featured: payload.featured ?? false,
    sort_order: payload.sort_order ?? 0,
  };
  const { data, error } = await supabase.from(TABLE).insert(insert).select().single();
  if (error) { console.error("[createVideo]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/"); revalidatePath("/videolar");
  return { data: normalize(data), error: null };
}

export async function actionUpdateVideo(id: string, payload: Partial<VideoPayload>): Promise<{ data: GalleryVideo | null; error: string | null }> {
  const update = {
    src: payload.src ?? "",
    thumbnail_url: payload.thumbnail_url ?? null,
    title: payload.title ?? "",
    date: payload.date ?? "",
    duration: payload.duration ?? null,
    featured: payload.featured ?? false,
    sort_order: payload.sort_order ?? 0,
  };

  if (!isValidUUID(id)) {
    const { data, error } = await supabase.from(TABLE).insert(update).select().single();
    if (error) { console.error("[createVideo-from-seed]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
    revalidatePath("/"); revalidatePath("/videolar");
    return { data: normalize(data), error: null };
  }

  const { data, error } = await supabase.from(TABLE).update(update).eq("id", id).select().single();
  if (error) { console.error("[updateVideo]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/"); revalidatePath("/videolar");
  return { data: normalize(data), error: null };
}

export async function actionDeleteVideo(id: string): Promise<{ ok: boolean; error: string | null }> {
  if (!isValidUUID(id)) return { ok: true, error: null };
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) { console.error("[deleteVideo]", error.code, error.message); return { ok: false, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/"); revalidatePath("/videolar");
  return { ok: true, error: null };
}

export async function actionUploadVideo(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file") as File;
  if (!file) return { url: null, error: "Dosya bulunamadı" };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) { console.error("[uploadVideo]", error.message); return { url: null, error: error.message }; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function actionUploadThumbnail(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file") as File;
  if (!file) return { url: null, error: "Dosya bulunamadı" };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) { console.error("[uploadThumbnail]", error.message); return { url: null, error: error.message }; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}