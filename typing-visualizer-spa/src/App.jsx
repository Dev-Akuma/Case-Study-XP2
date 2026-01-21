import { useState, useEffect } from "react";
import { TestProvider, useTest } from "./context/TestContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import TextDisplay from "./components/TextDisplay";
import StatsBar from "./components/StatsBar";
import TimerBar from "./components/TimerBar";
import DurationSelector from "./components/DurationSelector";
import EffectsCanvas from "./effects/EffectsCanvas";
import ResultsPage from "./components/ResultsPage"; // Import new page
import ThemeSettings from "./components/ThemeSettings";

import { Drawer, IconButton, Box, Typography, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

/* ---------- INNER APP CONTENT ---------- */
function AppContent() {
  const { theme } = useTheme();
  const { timeLeft } = useTest(); // We only need to check time here
  const [openSettings, setOpenSettings] = useState(false);

  // Sync Body Background
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.transition = "background-color 0.25s ease";
  }, [theme.background]);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: theme.textTyped,
        position: "relative",
        overflowX: "hidden"
      }}
    >
      {/* 1. BACKGROUND EFFECTS */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <EffectsCanvas />
      </div>

      {/* 2. SETTINGS BUTTON */}
      <IconButton
        onClick={() => setOpenSettings(true)}
        sx={{
          position: "fixed", top: 16, left: 16, zIndex: 1300,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <SettingsIcon sx={{ color: "#e5e7eb" }} />
      </IconButton>

      {/* 3. SETTINGS DRAWER */}
      <Drawer anchor="left" open={openSettings} onClose={() => setOpenSettings(false)}>
        <Box sx={{ width: 320, height: "100%", bgcolor: "#020617", color: "#e5e7eb", p: 3 }}>
          <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: "0.2em" }}>
            Customization
          </Typography>
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <ThemeSettings />
        </Box>
      </Drawer>

      {/* 4. MAIN CONTENT SWITCHER */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* LOGIC: IF Time is 0, Show Results. ELSE Show Test */}
        {timeLeft === 0 ? (
          <ResultsPage />
        ) : (
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center mb-5" style={{gap: "1rem"}}>
              <DurationSelector />
              <TimerBar />
            </div>
            
            <div className="my-2">
              <TextDisplay />
            </div>

            <StatsBar />
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- PROVIDER WRAPPER ---------- */
export default function App() {
  return (
    <ThemeProvider>
      <TestProvider>
        <AppContent />
      </TestProvider>
    </ThemeProvider>
  );
}