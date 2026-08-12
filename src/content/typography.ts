/**
 * Русская типографика для текстов контента.
 *
 * В исходнике переносы расставлены вручную неразрывными пробелами
 * (`Одна платформа&nbsp;— весь маркетинг`, `из&nbsp;одной идеи`,
 * `в&nbsp;вашем стиле`). Здесь то же правило применяется автоматически ко всем
 * строкам контента, чтобы короткие слова и тире не оставались в конце строки.
 */

const NBSP = ' ';

/** Короткие слова (предлоги, союзы, однозначные числа) прилипают к следующему. */
export function typo(text: string): string {
  let result = text;
  /* Два прохода — иначе в цепочках вроде «а не дни» второе слово остаётся. */
  for (let pass = 0; pass < 2; pass += 1) {
    result = result.replace(/(^|[\s(«"])([А-Яа-яЁёA-Za-z0-9]{1,2}) /g, `$1$2${NBSP}`);
  }
  /* Тире не уезжает на новую строку отдельно от слова перед ним. */
  return result.replace(/ +—/g, `${NBSP}—`);
}

/** Ключи, значения которых нельзя трогать: пути, ссылки, идентификаторы. */
const TECHNICAL = new Set([
  'image',
  'sources',
  'src',
  'media',
  'href',
  'id',
  'icon',
  'asOf',
  'email',
  'telegram',
  'demoAnchor',
]);

/**
 * Рекурсивно применяет typo ко всем строкам объекта контента, не задевая
 * технические поля и компоненты иконок.
 */
export function typography<T>(value: T): T {
  if (typeof value === 'string') return typo(value) as T;
  if (Array.isArray(value)) return value.map((item) => typography(item)) as T;
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(source)) {
      result[key] = TECHNICAL.has(key) || typeof item === 'function' ? item : typography(item);
    }
    return result as T;
  }
  return value;
}
