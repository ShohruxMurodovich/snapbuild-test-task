import { MediaCard } from '@/components/ui/MediaCard';
import { Section } from '@/components/ui/Section';
import { security } from '@/content/original';
import styles from './Security.module.css';

export function Security() {
  return (
    <Section id="features" compact>
      <h2 className="sb-title">{security.title}</h2>
      <div className={`${styles.grid} sb-stagger`}>
        {security.points.map((point) => (
          <MediaCard
            key={point.title}
            image={point.image}
            sources={point.sources}
            title={point.title}
            text={point.text}
            width={864}
            height={720}
          />
        ))}
      </div>
    </Section>
  );
}
