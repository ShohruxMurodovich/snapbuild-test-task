'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconArrow } from '@/components/ui/icons';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { testimonials } from '@/content/added';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import styles from './Testimonials.module.css';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 48;

export function Testimonials() {
  const items = testimonials.items;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % items.length) + items.length) % items.length),
    [items.length],
  );

  /* Автопрокрутка: стоит на ховере, фокусе и при prefers-reduced-motion. */
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, items.length]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    dragStart.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    go(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <Section id="reviews" compact>
      <SectionHead title={testimonials.title} subtitle={testimonials.subtitle} />

      <div
        className={styles.carousel}
        role="group"
        aria-roledescription="карусель"
        aria-label={testimonials.title}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className={styles.viewport}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
        >
          <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
            {items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <div
                  className={styles.slide}
                  key={item.name + item.role}
                  role="group"
                  aria-roledescription="слайд"
                  aria-label={`${itemIndex + 1} из ${items.length}`}
                  aria-hidden={itemIndex !== index}
                >
                  <figure className={styles.card}>
                    <blockquote className={styles.quote}>«{item.quote}»</blockquote>
                    <figcaption className={styles.meta}>
                      <div className={styles.author}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={styles.role}>{item.role}</span>
                      </div>
                      <span className={styles.metric}>
                        <span className={styles.metricIcon} aria-hidden="true">
                          <Icon />
                        </span>
                        <span className="sb-gradient">{item.metric}</span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.dots}>
            {items.map((item, itemIndex) => (
              <button
                key={`dot-${item.name}-${itemIndex}`}
                type="button"
                className={[styles.dot, itemIndex === index && styles.dotActive]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Отзыв ${itemIndex + 1}`}
                aria-current={itemIndex === index}
                onClick={() => go(itemIndex)}
              />
            ))}
          </div>

          <div className={styles.arrows}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              aria-label="Предыдущий отзыв"
              onClick={() => go(index - 1)}
            >
              <IconArrow />
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Следующий отзыв"
              onClick={() => go(index + 1)}
            >
              <IconArrow />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
