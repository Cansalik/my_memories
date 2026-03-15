"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryModal from "@/components/ui/MemoryModal";
import type { Memory } from "@/types";
import { STAR_COUNT, STAR_HIT_RADIUS } from "@/lib/constants";

interface Star {
  x: number; y: number; vx: number; vy: number;
  radius: number; baseOpacity: number; opacity: number;
  twinkleSpeed: number; twinkleOffset: number; glowRadius: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function makeStars(W: number, H: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const r = rnd(1.2, 3.8);
    return { x: rnd(0,W), y: rnd(0,H), vx: rnd(-0.28,0.28), vy: rnd(-0.2,0.2), radius: r, baseOpacity: rnd(0.45,0.9), opacity: 0.6, twinkleSpeed: rnd(0.008,0.025), twinkleOffset: Math.random()*Math.PI*2, glowRadius: r*rnd(3.5,6) };
  });
}

interface Props { memories: Memory[]; }

export default function StarMemorySection({ memories }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const hoveredRef = useRef(-1);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, title: "", visible: false });

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    timeRef.current = ts * 0.001;
    ctx.clearRect(0, 0, W, H);

    starsRef.current.forEach((s, idx) => {
      s.x += s.vx; s.y += s.vy;
      if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10;
      const t = Math.sin(timeRef.current * s.twinkleSpeed * 60 + s.twinkleOffset);
      s.opacity = s.baseOpacity * (0.55 + 0.45 * t);
      const hov = idx === hoveredRef.current;
      const r = hov ? s.radius * 1.8 : s.radius;
      const glow = hov ? s.glowRadius * 2.2 : s.glowRadius;
      const op = hov ? Math.min(1, s.opacity * 1.6) : s.opacity;
      const grad = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,glow);
      grad.addColorStop(0,`rgba(245,220,140,${op*.45})`); grad.addColorStop(0.4,`rgba(245,210,122,${op*.2})`); grad.addColorStop(1,"rgba(245,210,122,0)");
      ctx.beginPath(); ctx.arc(s.x,s.y,glow,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
      const core = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r);
      core.addColorStop(0,`rgba(255,252,235,${op})`); core.addColorStop(0.4,`rgba(245,220,140,${op*.95})`); core.addColorStop(1,`rgba(201,168,76,${op*.6})`);
      ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2); ctx.fillStyle=core; ctx.fill();
      if (r > 2.2 || hov) {
        const spike = r * (hov ? 3.5 : 2.2);
        ctx.save(); ctx.globalAlpha=op*.7; ctx.strokeStyle=`rgba(255,248,220,${op*.6})`; ctx.lineWidth=hov?1:0.7;
        ctx.beginPath(); ctx.moveTo(s.x-spike,s.y); ctx.lineTo(s.x+spike,s.y); ctx.moveTo(s.x,s.y-spike); ctx.lineTo(s.x,s.y+spike); ctx.stroke(); ctx.restore();
      }
    });
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const resize = () => { canvas.width = section.offsetWidth; canvas.height = section.offsetHeight; if (!starsRef.current.length) starsRef.current = makeStars(canvas.width, canvas.height); };
    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [draw]);

  const hitTest = useCallback((px: number, py: number) => {
    let best = -1, bestDist = STAR_HIT_RADIUS;
    starsRef.current.forEach((s, i) => { const d = Math.hypot(s.x - px, s.y - py); if (d < bestDist) { bestDist = d; best = i; } });
    return best;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const idx = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    hoveredRef.current = idx;
    if (idx !== -1) {
      const s = starsRef.current[idx];
      const mem = memories[idx % memories.length];
      setTooltip({ x: s.x, y: s.y - 28, title: mem.title, visible: true });
      (e.currentTarget as HTMLCanvasElement).style.cursor = "pointer";
    } else {
      setTooltip(t => ({ ...t, visible: false }));
      (e.currentTarget as HTMLCanvasElement).style.cursor = "default";
    }
  }, [hitTest, memories]);

  const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const idx = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (idx !== -1) setSelected(memories[idx % memories.length]);
  }, [hitTest, memories]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }} onMouseMove={onMouseMove} onMouseLeave={() => { hoveredRef.current = -1; setTooltip(t => ({ ...t, visible: false })); }} onClick={onClick} />

      <AnimatePresence>
        {tooltip.visible && (
          <motion.div className="absolute pointer-events-none z-30" style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }} initial={{ opacity: 0, y: 6, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.92 }} transition={{ duration: 0.18 }}>
            <div style={{ fontFamily: "'Lato',sans-serif", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", background: "rgba(11,29,58,0.95)", border: "1px solid rgba(245,210,122,0.35)", color: "#F5D27A", backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", letterSpacing: "0.03em", whiteSpace: "nowrap", fontSize: "0.85rem" }}>{tooltip.title}</div>
            <div className="mx-auto w-px h-2 mt-0.5" style={{ background: "rgba(245,210,122,0.3)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-start pt-20 pb-16 px-4 pointer-events-none">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,210,122,.6)", marginBottom: "0.75rem" }}>Anıların Gökyüzü</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: "#FFF7E6", marginBottom: "1rem", textShadow: "0 0 30px rgba(245,210,122,0.25)" }}>Yıldızlarımız</h2>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.875rem", color: "rgba(255,247,230,0.4)", maxWidth: "20rem", margin: "0 auto" }}>Her yıldıza tıkla — sana bir anımızı göstersin</p>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 px-4 py-2 rounded-full pointer-events-none" style={{ background: "rgba(7,15,30,0.6)", border: "1px solid rgba(245,210,122,0.12)", backdropFilter: "blur(10px)" }}>
        <motion.div className="w-2 h-2 rounded-full" style={{ background: "#F5D27A", boxShadow: "0 0 6px rgba(245,210,122,0.7)" }} animate={{ scale: [1,1.4,1], opacity: [0.7,1,0.7] }} transition={{ duration: 2, repeat: Infinity }} />
        <span style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.7rem", color: "rgba(255,247,230,0.45)" }}>{STAR_COUNT} yıldız · tıkla ve keşfet</span>
      </div>

      <MemoryModal memory={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
