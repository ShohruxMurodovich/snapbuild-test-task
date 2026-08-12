import { asset } from '@/lib/asset';
import { cta, site } from '@/content/site';
import styles from './Cta.module.css';

export function Cta() {
  return (
    <section id="cta" className={`${styles.cta} sb-reveal`} aria-label="Начать работу">
      <div className={styles.dust} aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={asset('/assets/images/cta-aurora-mobile.webp')} />
          <source media="(max-width: 1023px)" srcSet={asset('/assets/images/cta-aurora-tablet.webp')} />
          <img src={asset('/assets/images/cta-aurora-desktop.webp')} alt="" loading="lazy" decoding="async" />
        </picture>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{cta.title}</h2>
        <a className={styles.button} href={site.demoAnchor}>
          <span className="sb-gradient">{cta.button}</span>
        </a>
      </div>
    </section>
  );
}
