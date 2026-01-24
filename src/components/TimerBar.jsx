import { useTest } from "../context/TestContext";

export default function TimerBar() {
  const { timeLeft, mode } = useTest();

  return (
    <div
      style={{
  textAlign: "center",
  fontSize: "0.95rem",
  opacity: 0.55,
  marginBottom: "1.2rem",
  letterSpacing: "0.18em",

  position: "relative",
  zIndex: 2,
}}

    >
      {mode === "flow" ? "FLOW" : `${timeLeft}s`}
    </div>
  );
}
