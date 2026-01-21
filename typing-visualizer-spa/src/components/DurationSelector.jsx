import { useTest } from "../context/TestContext";

const DURATIONS = [15, 30, 60];

export default function DurationSelector() {
  const { duration, setDuration, running } = useTest();

  return (
    <div
      className="d-flex justify-content-center gap-3 mb-3"
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.9rem",
        opacity: running ? 0.4 : 0.85,
        pointerEvents: running ? "none" : "auto",
      }}
    >
      {DURATIONS.map((d) => (
        <button
          key={d}
          onClick={() => setDuration(d)}
          style={{
            background: "transparent",
            border: "none",
            color: d === duration ? "#f8fafc" : "#64748b",
            borderBottom:
              d === duration ? "2px solid #f8fafc" : "2px solid transparent",
            padding: "0.25rem 0.5rem",
            cursor: "pointer",
          }}
        >
          {d}s
        </button>
      ))}
    </div>
  );
}
