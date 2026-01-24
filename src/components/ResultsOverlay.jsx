import { useEffect, useRef } from "react";
import { Box, Typography, Button, Stack, Fade } from "@mui/material";
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";
import RefreshIcon from "@mui/icons-material/Refresh"; // Optional: npm install @mui/icons-material

export default function ResultsOverlay({ stats }) {
  const { timeLeft, resetTest } = useTest();
  const { theme } = useTheme();
  const restartButtonRef = useRef(null);

  const isFinished = timeLeft === 0;

  // UX: Auto-focus the restart button when results appear
  // allows user to just hit "Enter" or "Space" to go again
  useEffect(() => {
    if (isFinished && restartButtonRef.current) {
      setTimeout(() => restartButtonRef.current.focus(), 100);
    }
  }, [isFinished]);

  // UX: Allow "Tab" to restart quickly
  useEffect(() => {
    if (!isFinished) return;
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, resetTest]);

  if (!isFinished) return null;

  return (
    <Fade in={isFinished} timeout={500}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 10, 15, 0.6)", // Dark overlay
          backdropFilter: "blur(8px)", // The "Glass" effect
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            background: theme.background, // Match user theme
            borderRadius: "16px",
            p: 5,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: `1px solid ${theme.textTyped}20`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Header */}
          <Typography
            variant="h6"
            sx={{
              color: theme.textTyped,
              opacity: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              mb: 2,
              fontSize: "0.9rem",
            }}
          >
            Test Complete
          </Typography>

          {/* Main Stat: WPM */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                color: theme.caret,
                fontWeight: 700,
                fontSize: "5rem",
                lineHeight: 1,
                mb: 1,
              }}
            >
              {stats.wpm}
            </Typography>
            <Typography variant="h5" sx={{ color: theme.textTyped, opacity: 0.8 }}>
              WPM
            </Typography>
          </Box>

          {/* Secondary Stats Grid */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={4}
            sx={{ mb: 5 }}
          >
            <StatBox label="Accuracy" value={`${stats.accuracy}%`} theme={theme} />
            <StatBox label="Errors" value={stats.errors} theme={theme} />
            <StatBox label="Time" value="30s" theme={theme} />
          </Stack>

          {/* Actions */}
          <Button
            ref={restartButtonRef}
            onClick={resetTest}
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              color: theme.textUpcoming,
              borderColor: theme.textTyped,
              opacity: 0.7,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "lowercase",
              fontFamily: "inherit",
              "&:hover": {
                opacity: 1,
                borderColor: theme.caret,
                background: "transparent",
              },
            }}
          >
            Restart (Tab)
          </Button>
        </Box>
      </Box>
    </Fade>
  );
}

// Helper sub-component for layout
function StatBox({ label, value, theme }) {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ color: theme.textUpcoming, fontWeight: "bold", mb: 0.5 }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: theme.textTyped, letterSpacing: "0.05em", opacity: 0.6 }}
      >
        {label}
      </Typography>
    </Box>
  );
}