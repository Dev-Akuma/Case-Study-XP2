// engine.js
export function createGameEngine(config) {
  const state = {
    isPlaying: false,
    score: 0,
    combo: 0,
    tiles: []
  };

  const callbacks = {
    onSpawnTile: () => {},
    onHit: () => {},
    onMiss: () => {},
    onStateChange: () => {}
  };

  function start() {
    state.isPlaying = true;
    state.score = 0;
    state.combo = 0;
    state.tiles = [];
    callbacks.onStateChange({ ...state });
  }

  function stop() {
    state.isPlaying = false;
  }

  function spawnWord(word) {
    if (!state.isPlaying) return;

    const letters = word.toLowerCase().split("");
    if (letters.length > config.lanes.length) return;

    const tile = {
      letters,
      progress: 0,
      startLane: 0,
      y: -config.tileHeight,
      hit: false,
      missed: false
    };

    state.tiles.push(tile);
    callbacks.onSpawnTile(tile);
  }

  function update(deltaTime) {
    if (!state.isPlaying) return;

    const speed = config.baseSpeed * (deltaTime / 1000);

    for (let i = state.tiles.length - 1; i >= 0; i--) {
      const tile = state.tiles[i];
      tile.y += speed;

      if (tile.hit) {
        state.tiles.splice(i, 1);
        continue;
      }

      if (tile.y > config.gameHeight) {
        state.tiles.splice(i, 1);
        state.combo = 0;
        callbacks.onMiss(tile);
      }
    }

    callbacks.onStateChange({ ...state });
  }

  function handleKey(key) {
    if (!state.isPlaying) return;

    const tile = state.tiles[0];
    if (!tile) return;

    const expected = tile.letters[tile.progress];
    if (key !== expected) {
      state.combo = 0;
      callbacks.onMiss(tile);
      return;
    }

    tile.progress++;
    state.combo++;
    state.score += 100;

    if (tile.progress === tile.letters.length) {
      tile.hit = true;
      callbacks.onHit(tile);
    }
  }

  function getTiles() {
    return state.tiles;
  }

  function on(event, fn) {
    callbacks[event] = fn;
  }

  return {
    start,
    stop,
    spawnWord,
    update,
    handleKey,
    getTiles,
    on
  };
}
