'use client';

import { useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { scenarios } from '@/content/added';
import styles from './Scenarios.module.css';

export function Scenarios() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const active = scenarios.roles[index];

  const onKeyDown = (event: React.KeyboardEvent, current: number) => {
    const last = scenarios.roles.length - 1;
    const next: Record<string, number> = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setIndex(target);
    buttons.current[target]?.focus();
  };

  return (
    <Section id="scenarios">
      <SectionHead title={scenarios.title} subtitle={scenarios.subtitle} />

      <div className={styles.layout}>
        <div
          className={`${styles.roles} sb-scroller`}
          role="tablist"
          aria-orientation="vertical"
          aria-label="Команды"
        >
          {scenarios.roles.map((role, roleIndex) => (
            <button
              key={role.id}
              ref={(node) => {
                buttons.current[roleIndex] = node;
              }}
              type="button"
              role="tab"
              id={`scenario-tab-${role.id}`}
              aria-selected={roleIndex === index}
              aria-controls="scenario-panel"
              tabIndex={roleIndex === index ? 0 : -1}
              className={[styles.role, roleIndex === index && styles.roleActive]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setIndex(roleIndex)}
              onKeyDown={(event) => onKeyDown(event, roleIndex)}
            >
              <span className={styles.marker} aria-hidden="true" />
              {role.label}
            </button>
          ))}
        </div>

        <div
          className={styles.card}
          id="scenario-panel"
          role="tabpanel"
          aria-labelledby={`scenario-tab-${active.id}`}
          tabIndex={-1}
        >
          <h3 className={styles.task}>{active.task}</h3>

          <ul className={styles.points}>
            {active.points.map((point) => (
              <li className={styles.point} key={point}>
                <span className={styles.bullet} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>

          <dl className={styles.stats}>
            {active.stats.map((stat) => (
              <div key={stat.label}>
                <dt className={`${styles.statValue} sb-gradient`}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
