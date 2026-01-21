import { useTheme } from "../context/ThemeContext";
import ColorPicker from "./ColorPicker";

export default function SettingsPanel({ open, onClose }) {
  const { theme, updateTheme } = useTheme();
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 auto 0 0",
        width: "320px",
        background: "#020617",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: "1.6rem",
        zIndex: 60,
        boxShadow: "10px 0 50px rgba(0,0,0,0.6)",
      }}
    >
      <h3 style={{ fontSize: "0.8rem", opacity: 0.7, letterSpacing: "0.2em" }}>
        CUSTOMIZATION
      </h3>

      <Section title="Background">
        <ColorPicker onChange={(v) => updateTheme("background", v)} />
      </Section>

      <Section title="Typed text">
        <ColorPicker onChange={(v) => updateTheme("textTyped", v)} />
      </Section>

      <Section title="Upcoming text">
        <ColorPicker onChange={(v) => updateTheme("textUpcoming", v)} />
      </Section>

      <Section title="Errors">
        <ColorPicker onChange={(v) => updateTheme("textError", v)} />
      </Section>

      <Section title="Caret">
        <ColorPicker onChange={(v) => updateTheme("caret", v)} />
      </Section>

      <button
        onClick={onClose}
        style={{
          marginTop: "1.8rem",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#e5e7eb",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        close
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: "1.6rem" }}>
      <div
        style={{
          marginBottom: "0.6rem",
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          opacity: 0.6,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
