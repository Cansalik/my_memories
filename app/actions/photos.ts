"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { GalleryPhoto, PhotoPayload } from "@/types";

const TABLE = "gallery_photos";

// UUID format kontrolü
function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function normalize(row: any): GalleryPhoto {
  return {
    id: row.id,
    url: row.url ?? "",
    caption: row.caption ?? "",
    date: row.date ?? "",
    featured: row.featured ?? false,
    sort_order: row.sort_order ?? 0,
    created_at: row.created_at,
  };
}

export async function actionCreatePhoto(payload: PhotoPayload): Promise<{ data: GalleryPhoto | null; error: string | null }> {
  const insert = {
    url: payload.url ?? "",
    caption: payload.caption,
    date: payload.date,
    featured: payload.featured ?? false,
    sort_order: payload.sort_order ?? 0,
  };

  const { data, error } = await supabase.from(TABLE).insert(insert).select().single();
  if (error) {
    console.error("[createPhoto]", error.code, error.message);
    return { data: null, error: `${error.code}: ${error.message}` };
  }
  revalidatePath("/");
  revalidatePath("/galeri");
  return { data: normalize(data), error: null };
}

export async function actionUpdatePhoto(id: string, payload: Partial<PhotoPayload>): Promise<{ data: GalleryPhoto | null; error: string | null }> {
  const update = {
    url: payload.url ?? "",
    caption: payload.caption ?? "",
    date: payload.date ?? "",
    featured: payload.featured ?? false,
    sort_order: payload.sort_order ?? 0,
  };

  // Seed verisi (UUID değil) → güncelleme yerine yeni kayıt oluştur
  if (!isValidUUID(id)) {
    const { data, error } = await supabase.from(TABLE).insert(update).select().single();
    if (error) {
      console.error("[createPhoto-from-seed]", error.code, error.message);
      return { data: null, error: `${error.code}: ${error.message}` };
    }
    revalidatePath("/");
    revalidatePath("/galeri");
    return { data: normalize(data), error: null };
  }

  // Gerçek UUID → normal güncelleme
  const { data, error } = await supabase.from(TABLE).update(update).eq("id", id).select().single();
  if (error) {
    console.error("[updatePhoto]", error.code, error.message);
    return { data: null, error: `${error.code}: ${error.message}` };
  }
  revalidatePath("/");
  revalidatePath("/galeri");
  return { data: normalize(data), error: null };
}

export async function actionDeletePhoto(id: string): Promise<{ ok: boolean; error: string | null }> {
  // Seed verisi silinemez (DB'de yok)
  if (!isValidUUID(id)) {
    return { ok: true, error: null }; // UI'dan kaldır, DB'de zaten yok
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("[deletePhoto]", error.code, error.message);
    return { ok: false, error: `${error.code}: ${error.message}` };
  }
  revalidatePath("/");
  revalidatePath("/galeri");
  return { ok: true, error: null };
}

export async function actionUploadPhoto(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file") as File;
  if (!file) return { url: null, error: "Dosya bulunamadı" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    console.error("[uploadPhoto]", error.message);
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}