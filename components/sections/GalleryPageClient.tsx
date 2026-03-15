"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightboxModal from "@/components/ui/LightboxModal";
import type { GalleryPhoto } from "@/types";

const starRows = [[8,25,45,62,78,90,33,55],[15,38,55,72,88,20,48,68],[22,42,60,78,92,12,35,58]];
function Placeholder({ index }: { index: number }) {
  const row = starRows[index % 3];
  return (
    <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg,rgba(17,35,71,.95),rgba(30,50,90,.75))" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 75%,rgba(245,210,122,.1) 0%,transparent 50%),radial-gradient(circle at 75% 25%,rgba(232,164,184,.07) 0%,transparent 50%)" }} />
      {row.map((x,j) => <div key={j} className="absolute rounded-full" style={{ width: j%3===0?2.5:1.5, height: j%3===0?2.5:1.5, background: "rgba(245,210,122,.3)", left:`${x}%`, top:`${row[(j+4)%8]}%`, animation:`twinkle ${2.5+j*.4}s ease-in-out infinite`, animationDelay:`${j*.3}s` }} />)}
      <div className="absolute inset-0 flex items-center justify-center"><span style={{ color: "rgba(245,210,122,.2)", fontSize: "1.5rem" }}>✦</span></div>
    </div>
  );
}

export default function GalleryPageClient({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:text-gold transition-colors duration-300 group" style={{ color: "rgba(255,247,230,.35)", fontFamily: "'Lato',sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>Ana Sayfaya Dön
        </Link>
        <div className="text-center">
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,210,122,.6)", marginBottom: "0.75rem" }}>Anı Defteri</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.5rem,6vw,4rem)", color: "#FFF7E6", textShadow: "0 0 40px rgba(245,210,122,.2)" }}>Tüm Fotoğraflar</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg,transparent,rgba(245,210,122,.3))" }} />
            <span style={{ color: "rgba(245,210,122,.4)", fontSize: "0.7rem", fontFamily: "'Lato',sans-serif" }}>{photos.length} Anı</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg,rgba(245,210,122,.3),transparent)" }} />
          </div>
        </div>
      </motion.div>

      <div style={{ columns: "2", columnGap: "1rem" }} className="sm:[column-count:3] lg:[column-count:4]">
        {photos.map((photo, i) => (
          <motion.div key={photo.id} className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden cursor-pointer" style={{ aspectRatio: i%5===0?"4/5":i%3===0?"3/4":"1/1", border: photo.featured?"1px solid rgba(245,210,122,.25)":"1px solid rgba(245,210,122,.1)", boxShadow: "0 4px 20px rgba(0,0,0,.35)", transition: "transform .25s" }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i%4)*.06 }}
            whileHover={{ scale: 1.02 }} onClick={() => setActive(i)}>
            <div className="absolute inset-0">{photo.url ? <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <Placeholder index={i} />}</div>
            {photo.featured && <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(11,29,58,.88)", border: "1px solid rgba(245,210,122,.3)", backdropFilter: "blur(6px)" }}><span style={{ color: "#F5D27A", fontSize: "0.6rem" }}>✦</span><span style={{ color: "rgba(245,210,122,.7)", fontFamily: "'Lato',sans-serif", fontSize: "0.58rem" }}>Öne Çıkan</span></div>}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-3" style={{ background: "linear-gradient(to top,rgba(11,29,58,.95) 0%,rgba(11,29,58,.4) 55%,transparent 100%)", boxShadow: "inset 0 0 0 1.5px rgba(245,210,122,.3)" }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", color: "#FFF7E6", fontSize: "0.9rem", fontWeight: 500 }}>{photo.caption}</p>
                <p style={{ fontFamily: "'Lato',sans-serif", color: "rgba(245,210,122,.65)", fontSize: "0.65rem" }}>{photo.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && <LightboxModal photo={photos[active]} onClose={() => setActive(null)} onPrev={() => setActive(i => i===null?null:(i-1+photos.length)%photos.length)} onNext={() => setActive(i => i===null?null:(i+1)%photos.length)} />}
      </AnimatePresence>
    </div>
  );
}
