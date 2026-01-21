import { useEffect, useRef, useState } from "react";
import { useTest } from "../context/TestContext";

export default function StatsBar() {
  const { timeLeft } = useTest();

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  const startTime = useRef(null);
  const correct = useRef(0);
  const total = useRef(0);

  // --- stats listener ---
  useEffect(() => {
    function onStat(e) {
      const { correct: isCorrect } = e.detail;

      if (!startTime.current) startTime.current = Date.now();

      total.current++;

      if (isCorrect) {
        correct.current++;
      } else {
        setErrors((v) => v + 1);
      }

      const minutes = (Date.now() - startTime.current) / 60000;
      if (minutes > 0) {
        setWpm(Math.round((correct.current / 5) / minutes));
      }

      setAccuracy(
        Math.round((correct.current / Math.max(total.current, 1)) * 100)
      );
    }

    window.addEventListener("typing:stat", onStat);
    return () => window.removeEventListener("typing:stat", onStat);
  }, []);

  // --- reset on test end ---
  useEffect(() => {
    if (timeLeft === 0) {
      startTime.current = null;
      correct.current = 0;
      total.current = 0;
      setWpm(0);
      setAccuracy(100);
      setErrors(0);
    }
  }, [timeLeft]);

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        marginTop: "2.4rem",
        gap: "4.2rem",

        fontFamily: "JetBrains Mono, monospace",
        opacity: 0.7,

        position: "relative",
        zIndex: 2,
      }}
    >
      <Stat label="wpm" value={wpm} />
      <Stat label="accuracy" value={`${accuracy}%`} />
      <Stat label="errors" value={errors} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        textAlign: "center",
        minWidth: "72px",
      }}
    >
      {/* VALUE */}
      <div
        style={{
          fontSize: "1.45rem",
          fontWeight: 500,
          color: "#f1f5f9",
          lineHeight: 1.1,
          transition: "color 0.2s ease",
        }}
      >
        {value}
      </div>

      {/* LABEL */}
      <div
        style={{
          marginTop: "0.35rem",
          fontSize: "0.7rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#94a3b8",
        }}
      >
        {label}
      </div>
    </div>
  );
}
