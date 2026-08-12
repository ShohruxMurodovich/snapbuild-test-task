import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    /* out/ и next-env.d.ts генерируются сборкой, scripts/ — служебные утилиты */
    ignores: ['out/**', '.next/**', 'node_modules/**', 'scripts/**', 'next-env.d.ts'],
  },
  {
    rules: {
      /* В статическом экспорте оптимизатор картинок недоступен
         (images.unoptimized), поэтому next/image не даёт преимуществ
         перед обычным <img> с заданными width/height. */
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
