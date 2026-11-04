// In-memory frame cache for the house sequences, with a small LRU so memory stays bounded.
// Frames are Image objects created lazily: no network request until a frame is asked for.
import { SEQUENCES, IMG_EXT, ROOM_ADJACENCY, ROOM_CONNECTIONS } from './data';

const MAX_CACHED_SEQUENCES = 6; // Keep RAM usage bounded and predictable

export const pad4 = (n) => String(n).padStart(4, '0');

export function createFrameStore(getCurrentRoom) {
  const frameCache = {};
  const cacheAccessTimes = {};

  function pruneCache() {
    const keys = Object.keys(frameCache);
    if (keys.length <= MAX_CACHED_SEQUENCES) return;

    // Never evict entrance, current room connections, or current active sequence
    const protectedKeys = new Set(['entrance']);
    const adj = ROOM_ADJACENCY[getCurrentRoom()];
    if (adj) adj.forEach((k) => protectedKeys.add(k));

    const evictCandidates = keys
      .filter((k) => !protectedKeys.has(k))
      .sort((a, b) => (cacheAccessTimes[a] || 0) - (cacheAccessTimes[b] || 0));

    if (evictCandidates.length > 0) {
      const toEvict = evictCandidates[0];
      delete frameCache[toEvict];
      delete cacheAccessTimes[toEvict];
    }
  }

  function initSequenceFrames(key) {
    cacheAccessTimes[key] = Date.now();
    if (frameCache[key]) return frameCache[key];

    const seq = SEQUENCES[key];
    if (!seq) return [];

    const frames = [];
    const start = seq.start || 1;
    for (let i = 0; i < seq.count; i++) {
      const img = new Image();
      img._targetSrc = `${seq.folder}${seq.prefix}${pad4(start + i)}${IMG_EXT}`;
      frames.push(img);
    }

    frameCache[key] = frames;
    pruneCache();
    return frames;
  }

  function preloadSequence(key) {
    const frames = initSequenceFrames(key);
    frames.forEach((img) => {
      if (!img.src && img._targetSrc) img.src = img._targetSrc;
    });
    return frames;
  }

  // Load ONE frame of a sequence (negative idx counts from the end) without requesting the rest.
  // Used for room base frames so the first paint is not queued behind unrelated downloads.
  function getSequenceFrame(key, idx) {
    const frames = initSequenceFrames(key);
    if (!frames || frames.length === 0) return null;
    const img = frames[idx < 0 ? frames.length + idx : idx];
    if (!img) return null;
    if (!img.src && img._targetSrc) img.src = img._targetSrc;
    return img;
  }

  // Frame indices (0-based, in playback order) that a transition leaving `room` plays first.
  // Reverse connections play their sequence backwards, so their "head" is the end of the sequence.
  function transitionHeadIndices(room, seqKey, n) {
    const seq = SEQUENCES[seqKey];
    if (!seq) return [];
    let reverse = false;
    for (const key in ROOM_CONNECTIONS) {
      if (key.indexOf(room + '-') === 0 && ROOM_CONNECTIONS[key].seq === seqKey) {
        reverse = ROOM_CONNECTIONS[key].reverse;
        break;
      }
    }
    const count = Math.min(n, seq.count);
    const out = [];
    for (let i = 0; i < count; i++) out.push(reverse ? seq.count - 1 - i : i);
    return out;
  }

  // The single frame that represents a room.
  function getRoomBaseFrame(room) {
    if (room === 'living') return getSequenceFrame('living_bedroom', 0);
    if (room === 'bedroom') return getSequenceFrame('living_bedroom', -1);
    if (room === 'kitchen') return getSequenceFrame('living_kitchen', -1);
    if (room === 'poolroom') return getSequenceFrame('living_pool', -1);
    if (room === 'office') return getSequenceFrame('living_office', -1);
    return null;
  }

  return {
    cache: frameCache,
    initSequenceFrames,
    preloadSequence,
    getSequenceFrame,
    transitionHeadIndices,
    getRoomBaseFrame,
  };
}
