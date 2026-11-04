// Progressive background loading of the transitions that leave the current room.
// Loads in small, throttled batches; the transitions people use most from each room go first.
import { SEQUENCES, ROOM_ADJACENCY, ROOM_PRIORITY } from './data';

export const ROOM_READY_FRAMES = 24; // opening frames fetched first for the other transitions

export function createBackgroundQueue(store, isGateClosed) {
  const q = {
    _queue: [],
    _activeLoading: 0,
    _concurrency: 3,     // at most 3 images loading concurrently
    _gateConcurrency: 6, // ... or 6 while the post-intro interaction lock is waiting for them
    _isPaused: false,
    _hasStarted: false,
    _room: 'living',

    start(room) {
      if (this._hasStarted) return;
      this._hasStarted = true;
      this.reprioritize(room);
      this._pump();
    },

    pause() {
      this._isPaused = true;
    },

    resume() {
      this._isPaused = false;
      this._pump();
    },

    reprioritize(room) {
      this._room = room;
      // Queue ONLY the sequences reachable from this room. The set is small enough (<= 5) to fit
      // inside the frame cache, so nothing is evicted and re-queued.
      const adjacent = ROOM_ADJACENCY[room] || [];

      const pending = adjacent.filter((seqKey) => {
        if (!SEQUENCES[seqKey]) return false;
        const cached = store.cache[seqKey];
        return !(cached && cached.every((img) => img.complete && img.naturalWidth > 0));
      });

      const priority = (ROOM_PRIORITY[room] || []).filter((k) => pending.indexOf(k) !== -1);
      const others = pending.filter((k) => priority.indexOf(k) === -1);

      // Round 1: the priority transitions, one after another, each in playback order.
      const priorityQueue = [];
      priority.forEach((seqKey) => {
        store.transitionHeadIndices(room, seqKey, SEQUENCES[seqKey].count).forEach((i) => {
          priorityQueue.push({ seqKey, index: i + 1 });
        });
      });

      // Round 2: the opening frames of every other outgoing transition, interleaved.
      // Round 3: everything else.
      const heads = {};
      others.forEach((seqKey) => {
        heads[seqKey] = store.transitionHeadIndices(room, seqKey, ROOM_READY_FRAMES);
      });
      const headQueue = [];
      for (let i = 0; i < ROOM_READY_FRAMES; i++) {
        others.forEach((seqKey) => {
          if (i < heads[seqKey].length) headQueue.push({ seqKey, index: heads[seqKey][i] + 1 });
        });
      }
      const tailQueue = [];
      others.forEach((seqKey) => {
        const headSet = new Set(heads[seqKey]);
        for (let i = 1; i <= SEQUENCES[seqKey].count; i++) {
          if (!headSet.has(i - 1)) tailQueue.push({ seqKey, index: i });
        }
      });

      this._queue = priorityQueue.concat(headQueue, tailQueue);
      this._pump();
    },

    _pump() {
      if (this._isPaused) return;

      // While the page is locked waiting for the first transitions, nothing else competes for the
      // network, so fetch more frames at once; back to the normal limit once interaction is open.
      const limit = isGateClosed() ? this._gateConcurrency : this._concurrency;
      while (this._activeLoading < limit && this._queue.length > 0) {
        const item = this._queue.shift();
        if (!SEQUENCES[item.seqKey]) continue;

        // Frame objects are created lazily (no network yet); each download starts only when its
        // turn comes, so _concurrency is a real limit.
        const frames = store.cache[item.seqKey] || store.initSequenceFrames(item.seqKey);
        const img = frames && frames[item.index - 1];
        if (!img || (img.complete && img.naturalWidth > 0)) continue;
        if (!img.src && img._targetSrc) img.src = img._targetSrc;

        this._activeLoading++;
        const onDone = () => {
          this._activeLoading--;
          this._pump();
        };

        if (typeof img.decode === 'function') {
          img.decode().then(onDone).catch(onDone);
        } else {
          img.addEventListener('load', onDone, { once: true });
          img.addEventListener('error', onDone, { once: true });
        }
      }
    },
  };
  return q;
}
