# ✦ Neşet & Müzeyyen

> *"Her yıldız bir anımızı temsil ediyor"*

Romantik, sinematik bir hafıza sitesi. Tüm paylaşılan anlar gece gökyüzünde parlayan yıldızlara dönüşür.

---

## Proje Yapısı (Clean Architecture)

```
neset-muzeyyen/
├── app/
│   ├── layout.tsx               # Root layout — Footer her sayfada
│   ├── page.tsx                 # Ana sayfa (server component)
│   ├── galeri/page.tsx          # Tüm fotoğraflar
│   ├── videolar/page.tsx        # Tüm videolar
│   ├── admin/
│   │   ├── page.tsx             # Admin giriş
│   │   ├── layout.tsx
│   │   ├── anılar/page.tsx      # Anı yönetimi
│   │   ├── fotograflar/page.tsx # Fotoğraf yönetimi
│   │   ├── videolar/page.tsx    # Video yönetimi
│   │   └── sarki/page.tsx       # Şarkı ayarları
│   └── api/
│       ├── admin/login/route.ts
│       ├── admin/logout/route.ts
│       └── song/route.ts
├── components/
│   ├── shared/                  # Her sayfada kullanılan
│   │   ├── Footer.tsx           # 70px sabit footer + müzik çalar
│   │   └── StarField.tsx        # Canvas arka plan yıldızları
│   ├── sections/                # Sayfa bölümleri
│   │   ├── HeroSection.tsx
│   │   ├── RelationshipTimer.tsx
│   │   ├── StarMemorySection.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── VideoGallery.tsx
│   │   ├── GalleryPageClient.tsx
│   │   └── VideoPageClient.tsx
│   ├── ui/                      # Yeniden kullanılabilir UI
│   │   ├── MemoryModal.tsx
│   │   ├── VideoModal.tsx
│   │   ├── LightboxModal.tsx
│   │   └── SectionDivider.tsx
│   └── admin/                   # Admin paneli
│       ├── AdminLoginForm.tsx
│       ├── AdminShell.tsx
│       ├── MemoryManager.tsx
│       ├── PhotoManager.tsx
│       ├── VideoManager.tsx
│       └── SongManager.tsx
├── lib/
│   ├── constants.ts             # Çift ismi, renkler, sabitler
│   ├── supabase.ts              # DB client
│   ├── auth.ts                  # Admin cookie auth
│   └── data/
│       ├── memories.ts          # CRUD
│       ├── photos.ts            # CRUD + upload
│       ├── videos.ts            # CRUD + upload
│       ├── song.ts              # Upsert
│       └── seed.ts              # Fallback statik veri
├── types/index.ts               # Tüm TypeScript tipleri
└── supabase/schema.sql          # DB şeması + RLS
```

---

## 🚀 Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Supabase ayarla

1. [supabase.com](https://supabase.com) üzerinde proje oluştur
2. **SQL Editor** → `supabase/schema.sql` içeriğini çalıştır
3. **Storage** → `media` adında **public** bucket oluştur
4. **Settings → API** → URL ve anonimous key'i kopyala

### 3. Environment değişkenlerini ayarla

```bash
cp .env.local.example .env.local
# .env.local dosyasını açıp değerleri doldur
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PIN=gizli-sifren
```

### 4. Çalıştır

```bash
npm run dev
# http://localhost:3000
```

---

## 🔑 Admin Panel

`/admin` adresine git → şifreni gir → içerik yönetimi yap

| Bölüm | Yapabileceklerin |
|---|---|
| **Anılar** | Yeni anı ekle, düzenle, sil |
| **Fotoğraflar** | Fotoğraf yükle/URL ekle, öne çıkar, sırala |
| **Videolar** | Video yükle/URL ekle, öne çıkar, kapak fotoğrafı |
| **Şarkımız** | YouTube ID ile şarkı ayarla |

---

## 🛠 Teknoloji

- **Next.js 14** App Router + Server Components
- **TypeScript** — Tam tip güvenliği
- **Tailwind CSS** — Stil
- **Framer Motion** — Animasyonlar
- **Supabase** — Veritabanı + Dosya depolama
- **Canvas API** — Animasyonlu yıldız alanı

---

## 🌍 Yayına Alma (Vercel)

```bash
npx vercel
```

Vercel dashboard'una şu env değerlerini ekle:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PIN`

---

*Neşet & Müzeyyen için sevgiyle yapıldı ✦*
