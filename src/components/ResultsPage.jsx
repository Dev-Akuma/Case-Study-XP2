import { Box, Button, Typography, Stack, Container } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useTest } from "../context/TestContext";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ResultsPage() {
  const { theme } = useTheme();
  const { resetTest, totalTyped, totalErrors, duration, history } = useTest();

  // Calculate Final Stats
  const timeInMinutes = duration / 60;
  const wpm = Math.round((totalTyped / 5) / timeInMinutes);
  const accuracy = totalTyped > 0 
    ? Math.round(((totalTyped - totalErrors) / totalTyped) * 100) 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      {/* 1. MAIN STATS HEADER */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h6" sx={{ color: theme.textTyped, opacity: 0.5, mb: 1 }}>
          TEST COMPLETE
        </Typography>
        <Typography 
          variant="h1" 
          sx={{ color: theme.caret, fontSize: "6rem", fontWeight: 700, lineHeight: 1 }}
        >
          {wpm}
        </Typography>
        <Typography variant="h5" sx={{ color: theme.textTyped, opacity: 0.8 }}>
          WPM
        </Typography>
      </Box>

      {/* 2. DETAILED STATS ROW */}
      <Stack direction="row" justifyContent="center" spacing={8} sx={{ mb: 6 }}>
        <StatBox label="Accuracy" value={`${accuracy}%`} theme={theme} />
        <StatBox label="Characters" value={`${totalTyped}/${totalErrors}`} theme={theme} />
        <StatBox label="Time" value={`${duration}s`} theme={theme} />
      </Stack>

      {/* 3. CHART SECTION */}
      <Box sx={{ height: 300, width: "100%", mb: 6 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.textTyped} opacity={0.1} />
            <XAxis 
              dataKey="time" 
              stroke={theme.textTyped} 
              opacity={0.5} 
              label={{ value: 'Seconds', position: 'insideBottomRight', offset: -5, fill: theme.textTyped }}
            />
            <YAxis 
              stroke={theme.textTyped} 
              opacity={0.5} 
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: theme.background, borderColor: theme.textTyped }}
              itemStyle={{ color: theme.caret }}
            />
            <Line 
              type="monotone" 
              dataKey="wpm" 
              stroke={theme.caret} 
              strokeWidth={3} 
              dot={{ r: 4, fill: theme.background, stroke: theme.caret, strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 4. RESTART BUTTON */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          onClick={resetTest}
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{
            color: theme.textUpcoming,
            borderColor: theme.textTyped,
            px: 4, py: 1.5,
            fontSize: "1.1rem",
            "&:hover": { borderColor: theme.caret, background: "transparent", color: theme.caret }
          }}
        >
          Restart Test
        </Button>
      </Box>
    </Container>
  );
}

function StatBox({ label, value, theme }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ color: theme.textUpcoming, fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: theme.textTyped, opacity: 0.6 }}>
        {label}
      </Typography>
    </Box>
  );
}