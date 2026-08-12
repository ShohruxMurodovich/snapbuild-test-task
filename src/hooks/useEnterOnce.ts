'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Одноразовое появление по входу во вьюпорт — для случаев, где нужна
 * время-основанная анимация с задержками (каскад логотипов), а не
 * scroll-driven: в scroll-driven анимациях animation-delay игнорируется.
 *
 * Три состояния вместо двух, чтобы блок нельзя было «потерять»:
 * - idle: разметка отрисована, JS ещё не подхватил — контент виден;
 * - armed: JS смонтирован, элементы спрятаны и ждут своей очереди;
 * - revealed: анимация появления отыгрывает.
 *
 * Если JS не выполнился или IntersectionObserver недоступен, состояние
 * остаётся idle/revealed и контент всё равно на месте.
 */
export type EnterState = 'idle' | 'armed' | 'revealed';

export function useEnterOnce<T extends HTMLElement = HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<EnterState>('idle');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setState('revealed');
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setState('revealed');
      return;
    }

    /* Если блок уже в кадре, прятать его нет смысла — сразу проявляем. */
    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    setState(alreadyVisible ? 'revealed' : 'armed');
    if (alreadyVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setState('revealed');
        observer.disconnect();
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, state };
}
