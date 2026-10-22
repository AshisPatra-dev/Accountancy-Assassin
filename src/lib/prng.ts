// ============================================================
// ACCOUNTANCY ASSASSIN — Seeded Pseudo-Random Number Generator
// Mulberry32 32-bit state generator for deterministic problem generation.
// Reproduces identical exam questions given the same seed.
// ============================================================

/**
 * Creates a mulberry32 PRNG initialized with a 32-bit integer seed.
 * Produces floating point numbers in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function (): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an integer in [min, max] inclusive on both ends.
 */
export function randInt(rng: () => number, min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(rng() * (high - low + 1)) + low;
}

/**
 * Selects a random element from an array.
 */
export function randFrom<T>(rng: () => number, arr: readonly T[] | T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = Math.floor(rng() * arr.length);
  return arr[index];
}

/**
 * Generates a number between min and max rounded to the nearest step.
 * e.g., randRound(rng, 5000, 50000, 1000) produces multiples of 1000.
 */
export function randRound(
  rng: () => number,
  min: number,
  max: number,
  step: number
): number {
  const count = Math.floor((max - min) / step);
  const offset = Math.floor(rng() * (count + 1)) * step;
  return min + offset;
}
