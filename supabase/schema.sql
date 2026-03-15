-- ============================================================
-- Neşet & Müzeyyen — Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Memories ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memories (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  date        TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Gallery Photos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url         TEXT NOT NULL DEFAULT '',
  caption     TEXT NOT NULL,
  date        TEXT NOT NULL,
  featured    BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Gallery Videos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_videos (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  src           TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  title         TEXT NOT NULL,
  date          TEXT NOT NULL,
  duration      TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Song Config ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS song_config (
  id         TEXT PRIMARY KEY DEFAULT 'default',
  youtube_id TEXT NOT NULL DEFAULT '',
  title      TEXT NOT NULL DEFAULT 'Bizim Şarkımız',
  artist     TEXT NOT NULL DEFAULT 'Neşet & Müzeyyen',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row so upsert always works
INSERT INTO song_config (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- ── Storage bucket ─────────────────────────────────────────
-- Create a PUBLIC bucket named "media" in:
--   Supabase Dashboard → Storage → New Bucket
--   Name: media | Public: ON
-- This bucket will store all uploaded photos and videos.

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE memories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_config     ENABLE ROW LEVEL SECURITY;

-- Public read (everyone can see content)
CREATE POLICY "public_read_memories"    ON memories        FOR SELECT USING (true);
CREATE POLICY "public_read_photos"      ON gallery_photos  FOR SELECT USING (true);
CREATE POLICY "public_read_videos"      ON gallery_videos  FOR SELECT USING (true);
CREATE POLICY "public_read_song"        ON song_config     FOR SELECT USING (true);

-- Authenticated write (admin uses service role — bypasses RLS)
CREATE POLICY "auth_write_memories"  ON memories        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_photos"    ON gallery_photos  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_videos"    ON gallery_videos  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_song"      ON song_config     FOR ALL USING (auth.role() = 'authenticated');

-- ── Optional seed data ─────────────────────────────────────
INSERT INTO memories (title, date, description) VALUES
  ('İlk Tanışma',       '3 Mart 2022',      'Hayatımın en güzel sürpriziydi. Gülüşün her şeyi değiştirdi.'),
  ('İlk Kahvemiz',      '15 Mart 2022',     'O küçük kafede geçirdiğimiz saatler, yıllar gibi geldi.'),
  ('İlk Film Gecesi',   '2 Nisan 2022',     'Filmi izledik mi, yoksa birbirimizi mi izledik, hâlâ bilmiyorum.'),
  ('İlk Tatilimiz',     '14 Eylül 2022',    'Denizin sesi, gün batımının altın rengi ve seninle her şey mükemmeldi.'),
  ('Nişan Günümüz',     '14 Şubat 2023',    'Ellerini tuttuğumda tüm cevapları buldum. Evet, seninle.'),
  ('İlk Kış Yürüyüşü', '12 Ocak 2023',     'Kar altında, soğukta, ellerin elimde — kalbim hiç bu kadar sıcak olmamıştı.'),
  ('Doğum Günü Sürprizi','7 Haziran 2022',  'Yüzündeki şaşkın ve mutlu ifadeyi hiç unutamam.'),
  ('İlk Yemek Pişirme', '30 Mayıs 2022',   'Mutfak savaş alanına döndü ama gülüşlerimiz hiç bitmedi.');
