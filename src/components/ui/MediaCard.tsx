import { asset } from '@/lib/asset';
import styles from './MediaCard.module.css';

/** Вариант картинки под конкретный брейкпоинт (media-условие как в <source>). */
export type MediaSource = { media: string; src: string };

type MediaCardProps = {
  image: string;
  title: string;
  text: string;
  /**
   * Перекадрированные варианты под узкие экраны. В исходнике для части
   * карточек отдаются отдельные файлы: на мобильной пропорции центральный
   * объект иначе не влезает в кадр.
   */
  sources?: MediaSource[];
  /** Размеры файла — чтобы браузер зарезервировал место до загрузки. */
  width?: number;
  height?: number;
};

export function MediaCard({
  image,
  title,
  text,
  sources = [],
  width = 1440,
  height = 1080,
}: MediaCardProps) {
  return (
    <article className={styles.card}>
      <picture>
        {sources.map((source) => (
          <source key={source.media} media={source.media} srcSet={asset(source.src)} />
        ))}
        <img
          className={styles.media}
          src={asset(image)}
          alt=""
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
    </article>
  );
}
