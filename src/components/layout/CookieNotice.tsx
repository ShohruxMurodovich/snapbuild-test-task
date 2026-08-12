'use client';

import { useEffect, useState } from 'react';
import { cookieNotice } from '@/content/site';
import styles from './CookieNotice.module.css';

const STORAGE_KEY = 'sb-cookie-accepted';

/**
 * Плашка про cookie из исходника. Решение запоминается в localStorage,
 * поэтому после перезагрузки она не появляется снова.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // приватный режим — просто показываем плашку
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* игнорируем: недоступный localStorage не должен ломать закрытие */
    }
    setVisible(false);
  };

  return (
    <aside className={styles.notice} aria-label="Использование cookie">
      <p className={styles.text}>{cookieNotice.text}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={accept}>
          {cookieNotice.accept}
        </button>
      </div>
    </aside>
  );
}
