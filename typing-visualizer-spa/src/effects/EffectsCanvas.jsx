import { useEffect, useRef } from "react";

export default function EffectsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let ripples = [];
    let last = performance.now();

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnBurst(intensity, combo, clean) {
      const count = Math.min(28, 4 + combo * 2);
      const color = clean ? "180,200,255" : "239,68,68";

      for (let i = 0; i < count; i++) {
        ripples.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 8,
          speed: 18 + Math.random() * 30,
          alpha: 0.45,
          decay: 0.18 + Math.random() * 0.25,
          delay: Math.random() * 220,
          born: performance.now(),
          color,
        });
      }
    }

    function onWord(e) {
      const { cps, combo, clean } = e.detail;
      spawnBurst(cps, combo, clean);
    }

    window.addEventListener("typing:word", onWord);

    function update(dt) {
      ripples.forEach(r => {
        const age = performance.now() - r.born;
        if (age < r.delay) return;

        r.r += r.speed * dt;
        r.alpha -= r.decay * dt;
      });

      ripples = ripples.filter(r => r.alpha > 0);
    }

    function draw() {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      ripples.forEach(r => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      });
    }

    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      update(dt);
      draw();
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("typing:word", onWord);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2,6,23,0.6)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
