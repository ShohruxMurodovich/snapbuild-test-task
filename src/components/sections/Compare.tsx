import { IconCheck } from '@/components/ui/icons';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { compare, type CompareCell } from '@/content/original';
import styles from './Compare.module.css';

function Cell({ value }: { value: CompareCell }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      <span className={styles.check}>
        <IconCheck />
      </span>
      {value.text ? <span>{value.text}</span> : null}
    </>
  );
}

export function Compare() {
  return (
    <Section id="compare" compact>
      <SectionHead title={compare.title} subtitle={compare.subtitle} />

      <div className={`${styles.wrap} sb-scroller`}>
        <div className={styles.table} role="table" aria-label={compare.title}>
          <span className={styles.brandBorder} aria-hidden="true" />

          <div className={`${styles.row} ${styles.head}`} role="row">
            {compare.columns.map((column, index) => (
              <div
                key={column}
                role="columnheader"
                className={[styles.cell, index === 0 && styles.label].filter(Boolean).join(' ')}
              >
                {index === 1 ? <span className="sb-gradient">{column}</span> : column}
              </div>
            ))}
          </div>

          {compare.rows.map((row) => (
            <div className={styles.row} key={row.label} role="row">
              <div role="rowheader" className={`${styles.cell} ${styles.label}`}>
                {row.label}
              </div>
              {row.cells.map((cell, index) => (
                <div role="cell" className={styles.cell} key={`${row.label}-${index}`}>
                  <Cell value={cell} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
