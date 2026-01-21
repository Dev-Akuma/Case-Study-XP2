export default function SettingsButton({ onClick, hidden }) {
  if (hidden) return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        top: "1.4rem",
        left: "1.4rem",
        zIndex: 60,

        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
        padding: "0.55rem 0.65rem",

        color: "#e5e7eb",
        cursor: "pointer",
        fontSize: "1rem",

        backdropFilter: "blur(6px)",
      }}
      aria-label="settings"
    >
      ⚙
    </button>
  );
}
