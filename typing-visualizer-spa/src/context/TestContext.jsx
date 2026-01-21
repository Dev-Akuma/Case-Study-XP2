import { createContext, useContext, useRef, useState } from "react";

const TestContext = createContext(null);

export function TestProvider({ children }) {
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("timed"); // timed | flow

  const timerRef = useRef(null);

  function startTest() {
    if (running) return;
    setRunning(true);

    if (mode === "flow") return;

    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function resetTest() {
    clearInterval(timerRef.current);
    setRunning(false);
    setTimeLeft(duration);
  }

  return (
    <TestContext.Provider
      value={{
        duration,
        setDuration,
        timeLeft,
        running,
        startTest,
        resetTest,
        mode,
        setMode,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  return useContext(TestContext);
}
