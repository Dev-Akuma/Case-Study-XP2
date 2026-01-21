import { createContext, useContext, useState, useEffect, useRef } from "react";

// 1. Create the Context
const TestContext = createContext();

// 2. Export the Custom Hook (Named Export)
export function useTest() {
  return useContext(TestContext);
}

// 3. Export the Provider (Named Export)
export function TestProvider({ children }) {
  // --- STATE ---
  const [duration, setDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);

  // Stats
  const [totalTyped, setTotalTyped] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [history, setHistory] = useState([]);

  // Timestamps
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Refs (for intervals and tracking values without re-renders)
  const timerRef = useRef(null);
  const graphTimerRef = useRef(null);
  const totalTypedRef = useRef(0);

  // Sync ref with state so the interval can read fresh data
  useEffect(() => {
    totalTypedRef.current = totalTyped;
  }, [totalTyped]);

  // --- ACTIONS ---
  const startTest = () => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      setEndTime(null);
      setTotalTyped(0);
      setTotalErrors(0);
      setHistory([{ time: 0, wpm: 0 }]); // Init graph
    }
  };

  const recordInput = (isCorrect) => {
    if (!isActive) startTest();

    setTotalTyped((prev) => prev + 1);
    if (!isCorrect) {
      setTotalErrors((prev) => prev + 1);
    }
  };

  const resetTest = () => {
    setIsActive(false);
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(duration);
    setTotalTyped(0);
    setTotalErrors(0);
    setHistory([]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (graphTimerRef.current) clearInterval(graphTimerRef.current);
  };

// ... inside TestProvider ...

  // FIX: Manually reset using 'newTime' to avoid stale state issues
  const updateDuration = (newTime) => {
    // 1. Stop the test immediately
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (graphTimerRef.current) clearInterval(graphTimerRef.current);

    // 2. Update all states with the NEW time
    setDuration(newTime);
    setTimeLeft(newTime); // <--- This forces the timer to 30s instantly
    
    // 3. Reset stats
    setStartTime(null);
    setEndTime(null);
    setTotalTyped(0);
    setTotalErrors(0);
    setHistory([]);
  };

  // ... rest of the file ...

  // --- MAIN TIMER LOGIC ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Test Finished
      setIsActive(false);
      setEndTime(Date.now());
      clearInterval(timerRef.current);
      clearInterval(graphTimerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // --- GRAPH RECORDER LOGIC ---
  useEffect(() => {
    if (isActive && startTime) {
      graphTimerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSec = Math.floor((now - startTime) / 1000);
        const elapsedMin = elapsedSec / 60;

        if (elapsedMin > 0) {
          // Use Ref to get current count without restarting interval
          const currentTyped = totalTypedRef.current;
          
          // Calculate Gross WPM for the graph point
          const currentWpm = Math.round((currentTyped / 5) / elapsedMin);
          
          setHistory((prev) => [
            ...prev,
            { time: elapsedSec, wpm: currentWpm }
          ]);
        }
      }, 1000); // Run exactly every 1 second
    }
    return () => clearInterval(graphTimerRef.current);
  }, [isActive, startTime]);

  // 4. Return the Provider
  return (
    <TestContext.Provider
      value={{
        timeLeft,
        duration,
        isActive,
        totalTyped,
        totalErrors,
        history,
        startTime,
        startTest,
        resetTest,
        setDuration: updateDuration,
        recordInput,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}