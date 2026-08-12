import type { NextConfig } from 'next';

/**
 * Статический экспорт для GitHub Pages.
 *
 * basePath приходит из окружения, поэтому `npm run dev` работает на «/»,
 * а деплой-сборка (`npm run build:gh`) — на «/snapbuild-test-task».
 * Оптимизатор картинок в статическом экспорте недоступен, поэтому
 * images.unoptimized: true, а сами файлы уменьшены заранее
 * (scripts/optimize-images.mjs).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
