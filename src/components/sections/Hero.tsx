import { asset } from '@/lib/asset';
import { hero, site } from '@/content/site';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.card}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <div className={styles.heading}>
              <h1 className={styles.title}>{hero.title}</h1>
              <p className={styles.subtitle}>{hero.subtitle}</p>
            </div>
            <a className={styles.cta} href={site.demoAnchor}>
              <span className="sb-shine-text">{hero.cta}</span>
            </a>
          </div>

          <div className={styles.media}>
            <img
              className={styles.shot}
              src={asset('/assets/images/hero-app.webp')}
              alt={hero.screenshotAlt}
              width={1920}
              height={1011}
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
