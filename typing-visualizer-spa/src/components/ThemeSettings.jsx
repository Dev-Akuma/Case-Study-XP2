import { Stack, Typography, Box } from "@mui/material";
// Correct import source
import { HexColorPicker } from "react-colorful";

// Assuming this context exists in your project
import { useTheme } from "../context/ThemeContext";

export default function ThemeSettings() {
  const { theme, updateTheme } = useTheme();

  return (
    <Stack spacing={4}>
      <ColorControl
        label="Background"
        value={theme.background}
        onChange={(v) => updateTheme("background", v)}
      />
      <ColorControl
        label="Typed Text"
        value={theme.textTyped}
        onChange={(v) => updateTheme("textTyped", v)}
      />
      <ColorControl
        label="Upcoming Text"
        value={theme.textUpcoming}
        onChange={(v) => updateTheme("textUpcoming", v)}
      />
      <ColorControl
        label="Error Text"
        value={theme.textError}
        onChange={(v) => updateTheme("textError", v)}
      />
      <ColorControl
        label="Caret"
        value={theme.caret}
        onChange={(v) => updateTheme("caret", v)}
      />
    </Stack>
  );
}

function ColorControl({ label, value, onChange }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          opacity: 0.65,
          letterSpacing: "0.14em",
          mb: 1.5,
          display: "block",
          textTransform: "uppercase",
          fontWeight: "bold"
        }}
      >
        {label}
      </Typography>

      {/* react-colorful is 100% width by default, 
         wrapping it allows you to control the size if needed.
      */}
      <Box sx={{ "& .react-colorful": { width: "100%" } }}>
        <HexColorPicker color={value} onChange={onChange} />
      </Box>
    </Box>
  );
}