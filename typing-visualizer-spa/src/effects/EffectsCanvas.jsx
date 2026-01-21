import { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTest } from "../context/TestContext";

// Helper: Hex to RGB string "255, 0, 0"
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255";
};

export default function EffectsCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const { history, isActive, visualEffect } = useTest(); // Get selected effect

  // Unified storage for all active effects
  const activeEffectsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // --- EVENT HANDLER: DISPATCHER ---
    const handleVisualEvent = (e) => {
      const { x, y, key } = e.detail;

      // 1. RIPPLE MODE (Only on Spacebar or Period)
      if (visualEffect === "ripple" && (key === " " || key === ".")) {
        activeEffectsRef.current.push({
          type: "ripple",
          x, y,
          radius: 10,
          alpha: 0.8,
          lineWidth: 3,
          speed: 3
        });
      }

      // 2. ROCKET MODE (Every letter shoots up)
      else if (visualEffect === "rocket" && key !== " ") {
        activeEffectsRef.current.push({
          type: "rocket",
          x, y,
          vy: -4 - Math.random() * 2, // Upward velocity
          alpha: 1,
          size: 3,
          color: theme.caret // Use theme color
        });
      }

      // 3. FIRE MODE (Explosion on every key)
      else if (visualEffect === "fire" && key !== " ") {
        // Spawn 5-8 small particles
        for (let i = 0; i < 6; i++) {
          activeEffectsRef.current.push({
            type: "fire",
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            size: Math.random() * 3,
            decay: 0.02 + Math.random() * 0.02
          });
        }
      }
    };
    
    // Listen to our new generic event
    window.addEventListener("typing:visual", handleVisualEvent);


    // --- ANIMATION LOOP ---
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- RENDER EFFECTS ---
      const rgbBase = hexToRgb(theme.caret);

      for (let i = activeEffectsRef.current.length - 1; i >= 0; i--) {
        const p = activeEffectsRef.current[i];

        // --- TYPE: RIPPLE ---
        if (p.type === "ripple") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgbBase}, ${p.alpha})`;
          ctx.lineWidth = p.lineWidth;
          ctx.stroke();

          // Physics
          p.radius += p.speed;
          p.alpha -= 0.02;
          p.lineWidth *= 0.95;
          if (p.alpha <= 0) activeEffectsRef.current.splice(i, 1);
        }

        // --- TYPE: ROCKET ---
        else if (p.type === "rocket") {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 2, 8); // Draw a little "streak"

          // Physics
          p.y += p.vy; // Move up
          p.alpha -= 0.015;
          
          // Add "Smoke" trail (spawn new tiny particles from the rocket)
          // (Only spawn smoke occasionally to save performance)
          if (Math.random() > 0.5) {
             // Simple smoke implementation: separate loop or just fade
             // For simplicity, we just fade the rocket itself
          }
          
          if (p.y < 0 || p.alpha <= 0) activeEffectsRef.current.splice(i, 1);
        }

        // --- TYPE: FIRE ---
        else if (p.type === "fire") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgbBase}, ${p.alpha})`;
          ctx.fill();

          // Physics
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.size *= 0.9; // Shrink
          
          if (p.alpha <= 0) activeEffectsRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("typing:visual", handleVisualEvent);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme.caret, visualEffect]); // Re-bind when effect changes

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}