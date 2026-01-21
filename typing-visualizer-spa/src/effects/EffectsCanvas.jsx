import { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
// 1. Import useTest to get live speed data
import { useTest } from "../context/TestContext";

// Helper to convert hex to rgb for opacity control
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255";
};

export default function EffectsCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  // 2. Get history (for live WPM) and active status
  const { history, isActive } = useTest();

  const ripplesRef = useRef([]);

  // Get the latest WPM safely
  const currentWpm = history.length > 0 && isActive ? history[history.length - 1].wpm : 0;

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

    // Keep the old listener just in case you want precise ripples too (optional)
    const handleRipple = (e) => {
      const { x, y } = e.detail;
      ripplesRef.current.push({
        x: x, y: y, radius: 10, alpha: 0.8, lineWidth: 3, expansionSpeed: 3
      });
    };
    window.addEventListener("typing:ripple", handleRipple);

    // --- PARTICLE SETUP ---
    const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2
    }));

    // --- MAIN ANIMATION LOOP ---
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // A. DRAW PARTICLES (Background dust)
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if(p.x < 0) p.x = canvas.width; else if(p.x > canvas.width) p.x = 0;
          if(p.y < 0) p.y = canvas.height; else if(p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
      });

      // B. AUTO-SPAWN RIPPLES BASED ON SPEED
      // Only spawn if active and user has started typing (WPM > 0)
      if (isActive && currentWpm > 5) {
         // Calculate a "Speed Factor" (normalized roughly 0.0 to 2.0 based on 100 WPM)
         const speedFactor = currentWpm / 100;

         // Spawn Chance: Higher WPM = higher chance per frame.
         // TWEAK THIS NUMBER (1500): Lower = more ripples, Higher = fewer ripples.
         const spawnThreshold = currentWpm / 1500;

         if (Math.random() < spawnThreshold) {
           ripplesRef.current.push({
             x: Math.random() * canvas.width,
             y: Math.random() * canvas.height,
             // At high speed, start smaller and explode faster for "crazy" feel
             radius: 5 + Math.random() * 10, 
             // Faster typing = much faster expansion
             expansionSpeed: 2 + (speedFactor * 5), 
             // Randomize opacity slightly for variety
             alpha: 0.4 + (Math.random() * 0.4), 
             // Faster typing = slightly thicker initial lines
             lineWidth: 1 + (speedFactor * 2),
             // Faster typing = fades out faster
             fadeSpeed: 0.01 + (speedFactor * 0.015)
           });
         }
      }

      // C. DRAW AND UPDATE RIPPLES
      const rgbColor = hexToRgb(theme.caret);
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        
        ctx.beginPath();
        // Use a quadratic curve for the line width so it gets thinner as it expands
        ctx.lineWidth = Math.max(0.5, r.lineWidth * (r.alpha * 2));
        ctx.strokeStyle = `rgba(${rgbColor}, ${r.alpha})`;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Physics Update based on their individual properties
        r.radius += r.expansionSpeed;
        // Default fadeSpeed to 0.02 if it was an old-style ripple event
        r.alpha -= r.fadeSpeed || 0.02; 

        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("typing:ripple", handleRipple);
      cancelAnimationFrame(animationFrameId);
    };
    // Add currentWpm to dependency array so the loop detects speed changes
  }, [theme.caret, currentWpm, isActive]); 

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}