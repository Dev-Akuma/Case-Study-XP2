import { useState, useEffect } from "react";
// 1. IMPORT useTest SO WE CAN ACCESS TYPING STATS
import { TestProvider, useTest } from "./context/TestContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import TextDisplay from "./components/TextDisplay";
import StatsBar from "./components/StatsBar";
import TimerBar from "./components/TimerBar";
import DurationSelector from "./components/DurationSelector";
import ResultsOverlay from "./components/ResultsOverlay";
import EffectsCanvas from "./effects/EffectsCanvas";

import { Drawer, IconButton, Box, Typography, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeSettings from "./components/ThemeSettings";

/* ---------- INNER APP COMPONENT ---------- */
function AppContent() {
  const { theme } = useTheme();
  
  // 2. GET TEST DATA FROM CONTEXT
  // We need totalTyped and totalErrors to calculate WPM
  const { timeLeft, totalTyped, totalErrors, duration } = useTest();
  
  const [open, setOpen] = useState(false);
  const [finalStats, setFinalStats] = useState({ wpm: 0, accuracy: 0, errors: 0 });

  // 3. CALCULATE RESULTS WHEN TEST ENDS
  useEffect(() => {
    if (timeLeft === 0) {
      // Safety Checks: Default to 0 or 30 if values are missing to prevent "NaN"
      const safeTyped = totalTyped || 0;
      const safeErrors = totalErrors || 0;
      const safeDuration = duration || 30; 

      const timeInMinutes = safeDuration / 60; 
      
      // Prevent division by zero
      const grossWPM = timeInMinutes > 0 
        ? Math.round((safeTyped / 5) / timeInMinutes) 
        : 0;
      
      const accuracy = safeTyped > 0 
        ? Math.round(((safeTyped - safeErrors) / safeTyped) * 100) 
        : 0;

      setFinalStats({
        wpm: grossWPM,
        accuracy: accuracy,
        errors: safeErrors
      });
    }
  }, [timeLeft, totalTyped, totalErrors, duration]);

  return (
    <div
      className="vh-100"
      style={{
        background: theme.background,
        color: theme.textTyped,
        transition: "background 0.25s ease",
        position: "relative",
        overflow: "hidden" // Prevents scrollbars from effects
      }}
    >
      <EffectsCanvas />

      {/* SETTINGS BUTTON */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <SettingsIcon sx={{ color: "#e5e7eb" }} />
      </IconButton>

      {/* SETTINGS DRAWER */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 320, height: "100%", bgcolor: "#020617", color: "#e5e7eb", p: 3 }}>
          <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: "0.2em" }}>
            Customization
          </Typography>
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <ThemeSettings />
        </Box>
      </Drawer>

      {/* MAIN UI */}
      <div className="container-fluid h-100 d-flex flex-column justify-content-center">
        
        {/* Top Section: Time & Duration */}
        <div className="d-flex flex-column align-items-center mb-5" style={{gap: "1rem"}}>
           <DurationSelector />
           <TimerBar />
        </div>
        
        {/* Middle Section: Typing Area */}
        <div className="my-2">
           <TextDisplay />
        </div>

        {/* Bottom Section: Live Stats */}
        <StatsBar />

        {/* 4. PASS THE CALCULATED STATS TO THE OVERLAY */}
        <ResultsOverlay stats={finalStats} />
      </div>
    </div>
  );
}

/* ---------- MAIN PROVIDER WRAPPER ---------- */
export default function App() {
  return (
    <ThemeProvider>
      <TestProvider>
        <AppContent />
      </TestProvider>
    </ThemeProvider>
  );
}