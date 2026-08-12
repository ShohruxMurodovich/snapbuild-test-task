const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Путь к файлу из /public с учётом basePath (GitHub Pages отдаёт проект
 * из подкаталога). Next сам префиксует только next/image и next/link,
 * поэтому для обычных <img> и ссылок используем этот хелпер.
 */
export const asset = (path: string) => `${basePath}${path}`;
