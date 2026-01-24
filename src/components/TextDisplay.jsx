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

export default function TextDisplay() {
  const { theme } = useTheme();
  
  // 1. Get recordInput from Context (Critical for Stats)
  const { startTest, timeLeft, recordInput } = useTest();

  const [text, setText] = useState(generateText());
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const startedRef = useRef(false);
  const comboRef = useRef(0);
  
  // Refs for scrolling logic and finding character position
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

      // --- CORRECT KEY ---
      if (e.key === expected) {
        comboRef.current += 1;
        
        // 1. Capture the visual position of the character we just typed
        // 'activeCharRef.current' points to the active character span
        const charElement = activeCharRef.current;
        
        // 2. Dispatch generic Visual Event (Rocket/Fire/Ripple)
        // We dispatch this on EVERY correct key so rockets/fire work on letters
        if (charElement) {
            const rect = charElement.getBoundingClientRect();
            window.dispatchEvent(
                new CustomEvent("typing:visual", {
                    detail: {
                        // Center of the character
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        key: e.key // Pass the key (so canvas knows if it's spacebar or letter)
                    }
                })
            );
        }

        setIndex((i) => i + 1);
        
        // 3. Update Stats
        recordInput(true);
      } 
      
      // --- INCORRECT KEY ---
      else {
        comboRef.current = 0; 
        setErrors((prev) => ({ ...prev, [index]: true }));
        
        // Update Stats (Error)
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
      
      {/* Top/Bottom Fade Masks */}
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

// Sub-component for performance optimization
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