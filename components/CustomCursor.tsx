'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, summary, [role="button"], [role="switch"]';
const ACTIVE_CLASS = 'custom-cursor-active';

function subscribeNever() {
  return () => {};
}
function getFinePointerSnapshot(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
function getFinePointerServerSnapshot(): boolean {
  return false;
}
function getReducedMotionSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function CustomCursor() {
  const hasFinePointer = useSyncExternalStore(subscribeNever, getFinePointerSnapshot, getFinePointerServerSnapshot);
  const reduceMotion = useSyncExternalStore(subscribeNever, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);

  const ringSpringConfig = reduceMotion
    ? { stiffness: 1200, damping: 100, mass: 0.15 }
    : { stiffness: 500, damping: 38, mass: 0.4 };
  const ringRawX = useSpring(x, ringSpringConfig);
  const ringRawY = useSpring(y, ringSpringConfig);
  const ringScale = useSpring(scale, { stiffness: 400, damping: 28 });

  const dotX = useTransform(x, (v) => v - 3);
  const dotY = useTransform(y, (v) => v - 3);
  const ringX = useTransform(ringRawX, (v) => v - 14);
  const ringY = useTransform(ringRawY, (v) => v - 14);

  useEffect(() => {
    if (!hasFinePointer) return;

    document.documentElement.classList.add(ACTIVE_CLASS);

    function handleMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    }
    function handleOver(e: PointerEvent) {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) scale.set(1.8);
    }
    function handleOut(e: PointerEvent) {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) scale.set(1);
    }
    function handleLeave() {
      opacity.set(0);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerover', handleOver);
    window.addEventListener('pointerout', handleOut);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.documentElement.classList.remove(ACTIVE_CLASS);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('pointerout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [hasFinePointer, x, y, scale, opacity]);

  if (!hasFinePointer) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-periwinkle"
        style={{ x: dotX, y: dotY, opacity }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-7 w-7 rounded-full border border-periwinkle"
        style={{ x: ringX, y: ringY, scale: ringScale, opacity }}
      />
    </>
  );
}
