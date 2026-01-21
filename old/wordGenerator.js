// wordGenerator.js
import { WORDS } from "./words.js";

export function getRandomWord(config) {
  const allowed = WORDS.filter(word => {
    if (word.length < config.minWordLength) return false;
    if (word.length > config.maxWordLength) return false;

    return [...word].every(ch =>
      config.lanes.includes(ch.toLowerCase())
    );
  });

  if (allowed.length === 0) return null;

  return allowed[Math.floor(Math.random() * allowed.length)];
}
