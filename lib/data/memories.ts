import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Memory, MemoryPayload } from "@/types";

const TABLE = "memories";

export async function getMemories(): Promise<Memory[]> {
  noStore();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });
  if (error) { console.error("[getMemories]", error); return []; }
  return data ?? [];
}

export async function createMemory(payload: MemoryPayload): Promise<Memory | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) { console.error("[createMemory]", error); return null; }
  return data;
}

export async function updateMemory(id: string, payload: Partial<MemoryPayload>): Promise<Memory | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("[updateMemory]", error); return null; }
  return data;
}

export async function deleteMemory(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) { console.error("[deleteMemory]", error); return false; }
  return true;
}
