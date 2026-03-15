"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { COUPLE_NAME } from "@/lib/constants";

export default function AdminLoginForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    setLoading(false);
    if (res.ok) { router.push("/admin/anilar"); router.refresh(); }
    else { setError("Hatalı şifre. Tekrar deneyin."); setPin(""); }
  };

  return (
    <motion.div className="w-full max-w-sm px-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%,rgba(245,210,122,.05) 0%,transparent 70%)" }} />
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.span className="text-gold text-2xl block mb-4" animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:3, repeat:Infinity }} style={{ textShadow:"0 0 16px rgba(245,210,122,.6)" }}>✦</motion.span>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.75rem", fontWeight:500, color:"#FFF7E6", marginBottom:"0.5rem" }}>{COUPLE_NAME}</h1>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.75rem", color:"rgba(245,210,122,.5)", letterSpacing:"0.2em", textTransform:"uppercase" }}>Yönetim Paneli</p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-8" style={{ background:"linear-gradient(145deg,rgba(17,35,71,.95),rgba(11,29,58,.98))", border:"1px solid rgba(245,210,122,.2)", boxShadow:"0 20px 60px rgba(0,0,0,.4),0 0 0 1px rgba(245,210,122,.06)" }}>
          <form onSubmit={submit}>
            <label style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(245,210,122,.5)", display:"block", marginBottom:"0.75rem" }}>Giriş Şifresi</label>
            <input
              type="password" value={pin} onChange={e => setPin(e.target.value)}
              placeholder="••••"
              className="w-full rounded-xl px-4 py-3 mb-4 outline-none text-cream placeholder-cream/20 font-lato text-center text-2xl tracking-widest"
              style={{ fontFamily:"'Lato',sans-serif", background:"rgba(7,15,30,.8)", border:`1px solid ${error?"rgba(255,100,100,.4)":"rgba(245,210,122,.2)"}`, color:"#FFF7E6", transition:"border-color .2s" }}
              onFocus={e => { if(!error) e.currentTarget.style.borderColor="rgba(245,210,122,.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor=error?"rgba(255,100,100,.4)":"rgba(245,210,122,.2)"; }}
              autoFocus maxLength={16}
            />
            {error && <p style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.72rem", color:"rgba(255,120,120,.8)", textAlign:"center", marginBottom:"0.75rem" }}>{error}</p>}
            <motion.button type="submit" disabled={loading || !pin} className="w-full py-3 rounded-xl font-medium transition-all" style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.875rem", letterSpacing:"0.1em", background: loading||!pin?"rgba(245,210,122,.15)":"linear-gradient(135deg,#F5D27A,#C9A84C)", color: loading||!pin?"rgba(245,210,122,.4)":"#0B1D3A", cursor: loading||!pin?"not-allowed":"pointer", boxShadow: loading||!pin?"none":"0 0 20px rgba(245,210,122,.3)" }}
              whileHover={!loading&&pin?{scale:1.02}:{}} whileTap={!loading&&pin?{scale:0.98}:{}}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-6" style={{ fontFamily:"'Lato',sans-serif", fontSize:"0.65rem", color:"rgba(255,247,230,.2)", letterSpacing:"0.1em" }}>Varsayılan şifre: ADMIN_PIN env değişkeni</p>
      </div>
    </motion.div>
  );
}
