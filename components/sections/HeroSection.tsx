"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const floatingStars = [
  { cx: "15%", cy: "25%", r: 2 },
  { cx: "35%", cy: "15%", r: 1.5 },
  { cx: "55%", cy: "20%", r: 2.5 },
  { cx: "72%", cy: "12%", r: 1.8 },
  { cx: "85%", cy: "30%", r: 2 },
  { cx: "90%", cy: "18%", r: 1.5 },
  { cx: "10%", cy: "45%", r: 1.8 },
  { cx: "42%", cy: "38%", r: 2.2 },
  { cx: "68%", cy: "42%", r: 1.5 },
];

const constellationPoints = [
  { x: "22%", y: "30%" }, { x: "32%", y: "22%" }, { x: "45%", y: "18%" },
  { x: "58%", y: "25%" }, { x: "70%", y: "20%" }, { x: "80%", y: "28%" },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Constellation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {constellationPoints.slice(0, -1).map((pt, i) => {
            const next = constellationPoints[i + 1];
            return (
              <motion.line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke="rgba(245,210,122,0.25)" strokeWidth="0.2" strokeDasharray="1 1"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.5 + i * 0.3 }} />
            );
          })}
        </svg>
        {floatingStars.map((star, i) => (
          <motion.div key={i} className="absolute rounded-full bg-gold"
            style={{ left: star.cx, top: star.cy, width: star.r * 4, height: star.r * 4, boxShadow: `0 0 ${star.r * 6}px ${star.r * 3}px rgba(245,210,122,0.4)` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%,rgba(17,35,71,0.6) 0%,transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <motion.div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
          {["✦","✧","✦","✧","✦"].map((s, i) => (
            <span key={i} className="text-gold text-xs"
              style={{ textShadow:"0 0 8px rgba(245,210,122,0.8)", animation:`twinkle ${2+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.2}s` }}>{s}</span>
          ))}
        </motion.div>

        {/* Ana başlık — mobilde küçük */}
        <motion.h1
          className="font-playfair font-normal tracking-wide mb-3"
          style={{
            fontFamily:"'Playfair Display',serif", color:"#FFF7E6",
            fontSize:"clamp(2.4rem, 10vw, 7rem)",
            textShadow:"0 0 40px rgba(245,210,122,0.3),0 0 80px rgba(245,210,122,0.15)",
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}>
          Neşet
          <span className="text-gold mx-2 sm:mx-4" style={{ fontSize:"0.7em" }}>&</span>
          Müzeyyen
        </motion.h1>

        <motion.div className="flex items-center justify-center gap-4 my-4 sm:my-6"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2 }}>
          <div className="h-px flex-1 max-w-24" style={{ background:"linear-gradient(90deg,transparent,rgba(245,210,122,0.5))" }} />
          <span className="text-gold text-sm" style={{ fontFamily:"'Lato',sans-serif" }}>✦</span>
          <div className="h-px flex-1 max-w-24" style={{ background:"linear-gradient(90deg,rgba(245,210,122,0.5),transparent)" }} />
        </motion.div>

        <motion.p className="font-playfair italic font-light px-2"
          style={{ fontFamily:"'Playfair Display',serif", color:"#FAE4A4", fontSize:"clamp(1rem,3vw,1.5rem)", textShadow:"0 0 20px rgba(245,210,122,0.4)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}>
          "Her yıldız bir anımızı temsil ediyor"
        </motion.p>

        <motion.div className="mt-12 sm:mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.2 }}>
          <span className="text-cream/40 text-xs tracking-widest uppercase" style={{ fontFamily:"'Lato',sans-serif" }}>Yıldızları keşfet</span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <rect x="8" y="0" width="4" height="18" rx="2" fill="rgba(245,210,122,0.3)" />
              <path d="M3 18 L10 28 L17 18" stroke="rgba(245,210,122,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
