'use client';

import { useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { asset } from '@/lib/asset';
import { useCases } from '@/content/original';
import styles from './UseCases.module.css';

export function UseCases() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pointIndex, setPointIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const tabs = useCases.tabs;
  const activeTab = tabs[tabIndex];

  const selectTab = (index: number) => {
    setTabIndex(index);
    setPointIndex(0);
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
              onClick={() => setPointIndex(index)}
            >
              <span className={styles.pointTitle}>{point.title}</span>
              <span className={styles.pointText}>
                <span>{point.text}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          className={styles.panel}
          id="uc-panel"
          role="tabpanel"
          aria-labelledby={`uc-tab-${activeTab.id}`}
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
