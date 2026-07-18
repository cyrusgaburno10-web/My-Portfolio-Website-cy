export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function lerp(a: number, b: number, t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return a + (b - a) * clamped;
}

/**
 * Math.cos/Math.sin can differ in their last bit between Node's SSR pass and
 * the browser's hydration pass, which fails React's strict SSR/client match.
 * Rounding collapses that noise without any visible effect on the render.
 */
export function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}
