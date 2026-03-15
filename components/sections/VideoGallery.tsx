"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoModal from "@/components/ui/VideoModal";
import type { GalleryVideo } from "@/types";

function FilmPlaceholder({ index }: { index: number }) {
  const rows = [[8,45,78,22,60,90,35,68],[15,52,82,28,65,18,48,75],[20,40,70,12,55,85,30,62]];
  const row = rows[index % 3];
  return (
    <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg,rgba(17,35,71,.98),rgba(22,42,80,.9))" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 75%,rgba(245,210,122,.09) 0%,transparent 48%),radial-gradient(circle at 80% 25%,rgba(232,164,184,.06) 0%,transparent 48%)" }} />
      {row.map((x,j) => <div key={j} className="absolute rounded-full" style={{ width: j%3===0?2:1.5, height: j%3===0?2:1.5, background: "rgba(245,210,122,.28)", left:`${x}%`, top:`${row[(j+4)%8]}%`, animation:`twinkle ${2.5+j*.4}s ease-in-out infinite`, animationDelay:`${j*.3}s` }} />)}
      <div className="absolute inset-0 flex items-center justify-center flex-col gap-1"><span style={{ color: "rgba(245,210,122,.18)", fontSize: "1.6rem" }}>▶</span></div>
    </div>
  );
}

interface Props { featured: GalleryVideo[]; total: number; }

export default function VideoGallery({ featured, total }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const close = () => setActive(null);
  const prev = () => setActive(i => i === null ? null : (i - 1 + featured.length) % featured.length);
  const next = () => setActive(i => i === null ? null : (i + 1) % featured.length);

  return (
    <section className="relative py-16 px-4">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%,rgba(232,164,184,.03) 0%,transparent 70%)" }} />

      <motion.div className="text-center mb-5" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,210,122,.6)", marginBottom: "0.75rem" }}>Hareketli Anılar</p>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: "#FFF7E6", textShadow: "0 0 30px rgba(245,210,122,.18)" }}>Video Galerimiz</h2>
      </motion.div>

      <motion.div className="flex items-center justify-between max-w-5xl mx-auto mb-8 px-1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full" style={{ background: "rgba(232,164,184,.5)" }} /><span style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.7rem", color: "rgba(255,247,230,.3)" }}>Öne çıkan videolar</span></div>
        <Link href="/videolar" className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300" style={{ background: "rgba(245,210,122,.06)", border: "1px solid rgba(245,210,122,.18)" }}>
          <span style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.7rem", color: "rgba(245,210,122,.7)", letterSpacing: "0.1em" }}>Tüm Videolar</span>
          <span style={{ color: "rgba(245,210,122,.4)", fontSize: "0.7rem" }}>({total})</span>
          <motion.span style={{ color: "rgba(245,210,122,.5)", fontSize: "0.75rem" }} animate={{ x:[0,3,0] }} transition={{ duration:2, repeat:Infinity }}>→</motion.span>
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((video, i) => (
          <motion.button key={video.id} className="group relative w-full rounded-2xl overflow-hidden text-left" style={{ aspectRatio: "16/9", border: "1px solid rgba(245,210,122,.1)", boxShadow: "0 4px 24px rgba(0,0,0,.4)", display: "block" }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ scale: 1.02 }} onClick={() => setActive(i)}>
            <div className="absolute inset-0">{video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <FilmPlaceholder index={i} />}</div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(7,15,30,.92) 0%,rgba(7,15,30,.2) 55%,rgba(7,15,30,.1) 100%)" }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 1.5px rgba(245,210,122,.4),inset 0 0 32px rgba(245,210,122,.06)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: "rgba(11,29,58,.85)", border: "1.5px solid rgba(245,210,122,.55)", backdropFilter: "blur(8px)", boxShadow: "0 0 22px rgba(245,210,122,.22)" }} whileHover={{ scale: 1.14 }}>
                <motion.div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(245,210,122,.25)" }} animate={{ scale:[1,1.65,1], opacity:[0.5,0,0.5] }} transition={{ duration:2.5, repeat:Infinity, delay:i*.3 }} />
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" style={{ marginLeft: 3 }}><path d="M2 1L16 10L2 19V1Z" fill="#F5D27A" /></svg>
              </motion.div>
            </div>
            {video.duration && <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded" style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.62rem", background:"rgba(7,15,30,.88)", border:"1px solid rgba(245,210,122,.22)", color:"rgba(245,210,122,.8)" }}>{video.duration}</div>}
            <div className="absolute bottom-0 left-0 right-0 p-4 pr-14">
              <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontWeight:500, fontSize:"0.95rem", lineHeight:1.3 }}>{video.title}</p>
              <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.6)", fontSize:"0.68rem" }}>{video.date}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div className="flex justify-center mt-8" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}>
        <Link href="/videolar" className="group relative inline-flex items-center gap-3 px-7 py-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(17,35,71,.9),rgba(7,15,30,.95))", border: "1px solid rgba(245,210,122,.2)", boxShadow: "0 4px 20px rgba(0,0,0,.3)" }}>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: "linear-gradient(135deg,rgba(245,210,122,.07),rgba(232,164,184,.04))" }} />
          <span style={{ color: "rgba(245,210,122,.5)", fontSize: "0.85rem" }}>▶</span>
          <span style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.875rem", color: "rgba(255,247,230,.7)", letterSpacing: "0.05em" }} className="relative">Tüm anılara bak</span>
          <span style={{ color: "rgba(255,247,230,.3)", fontSize: "0.75rem" }} className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </motion.div>

      <AnimatePresence>
        {active !== null && <VideoModal video={featured[active]} onClose={close} onPrev={prev} onNext={next} />}
      </AnimatePresence>
    </section>
  );
}
