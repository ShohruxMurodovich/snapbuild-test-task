import { MediaCard } from '@/components/ui/MediaCard';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { process } from '@/content/original';
import styles from './Process.module.css';

export function Process() {
  return (
    <Section id="process">
      <SectionHead title={process.title} subtitle={process.subtitle} regularSubtitle />
      <div className={`${styles.grid} sb-stagger`}>
        {process.cards.map((card) => (
          <MediaCard
            key={card.title}
            image={card.image}
            sources={'sources' in card ? card.sources : undefined}
            title={card.title}
            text={card.text}
          />
        ))}
      </div>
    </Section>
  );
}
