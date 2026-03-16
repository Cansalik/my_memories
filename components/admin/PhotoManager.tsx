"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryPhoto, PhotoPayload } from "@/types";
import {
  actionCreatePhoto,
  actionUpdatePhoto,
  actionDeletePhoto,
  actionUploadPhoto,
} from "@/app/actions/photos";

const empty: PhotoPayload = { url:"", caption:"", date:"", featured:false, sort_order:0 };

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

function PhotoUploader({ value, onChange, onError }: { value:string; onChange:(url:string)=>void; onError:(e:string)=>void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await actionUploadPhoto(fd);
    setUploading(false);
    if (result.url) { onChange(result.url); onError(""); }
    else onError(`Yükleme hatası: ${result.error}`);
    e.target.value = "";
  };

  return (
    <div>
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden" style={{ aspectRatio:"16/9", maxWidth:220, background:"rgba(7,15,30,.8)" }}>
          <img src={value} alt="Önizleme" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,100,100,.4)", cursor:"pointer" }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,120,120,.8)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
      <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
        style={{ background:uploading?"rgba(245,210,122,.03)":"rgba(245,210,122,.06)", border:"1px dashed rgba(245,210,122,.3)" }}>
        <span style={{ color:"rgba(245,210,122,.7)", fontSize:"1.1rem" }}>{uploading?"⏳":value?"🔄":"📷"}</span>
        <div>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.82rem", color:"rgba(255,247,230,.7)" }}>
            {uploading?"Yükleniyor...":value?"Farklı fotoğraf seç":"Cihazdan fotoğraf seç"}
          </p>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", color:"rgba(255,247,230,.3)", marginTop:"0.15rem" }}>JPG, PNG, WEBP · Maks 10MB</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  );
}

