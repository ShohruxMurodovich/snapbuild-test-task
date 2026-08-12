'use client';

import { useEffect, useState } from 'react';

/**
 * Подписка на media query. На первом рендере всегда false — статический
 * экспорт отдаёт разметку без знания о вьюпорте, поэтому значение
 * появляется только после монтирования (иначе рассинхрон гидратации).
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Совпадает с брейкпоинтом планшета и ниже из дизайн-системы исходника. */
export const useIsCompact = () => useMediaQuery('(max-width: 1023px)');

/** Пользователь просил меньше анимации. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
