"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryVideo, VideoPayload } from "@/types";
import {
  actionCreateVideo, actionUpdateVideo, actionDeleteVideo,
  actionUploadVideo, actionUploadThumbnail,
} from "@/app/actions/videos";

const empty: VideoPayload = { src:"", thumbnail_url:"", title:"", date:"", duration:"", featured:false, sort_order:0 };

const inputStyle = {
  fontFamily:"'Lato',sans-serif", fontSize:"0.875rem",
  background:"rgba(7,15,30,.8)", border:"1px solid rgba(245,210,122,.2)",
  color:"#FFF7E6", borderRadius:"0.75rem", padding:"0.625rem 0.875rem",
  width:"100%", outline:"none",
} as const;

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div className="mb-4">
      <label style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,210,122,.5)", display:"block", marginBottom:"0.4rem" }}>{label}</label>
      {children}
    </div>
  );
}

function VideoUploader({ value, onChange }: { value:string; onChange:(url:string)=>void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const result = await actionUploadVideo(fd);
    setUploading(false);
    if (result.url) { onChange(result.url); setError(""); }
    else setError(`Yükleme hatası: ${result.error}`);
    e.target.value = "";
  };

  return (
    <div>
      {value && (
        <div className="mb-3 p-3 rounded-xl flex items-center gap-3" style={{ background:"rgba(245,210,122,.05)", border:"1px solid rgba(245,210,122,.15)" }}>
          <span style={{ color:"#F5D27A" }}>▶</span>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.72rem", color:"rgba(245,210,122,.7)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value.split("/").pop() ?? ""}</p>
          <button type="button" onClick={() => onChange("")} className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background:"rgba(255,100,100,.08)", border:"1px solid rgba(255,100,100,.25)", cursor:"pointer" }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,120,120,.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
      <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
        style={{ background:uploading?"rgba(245,210,122,.03)":"rgba(245,210,122,.06)", border:"1px dashed rgba(245,210,122,.3)" }}>
        <span style={{ color:"rgba(245,210,122,.7)", fontSize:"1.1rem" }}>{uploading?"⏳":value?"🔄":"🎬"}</span>
        <div>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.82rem", color:"rgba(255,247,230,.7)" }}>{uploading?"Yükleniyor...":value?"Farklı video seç":"Cihazdan video seç"}</p>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", color:"rgba(255,247,230,.3)", marginTop:"0.15rem" }}>MP4, MOV, WEBM · Büyük dosyalar biraz sürebilir</p>
        </div>
        <input type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(255,100,100,.7)", marginTop:"0.4rem" }}>{error}</p>}
    </div>
  );
}

function ThumbnailUploader({ value, onChange }: { value:string; onChange:(url:string)=>void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const result = await actionUploadThumbnail(fd);
    setUploading(false);
    if (result.url) { onChange(result.url); setError(""); }
    else setError(`Yükleme hatası: ${result.error}`);
    e.target.value = "";
  };

  return (
    <div>
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden" style={{ aspectRatio:"16/9", maxWidth:220, background:"rgba(7,15,30,.8)" }}>
          <img src={value} alt="Kapak" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,100,100,.4)", cursor:"pointer" }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,120,120,.8)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
      <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
        style={{ background:uploading?"rgba(245,210,122,.03)":"rgba(245,210,122,.06)", border:"1px dashed rgba(245,210,122,.3)" }}>
        <span style={{ color:"rgba(245,210,122,.7)", fontSize:"1.1rem" }}>{uploading?"⏳":value?"🔄":"🖼️"}</span>
        <div>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.82rem", color:"rgba(255,247,230,.7)" }}>{uploading?"Yükleniyor...":value?"Farklı kapak seç":"Kapak fotoğrafı seç"}</p>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", color:"rgba(255,247,230,.3)", marginTop:"0.15rem" }}>JPG, PNG, WEBP · İsteğe bağlı</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(255,100,100,.7)", marginTop:"0.4rem" }}>{error}</p>}
    </div>
  );
}

