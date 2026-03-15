"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { SongConfig, SongPayload } from "@/types";
import { upsertSong } from "@/lib/data/song";

const inputStyle = {
  fontFamily:"'Lato',sans-serif", fontSize:"0.875rem",
  background:"rgba(7,15,30,.8)", border:"1px solid rgba(245,210,122,.2)",
  color:"#FFF7E6", borderRadius:"0.75rem", padding:"0.625rem 0.875rem",
  width:"100%", outline:"none",
} as const;

// Tüm YouTube URL formatlarından ID çıkarır
function extractYoutubeId(input: string): string {
  const trimmed = input.trim();

  // Zaten sadece ID ise (11 karakter, harf/rakam/- ve _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    // youtube.com/watch?v=ID
    const v = url.searchParams.get("v");
    if (v) return v;

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1).split("?")[0];
    }

    // youtube.com/embed/ID
    // youtube.com/shorts/ID
    const match = url.pathname.match(/\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[2];
  } catch {
    // URL parse edilemedi, regex ile dene
    const match = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return trimmed; // Tanınamadıysa olduğu gibi döndür
}

function Field({ label, hint, children }: { label:string; hint?:string; children:React.ReactNode }) {
  return (
    <div className="mb-5">
      <label style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,210,122,.5)", display:"block", marginBottom:"0.4rem" }}>{label}</label>
      {children}
      {hint && <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.68rem", color:"rgba(255,247,230,.3)", marginTop:"0.35rem" }}>{hint}</p>}
    </div>
  );
}

