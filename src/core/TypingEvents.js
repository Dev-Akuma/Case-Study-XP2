export function emitTypingEvent(type, payload) {
  window.dispatchEvent(
    new CustomEvent("typing:event", { detail: { type, payload } })
  );
}
