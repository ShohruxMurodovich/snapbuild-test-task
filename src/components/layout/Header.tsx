'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { hero, nav, site } from '@/content/site';
import { useIsCompact } from '@/hooks/useMediaQuery';
import { useScrolled } from '@/hooks/useScrolled';
import styles from './Header.module.css';

export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const isCompact = useIsCompact();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  /* Меню закрывается при переходе на десктоп. */
  useEffect(() => {
    if (!isCompact) setOpen(false);
  }, [isCompact]);

  /* Блокируем прокрутку страницы под открытым меню. */
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.style.overflow = 'hidden';
    else root.style.removeProperty('overflow');
    return () => {
      root.style.removeProperty('overflow');
    };
  }, [open]);

  /* Esc закрывает меню, Tab не выходит за его пределы. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const candidates: Array<HTMLElement | null> = [
        burgerRef.current,
        ...Array.from(menuRef.current?.querySelectorAll('a') ?? []),
      ];
      const focusable = candidates.filter((node): node is HTMLElement => node !== null);
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <header className={styles.header}>
      <div
        className={[styles.bar, scrolled && styles.barScrolled, open && styles.barOpen]
          .filter(Boolean)
          .join(' ')}
      >
        <a className={styles.logo} href="#hero" aria-label={site.name}>
          {/* Логотип из исходника; размеры заданы, чтобы не было сдвига вёрстки. */}
          <img src={asset('/assets/images/logo-snapbuild.svg')} alt={site.name} width={153} height={22} />
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          {nav.map((item) => (
            <a key={item.href} className={styles.link} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.cta} href={site.demoAnchor}>
            {hero.cta}
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={[styles.burger, open && styles.burgerOpen].filter(Boolean).join(' ')}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={styles.burgerIcon} />
          </button>
        </div>
      </div>

      {open ? (
        <nav ref={menuRef} id="mobile-menu" className={styles.menu} aria-label="Мобильная навигация">
          {nav.map((item) => (
            <a key={item.href} className={styles.menuLink} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a className={styles.menuCta} href={site.demoAnchor} onClick={close}>
            {hero.cta}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
