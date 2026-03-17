"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryPhoto } from "@/types";

interface Props { photo:GalleryPhoto|null; onClose:()=>void; onPrev:()=>void; onNext:()=>void; }

export default function LightboxModal({ photo, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==="Escape") onClose();
      if (e.key==="ArrowLeft") onPrev();
      if (e.key==="ArrowRight") onNext();
    };
    document.addEventListener("keydown", h);
    if (photo) document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [photo, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {photo && (
        <>
          {/* Background */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background:"rgba(3,6,14,.94)", backdropFilter:"blur(14px)" }}
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            onClick={onClose}
          />

          {/* SCROLLABLE CONTAINER */}
          <div className="fixed inset-0 z-50 overflow-y-auto pt-4 pb-16 px-3 sm:px-6 md:px-8">

            <motion.div
              className="relative w-full mx-auto my-10"
              style={{ maxWidth:780 }}
              initial={{ scale:0.88, opacity:0, y:24 }}
              animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:0.88, opacity:0, y:24 }}
              transition={{ type:"spring", damping:26, stiffness:280 }}
              onClick={e=>e.stopPropagation()}
            >

              {/* Top nav */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button onClick={onClose} className="flex items-center gap-2"
                  style={{ color:"rgba(255,247,230,.45)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.15em" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Kapat
                </button>
                <div className="flex items-center gap-3">
                  <button onClick={onPrev} style={{ color:"rgba(255,247,230,.35)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer" }}>← Önceki</button>
                  <span style={{ color:"rgba(245,210,122,.2)", fontSize:"0.7rem" }}>|</span>
                  <button onClick={onNext} style={{ color:"rgba(255,247,230,.35)", fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", background:"none", border:"none", cursor:"pointer" }}>Sonraki →</button>
                </div>
              </div>

              <div className="rounded-xl sm:rounded-2xl overflow-hidden"
                style={{ border:"1px solid rgba(245,210,122,.2)", boxShadow:"0 30px 80px rgba(0,0,0,.6)" }}>

                {/* Photo */}
                <div style={{ position:"relative", aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(17,35,71,.95),rgba(30,50,90,.8))" }}>
                  {photo.url ? (
                    <img src={photo.url} alt={photo.caption} style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><span style={{ color:"rgba(245,210,122,.2)", fontSize:"3rem" }}>✦</span></div>
                  )}

                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,rgba(11,29,58,.8) 100%)" }} />

                  <button onClick={onPrev}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                    style={{ width:40, height:40, background:"rgba(11,29,58,.75)", border:"1px solid rgba(245,210,122,.2)", backdropFilter:"blur(6px)", cursor:"pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="#F5D27A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>

                  <button onClick={onNext}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                    style={{ width:40, height:40, background:"rgba(11,29,58,.75)", border:"1px solid rgba(245,210,122,.2)", backdropFilter:"blur(6px)", cursor:"pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="#F5D27A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>

                <div className="px-4 sm:px-5 py-3 sm:py-4"
                  style={{ background:"rgba(11,29,58,.98)", borderTop:"1px solid rgba(245,210,122,.08)" }}>
                  <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontWeight:500, fontSize:"clamp(0.9rem,2.5vw,1.1rem)" }}>
                    {photo.caption}
                  </p>
                  <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.55)", fontSize:"0.78rem", marginTop:4 }}>
                    {photo.date}
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}