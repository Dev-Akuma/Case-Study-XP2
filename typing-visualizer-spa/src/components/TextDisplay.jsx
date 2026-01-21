import { useEffect, useRef, useState, useMemo } from "react";
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";
import { Box } from "@mui/material"; // Or use a simple div if you prefer

const WORDS = [
  "flow", "focus", "typing", "mind", "clarity", "speed", "accuracy",
  "balance", "rhythm", "tempo", "water", "logic", "create", "system"
];

function generateText(count = 50) {
  return Array.from({ length: count }, () =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  ).join(" ");
}

export default function TextDisplay() {
  const { theme } = useTheme();
  const { startTest, timeLeft } = useTest();

  const [text, setText] = useState(generateText());
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const startedRef = useRef(false);
  const comboRef = useRef(0);
  const lastTypeTime = useRef(Date.now());
  
  // Refs for scrolling logic
  const containerRef = useRef(null);
  const activeCharRef = useRef(null);

  // 1. Extend text (Infinite Scroll)
  useEffect(() => {
    if (index > text.length - 20) {
      setText((t) => t + " " + generateText(25));
    }
  }, [index, text.length]);

  // 2. Auto-Scroll to keep active line centered ("Typewriter Mode")
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const char = activeCharRef.current;
      
      // Calculate offset to center the line
      const topOffset = char.offsetTop - container.offsetTop;
      const midPoint = container.clientHeight / 2 - 20; // 20px adjustment for line height

      container.scrollTo({
        top: topOffset - midPoint,
        behavior: "smooth"
      });
    }
  }, [index]); // Runs whenever cursor moves

  // 3. Typing Logic
  useEffect(() => {
    function onKey(e) {
      if (timeLeft === 0) return;
      
      // Ignore modifier keys to prevent blocking browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 && e.key !== "Backspace") return;

      if (!startedRef.current) {
        startTest();
        startedRef.current = true;
      }

      lastTypeTime.current = Date.now();

      // Backspace Logic
      if (e.key === "Backspace") {
        if (index > 0) {
          setIndex((i) => i - 1);
          // Optional: Clear error on backspace?
          // setErrors(prev => { const n = {...prev}; delete n[index-1]; return n; });
        }
        return;
      }

      const expected = text[index];

      // Correct Key
      if (e.key === expected) {
        comboRef.current += 1;
        setIndex((i) => i + 1);

        // Fire events for other components (stats/sound)
        window.dispatchEvent(new CustomEvent("typing:stat", { detail: { correct: true } }));
        
        if (expected === " ") {
           // Word completed
        }
      } 
      // Incorrect Key
      else {
        comboRef.current = 0; // Punishing reset for flow
        setErrors((prev) => ({ ...prev, [index]: true }));
        window.dispatchEvent(new CustomEvent("typing:stat", { detail: { correct: false } }));
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, text, timeLeft, startTest]);

  // Memoize words to prevent recalculating the split on every render
  const wordsArray = useMemo(() => text.split(" "), [text]);
  
  // Helper to map global index to word/char chunks
  // We reconstruct the UI by iterating words, keeping track of a running global index.
  let globalCharIndex = 0;

  return (
    <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* Top/Bottom Fade Masks for Focus */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "60px",
        background: `linear-gradient(to bottom, ${theme.background} 10%, transparent)`,
        zIndex: 10, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
        background: `linear-gradient(to top, ${theme.background} 10%, transparent)`,
        zIndex: 10, pointerEvents: "none"
      }} />

      {/* Main Text Container */}
      <div
        ref={containerRef}
        style={{
          height: "45vh", // Fixed height viewport
          overflow: "hidden", // Hide scrollbars
          padding: "2rem 1rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "1.6rem",
          lineHeight: "1.8",
          userSelect: "none",
          cursor: "default",
          position: "relative"
        }}
      >
        {wordsArray.map((word, wIdx) => {
          // Identify current word range
          const wordStartIndex = globalCharIndex;
          const wordEndIndex = wordStartIndex + word.length;
          // Include the space after the word in the count
          globalCharIndex = wordEndIndex + 1; 

          return (
            <Word 
              key={`${wIdx}-${wordStartIndex}`} // Unique key
              word={word}
              startIndex={wordStartIndex}
              currentIndex={index}
              errors={errors}
              theme={theme}
              activeCharRef={activeCharRef}
            />
          );
        })}
      </div>
    </div>
  );
}

// Sub-component to optimize rendering. 
// React handles changes to small components better than one massive list of spans.
const Word = ({ word, startIndex, currentIndex, errors, theme, activeCharRef }) => {
  // Render letters + the following space
  const chars = word.split("");
  chars.push(" "); // Add space explicitly

  return (
    <span style={{ display: "inline-block", marginRight: "0" }}>
      {chars.map((char, localIdx) => {
        const globalIdx = startIndex + localIdx;
        const isTyped = globalIdx < currentIndex;
        const isCurrent = globalIdx === currentIndex;
        const isError = errors[globalIdx];

        // Determine Color
        let color = theme.textUpcoming;
        if (isTyped) color = theme.textTyped;
        if (isError) color = theme.textError;
        
        // Opacity for "Focus Mode" (optional: fade out far text)
        // const distance = Math.abs(globalIdx - currentIndex);
        // const opacity = distance > 50 ? 0.3 : 1;

        return (
          <span
            key={globalIdx}
            ref={isCurrent ? activeCharRef : null}
            style={{
              position: "relative",
              color: color,
              opacity: 1, // change to opacity var if using focus mode
              transition: "color 0.1s ease",
            }}
          >
            {/* The Caret: Rendered as a pseudo-element logic or absolute div */}
            {isCurrent && (
              <span
                style={{
                  position: "absolute",
                  left: "-2px",
                  top: "10%",
                  bottom: "10%",
                  width: "2px",
                  backgroundColor: theme.caret,
                  animation: "blink 1s infinite",
                  boxShadow: `0 0 8px ${theme.caret}`,
                  borderRadius: "1px"
                }}
              />
            )}
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      
      {/* Global Styles for blinking */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};