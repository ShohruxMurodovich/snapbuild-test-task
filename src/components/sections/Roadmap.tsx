'use client';

import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { roadmap } from '@/content/original';
import { useDragScroll } from '@/hooks/useDragScroll';
import styles from './Roadmap.module.css';

const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

/** «Март, 2026» → 2026-03, чтобы сравнить с asOf без парсинга дат браузером. */
function toSortableMonth(date: string) {
  const [monthName, year] = date.split(',').map((part) => part.trim().toLowerCase());
  const month = MONTHS.indexOf(monthName) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function Roadmap() {
  const { ref, dragging, handlers } = useDragScroll<HTMLDivElement>();

  const reachedCount = roadmap.items.filter(
    (item) => toSortableMonth(item.date) <= roadmap.asOf,
  ).length;

  return (
    <Section id="roadmap" compact flush className={styles.roadmap}>
      <SectionHead title={roadmap.title} subtitle={roadmap.subtitle} inline />

      <div
        ref={ref}
        className={[styles.scroller, dragging && styles.dragging].filter(Boolean).join(' ')}
        {...handlers}
      >
        <ol
          className={styles.track}
          style={{ '--progress': Math.max(reachedCount - 1, 0) } as CSSProperties}
        >
          {roadmap.items.map((item, index) => (
            <li
              key={item.name}
              className={[styles.item, index < reachedCount && styles.reached]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.dot} aria-hidden="true">
                <span className={styles.halo} />
                <span className={styles.core} />
              </span>
              <div className={styles.body}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.text}>{item.text}</p>
                <p className={styles.date}>{item.date}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
