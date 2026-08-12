'use client';

import { useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { asset } from '@/lib/asset';
import { useCases } from '@/content/original';
import styles from './UseCases.module.css';

const SWIPE_THRESHOLD = 44;

export function UseCases() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pointIndex, setPointIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'next' | 'prev' | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swipeStart = useRef<number | null>(null);

  const tabs = useCases.tabs;
  const activeTab = tabs[tabIndex];

  const selectTab = (index: number) => {
    setTabIndex(index);
    setPointIndex(0);
    setSwipeDir(null);
  };

  const selectPoint = (index: number, dir: 'next' | 'prev' | null = null) => {
    setPointIndex(index);
    setSwipeDir(dir);
  };

  /* Перелистывание картинок пальцем — как в исходнике, только на тач-вводе,
     чтобы не мешать клику мышью. */
  const onPointerDown = (event: React.PointerEvent) => {
    swipeStart.current = event.pointerType === 'touch' ? event.clientX : null;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    const last = activeTab.points.length - 1;
    if (delta < 0) selectPoint(pointIndex === last ? 0 : pointIndex + 1, 'next');
    else selectPoint(pointIndex === 0 ? last : pointIndex - 1, 'prev');
  };

  /* Стрелки и Home/End по полосе форматов — поведение обычного tablist. */
  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const map: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = map[event.key];
    if (next === undefined) return;
    event.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="use-cases">
      <div className={styles.header}>
        <h2 className="sb-title">{useCases.title}</h2>
        <div className={`${styles.tabs} sb-scroller`} role="tablist" aria-label="Форматы материалов">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`uc-tab-${tab.id}`}
              aria-selected={index === tabIndex}
              aria-controls="uc-panel"
              tabIndex={index === tabIndex ? 0 : -1}
              className={[styles.tab, index === tabIndex && styles.tabActive].filter(Boolean).join(' ')}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.points}>
          {activeTab.points.map((point, index) => (
            <button
              key={point.title}
              type="button"
              className={[styles.point, index === pointIndex && styles.pointActive]
                .filter(Boolean)
                .join(' ')}
              aria-expanded={index === pointIndex}
              aria-controls="uc-panel"
              onClick={() => selectPoint(index)}
            >
              <span className={styles.pointTitle}>{point.title}</span>
              <span className={styles.pointText}>
                <span>{point.text}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          className={[
            styles.panel,
            swipeDir === 'next' && styles.swipeNext,
            swipeDir === 'prev' && styles.swipePrev,
          ]
            .filter(Boolean)
            .join(' ')}
          id="uc-panel"
          role="tabpanel"
          aria-labelledby={`uc-tab-${activeTab.id}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
          {activeTab.points.map((point, index) => (
            <img
              key={point.image}
              className={[styles.media, index === pointIndex && styles.mediaActive]
                .filter(Boolean)
                .join(' ')}
              src={asset(point.image)}
              alt={`${activeTab.label}: ${point.title}`}
              width={1920}
              height={1080}
              loading={tabIndex === 0 && index === 0 ? undefined : 'lazy'}
              decoding="async"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
