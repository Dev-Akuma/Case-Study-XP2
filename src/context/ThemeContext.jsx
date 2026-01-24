import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    background: "#020617",
    textTyped: "#f8fafc",
    textUpcoming: "#64748b",
    textError: "#ef4444",
    caret: "#f8fafc",
    accent: "#94a3b8",
  });

  function updateTheme(key, value) {
    setTheme((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* 🔴 THIS EXPORT IS WHAT WAS MISSING */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
