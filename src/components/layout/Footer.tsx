import { asset } from '@/lib/asset';
import { footer, site } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <img src={asset('/assets/images/logo-snapbuild.svg')} alt={site.name} width={153} height={22} />
          </span>
          <p className={styles.tagline}>{footer.tagline}</p>
          <a className={`${styles.email} ${styles.emailMobile}`} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>

        <div className={styles.columns}>
          {footer.columns.map((column) => (
            <div className={styles.column} key={column.title}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className={styles.link}
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legal}>
        <p className={styles.copyright}>{footer.copyright}</p>
        <a className={styles.legalEmail} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      <p className={styles.disclaimer}>
        Учебная реплика лендинга snapbuild.ru для тестового задания. Тексты, цены, отзывы и метрики
        в новых секциях — демонстрационные.
      </p>
    </footer>
  );
}
