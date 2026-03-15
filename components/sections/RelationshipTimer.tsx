"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RELATIONSHIP_START } from "@/lib/constants";

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

function getElapsed(): TimeElapsed {
  const now = new Date();
  const diff = now.getTime() - RELATIONSHIP_START.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const years = now.getFullYear() - RELATIONSHIP_START.getFullYear();
  const months = now.getMonth() - RELATIONSHIP_START.getMonth() + years * 12;
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: totalDays,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    totalDays,
  };
}

function UnitCard({ value, label, delay }: { value: number; label: string; delay: number }) {
  const display = String(value).padStart(2, "0");
  return (
    <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(145deg,rgba(17,35,71,0.9),rgba(7,15,30,0.9))", border: "1px solid rgba(245,210,122,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(245,210,122,0.1)" }}>
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.04) 0%,transparent 100%)", borderBottom: "1px solid rgba(245,210,122,0.08)" }} />
        <span className="font-playfair text-3xl md:text-4xl font-semibold shimmer" style={{ fontFamily: "'Playfair Display',serif" }}>{display}</span>
      </div>
      <span className="text-cream/50 text-xs tracking-widest uppercase font-lato" style={{ fontFamily: "'Lato',sans-serif" }}>{label}</span>
    </motion.div>
  );
}

function SkeletonCard({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl" style={{ background: "linear-gradient(145deg,rgba(17,35,71,0.9),rgba(7,15,30,0.9))", border: "1px solid rgba(245,210,122,0.2)" }} />
      <span className="text-cream/50 text-xs tracking-widest uppercase font-lato" style={{ fontFamily: "'Lato',sans-serif" }}>{label}</span>
    </div>
  );
}

export default function RelationshipTimer() {
  // null ile başla — sunucu tarafında hesap yapılmaz, hydration hatası olmaz
  const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);

  useEffect(() => {
    setElapsed(getElapsed());
    const id = setInterval(() => setElapsed(getElapsed()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%,rgba(245,210,122,0.04) 0%,transparent 70%)" }} />

      <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-3 font-lato" style={{ fontFamily: "'Lato',sans-serif" }}>Aşkın Ölçümü</p>
        <h2 className="font-playfair text-4xl md:text-5xl text-cream mb-3" style={{ fontFamily: "'Playfair Display',serif", textShadow: "0 0 30px rgba(245,210,122,0.2)" }}>Birlikte Geçen Süre</h2>
        <p className="text-cream/40 text-sm font-lato" style={{ fontFamily: "'Lato',sans-serif" }}>3 Mart 2022'den bu yana</p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {/* Toplam gün */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="inline-block px-8 py-5 rounded-2xl" style={{ background: "linear-gradient(145deg,rgba(17,35,71,0.8),rgba(7,15,30,0.9))", border: "1px solid rgba(245,210,122,0.2)", boxShadow: "0 0 40px rgba(245,210,122,0.08),0 16px 48px rgba(0,0,0,0.3)" }}>
            <div className="flex items-baseline gap-3 justify-center">
              <span className="font-playfair font-bold text-6xl md:text-7xl shimmer" style={{ fontFamily: "'Playfair Display',serif" }}>
                {elapsed ? elapsed.totalDays.toLocaleString("tr-TR") : "···"}
              </span>
              <span className="text-gold/70 text-xl font-lato" style={{ fontFamily: "'Lato',sans-serif" }}>gün</span>
            </div>
            <p className="text-cream/30 text-xs mt-1 font-lato tracking-wider" style={{ fontFamily: "'Lato',sans-serif" }}>✦ birlikte ✦</p>
          </div>
        </motion.div>

        {/* Saat : Dakika : Saniye */}
        <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
          {elapsed ? (
            <>
              <UnitCard value={elapsed.hours}   label="Saat"   delay={0.3} />
              <motion.span className="text-gold/30 text-2xl pb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>:</motion.span>
              <UnitCard value={elapsed.minutes} label="Dakika" delay={0.4} />
              <motion.span className="text-gold/30 text-2xl pb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>:</motion.span>
              <UnitCard value={elapsed.seconds} label="Saniye" delay={0.5} />
            </>
          ) : (
            <>
              <SkeletonCard label="Saat" />
              <span className="text-gold/30 text-2xl pb-6">:</span>
              <SkeletonCard label="Dakika" />
              <span className="text-gold/30 text-2xl pb-6">:</span>
              <SkeletonCard label="Saniye" />
            </>
          )}
        </div>

        {/* Yıl / Ay */}
        <motion.div className="flex items-center justify-center gap-8 mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}>
          <div className="text-center">
            <span className="font-playfair text-3xl text-gold" style={{ fontFamily: "'Playfair Display',serif" }}>
              {elapsed ? elapsed.years : 0}
            </span>
            <p className="text-cream/40 text-xs mt-1 font-lato tracking-widest uppercase" style={{ fontFamily: "'Lato',sans-serif" }}>Yıl</p>
          </div>
          <div className="w-px h-8" style={{ background: "rgba(245,210,122,0.2)" }} />
          <div className="text-center">
            <span className="font-playfair text-3xl text-gold" style={{ fontFamily: "'Playfair Display',serif" }}>
              {elapsed ? elapsed.months : 0}
            </span>
            <p className="text-cream/40 text-xs mt-1 font-lato tracking-widest uppercase" style={{ fontFamily: "'Lato',sans-serif" }}>Ay</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}