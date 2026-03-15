"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { COUPLE_NAME } from "@/lib/constants";

type Section = "anilar" | "fotograflar" | "videolar" | "sarki";

const navItems: { key: Section; label: string; icon: string; href: string }[] = [
  { key: "anilar",      label: "Anılar",      icon: "✦", href: "/admin/anilar" },
  { key: "fotograflar", label: "Fotoğraflar", icon: "✧", href: "/admin/fotograflar" },
  { key: "videolar",    label: "Videolar",    icon: "▶", href: "/admin/videolar" },
  { key: "sarki",       label: "Şarkımız",    icon: "♪", href: "/admin/sarki" },
];

interface Props { children: React.ReactNode; active: Section; }

export default function AdminShell({ children, active }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor:"rgba(245,210,122,.1)" }}>
        <div className="flex items-center gap-2 mb-1">
          <motion.span style={{ color:"#F5D27A", fontSize:"0.85rem" }} animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:3, repeat:Infinity }}>✦</motion.span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.88rem", color:"#FFF7E6", fontWeight:500 }}>{COUPLE_NAME}</span>
        </div>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.55rem", color:"rgba(245,210,122,.4)", letterSpacing:"0.15em", textTransform:"uppercase", paddingLeft:"1.1rem" }}>Yönetim Paneli</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3">
        {navItems.map(item => {
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200"
              style={{ background:isActive?"rgba(245,210,122,.1)":"transparent", border:isActive?"1px solid rgba(245,210,122,.2)":"1px solid transparent" }}
            >
              <span style={{ color:isActive?"#F5D27A":"rgba(245,210,122,.35)", fontSize:"0.8rem", width:16, textAlign:"center" }}>{item.icon}</span>
              <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.82rem", color:isActive?"rgba(255,247,230,.9)":"rgba(255,247,230,.4)", fontWeight:isActive?600:400, letterSpacing:"0.04em" }}>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-4 rounded-full" style={{ background:"linear-gradient(to bottom,#F5D27A,#C9A84C)" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t" style={{ borderColor:"rgba(245,210,122,.1)" }}>
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 hover:bg-white/5">
          <span style={{ color:"rgba(245,210,122,.35)", fontSize:"0.75rem" }}>←</span>
          <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.78rem", color:"rgba(255,247,230,.35)" }}>Siteye Dön</span>
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 hover:bg-red-500/10">
          <span style={{ color:"rgba(255,100,100,.4)", fontSize:"0.75rem" }}>✕</span>
          <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.78rem", color:"rgba(255,120,120,.4)" }}>Çıkış</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">

      {/* ── Desktop sidebar (md ve üzeri) ── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{ width:220, background:"rgba(7,15,30,.97)", borderRight:"1px solid rgba(245,210,122,.1)" }}
      >
        <NavContent />
      </aside>

      {/* ── Mobile: üst bar + drawer ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height:56, background:"rgba(7,15,30,.97)", borderBottom:"1px solid rgba(245,210,122,.12)", backdropFilter:"blur(12px)" }}>
        {/* Sol: logo */}
        <div className="flex items-center gap-2">
          <span style={{ color:"#F5D27A", fontSize:"0.85rem" }}>✦</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.88rem", color:"#FFF7E6", fontWeight:500 }}>{COUPLE_NAME}</span>
        </div>
        {/* Sağ: hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex flex-col justify-center gap-1.5 p-2 rounded-lg"
          style={{ background:"rgba(245,210,122,.06)", border:"1px solid rgba(245,210,122,.15)" }}
        >
          <motion.div style={{ width:18, height:1.5, background:"#F5D27A", borderRadius:2, transformOrigin:"center" }} animate={mobileOpen ? { rotate:45, y:5 } : { rotate:0, y:0 }} transition={{ duration:0.2 }} />
          <motion.div style={{ width:18, height:1.5, background:"#F5D27A", borderRadius:2 }} animate={mobileOpen ? { opacity:0 } : { opacity:1 }} transition={{ duration:0.15 }} />
          <motion.div style={{ width:18, height:1.5, background:"#F5D27A", borderRadius:2, transformOrigin:"center" }} animate={mobileOpen ? { rotate:-45, y:-5 } : { rotate:0, y:0 }} transition={{ duration:0.2 }} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-40"
              style={{ background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)" }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 flex flex-col"
              style={{ width:260, background:"rgba(7,15,30,.99)", borderRight:"1px solid rgba(245,210,122,.15)", boxShadow:"4px 0 32px rgba(0,0,0,.5)" }}
              initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", damping:28, stiffness:300 }}
            >
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto" style={{ minWidth:0 }}>
        {/* Mobile top bar için boşluk */}
        <div className="md:hidden" style={{ height:56 }} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );}