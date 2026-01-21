import { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function EffectsCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme(); // You can use this to color particles if you want

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // --- PARTICLE LOGIC (Simplified) ---
    const particles = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2
        });
    }

    const animate = () => {
      // FIX 1: CLEAR RECT instead of filling black
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; // Very subtle dust
      particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if(p.x < 0) p.x = canvas.width;
          if(p.x > canvas.width) p.x = 0;
          if(p.y < 0) p.y = canvas.height;
          if(p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}