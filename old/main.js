// main.js
import { createGameEngine } from "./engine.js";

const container = document.getElementById("game-container");
const tileLayer = document.getElementById("tile-layer");
const startBtn = document.getElementById("btn-start");
const startMenu = document.getElementById("start-menu");
const scoreEl = document.getElementById("score");

const CONFIG = {
  lanes: ["a", "s", "d", "f"],
  tileHeight: 120,
  baseSpeed: 300,
  gameHeight: container.clientHeight
};

const engine = createGameEngine(CONFIG);

engine.on("onSpawnTile", tile => {
  const el = document.createElement("div");
  el.className = "tile";

  const laneWidth = 100 / CONFIG.lanes.length;
  el.style.width = `${laneWidth * tile.letters.length}%`;
  el.style.left = "0%";

  tile.letters.forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "tile-letter";
    span.innerText = ch.toUpperCase();
    span.style.width = `${100 / tile.letters.length}%`;
    el.appendChild(span);
  });

  tile.el = el;
  tileLayer.appendChild(el);
});

engine.on("onHit", tile => {
  tile.el.remove();
});

engine.on("onMiss", tile => {
  tile.el.classList.add("missed");
});

engine.on("onStateChange", state => {
  scoreEl.innerText = state.score;
});

let last = performance.now();
function loop(now) {
  const dt = now - last;
  last = now;

  engine.update(dt);

  engine.getTiles().forEach(tile => {
    tile.el.style.transform = `translateY(${tile.y}px)`;
  });

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", e => {
  engine.handleKey(e.key.toLowerCase());
});

startBtn.onclick = () => {
  startMenu.classList.add("hidden");
  engine.start();
  engine.spawnWord("flow");
  engine.spawnWord("beat");
  last = performance.now();
  requestAnimationFrame(loop);
};
