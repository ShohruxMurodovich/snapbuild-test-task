import type { ReactNode } from 'react';

type SectionHeadProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Заголовок второго уровня по умолчанию; h1 занят первым экраном. */
  as?: 'h2' | 'h3';
  /** Свои горизонтальные отступы — для секций с флеш-краями. */
  inline?: boolean;
  /** Подзаголовок весом 400 вместо 500 — как у «Продукта» и FAQ в исходнике. */
  regularSubtitle?: boolean;
  className?: string;
};

/**
 * Заголовок секции в стиле исходника: 52/500 с плотным трекингом и
 * серый подзаголовок под ним (на 1280 они стоят в колонку, не в ряд).
 */
export function SectionHead({
  title,
  subtitle,
  as: Tag = 'h2',
  inline,
  regularSubtitle,
  className,
}: SectionHeadProps) {
  return (
    <header className={['sb-head', inline && 'sb-head--inline', className].filter(Boolean).join(' ')}>
      <Tag className="sb-title">{title}</Tag>
      {subtitle ? (
        <p className={['sb-subtitle', regularSubtitle && 'sb-subtitle--regular'].filter(Boolean).join(' ')}>
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
