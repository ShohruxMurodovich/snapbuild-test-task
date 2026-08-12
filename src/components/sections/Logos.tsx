import type { CSSProperties } from 'react';
import { asset } from '@/lib/asset';
import { logos } from '@/content/site';
import styles from './Logos.module.css';

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={[styles.group, hidden && styles.groupCopy].filter(Boolean).join(' ')}
      aria-hidden={hidden || undefined}
    >
      {logos.items.map((logo, index) => (
        <div
          key={`${logo.alt}-${hidden ? 'copy' : 'main'}`}
          className={styles.item}
          style={{ '--logo-index': index, '--logo-height': logo.height } as CSSProperties}
        >
          <img src={asset(logo.src)} alt={hidden ? '' : logo.alt} width={logo.width} height={logo.height} />
        </div>
      ))}
    </div>
  );
}

export function Logos() {
  return (
    <section id="logos" className={styles.logos} aria-label="Клиенты платформы">
      <div className={styles.track}>
        <Group />
        {/* Дубль для бесшовной бегущей строки на мобильном. */}
        <Group hidden />
      </div>
      <p className={styles.eyebrow}>{logos.eyebrow}</p>
    </section>
  );
}
