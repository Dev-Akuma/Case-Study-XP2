import { useEffect, useRef, useState } from "react";

function hsvToHex(h, s, v) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function ColorPicker({ onChange }) {
  const wheelRef = useRef(null);
  const squareRef = useRef(null);

  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(80);
  const [val, setVal] = useState(80);

  // draw hue wheel
  useEffect(() => {
    const canvas = wheelRef.current;
    const ctx = canvas.getContext("2d");
    const r = canvas.width / 2;

    for (let a = 0; a < 360; a++) {
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r, (a - 1) * Math.PI / 180, a * Math.PI / 180);
      ctx.closePath();
      ctx.fillStyle = `hsl(${a},100%,50%)`;
      ctx.fill();
    }
  }, []);

  // draw saturation/value square
  useEffect(() => {
    const c = squareRef.current;
    const ctx = c.getContext("2d");

    const gradX = ctx.createLinearGradient(0, 0, c.width, 0);
    gradX.addColorStop(0, "#fff");
    gradX.addColorStop(1, `hsl(${hue},100%,50%)`);

    ctx.fillStyle = gradX;
    ctx.fillRect(0, 0, c.width, c.height);

    const gradY = ctx.createLinearGradient(0, 0, 0, c.height);
    gradY.addColorStop(0, "rgba(0,0,0,0)");
    gradY.addColorStop(1, "#000");

    ctx.fillStyle = gradY;
    ctx.fillRect(0, 0, c.width, c.height);
  }, [hue]);

  useEffect(() => {
    onChange(hsvToHex(hue, sat, val));
  }, [hue, sat, val]);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <canvas
        ref={wheelRef}
        width={120}
        height={120}
        style={{ borderRadius: "50%", cursor: "crosshair" }}
        onMouseDown={(e) => {
          const r = wheelRef.current.getBoundingClientRect();
          const x = e.clientX - r.left - 60;
          const y = e.clientY - r.top - 60;
          const angle = Math.atan2(y, x) * 180 / Math.PI;
          setHue((angle + 360) % 360);
        }}
      />

      <canvas
        ref={squareRef}
        width={120}
        height={120}
        style={{ cursor: "crosshair" }}
        onMouseDown={(e) => {
          const r = squareRef.current.getBoundingClientRect();
          setSat(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
          setVal(100 - Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
        }}
      />
    </div>
  );
}
