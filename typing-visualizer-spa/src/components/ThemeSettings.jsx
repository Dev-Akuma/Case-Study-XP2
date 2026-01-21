import { Stack, Typography, Box } from "@mui/material";
// IMPORTANT: Make sure you installed this: npm install react-colorful
import { HexColorPicker } from "react-colorful"; 
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
          opacity: 0.7,
          letterSpacing: "0.1em",
          mb: 1.5,
          display: "block",
          textTransform: "uppercase",
          fontWeight: 600,
          fontSize: "0.75rem"
        }}
      >
        {label}
      </Typography>

      {/* Custom styling for the color picker to make it look cleaner.
        You can remove the sx prop if you prefer the default look.
      */}
      <Box sx={{ "& .react-colorful": { width: "100%", height: "150px" } }}>
        <HexColorPicker color={value} onChange={onChange} />
      </Box>
      
      {/* Optional: Show Hex Code below picker */}
      <Typography 
        variant="caption" 
        sx={{ 
            display: 'block', 
            mt: 1, 
            opacity: 0.5, 
            fontFamily: 'monospace' 
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}