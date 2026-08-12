import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  children: ReactNode;
  /** Нижний отступ 96 вместо 128 — как у секций сравнения, безопасности и FAQ. */
  compact?: boolean;
  /** Без горизонтальных отступов: секция сама управляет ими (роадмап, таблица). */
  flush?: boolean;
  className?: string;
  /** aria-label, если у секции нет видимого заголовка. */
  label?: string;
};

/**
 * Оболочка секции: отступы дизайн-системы + появление при скролле (чистый CSS,
 * см. .sb-reveal). Все секции лендинга — и воспроизведённые, и новые — собраны
 * через неё, поэтому вертикальный ритм страницы задаётся в одном месте.
 */
export function Section({ id, children, compact, flush, className, label }: SectionProps) {
  const classes = [
    'sb-section',
    compact && 'sb-section--compact',
    flush && 'sb-section--flush',
    'sb-reveal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes} aria-label={label}>
      {children}
    </section>
  );
}