export default function SongManager({ initial }: { initial: SongConfig }) {
  const [urlInput, setUrlInput] = useState(
    initial.youtube_id ? `https://www.youtube.com/watch?v=${initial.youtube_id}` : ""
  );
  const [form, setForm] = useState<SongPayload>({
    youtube_id: initial.youtube_id,
    title: initial.title,
    artist: initial.artist,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text:string; ok:boolean } | null>(null);

  const flash = (text:string, ok=true) => { setMsg({text,ok}); setTimeout(()=>setMsg(null),4000); };

  // URL input değişince ID'yi parse et
  const handleUrlChange = (raw: string) => {
    setUrlInput(raw);
    const id = extractYoutubeId(raw);
    setForm(f => ({ ...f, youtube_id: id }));
  };

  const youtubeId = form.youtube_id;
  const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(youtubeId);
  const previewThumb = isValidId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null;

  const save = async () => {
    if (!isValidId) { flash("Geçerli bir YouTube URL'si girin.", false); return; }
    setSaving(true);
    const result = await upsertSong(form);
    setSaving(false);
    if (result) flash("Şarkı kaydedildi ✦");
    else flash("Kaydedilemedi, tekrar deneyin.", false);
  };

  return (
    <div className="max-w-xl w-full">
      <div className="mb-8">
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.75rem", color:"#FFF7E6", fontWeight:500 }}>Bizim Şarkımız</h2>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.75rem", color:"rgba(245,210,122,.45)", marginTop:"0.25rem" }}>Footer'da oynatılan şarkıyı buradan ayarlayın</p>
      </div>

      {msg && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="mb-6 px-4 py-3 rounded-xl"
          style={{ background:msg.ok?"rgba(245,210,122,.1)":"rgba(255,80,80,.1)", border:`1px solid ${msg.ok?"rgba(245,210,122,.25)":"rgba(255,80,80,.3)"}`, color:msg.ok?"#F5D27A":"rgba(255,140,140,.9)", fontFamily:"'Lato',sans-serif", fontSize:"0.875rem" }}>
          {msg.text}
        </motion.div>
      )}

      <div className="rounded-2xl p-5 sm:p-8" style={{ background:"linear-gradient(145deg,rgba(17,35,71,.95),rgba(11,29,58,.98))", border:"1px solid rgba(245,210,122,.2)", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>

        {/* YouTube önizleme */}
        {previewThumb && (
          <div className="mb-6">
            <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio:"16/9", maxWidth:300, background:"rgba(11,29,58,.8)" }}>
              <img src={previewThumb} alt="YouTube önizleme" className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display="none"; }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center justify-center rounded-full"
                  style={{ width:44, height:44, background:"rgba(11,29,58,.85)", border:"1.5px solid rgba(245,210,122,.4)" }}>
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ marginLeft:3 }}>
                    <path d="M1.5 1L14.5 9L1.5 17V1Z" fill="#F5D27A"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* Çözümlenen ID */}
            <div className="flex items-center gap-2 mt-2">
              <span style={{ color:"rgba(245,210,122,.4)", fontSize:"0.65rem" }}>✓</span>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.68rem", color:"rgba(245,210,122,.5)" }}>
                Video ID: <code style={{ color:"rgba(245,210,122,.8)", background:"rgba(245,210,122,.08)", padding:"0.1rem 0.4rem", borderRadius:"0.25rem" }}>{youtubeId}</code>
              </p>
            </div>
          </div>
        )}

        {/* URL input */}
        <Field
          label="YouTube URL *"
          hint="Desteklenen formatlar: youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/..."
        >
          <div className="relative">
            <input
              value={urlInput}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                ...inputStyle,
                paddingRight: "2.5rem",
                borderColor: urlInput && !isValidId ? "rgba(255,100,100,.4)" : "rgba(245,210,122,.2)",
              }}
            />
            {/* Durum ikonu */}
            {urlInput && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ pointerEvents:"none" }}>
                {isValidId
                  ? <span style={{ color:"rgba(100,220,100,.7)", fontSize:"0.85rem" }}>✓</span>
                  : <span style={{ color:"rgba(255,100,100,.6)", fontSize:"0.85rem" }}>✕</span>
                }
              </div>
            )}
          </div>
          {urlInput && !isValidId && (
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.68rem", color:"rgba(255,120,120,.6)", marginTop:"0.35rem" }}>
              Geçerli bir YouTube URL'si giriniz
            </p>
          )}
        </Field>

        <Field label="Şarkı Adı *">
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Bizim Şarkımız" style={inputStyle}/>
        </Field>

        <Field label="Sanatçı">
          <input value={form.artist} onChange={e=>setForm({...form,artist:e.target.value})} placeholder="Neşet & Müzeyyen" style={inputStyle}/>
        </Field>

        <motion.button
          onClick={save}
          disabled={saving || !isValidId}
          className="w-full py-3.5 rounded-xl mt-2"
          style={{
            fontFamily:"'Lato',sans-serif", fontSize:"0.9rem", fontWeight:600,
            color: saving||!isValidId ? "rgba(245,210,122,.4)" : "#0B1D3A",
            background: saving||!isValidId ? "rgba(245,210,122,.15)" : "linear-gradient(135deg,#F5D27A,#C9A84C)",
            border:"none", cursor: saving||!isValidId ? "not-allowed" : "pointer",
            boxShadow: saving||!isValidId ? "none" : "0 0 24px rgba(245,210,122,.3)",
            transition:"all .3s",
          }}
          whileHover={!saving&&isValidId?{scale:1.02}:{}}
          whileTap={!saving&&isValidId?{scale:0.98}:{}}
        >
          {saving ? "Kaydediliyor..." : "♪ Şarkıyı Kaydet"}
        </motion.button>

        <div className="mt-6 px-4 py-3 rounded-xl" style={{ background:"rgba(245,210,122,.04)", border:"1px solid rgba(245,210,122,.1)" }}>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.72rem", color:"rgba(255,247,230,.3)", lineHeight:1.6 }}>
            YouTube bağlantısını yapıştır — kısa link, normal link, Shorts fark etmez. Otomatik tanınır ve footer'daki müzik çalara eklenir.
          </p>
        </div>
      </div>
    </div>
  );
}
