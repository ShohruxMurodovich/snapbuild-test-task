import { asset } from '@/lib/asset';
import styles from './MediaCard.module.css';

type MediaCardProps = {
  image: string;
  title: string;
  text: string;
  /** Размеры файла — чтобы браузер зарезервировал место до загрузки. */
  width?: number;
  height?: number;
};

export function MediaCard({ image, title, text, width = 1440, height = 1080 }: MediaCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.media}
        src={asset(image)}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
    </article>
  );
}
