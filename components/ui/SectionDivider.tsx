"use client";
import { motion } from "framer-motion";

interface Props { label?: string; }

export default function SectionDivider({ label }: Props) {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 px-8 py-2"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-1 h-px max-w-xs" style={{ background: "linear-gradient(90deg,transparent,rgba(245,210,122,.2),rgba(245,210,122,.1))" }} />
      <div className="flex items-center gap-2">
        <span style={{ color: "rgba(245,210,122,.2)", fontSize: "0.6rem" }}>✦</span>
        {label && <span style={{ fontFamily: "'Lato',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,210,122,.3)" }}>{label}</span>}
        <span style={{ color: "rgba(245,210,122,.2)", fontSize: "0.6rem" }}>✦</span>
      </div>
      <div className="flex-1 h-px max-w-xs" style={{ background: "linear-gradient(90deg,rgba(245,210,122,.1),rgba(245,210,122,.2),transparent)" }} />
    </motion.div>
  );
}
