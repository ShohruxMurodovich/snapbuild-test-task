'use client';

import { useState } from 'react';
import { IconPlus } from '@/components/ui/icons';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { faq } from '@/content/original';
import styles from './Faq.module.css';

export function Faq() {
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (index: number) =>
    setOpen((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );

  return (
    <Section id="faq" compact className={styles.faq}>
      <SectionHead title={faq.title} subtitle={faq.subtitle} regularSubtitle />

      <div className={`${styles.list} sb-stagger`}>
        {faq.items.map((item, index) => {
          const isOpen = open.includes(index);
          return (
            <div className={styles.item} key={item.question}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => toggle(index)}
              >
                <span className={styles.question}>{item.question}</span>
                <span
                  className={[styles.icon, isOpen && styles.iconOpen].filter(Boolean).join(' ')}
                  aria-hidden="true"
                >
                  <IconPlus />
                </span>
              </button>

              <div className={[styles.panel, isOpen && styles.panelOpen].filter(Boolean).join(' ')}>
                <p
                  className={styles.answer}
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
