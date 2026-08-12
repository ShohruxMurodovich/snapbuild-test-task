'use client';

import type { CSSProperties } from 'react';
import { asset } from '@/lib/asset';
import { logos } from '@/content/site';
import { useEnterOnce } from '@/hooks/useEnterOnce';
import styles from './Logos.module.css';

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={[styles.group, hidden && styles.groupCopy].filter(Boolean).join(' ')}
      aria-hidden={hidden || undefined}
    >
      {logos.items.map((logo, index) => (
        <div
          key={`${logo.alt}-${hidden ? 'copy' : 'main'}`}
          className={styles.item}
          style={
            {
              '--logo-index': index,
              '--logo-height': logo.display,
              ...('mobileWidth' in logo ? { '--logo-mobile-width': logo.mobileWidth } : {}),
            } as CSSProperties
          }
        >
          <img
            src={asset(logo.src)}
            alt={hidden ? '' : logo.alt}
            width={logo.width}
            height={logo.height}
            data-mobile-width={'mobileWidth' in logo ? '' : undefined}
          />
        </div>
      ))}
    </div>
  );
}

export function Logos() {
  /*
   * Каскад логотипов — как в исходнике: 520ms на логотип с задержкой
   * 90ms × индекс, запуск по входу во вьюпорт (там это тоже на
   * IntersectionObserver, threshold 0.18). Scroll-driven анимация здесь не
   * подходит: полоса низкая, её вход укладывается в ~80px прокрутки, и
   * задержки в таких анимациях не работают.
   */
  const { ref, state } = useEnterOnce<HTMLElement>(0.18);

  return (
    <section
      id="logos"
      ref={ref}
      className={[styles.logos, styles[state]].filter(Boolean).join(' ')}
      aria-label="Клиенты платформы"
    >
      <div className={styles.track}>
        <Group />
        {/* Дубль для бесшовной бегущей строки на мобильном. */}
        <Group hidden />
      </div>
      <p className={styles.eyebrow}>{logos.eyebrow}</p>
    </section>
  );
}
