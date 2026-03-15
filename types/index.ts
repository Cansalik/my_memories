// ── Domain types ─────────────────────────────────────────

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  photo_url?: string | null;
  created_at?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  featured: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface GalleryVideo {
  id: string;
  src: string;
  thumbnail_url?: string | null;
  title: string;
  date: string;
  duration?: string | null;
  featured: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface SongConfig {
  id: string;
  youtube_id: string;
  title: string;
  artist: string;
  updated_at?: string;
}

// ── Form payload types ────────────────────────────────────

export type MemoryPayload = Omit<Memory, "id" | "created_at">;
export type PhotoPayload = Omit<GalleryPhoto, "id" | "created_at">;
export type VideoPayload = Omit<GalleryVideo, "id" | "created_at">;
export type SongPayload = Omit<SongConfig, "id" | "updated_at">;

// ── UI helpers ────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
