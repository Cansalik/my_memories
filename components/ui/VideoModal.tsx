"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryVideo } from "@/types";

interface Props { video:GalleryVideo|null; onClose:()=>void; onPrev:()=>void; onNext:()=>void; }

export default function VideoModal({ video, onClose, onPrev, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==="Escape") onClose();
      if (e.key==="ArrowLeft") onPrev();
      if (e.key==="ArrowRight") onNext();
    };
    document.addEventListener("keydown", h);
    if (video) document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [video, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
          style={{ background:"rgba(3,6,14,.96)", backdropFilter:"blur(18px)" }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
          <motion.div className="relative w-full" style={{ maxWidth:900 }}
            initial={{ scale:0.88, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.88, opacity:0, y:24 }}
            transition={{ type:"spring", damping:26, stiffness:280 }} onClick={e=>e.stopPropagation()}>

            {/* Top nav */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button onClick={onClose} className="flex items-center gap-2"
                style={{ color:"rgba(255,247,230,.45)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.15em" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Kapat
              </button>
              {/* Prev/Next — mobilde sadece ikonlar */}
              <div className="flex items-center gap-3">
                <button onClick={onPrev} style={{ color:"rgba(255,247,230,.35)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer" }}>←</button>
                <span style={{ color:"rgba(245,210,122,.2)", fontSize:"0.7rem" }}>|</span>
                <button onClick={onNext} style={{ color:"rgba(255,247,230,.35)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer" }}>→</button>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden"
              style={{ background:"rgba(7,15,30,.99)", border:"1px solid rgba(245,210,122,.2)", boxShadow:"0 32px 80px rgba(0,0,0,.75)" }}>
              <div style={{ position:"relative", aspectRatio:"16/9", background:"#000" }}>
                {video.src ? (
                  <video key={video.id} ref={videoRef} src={video.src} poster={video.thumbnail_url??undefined}
                    controls autoPlay playsInline
                    style={{ width:"100%", height:"100%", display:"block", outline:"none", accentColor:"#F5D27A" }} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background:"linear-gradient(135deg,rgba(17,35,71,.98),rgba(22,42,80,.9))" }}>
                    <span style={{ color:"rgba(245,210,122,.3)", fontSize:"3rem" }}>▶</span>
                    <p style={{ color:"rgba(255,247,230,.25)", fontSize:"0.72rem", fontFamily:"'Lato',sans-serif", textAlign:"center", maxWidth:300, padding:"0 1rem" }}>
                      Video dosyasını <code style={{ color:"rgba(245,210,122,.5)" }}>public/videos/</code> klasörüne ekleyin
                    </p>
                  </div>
                )}
              </div>
              <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between"
                style={{ borderTop:"1px solid rgba(245,210,122,.08)" }}>
                <div>
                  <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontWeight:500, fontSize:"clamp(0.85rem,2.5vw,1rem)" }}>{video.title}</p>
                  <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.55)", fontSize:"0.78rem", marginTop:2 }}>{video.date}</p>
                </div>
                {video.duration && <span style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.4)", fontSize:"0.85rem", flexShrink:0 }}>{video.duration}</span>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