export default function PhotoManager({ initial }: { initial:GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const [form, setForm] = useState<PhotoPayload>(empty);
  const [editing, setEditing] = useState<string|null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{text:string;ok:boolean}|null>(null);

  const flash = (text:string, ok=true) => { setMsg({text,ok}); setTimeout(()=>setMsg(null),5000); };
  const openNew = () => { setForm({...empty, sort_order:photos.length+1}); setEditing(null); setOpen(true); };
  const openEdit = (p:GalleryPhoto) => {
    setForm({ url:p.url, caption:p.caption, date:p.date, featured:p.featured, sort_order:p.sort_order??0 });
    setEditing(p.id); setOpen(true);
  };
  const closeForm = () => { setOpen(false); setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.caption||!form.date) { flash("Başlık ve tarih zorunludur.", false); return; }
    setSaving(true);
    if (editing) {
      const result = await actionUpdatePhoto(editing, form);
      if (result.data) { setPhotos(ps=>ps.map(p=>p.id===editing?result.data!:p)); flash("Fotoğraf güncellendi ✦"); closeForm(); }
      else flash(`Hata: ${result.error}`, false);
    } else {
      const result = await actionCreatePhoto(form);
      if (result.data) { setPhotos(ps=>[...ps, result.data!]); flash("Fotoğraf eklendi ✦"); closeForm(); }
      else flash(`Hata: ${result.error}`, false);
    }
    setSaving(false);
  };

  const remove = async (id:string) => {
    if (!confirm("Fotoğrafı silmek istediğinizden emin misiniz?")) return;
    const result = await actionDeletePhoto(id);
    if (result.ok) { setPhotos(ps=>ps.filter(p=>p.id!==id)); flash("Silindi."); }
    else flash(`Silme hatası: ${result.error}`, false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.75rem", color:"#FFF7E6", fontWeight:500 }}>Fotoğraflar</h2>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.75rem", color:"rgba(245,210,122,.45)", marginTop:"0.25rem" }}>
            {photos.length} fotoğraf · {photos.filter(p=>p.featured).length} öne çıkan
          </p>
        </div>
        <motion.button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background:"linear-gradient(135deg,#F5D27A,#C9A84C)", fontFamily:"'Lato',sans-serif", fontSize:"0.8rem", fontWeight:600, color:"#0B1D3A", border:"none", cursor:"pointer" }}
          whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
          ✧ Yeni Fotoğraf
        </motion.button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-3 rounded-xl" style={{
          background:msg.ok?"rgba(245,210,122,.1)":"rgba(255,80,80,.1)",
          border:`1px solid ${msg.ok?"rgba(245,210,122,.3)":"rgba(255,80,80,.3)"}`,
          color:msg.ok?"#F5D27A":"rgba(255,140,140,.9)",
          fontFamily:"'Lato',sans-serif", fontSize:"0.875rem",
        }}>{msg.text}</div>
      )}

      {/* Liste — Videolar ile aynı tasarım */}
      <div className="space-y-3">
        {photos.map(photo => (
          <motion.div key={photo.id} layout
            className="flex items-center gap-4 px-5 py-4 rounded-xl"
            style={{ background:"rgba(17,35,71,.6)", border:`1px solid ${photo.featured?"rgba(245,210,122,.25)":"rgba(245,210,122,.1)"}` }}>
            {/* Küçük fotoğraf önizlemesi */}
            <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width:72, height:48, background:"rgba(11,29,58,.8)" }}>
              {photo.url
                ? <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center"><span style={{ color:"rgba(245,210,122,.3)", fontSize:"1rem" }}>✦</span></div>
              }
            </div>
            {/* Bilgiler */}
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontSize:"1rem", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {photo.caption}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.5)", fontSize:"0.72rem" }}>{photo.date}</p>
                {photo.featured && (
                  <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"#F5D27A", background:"rgba(245,210,122,.1)", border:"1px solid rgba(245,210,122,.2)", borderRadius:"999px", padding:"0.1rem 0.45rem" }}>
                    Öne Çıkan
                  </span>
                )}
              </div>
            </div>
            {/* Butonlar */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => openEdit(photo)} style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(245,210,122,.6)", background:"rgba(245,210,122,.08)", border:"1px solid rgba(245,210,122,.2)", borderRadius:"0.5rem", padding:"0.35rem 0.75rem", cursor:"pointer" }}>Düzenle</button>
              <button onClick={() => remove(photo.id)} style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(255,100,100,.5)", background:"rgba(255,100,100,.06)", border:"1px solid rgba(255,100,100,.15)", borderRadius:"0.5rem", padding:"0.35rem 0.75rem", cursor:"pointer" }}>Sil</button>
            </div>
          </motion.div>
        ))}
        {photos.length === 0 && (
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.85rem", color:"rgba(255,247,230,.25)", textAlign:"center", padding:"2rem" }}>
            Henüz fotoğraf eklenmemiş
          </p>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background:"rgba(3,6,14,.85)", backdropFilter:"blur(8px)" }}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={closeForm}/>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
              <motion.div className="w-full max-w-lg my-2 sm:my-4"
                initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}}
                transition={{type:"spring",damping:25,stiffness:300}} onClick={e=>e.stopPropagation()}>
                <div className="rounded-2xl overflow-hidden"
                  style={{ background:"linear-gradient(145deg,rgba(17,35,71,.97),rgba(11,29,58,.99))", border:"1px solid rgba(245,210,122,.25)", boxShadow:"0 25px 80px rgba(0,0,0,.5)" }}>
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5"
                    style={{ borderBottom:"1px solid rgba(245,210,122,.1)" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:"#FFF7E6" }}>
                      {editing?"Fotoğrafı Düzenle":"Yeni Fotoğraf"}
                    </h3>
                    <button onClick={closeForm} style={{ background:"none", border:"none", color:"rgba(245,210,122,.4)", cursor:"pointer", fontSize:"1.1rem" }}>✕</button>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-5">
                    <Field label="Fotoğraf">
                      <PhotoUploader value={form.url} onChange={url=>setForm({...form,url})} onError={e=>e&&flash(e,false)} />
                    </Field>
                    <Field label="Başlık *">
                      <input value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} placeholder="Tatil Anısı" style={inputStyle}/>
                    </Field>
                    <Field label="Tarih *">
                      <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="Eylül 2022" style={inputStyle}/>
                    </Field>
                    <Field label="Sıralama">
                      <input type="number" value={form.sort_order||0} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} style={{...inputStyle,width:80}}/>
                    </Field>
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
                      <motion.button onClick={save} disabled={saving}
                        style={{ flex:2, fontFamily:"'Lato',sans-serif", fontSize:"0.85rem", fontWeight:600, color:"#0B1D3A", background:saving?"rgba(245,210,122,.3)":"linear-gradient(135deg,#F5D27A,#C9A84C)", border:"none", borderRadius:"0.75rem", padding:"0.75rem", cursor:saving?"not-allowed":"pointer" }}
                        whileHover={!saving?{scale:1.02}:{}} whileTap={!saving?{scale:0.98}:{}}>{saving?"Kaydediliyor...":"Kaydet"}</motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );}