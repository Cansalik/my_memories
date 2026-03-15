"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GalleryPhoto } from "@/types";

const starRows = [[8,25,45,62,78,90,33,55],[15,38,55,72,88,20,48,68],[22,42,60,78,92,12,35,58]];

function Placeholder({ index }: { index:number }) {
  const row = starRows[index % 3];
  return (
    <div className="w-full h-full relative" style={{ background:"linear-gradient(135deg,rgba(17,35,71,.95),rgba(30,50,90,.75),rgba(17,35,71,.9))" }}>
      <div className="absolute inset-0" style={{ backgroundImage:"radial-gradient(circle at 20% 80%,rgba(245,210,122,.1) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(232,164,184,.08) 0%,transparent 50%)" }} />
      {row.map((x,j) => <div key={j} className="absolute rounded-full" style={{ width:j%3===0?2:1.5, height:j%3===0?2:1.5, background:"rgba(245,210,122,.3)", left:`${x}%`, top:`${row[(j+4)%8]}%`, animation:`twinkle ${2.5+j*.4}s ease-in-out infinite`, animationDelay:`${j*.3}s` }} />)}
      <div className="absolute inset-0 flex items-center justify-center"><span style={{ color:"rgba(245,210,122,.2)", fontSize:"1.5rem" }}>✦</span></div>
    </div>
  );
}

interface Props { featured: GalleryPhoto[]; total: number; }

export default function PhotoGallery({ featured, total }: Props) {
  return (
    <section className="relative py-14 sm:py-20 px-4">
      <motion.div className="text-center mb-5"
        initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(245,210,122,.6)", marginBottom:"0.75rem" }}>Anı Defteri</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,6vw,3.5rem)", color:"#FFF7E6", textShadow:"0 0 30px rgba(245,210,122,.2)" }}>Fotoğraf Galerimiz</h2>
      </motion.div>

      {/* Header row — mobilde alt alta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto mb-6 sm:mb-8 px-1 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gold/40" />
          <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(255,247,230,.3)" }}>Öne çıkan anlar</span>
        </div>
        <Link href="/galeri" className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start sm:self-auto"
          style={{ background:"rgba(245,210,122,.06)", border:"1px solid rgba(245,210,122,.18)" }}>
          <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", color:"rgba(245,210,122,.7)", letterSpacing:"0.1em" }}>Tüm Fotoğraflar</span>
          <span style={{ color:"rgba(245,210,122,.4)", fontSize:"0.7rem" }}>({total})</span>
          <motion.span style={{ color:"rgba(245,210,122,.5)", fontSize:"0.75rem" }} animate={{ x:[0,3,0] }} transition={{ duration:2, repeat:Infinity }}>→</motion.span>
        </Link>
      </div>

      {/* Grid — mobilde 1 kolon, sm'de 2, md'de 3 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {featured.slice(0,3).map((photo, i) => (
          <motion.div key={photo.id} className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ aspectRatio:"1/1", border:"1px solid rgba(245,210,122,.1)", boxShadow:"0 4px 24px rgba(0,0,0,.35)" }}
            initial={{ opacity:0, scale:0.93 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            transition={{ duration:0.55, delay:i*0.1 }} whileHover={{ scale:1.02 }}>
            <div className="absolute inset-0">
              {photo.url ? <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <Placeholder index={i} />}
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4"
              style={{ background:"linear-gradient(to top,rgba(11,29,58,.95) 0%,rgba(11,29,58,.45) 55%,transparent 100%)", boxShadow:"inset 0 0 0 1.5px rgba(245,210,122,.35)", borderRadius:"inherit" }}>
              <div>
                <p style={{ fontFamily:"'Playfair Display',serif", color:"#FFF7E6", fontSize:"0.95rem", fontWeight:500 }}>{photo.caption}</p>
                <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(245,210,122,.7)", fontSize:"0.7rem", marginTop:"0.15rem" }}>{photo.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="flex justify-center mt-6 sm:mt-8"
        initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4 }}>
        <Link href="/galeri" className="group relative inline-flex items-center gap-3 px-6 sm:px-7 py-3 rounded-full overflow-hidden"
          style={{ background:"linear-gradient(135deg,rgba(17,35,71,.9),rgba(7,15,30,.95))", border:"1px solid rgba(245,210,122,.2)", boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background:"linear-gradient(135deg,rgba(245,210,122,.07),rgba(232,164,184,.04))" }} />
          <span style={{ color:"rgba(245,210,122,.5)", fontSize:"0.8rem" }}>✦</span>
          <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.875rem", color:"rgba(255,247,230,.7)" }} className="relative">Tüm anılara bak</span>
          <span style={{ color:"rgba(255,247,230,.3)", fontSize:"0.75rem" }} className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
