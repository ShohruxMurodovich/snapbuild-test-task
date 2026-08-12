'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Горизонтальная прокрутка перетаскиванием — как у роадмапа в исходнике
 * (cursor: grab / grabbing). Колесо и тач-скролл остаются нативными,
 * мышью можно тянуть ленту.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, scroll: 0 });

  const onPointerDown = useCallback((event: React.PointerEvent<T>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    start.current = { x: event.clientX, scroll: ref.current.scrollLeft };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (!dragging || !ref.current) return;
      ref.current.scrollLeft = start.current.scroll - (event.clientX - start.current.x);
    },
    [dragging],
  );

  const stop = useCallback(() => setDragging(false), []);

  return {
    ref,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: stop,
      onPointerLeave: stop,
      onPointerCancel: stop,
    },
  };
}
