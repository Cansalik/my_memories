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
      {row.map((x,j) => <div key={j} className="absolute rounded-full" style={{ width:j%3===0?2:1.5, height:j%3===0?2:1.5, background:"rgba(245,210,122,.28)", left:`${x}%`, top:`${row[(j+4)%8]}%`, animation:`twinkle ${2.5+j*.4}s ease-in-out infinite`, animationDelay:`${j*.3}s` }} />)}
      <div className="absolute inset-0 flex items-center justify-center"><span style={{ color:"rgba(245,210,122,.18)", fontSize:"1.8rem" }}>▶</span></div>
    </div>
  );
}

export default function VideoPageClient({ videos }: { videos: GalleryVideo[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:text-gold transition-colors group" style={{ color:"rgba(255,247,230,.35)", fontFamily:"'Lato',sans-serif", fontSize:"0.75rem", letterSpacing:"0.15em" }}>
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>Ana Sayfaya Dön
        </Link>
        <div className="text-center">
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(245,210,122,.6)", marginBottom:"0.75rem" }}>Hareketli Anılar</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.5rem,6vw,4rem)", color:"#FFF7E6", textShadow:"0 0 40px rgba(245,210,122,.2)" }}>Tüm Videolar</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16" style={{ background:"linear-gradient(90deg,transparent,rgba(245,210,122,.3))" }} />
            <span style={{ color:"rgba(245,210,122,.4)", fontSize:"0.7rem", fontFamily:"'Lato',sans-serif" }}>{videos.length} Video</span>
            <div className="h-px w-16" style={{ background:"linear-gradient(90deg,rgba(245,210,122,.3),transparent)" }} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <motion.button key={video.id} className="group relative w-full rounded-2xl overflow-hidden text-left" style={{ aspectRatio:"16/9", display:"block", border: video.featured?"1px solid rgba(245,210,122,.25)":"1px solid rgba(245,210,122,.1)", boxShadow:"0 4px 24px rgba(0,0,0,.4)" }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:(i%3)*.08 }}
            whileHover={{ scale:1.02 }} onClick={() => setActive(i)}>
            <div className="absolute inset-0">{video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" /> : <FilmPlaceholder index={i} />}</div>
            <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(7,15,30,.92) 0%,rgba(7,15,30,.15) 55%,rgba(7,15,30,.1) 100%)" }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" style={{ boxShadow:"inset 0 0 0 1.5px rgba(245,210,122,.4)" }} />
            {video.featured && <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background:"rgba(11,29,58,.88)", border:"1px solid rgba(245,210,122,.3)", backdropFilter:"blur(6px)" }}><span style={{ color:"#F5D27A", fontSize:"0.55rem" }}>✦</span><span style={{ color:"rgba(245,210,122,.7)", fontFamily:"'Lato',sans-serif", fontSize:"0.58rem" }}>Öne Çıkan</span></div>}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" style={{ width:48, height:48, background:"rgba(11,29,58,.85)", border:"1.5px solid rgba(245,210,122,.5)", backdropFilter:"blur(8px)" }}>
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ marginLeft:3 }}><path d="M1.5 1L14.5 9L1.5 17V1Z" fill="#F5D27A" /></svg>
              </div>
            </div>
            {video.duration && <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded" style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.6rem", background:"rgba(7,15,30,.88)", border:"1px solid rgba(245,210,122,.2)", color:"rgba(245,210,122,.8)" }}>{video.duration}</div>}
            <div className="absolute bottom-0 left-0 right-0 p-4 pr-14">
              <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontWeight:500, fontSize:"0.9rem" }}>{video.title}</p>
              <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.6)", fontSize:"0.65rem" }}>{video.date}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && <VideoModal video={videos[active]} onClose={() => setActive(null)} onPrev={() => setActive(i => i===null?null:(i-1+videos.length)%videos.length)} onNext={() => setActive(i => i===null?null:(i+1)%videos.length)} />}
      </AnimatePresence>
    </div>
  );
}
