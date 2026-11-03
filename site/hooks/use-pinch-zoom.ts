"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Diffusion Studio's timeline zoom constants (engine/timeline/config.ts): wheel delta clamp and sensitivity. */
const ZOOM_DELTA_CLAMP = 50;
const ZOOM_SENSITIVITY = 0.01;

/**
 * Pinch-to-zoom on an element, from every input that means "pinch":
 * - two-finger pinch on a touch screen,
 * - trackpad pinch (Chrome, Edge and Firefox send it as a wheel event with ctrlKey; Safari sends gesture events),
 * - Ctrl/⌘ + mouse wheel.
 *
 * `onZoom` gets a multiplicative factor (above 1 zooms in) and the screen x the zoom should centre on.
 * The browser's own page zoom is suppressed inside the element; give the element `touch-action: pan-x`
 * so one-finger swipes still scroll it. The returned ref is true while a touch pinch is in progress.
 */
export function usePinchZoom(ref: RefObject<HTMLElement | null>, onZoom: (factor: number, clientX: number) => void) {
  const callback = useRef(onZoom);
  const pinching = useRef(false);

  useEffect(() => {
    callback.current = onZoom;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const delta = Math.max(-ZOOM_DELTA_CLAMP, Math.min(ZOOM_DELTA_CLAMP, dy));
      callback.current(Math.exp(-delta * ZOOM_SENSITIVITY), e.clientX);
    };

    // Touch: track the distance between two fingers.
    let touches = 0;
    let distance = 0;
    const spread = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const middle = (t: TouchList) => (t[0].clientX + t[1].clientX) / 2;

    const onTouchStart = (e: TouchEvent) => {
      touches = e.touches.length;
      if (touches === 2) {
        distance = spread(e.touches);
        pinching.current = true;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || distance <= 0) return;
      if (e.cancelable) e.preventDefault();
      const next = spread(e.touches);
      if (next > 0) callback.current(next / distance, middle(e.touches));
      distance = next;
    };
    const onTouchEnd = (e: TouchEvent) => {
      touches = e.touches.length;
      if (touches < 2) {
        distance = 0;
        pinching.current = false;
      }
    };

    // Safari: trackpad pinch arrives as gesture events. iOS sends these alongside touches, which are handled above.
    type GestureEvent = Event & { scale: number; clientX?: number };
    let gestureScale = 1;
    let gestureX = 0;
    let pointerX = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
    };
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureScale = 1;
      const rect = el.getBoundingClientRect();
      gestureX = (e as GestureEvent).clientX ?? (pointerX || rect.left + rect.width / 2);
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      if (touches > 0) return;
      const { scale } = e as GestureEvent;
      if (scale > 0) callback.current(scale / gestureScale, gestureX);
      gestureScale = scale;
    };
    const onGestureEnd = (e: Event) => e.preventDefault();

    const active = { passive: false } as const;
    el.addEventListener("wheel", onWheel, active);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, active);
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("gesturestart", onGestureStart, active);
    el.addEventListener("gesturechange", onGestureChange, active);
    el.addEventListener("gestureend", onGestureEnd, active);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
    };
  }, [ref]);

  return pinching;
}
