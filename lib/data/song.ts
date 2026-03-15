import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { SongConfig, SongPayload } from "@/types";

const TABLE = "song_config";

const FALLBACK: SongConfig = {
  id: "default",
  youtube_id: "",
  title: "Bizim Şarkımız",
  artist: "Neşet & Müzeyyen",
};

export async function getSong(): Promise<SongConfig> {
  noStore();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .limit(1)
    .single();
  if (error) { return FALLBACK; }
  return data ?? FALLBACK;
}

export async function upsertSong(payload: SongPayload): Promise<SongConfig | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ id: "default", ...payload, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) { console.error("[upsertSong]", error); return null; }
  return data;
}
