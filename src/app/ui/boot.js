"use client";

/**
 * Tiny module-level bus so the hero's WebGL scene can report how far along its
 * assets are, and the boot screen can render that without prop drilling
 * through the server components in between.
 *
 * Progress is monotonic: a late-arriving smaller value never rewinds the bar.
 */
let progress = 0;
let done = false;
const subs = new Set();

const emit = () => subs.forEach((fn) => fn(progress, done));

export function setBootProgress(p) {
  if (done) return;
  const next = Math.min(1, Math.max(0, p));
  if (next <= progress) return;
  progress = next;
  emit();
}

export function finishBoot() {
  if (done) return;
  done = true;
  progress = 1;
  emit();
}

export function onBoot(fn) {
  subs.add(fn);
  fn(progress, done); // catch up whoever subscribes late
  return () => subs.delete(fn);
}
