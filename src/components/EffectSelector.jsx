import { Stack } from "@mui/material";
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";

export default function EffectSelector() {
  const { visualEffect, setVisualEffect } = useTest();
  const { theme } = useTheme();

  const effects = [
    { id: "ripple", label: "Ripple" },
    { id: "rocket", label: "Rocket" },
    { id: "fire",   label: "Fire" },
    { id: "none",   label: "Off" },
  ];

  return (
    <Stack direction="row" spacing={3} sx={{ mb: 2, justifyContent: 'center' }}>
      {effects.map((fx) => (
        <span
          key={fx.id}
          onClick={() => setVisualEffect(fx.id)}
          style={{
            cursor: "pointer",
            fontWeight: visualEffect === fx.id ? "bold" : "normal",
            color: visualEffect === fx.id ? theme.caret : theme.textTyped,
            opacity: visualEffect === fx.id ? 1 : 0.5,
            transition: "all 0.2s",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          {fx.label}
        </span>
      ))}
    </Stack>
  );
}