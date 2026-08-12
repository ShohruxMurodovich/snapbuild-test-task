import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { integrations } from '@/content/added';
import styles from './Integrations.module.css';

export function Integrations() {
  return (
    <Section id="integrations" compact>
      <SectionHead title={integrations.title} subtitle={integrations.subtitle} />

      <div className={styles.block}>
        <p className="sb-overline">{integrations.toolsTitle}</p>
        <ul className={styles.tools}>
          {integrations.tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <li className={styles.tool} key={tool.label}>
                <span className="sb-tile" aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.toolText}>
                  <span className={styles.toolLabel}>{tool.label}</span>
                  <span className={styles.toolNote}>{tool.note}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.block}>
        <p className="sb-overline">{integrations.stepsTitle}</p>
        <ol className={styles.steps}>
          {integrations.steps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
              <span className={styles.duration}>{step.duration}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
