"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { COUPLE_NAME } from "@/lib/constants";

type Section = "anilar" | "fotograflar" | "videolar" | "sarki";

const navItems: { key: Section; label: string; icon: string; href: string }[] = [
  { key: "anilar", label: "Anılar", icon: "✦", href: "/admin/anilar" },
  { key: "fotograflar", label: "Fotoğraflar", icon: "✧", href: "/admin/fotograflar" },
  { key: "videolar", label: "Videolar", icon: "▶", href: "/admin/videolar" },
  { key: "sarki", label: "Şarkımız", icon: "♪", href: "/admin/sarki" },
];

interface Props { children: React.ReactNode; active: Section; }

export default function AdminShell({ children, active }: Props) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex-shrink-0 flex flex-col" style={{ width: 220, background: "rgba(7,15,30,.97)", borderRight: "1px solid rgba(245,210,122,.1)" }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(245,210,122,.1)" }}>
          <div className="flex items-center gap-2 mb-1">
            <motion.span className="text-gold text-sm" animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:3, repeat:Infinity }}>✦</motion.span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.9rem", color:"#FFF7E6", fontWeight:500 }}>{COUPLE_NAME}</span>
          </div>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.58rem", color:"rgba(245,210,122,.4)", letterSpacing:"0.15em", textTransform:"uppercase", paddingLeft:"1.1rem" }}>Yönetim</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          {navItems.map(item => {
            const isActive = active === item.key;
            return (
              <Link key={item.key} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200" style={{ background: isActive?"rgba(245,210,122,.1)":"transparent", border: isActive?"1px solid rgba(245,210,122,.2)":"1px solid transparent" }}>
                <span style={{ color: isActive?"#F5D27A":"rgba(245,210,122,.35)", fontSize:"0.75rem", width:14, textAlign:"center" }}>{item.icon}</span>
                <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.8rem", color: isActive?"rgba(255,247,230,.9)":"rgba(255,247,230,.4)", fontWeight: isActive?600:400, letterSpacing:"0.05em" }}>{item.label}</span>
                {isActive && <div className="ml-auto w-1 h-4 rounded-full" style={{ background:"linear-gradient(to bottom,#F5D27A,#C9A84C)" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t" style={{ borderColor:"rgba(245,210,122,.1)" }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 hover:bg-white/5">
            <span style={{ color:"rgba(245,210,122,.35)", fontSize:"0.75rem" }}>←</span>
            <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.78rem", color:"rgba(255,247,230,.35)", letterSpacing:"0.05em" }}>Siteye Dön</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 hover:bg-red-500/10">
            <span style={{ color:"rgba(255,100,100,.4)", fontSize:"0.75rem" }}>✕</span>
            <span style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.78rem", color:"rgba(255,120,120,.4)", letterSpacing:"0.05em" }}>Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
