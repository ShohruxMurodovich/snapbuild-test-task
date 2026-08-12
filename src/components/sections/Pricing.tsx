'use client';

import { useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { IconCheck } from '@/components/ui/icons';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { pricing } from '@/content/added';
import { site } from '@/content/site';
import styles from './Pricing.module.css';

type Period = 'monthly' | 'yearly';

export function Pricing() {
  const [period, setPeriod] = useState<Period>('monthly');

  return (
    <Section id="pricing" compact>
      <SectionHead title={pricing.title} subtitle={pricing.subtitle} />

      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label={pricing.toggle.label}>
          {(['monthly', 'yearly'] as Period[]).map((value) => (
            <button
              key={value}
              type="button"
              className={[styles.segment, period === value && styles.segmentActive]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {pricing.toggle[value]}
              {value === 'yearly' ? (
                <span className={`${styles.badge} sb-gradient`}>{pricing.toggle.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.plans} sb-stagger`}>
        {pricing.plans.map((plan) => (
          <article
            className={[styles.plan, plan.featured && 'sb-gradient-border'].filter(Boolean).join(' ')}
            key={plan.id}
          >
            <div className={styles.planTop}>
              <div className={styles.planHead}>
                <h3 className={styles.planName}>{plan.name}</h3>
                {plan.featured ? (
                  <span className={styles.chip}>
                    <span className="sb-gradient">Рекомендуем</span>
                  </span>
                ) : null}
              </div>
              <p className={styles.planDescription}>{plan.description}</p>
            </div>

            <div className={styles.priceRow}>
              {/* key по периоду перезапускает анимацию появления цены */}
              <p className={styles.price} key={`${plan.id}-${period}`}>
                {plan.price[period]}
              </p>
              {plan.priceNote ? <p className={styles.priceNote}>{plan.priceNote[period]}</p> : null}
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature) => (
                <li className={styles.feature} key={feature}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <IconCheck />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <ButtonLink
              href={site.demoAnchor}
              variant={plan.featured ? 'dark' : 'outline'}
              className={styles.action}
            >
              {plan.cta}
            </ButtonLink>
          </article>
        ))}
      </div>

      <div className={styles.footnote}>
        <div className={styles.footnoteText}>
          <h3 className={styles.footnoteTitle}>{pricing.footnote.title}</h3>
          <p className={styles.footnoteNote}>{pricing.footnote.text}</p>
        </div>
        <ButtonLink href={site.demoAnchor} variant="outline" gradientText>
          {pricing.footnote.cta}
        </ButtonLink>
      </div>
    </Section>
  );
}
