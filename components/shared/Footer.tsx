"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUPLE_NAME } from "@/lib/constants";

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady?: () => void; }
}

const fmt = (s: number) =>
  !s || isNaN(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Bars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-px flex-shrink-0" style={{ height: 16 }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{ width: 3, background: "linear-gradient(to top,#C9A84C,#F5D27A)", borderRadius: "1px 1px 0 0", minHeight: 2 }}
          animate={playing
            ? { height: [`${10 + (i % 3) * 22 + 10}%`, `${18 + (i % 4) * 18}%`, `${8 + (i % 5) * 16}%`] }
            : { height: "20%" }}
          transition={playing
            ? { duration: 0.38 + i * 0.05, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
            : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [songTitle, setSongTitle] = useState("Bizim Şarkımız");
  const [youtubeId, setYoutubeId] = useState("");
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/song")
      .then(r => r.json())
      .then(d => {
        if (d.title) setSongTitle(d.title);
        if (d.youtube_id) setYoutubeId(d.youtube_id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!youtubeId) return;
    const init = () => {
      if (!iframeRef.current) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: any) => { setDuration(e.target.getDuration()); setReady(true); },
          onStateChange: (e: any) => {
            if (e.data === 1) {
              setPlaying(true);
              intervalRef.current = setInterval(() => {
                const ct = playerRef.current?.getCurrentTime?.() || 0;
                const dur = playerRef.current?.getDuration?.() || 0;
                setCurrentTime(ct); setDuration(dur);
                setProgress(dur > 0 ? (ct / dur) * 100 : 0);
              }, 500);
            } else {
              setPlaying(false);
              if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
              if (e.data === 0) { setCurrentTime(0); setProgress(0); }
            }
          },
        },
      });
    };
    if (window.YT?.Player) { init(); return; }
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existing) { const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); init(); };
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [youtubeId]);

  const togglePlay = () => {
    if (!ready || !playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ready || !playerRef.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    playerRef.current.seekTo(ratio * duration, true);
    setProgress(ratio * 100); setCurrentTime(ratio * duration);
  };

  // Play button
  const PlayBtn = (
    <motion.button
      onClick={togglePlay}
      className="flex-shrink-0 flex items-center justify-center rounded-full"
      style={{
        width: 34, height: 34,
        background: ready ? "linear-gradient(135deg,#F5D27A,#C9A84C)" : "rgba(245,210,122,.15)",
        border: "none", cursor: ready ? "pointer" : "default",
        boxShadow: ready ? "0 0 12px rgba(245,210,122,.3)" : "none",
        transition: "background 0.4s",
      }}
      whileHover={ready ? { scale: 1.1 } : {}}
      whileTap={ready ? { scale: 0.92 } : {}}
    >
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div key="spin" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1 A4 4 0 0 1 9 5" stroke="rgba(11,29,58,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </motion.div>
        ) : playing ? (
          <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }} className="flex gap-0.5">
            <div style={{ width: 3, height: 10, borderRadius: 1.5, background: "#0B1D3A" }} />
            <div style={{ width: 3, height: 10, borderRadius: 1.5, background: "#0B1D3A" }} />
          </motion.div>
        ) : (
          <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{ marginLeft: 2 }}><path d="M1 0.5L9 6L1 11.5V0.5Z" fill="#0B1D3A" /></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  // Progress bar
  const ProgressBar = (
    <div className="flex items-center gap-2 w-full">
      <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.55rem", color:"rgba(255,247,230,.25)", minWidth:22, textAlign:"right", flexShrink:0 }}>{fmt(currentTime)}</span>
      <div className="flex-1 rounded-full cursor-pointer relative" style={{ height:3, background:"rgba(245,210,122,.1)" }} onClick={seek}>
        <div className="h-full rounded-full" style={{ width:`${progress}%`, background:"linear-gradient(90deg,#C9A84C,#F5D27A)", boxShadow:"0 0 5px rgba(245,210,122,.4)", transition:"width 0.5s linear", position:"relative" }}>
          <div style={{ position:"absolute", right:-3, top:"50%", transform:"translateY(-50%)", width:6, height:6, borderRadius:"50%", background:"#F5D27A", boxShadow:"0 0 4px rgba(245,210,122,.8)" }} />
        </div>
      </div>
      <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.55rem", color:"rgba(255,247,230,.25)", minWidth:22, flexShrink:0 }}>{fmt(duration)}</span>
    </div>
  );

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background:"linear-gradient(90deg,rgba(7,15,30,.97),rgba(11,29,58,.97),rgba(7,15,30,.97))", borderTop:"1px solid rgba(245,210,122,.12)", backdropFilter:"blur(16px)", boxShadow:"0 -4px 32px rgba(0,0,0,.4)" }}
    >
      {/* Hidden YT iframe */}
      <div style={{ position:"absolute", width:1, height:1, overflow:"hidden", opacity:0, pointerEvents:"none" }} aria-hidden>
        <div ref={iframeRef} />
      </div>

      {/* ── MOBİL LAYOUT (sm altı) ── */}
      <div className="flex sm:hidden flex-col items-center justify-center gap-1.5 px-4 py-2" style={{ minHeight:64 }}>
        {/* Üst satır: vinyl + şarkı adı + bars + play */}
        <div className="flex items-center gap-2.5 w-full justify-center">
          {/* Mini vinyl */}
          <motion.div className="flex-shrink-0 rounded-full" style={{ width:26, height:26, background:"conic-gradient(from 0deg,#0B1D3A,#112347,#0B1D3A,#070F1E)", position:"relative", boxShadow:"0 0 6px rgba(0,0,0,.5)" }} animate={{ rotate: playing ? 360 : 0 }} transition={{ duration:6, repeat:Infinity, ease:"linear" }}>
            <div style={{ position:"absolute", inset:"28%", borderRadius:"50%", background:"radial-gradient(circle,#F5D27A 0%,#C9A84C 60%,#8B6914 100%)" }}>
              <div style={{ position:"absolute", inset:"30%", borderRadius:"50%", background:"#070F1E" }} />
            </div>
          </motion.div>
          {/* Şarkı adı */}
          <div style={{ minWidth:0, flex:1 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.72rem", color:"rgba(255,247,230,.8)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{songTitle}</p>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.55rem", color:"rgba(245,210,122,.4)" }}>{COUPLE_NAME}</p>
          </div>
          <Bars playing={playing} />
          {PlayBtn}
        </div>
        {/* Alt satır: progress */}
        {ProgressBar}
      </div>

      {/* ── MASAÜSTÜ LAYOUT (sm ve üzeri) ── */}
      <div className="hidden sm:flex items-center" style={{ height:70 }}>
        {/* Sol — çift isim */}
        <div className="flex items-center gap-2.5 pl-5 flex-shrink-0" style={{ minWidth:170 }}>
          <motion.span style={{ color:"#F5D27A", fontSize:"1rem", textShadow:"0 0 10px rgba(245,210,122,.6)" }} animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:3, repeat:Infinity }}>✦</motion.span>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.8rem", fontWeight:500, color:"rgba(255,247,230,.8)", lineHeight:1.2 }}>{COUPLE_NAME}</p>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"rgba(245,210,122,.35)", letterSpacing:"0.05em" }}>Bizim Küçük Evrenimiz</p>
          </div>
        </div>

        {/* Orta — player */}
        <div className="flex-1 flex flex-col items-center gap-1 px-4" style={{ maxWidth:460, margin:"0 auto" }}>
          <div className="flex items-center gap-3 w-full justify-center">
            {/* Mini vinyl */}
            <motion.div className="flex-shrink-0 rounded-full" style={{ width:30, height:30, background:"conic-gradient(from 0deg,#0B1D3A,#112347,#0B1D3A,#070F1E)", boxShadow:"0 0 8px rgba(0,0,0,.5)", position:"relative" }} animate={{ rotate: playing ? 360 : 0 }} transition={{ duration:6, repeat:Infinity, ease:"linear" }}>
              <div style={{ position:"absolute", inset:"28%", borderRadius:"50%", background:"radial-gradient(circle,#F5D27A 0%,#C9A84C 60%,#8B6914 100%)" }}>
                <div style={{ position:"absolute", inset:"30%", borderRadius:"50%", background:"#070F1E" }} />
              </div>
            </motion.div>
            <div style={{ minWidth:0, flexShrink:1 }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.75rem", color:"rgba(255,247,230,.78)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{songTitle}</p>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"rgba(245,210,122,.45)" }}>{COUPLE_NAME}</p>
            </div>
            <Bars playing={playing} />
            {PlayBtn}
          </div>
          <div style={{ maxWidth:360, width:"100%" }}>{ProgressBar}</div>
        </div>

        {/* Sağ — telif */}
        <div className="flex items-center justify-end pr-5 flex-shrink-0" style={{ minWidth:170 }}>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"rgba(255,247,230,.14)", letterSpacing:"0.08em", textAlign:"right" }}>© 2025 · Tüm hakları saklıdır</p>
        </div>
      </div>
    </footer>
  );}