import { Stack, Button } from "@mui/material"; // or whatever UI lib you use
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";

export default function DurationSelector() {
  const { duration, setDuration } = useTest(); // Get setDuration from context
  const { theme } = useTheme();

  const options = [15, 30, 60];

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      {options.map((sec) => (
        <span
          key={sec}
          onClick={() => setDuration(sec)} // <--- MUST call setDuration
          style={{
            cursor: "pointer",
            fontWeight: duration === sec ? "bold" : "normal",
            color: duration === sec ? theme.caret : theme.textTyped,
            opacity: duration === sec ? 1 : 0.5,
            transition: "all 0.2s"
          }}
        >
          {sec}s
        </span>
      ))}
    </Stack>
  );
}