import { useState, useEffect } from "react";
import { TestProvider, useTest } from "./context/TestContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Components
import TextDisplay from "./components/TextDisplay";
import StatsBar from "./components/StatsBar";
import TimerBar from "./components/TimerBar";
import DurationSelector from "./components/DurationSelector";
import EffectSelector from "./components/EffectSelector"; // <--- NEW IMPORT
import ResultsPage from "./components/ResultsPage";
import ThemeSettings from "./components/ThemeSettings";
import EffectsCanvas from "./effects/EffectsCanvas";

// MUI
import { Drawer, IconButton, Box, Typography, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

/* ---------- INNER APP CONTENT ---------- */
function AppContent() {
  const { theme } = useTheme();
  const { timeLeft } = useTest(); 
  const [openSettings, setOpenSettings] = useState(false);

  // Sync Body Background
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.transition = "background-color 0.25s ease";
    document.body.style.color = theme.textTyped;
  }, [theme.background, theme.textTyped]);

  // Drawer width constant (used for calculating button position)
  const DRAWER_WIDTH = 320;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: theme.textTyped,
        position: "relative",
        overflowX: "hidden"
      }}
    >
      {/* BACKGROUND EFFECTS */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <EffectsCanvas />
      </div>

      {/* --- TOGGLE BUTTON --- */}
      <IconButton
        onClick={() => setOpenSettings((prev) => !prev)} 
        sx={{
          position: "fixed", 
          top: 16, 
          // Dynamic Position: Slides button when drawer opens
          left: openSettings ? `${DRAWER_WIDTH + 16}px` : "16px",
          
          transition: "left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          zIndex: 1400, 
          
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <SettingsIcon 
            sx={{ 
                color: "#e5e7eb",
                transition: "transform 0.3s ease",
                transform: openSettings ? "rotate(90deg)" : "rotate(0deg)"
            }} 
        />
      </IconButton>

      {/* --- SETTINGS DRAWER --- */}
      <Drawer 
        anchor="left" 
        open={openSettings} 
        onClose={() => setOpenSettings(false)}
      >
        <Box
          sx={{
            width: DRAWER_WIDTH, 
            height: "100%",
            bgcolor: "#020617",
            color: "#e5e7eb",
            p: 3,
            overflowY: "auto", 
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "rgba(0,0,0,0.1)" },
            "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.2)", borderRadius: "3px" }
          }}
        >
          <Typography
            variant="overline"
            sx={{ opacity: 0.7, letterSpacing: "0.2em", fontWeight: "bold" }}
          >
            Customization
          </Typography>

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <ThemeSettings />

          <Box sx={{ height: "40px" }} />
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT --- */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {timeLeft === 0 ? (
          <ResultsPage />
        ) : (
          <div className="container-fluid">
            {/* Controls Section */}
            <div className="d-flex flex-column align-items-center mb-5" style={{gap: "1rem"}}>
              <DurationSelector />
              {/* NEW: Effect Selector Added Here */}
              <EffectSelector /> 
              <TimerBar />
            </div>
            
            {/* Typing Area */}
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

export default function App() {
  return (
    <ThemeProvider>
      <TestProvider>
        <AppContent />
      </TestProvider>
    </ThemeProvider>
  );
}