import { useEffect, useRef, useState, useMemo } from "react";
import { useTest } from "../context/TestContext";
import { useTheme } from "../context/ThemeContext";

// Simple word list for testing
const WORDS = [
  "flow", "focus", "typing", "mind", "clarity", "speed", "accuracy",
  "balance", "rhythm", "tempo", "water", "logic", "create", "system",
  "pixel", "code", "debug", "react", "component", "state", "effect"
];

function generateText(count = 50) {
  return Array.from({ length: count }, () =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  ).join(" ");
}

// FIX: Ensure 'export default' is here
export default function TextDisplay() {
  const { theme } = useTheme();
  
  // 1. Get recordInput from Context (Critical for Stats)
  const { startTest, timeLeft, recordInput } = useTest();

  const [text, setText] = useState(generateText());
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const startedRef = useRef(false);
  const comboRef = useRef(0);
  
  // Refs for scrolling logic
  const containerRef = useRef(null);
  const activeCharRef = useRef(null);

  // Extend text (Infinite Scroll)
  useEffect(() => {
    if (index > text.length - 20) {
      setText((t) => t + " " + generateText(25));
    }
  }, [index, text.length]);

  // Auto-Scroll (Typewriter Mode)
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const char = activeCharRef.current;
      
      const topOffset = char.offsetTop - container.offsetTop;
      const midPoint = container.clientHeight / 2 - 20; 

      container.scrollTo({
        top: topOffset - midPoint,
        behavior: "smooth"
      });
    }
  }, [index]); 

  // Typing Logic
  useEffect(() => {
    function onKey(e) {
      if (timeLeft === 0) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 && e.key !== "Backspace") return;

      if (!startedRef.current) {
        startTest();
        startedRef.current = true;
      }

      if (e.key === "Backspace") {
        if (index > 0) {
          setIndex((i) => i - 1);
        }
        return;
      }

const expected = text[index];

  if (e.key === expected) {
    comboRef.current += 1;
    setIndex((i) => i + 1);
    recordInput(true);

    // --- NEW LOGIC: Trigger Ripple on Word Complete ---
    // Check if the typed character was a space (end of word)
    if (expected === " ") {
      
      // 1. Find the caret element visually
      // We use the activeCharRef because that's where the cursor currently IS.
      const caretElement = activeCharRef.current;

      if (caretElement) {
        // 2. Get screen coordinates
        const rect = caretElement.getBoundingClientRect();
        
        // 3. Dispatch the event to EffectsCanvas
        window.dispatchEvent(
          new CustomEvent("typing:ripple", {
            detail: {
              // Center the ripple on the character
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            }
          })
        );
      }
    }
  }
      // Incorrect Key
      else {
        comboRef.current = 0; 
        setErrors((prev) => ({ ...prev, [index]: true }));
        
        // CRITICAL: Send data to Context
        recordInput(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, text, timeLeft, startTest, recordInput]);

  const wordsArray = useMemo(() => text.split(" "), [text]);
  let globalCharIndex = 0;

  return (
    <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* Fade Masks */}
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

      {/* Main Container */}
      <div
        ref={containerRef}
        style={{
          height: "40vh",
          overflow: "hidden",
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
          const wordStartIndex = globalCharIndex;
          globalCharIndex += word.length + 1; 

          return (
            <Word 
              key={`${wIdx}-${wordStartIndex}`} 
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

// Sub-component (Needs no export, just local helper)
const Word = ({ word, startIndex, currentIndex, errors, theme, activeCharRef }) => {
  const chars = word.split("");
  chars.push(" "); 

  return (
    <span style={{ display: "inline-block", marginRight: "0" }}>
      {chars.map((char, localIdx) => {
        const globalIdx = startIndex + localIdx;
        const isTyped = globalIdx < currentIndex;
        const isCurrent = globalIdx === currentIndex;
        const isError = errors[globalIdx];

        let color = theme.textUpcoming;
        if (isTyped) color = theme.textTyped;
        if (isError) color = theme.textError;
        
        return (
          <span
            key={globalIdx}
            ref={isCurrent ? activeCharRef : null}
            style={{
              position: "relative",
              color: color,
              transition: "color 0.1s ease",
            }}
          >
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
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </span>
  );
};