export default function VideoManager({ initial }: { initial:GalleryVideo[] }) {
  const [videos, setVideos] = useState(initial);
  const [form, setForm] = useState<VideoPayload>(empty);
  const [editing, setEditing] = useState<string|null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{text:string;ok:boolean}|null>(null);

  const flash = (text:string, ok=true) => { setMsg({text,ok}); setTimeout(()=>setMsg(null),3500); };
  const openNew = () => { setForm({...empty, sort_order:videos.length+1}); setEditing(null); setOpen(true); };
  const openEdit = (v:GalleryVideo) => { setForm({ src:v.src, thumbnail_url:v.thumbnail_url||"", title:v.title, date:v.date, duration:v.duration||"", featured:v.featured, sort_order:v.sort_order??0 }); setEditing(v.id); setOpen(true); };
  const closeForm = () => { setOpen(false); setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.title||!form.date) { flash("Başlık ve tarih zorunludur.", false); return; }
    setSaving(true);
    if (editing) {
      const r = await actionUpdateVideo(editing, form);
      if (r.data) { setVideos(vs=>vs.map(v=>v.id===editing?r.data!:v)); flash("Video güncellendi ✦"); closeForm(); }
      else flash(`Hata: ${r.error}`, false);
    } else {
      const r = await actionCreateVideo(form);
      if (r.data) { setVideos(vs=>[...vs,r.data!]); flash("Video eklendi ✦"); closeForm(); }
      else flash(`Hata: ${r.error}`, false);
    }
    setSaving(false);
  };

  const remove = async (id:string) => {
    if (!confirm("Videoyu silmek istediğinizden emin misiniz?")) return;
    const r = await actionDeleteVideo(id);
    if (r.ok) { setVideos(vs=>vs.filter(v=>v.id!==id)); flash("Silindi."); }
    else flash(`Silme hatası: ${r.error}`, false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.75rem", color:"#FFF7E6", fontWeight:500 }}>Videolar</h2>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.75rem", color:"rgba(245,210,122,.45)", marginTop:"0.25rem" }}>{videos.length} video · {videos.filter(v=>v.featured).length} öne çıkan</p>
        </div>
        <motion.button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background:"linear-gradient(135deg,#F5D27A,#C9A84C)", fontFamily:"'Lato',sans-serif", fontSize:"0.8rem", fontWeight:600, color:"#0B1D3A", border:"none", cursor:"pointer" }}
          whileHover={{scale:1.03}} whileTap={{scale:0.97}}>▶ Yeni Video</motion.button>
      </div>

      {msg && <div className="mb-4 px-4 py-3 rounded-xl" style={{ background:msg.ok?"rgba(245,210,122,.1)":"rgba(255,80,80,.1)", border:`1px solid ${msg.ok?"rgba(245,210,122,.3)":"rgba(255,80,80,.3)"}`, color:msg.ok?"#F5D27A":"rgba(255,140,140,.9)", fontFamily:"'Lato',sans-serif", fontSize:"0.875rem" }}>{msg.text}</div>}

      <div className="space-y-3">
        {videos.map(video=>(
          <motion.div key={video.id} layout className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background:"rgba(17,35,71,.6)", border:`1px solid ${video.featured?"rgba(245,210,122,.25)":"rgba(245,210,122,.1)"}` }}>
            <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width:72, height:40, background:"rgba(11,29,58,.8)" }}>
              {video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><span style={{ color:"rgba(245,210,122,.3)", fontSize:"0.9rem" }}>▶</span></div>}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontSize:"1rem", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{video.title}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.5)", fontSize:"0.72rem" }}>{video.date}</p>
                {video.duration&&<p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.35)", fontSize:"0.68rem" }}>{video.duration}</p>}
                {video.featured&&<span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"#F5D27A", background:"rgba(245,210,122,.1)", border:"1px solid rgba(245,210,122,.2)", borderRadius:"999px", padding:"0.1rem 0.45rem" }}>Öne Çıkan</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={()=>openEdit(video)} style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(245,210,122,.6)", background:"rgba(245,210,122,.08)", border:"1px solid rgba(245,210,122,.2)", borderRadius:"0.5rem", padding:"0.35rem 0.75rem", cursor:"pointer" }}>Düzenle</button>
              <button onClick={()=>remove(video.id)} style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(255,100,100,.5)", background:"rgba(255,100,100,.06)", border:"1px solid rgba(255,100,100,.15)", borderRadius:"0.5rem", padding:"0.35rem 0.75rem", cursor:"pointer" }}>Sil</button>
            </div>
          </motion.div>
        ))}
        {videos.length===0&&<p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.85rem", color:"rgba(255,247,230,.25)", textAlign:"center", padding:"2rem" }}>Henüz video eklenmemiş</p>}
      </div>

      <AnimatePresence>
        {open&&(
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background:"rgba(3,6,14,.85)", backdropFilter:"blur(8px)" }} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={closeForm}/>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
              <motion.div className="w-full max-w-lg my-2 sm:my-4" initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}} transition={{type:"spring",damping:25,stiffness:300}} onClick={e=>e.stopPropagation()}>
                <div className="rounded-2xl overflow-hidden" style={{ background:"linear-gradient(145deg,rgba(17,35,71,.97),rgba(11,29,58,.99))", border:"1px solid rgba(245,210,122,.25)", boxShadow:"0 25px 80px rgba(0,0,0,.5)" }}>
                  <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom:"1px solid rgba(245,210,122,.1)" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:"#FFF7E6" }}>{editing?"Videoyu Düzenle":"Yeni Video"}</h3>
                    <button onClick={closeForm} style={{ background:"none", border:"none", color:"rgba(245,210,122,.4)", cursor:"pointer", fontSize:"1.1rem" }}>✕</button>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-5">
                    <Field label="Video Dosyası *"><VideoUploader value={form.src} onChange={src=>setForm({...form,src})} /></Field>
                    <Field label="Kapak Fotoğrafı (isteğe bağlı)"><ThumbnailUploader value={form.thumbnail_url||""} onChange={thumbnail_url=>setForm({...form,thumbnail_url})} /></Field>
                    <Field label="Başlık *"><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Tatil Videosu" style={inputStyle}/></Field>
                    <Field label="Tarih *"><input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="Eylül 2022" style={inputStyle}/></Field>
                    <Field label="Süre (örn: 2:34)"><input value={form.duration||""} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="2:34" style={{...inputStyle,width:100}}/></Field>
                    <label className="flex items-center gap-3 cursor-pointer mb-6">
                      <div style={{ position:"relative" }}>
                        <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="sr-only"/>
                        <div style={{ width:40, height:22, borderRadius:11, background:form.featured?"linear-gradient(135deg,#F5D27A,#C9A84C)":"rgba(255,247,230,.1)", border:"1px solid rgba(245,210,122,.3)", transition:"background .2s", position:"relative" }}>
                          <div style={{ position:"absolute", top:2, left:form.featured?20:2, width:16, height:16, borderRadius:"50%", background:form.featured?"#0B1D3A":"rgba(245,210,122,.4)", transition:"left .2s" }}/>
                        </div>
                      </div>
                      <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.8rem", color:"rgba(255,247,230,.6)" }}>Anasayfada öne çıkar</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={closeForm} style={{ flex:1, fontFamily:"'Lato',sans-serif", fontSize:"0.85rem", color:"rgba(255,247,230,.5)", background:"rgba(255,247,230,.05)", border:"1px solid rgba(255,247,230,.1)", borderRadius:"0.75rem", padding:"0.75rem", cursor:"pointer" }}>İptal</button>
                      <motion.button onClick={save} disabled={saving} style={{ flex:2, fontFamily:"'Lato',sans-serif", fontSize:"0.85rem", fontWeight:600, color:"#0B1D3A", background:saving?"rgba(245,210,122,.3)":"linear-gradient(135deg,#F5D27A,#C9A84C)", border:"none", borderRadius:"0.75rem", padding:"0.75rem", cursor:saving?"not-allowed":"pointer" }} whileHover={!saving?{scale:1.02}:{}} whileTap={!saving?{scale:0.98}:{}}>{saving?"Kaydediliyor...":"Kaydet"}</motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
