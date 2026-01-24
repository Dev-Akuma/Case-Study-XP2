import { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";

export default function StatsBar() {
  const { theme } = useTheme();
  const { totalTyped, totalErrors, isActive, startTime } = useTest();
  
  // Local state for smooth WPM animation
  const [liveWpm, setLiveWpm] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        // Calculate exact time elapsed in minutes (e.g. 0.05 minutes)
        const elapsedMin = (now - startTime) / 60000;
        
        // Prevent division by zero or tiny numbers at start
        if (elapsedMin < 0.01) {
            setLiveWpm(0);
            return;
        }

        // --- NET WPM FORMULA ---
        // ( (TotalChars / 5) - Errors ) / Minutes
        // This penalizes errors so accuracy matters.
        const grossWPM = (totalTyped / 5) / elapsedMin;
        const netWPM = Math.max(0, grossWPM - (totalErrors / elapsedMin));
        
        setLiveWpm(Math.round(netWPM));

      }, 200); // Update 5 times a second for smoothness
    } else if (!isActive && !startTime) {
        setLiveWpm(0);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime, totalTyped, totalErrors]);

  const accuracy = totalTyped > 0 
    ? Math.round(((totalTyped - totalErrors) / totalTyped) * 100) 
    : 100;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 4,
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.2s"
      }}
    >
      <Stack direction="row" spacing={8}>
        
        <StatItem 
          label="WPM" 
          value={liveWpm} 
          theme={theme} 
        />

        <StatItem 
          label="Accuracy" 
          value={accuracy + "%"} 
          theme={theme} 
        />

        <StatItem 
          label="Errors" 
          value={totalErrors} 
          theme={theme} 
          isError={totalErrors > 0} 
        />

      </Stack>
    </Box>
  );
}

function StatItem({ label, value, theme, isError }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: isError ? "#ef4444" : theme.caret, // Explicit red for errors
          lineHeight: 1,
          mb: 0.5
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: theme.textTyped,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "0.75rem",
          opacity: 0.6
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}