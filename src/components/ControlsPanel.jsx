import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";

export default function ControlsPanel() {
  const [mode, setMode] = useState("burst");

  useEffect(() => {
    window.setVisualMode?.(mode);
  }, [mode]);

  return (
    <div className="d-flex justify-content-center mt-4 opacity-75">
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, v) => v && setMode(v)}
        size="small"
      >
        <ToggleButton value="burst">burst</ToggleButton>
        <ToggleButton value="flow" disabled>
          flow
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
