"use client";

import { useEffect, useRef, useMemo } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nextShootingRef = useRef(0);

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 280 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnShootingStar = () => {
      const ss: ShootingStar = {
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: (Math.random() * 4 + 3),
        vy: (Math.random() * 2 + 1),
        life: 0,
        maxLife: Math.random() * 60 + 40,
        active: true,
      };
      shootingStarsRef.current.push(ss);
    };

    const draw = (time: number) => {
      timeRef.current = time * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      );
      grad.addColorStop(0, "rgba(17, 35, 71, 0.0)");
      grad.addColorStop(1, "rgba(7, 15, 30, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        const t = Math.sin(timeRef.current * star.twinkleSpeed * 60 + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.5 + 0.5 * t);
        const px = (star.x / 100) * canvas.width;
        const py = (star.y / 100) * canvas.height;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);

        const isGold = Math.random() < 0.001; // rarely turn gold on twinkle
        if (star.size > 1.5 && t > 0.7) {
          ctx.fillStyle = `rgba(245, 232, 180, ${currentOpacity})`;
          // Glow
          const grd = ctx.createRadialGradient(px, py, 0, px, py, star.size * 4);
          grd.addColorStop(0, `rgba(245, 232, 180, ${currentOpacity * 0.5})`);
          grd.addColorStop(1, "rgba(245, 232, 180, 0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(255, 247, 230, ${currentOpacity})`;
        ctx.fill();
      });

      // Shooting stars
      if (timeRef.current > nextShootingRef.current) {
        spawnShootingStar();
        nextShootingRef.current = timeRef.current + Math.random() * 8 + 4;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => ss.active);
      shootingStarsRef.current.forEach((ss) => {
        ss.life++;
        if (ss.life >= ss.maxLife) { ss.active = false; return; }

        const progress = ss.life / ss.maxLife;
        const alpha = Math.sin(progress * Math.PI);
        const tailLen = 80 * alpha;

        const x2 = ss.x + ss.vx * ss.life;
        const y2 = ss.y + ss.vy * ss.life;

        const grad = ctx.createLinearGradient(x2 - tailLen * 0.7, y2 - tailLen * 0.35, x2, y2);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,247,220,${alpha * 0.9})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x2 - tailLen * 0.7, y2 - tailLen * 0.35);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Head dot
        ctx.beginPath();
        ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,247,220,${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
