"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Memory, MemoryPayload } from "@/types";

const TABLE = "memories";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function actionCreateMemory(payload: MemoryPayload): Promise<{ data: Memory | null; error: string | null }> {
  const insert = {
    title: payload.title,
    date: payload.date,
    description: payload.description,
    photo_url: payload.photo_url ?? null,
  };
  const { data, error } = await supabase.from(TABLE).insert(insert).select().single();
  if (error) { console.error("[createMemory]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/");
  return { data, error: null };
}

export async function actionUpdateMemory(id: string, payload: Partial<MemoryPayload>): Promise<{ data: Memory | null; error: string | null }> {
  const update = {
    title: payload.title ?? "",
    date: payload.date ?? "",
    description: payload.description ?? "",
    photo_url: payload.photo_url ?? null,
  };

  if (!isValidUUID(id)) {
    const { data, error } = await supabase.from(TABLE).insert(update).select().single();
    if (error) { console.error("[createMemory-from-seed]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
    revalidatePath("/");
    return { data, error: null };
  }

  const { data, error } = await supabase.from(TABLE).update(update).eq("id", id).select().single();
  if (error) { console.error("[updateMemory]", error.code, error.message); return { data: null, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/");
  return { data, error: null };
}

export async function actionDeleteMemory(id: string): Promise<{ ok: boolean; error: string | null }> {
  if (!isValidUUID(id)) return { ok: true, error: null };
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) { console.error("[deleteMemory]", error.code, error.message); return { ok: false, error: `${error.code}: ${error.message}` }; }
  revalidatePath("/");
  return { ok: true, error: null };
}

export async function actionUploadMemoryPhoto(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file") as File;
  if (!file) return { url: null, error: "Dosya bulunamadı" };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `memories/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) { console.error("[uploadMemoryPhoto]", error.message); return { url: null, error: error.message }; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}