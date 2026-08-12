import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter-tight/wght.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/design-system.css';
import { CookieNotice } from '@/components/layout/CookieNotice';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { asset } from '@/lib/asset';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  applicationName: 'снэпбилд',
  authors: [{ name: 'Тестовое задание Fullstack Developer' }],
  icons: {
    icon: [
      { url: asset('/assets/images/favicon.svg'), type: 'image/svg+xml' },
      { url: asset('/assets/images/favicon.png'), type: 'image/png' },
    ],
    apple: asset('/assets/images/apple-touch-icon.png'),
  },
  openGraph: {
    title: site.title,
    description: site.description,
    locale: 'ru_RU',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f5f5f6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a className="sb-sr-only" href="#hero">
          Перейти к содержимому
        </a>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieNotice />
      </body>
    </html>
  );
}
