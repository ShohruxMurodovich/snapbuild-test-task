import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'light' | 'dark' | 'outline';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  /** Текст фирменным градиентом — как у главного CTA исходника. */
  gradientText?: boolean;
  className?: string;
};

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;
type LinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'> & { href: string };

const classes = (variant: Variant, className?: string) =>
  ['sb-btn', `sb-btn--${variant}`, className].filter(Boolean).join(' ');

/** Кнопка-ссылка (внутренний анкор или внешний адрес). */
export function ButtonLink({
  children,
  variant = 'light',
  gradientText,
  className,
  ...rest
}: LinkProps) {
  return (
    <a className={classes(variant, className)} {...rest}>
      <span className={gradientText ? 'sb-gradient' : undefined}>{children}</span>
    </a>
  );
}

/** Обычная кнопка (submit формы, переключатели). */
export function Button({
  children,
  variant = 'dark',
  gradientText,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, className)} {...rest}>
      <span className={gradientText ? 'sb-gradient' : undefined}>{children}</span>
    </button>
  );
}
