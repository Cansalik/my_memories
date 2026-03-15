"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Memory } from "@/types";

interface Props { memory:Memory|null; onClose:()=>void; }

export default function MemoryModal({ memory, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    if (memory) document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory && (
        <>
          <motion.div className="fixed inset-0 z-50" style={{ background:"rgba(7,15,30,.85)", backdropFilter:"blur(8px)" }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-auto">
            <motion.div className="pointer-events-auto relative w-full" style={{ maxWidth:480 }}
              initial={{ opacity:0, scale:0.8, y:40 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8, y:40 }}
              transition={{ type:"spring", damping:25, stiffness:300 }} onClick={e=>e.stopPropagation()}>
              {/* Glow */}
              <div className="absolute -inset-1 rounded-2xl opacity-40"
                style={{ background:"linear-gradient(135deg,rgba(245,210,122,.4),rgba(232,164,184,.2),rgba(245,210,122,.4))", filter:"blur(8px)" }} />
              <div className="relative rounded-2xl overflow-hidden"
                style={{ background:"linear-gradient(145deg,rgba(17,35,71,.97),rgba(11,29,58,.99))", border:"1px solid rgba(245,210,122,.25)", boxShadow:"0 25px 80px rgba(0,0,0,.5)" }}>
                {/* Photo area */}
                <div className="relative overflow-hidden" style={{ height:"clamp(160px,35vw,224px)", background:"linear-gradient(135deg,rgba(17,35,71,.9),rgba(30,50,90,.7))" }}>
                  {memory.photo_url ? (
                    <img src={memory.photo_url} alt={memory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-25">
                      <svg width="70" height="70" viewBox="0 0 80 80">
                        <circle cx="20" cy="20" r="3" fill="#F5D27A"/><circle cx="40" cy="12" r="2" fill="#F5D27A"/>
                        <circle cx="60" cy="22" r="3" fill="#F5D27A"/><circle cx="50" cy="40" r="2.5" fill="#F5D27A"/>
                        <circle cx="30" cy="50" r="2" fill="#F5D27A"/>
                        <line x1="20" y1="20" x2="40" y2="12" stroke="#F5D27A" strokeWidth=".8" opacity=".5"/>
                        <line x1="40" y1="12" x2="60" y2="22" stroke="#F5D27A" strokeWidth=".8" opacity=".5"/>
                        <line x1="60" y1="22" x2="50" y2="40" stroke="#F5D27A" strokeWidth=".8" opacity=".5"/>
                        <line x1="50" y1="40" x2="30" y2="50" stroke="#F5D27A" strokeWidth=".8" opacity=".5"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 30%,rgba(11,29,58,.9) 100%)" }} />
                  <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background:"rgba(11,29,58,.7)", border:"1px solid rgba(245,210,122,.3)", backdropFilter:"blur(4px)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="#F5D27A" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                  <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl"
                    style={{ color:"#F5D27A", textShadow:"0 0 12px rgba(245,210,122,.8)" }}
                    animate={{ scale:[1,1.2,1], opacity:[0.7,1,0.7] }} transition={{ duration:2, repeat:Infinity }}>✦</motion.div>
                </div>
                <div className="p-5 sm:p-6">
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.2rem,4vw,1.5rem)", fontWeight:600, color:"#FFF7E6", marginBottom:"0.25rem" }}>{memory.title}</h2>
                  <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.8rem", color:"#F5D27A", marginBottom:"1rem" }}>{memory.date}</p>
                  <div style={{ width:"3rem", height:1, background:"linear-gradient(90deg,rgba(245,210,122,.6),transparent)", marginBottom:"1rem" }} />
                  <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(255,247,230,.8)", lineHeight:1.75, fontStyle:"italic", fontSize:"clamp(0.85rem,2.5vw,1rem)" }}>"{memory.description}"</p>
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {["✦","✧","✦"].map((s,i) => <span key={i} style={{ color:"rgba(245,210,122,.35)", fontSize:"0.7rem", animation:`twinkle ${2+i}s ease-in-out infinite`, animationDelay:`${i*.4}s` }}>{s}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
