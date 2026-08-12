/**
 * Общие тексты и навигация. Копия исходного лендинга snapbuild.ru,
 * дополненная ссылками на новые секции (тарифы, отзывы, форма демо).
 */

import { typography } from './typography';

export const site = typography({
  name: 'снэпбилд',
  title: 'Снэпбилд — платформа для создания маркетинговых материалов на основе дизайн-системы',
  description:
    'Подключите дизайн-систему к Снэпбилду, чтобы каждый участник команды мог создавать сайты, изображения, видео, баннеры и презентации в фирменном стиле за минуты, а не дни.',
  email: 'hey@snapbuild.ru',
  telegram: 'https://t.me/snapbuild',
  demoAnchor: '#demo',
});

export const nav = [
  { label: 'Продукт', href: '#process' },
  { label: 'Возможности', href: '#use-cases' },
  { label: 'Безопасность', href: '#features' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const hero = typography({
  title: 'Платформа, где все создается в рамках вашего бренда и дизайн-системы',
  subtitle:
    'Подключите дизайн-систему к Снэпбилду, чтобы каждый участник команды мог создавать профессиональные материалы в фирменном стиле за минуты, а не дни.',
  cta: 'Начать сейчас',
  screenshotAlt: 'Интерфейс Снэпбилда: чат генерации и библиотека материалов',
});

export const logos = typography({
  eyebrow: 'С платформой работают команды, для которых бренд — закон',
  items: [
    { src: '/assets/images/logo-ozon.svg', alt: 'OZON', width: 101, height: 22 },
    { src: '/assets/images/logo-t2.svg', alt: 't2', width: 43, height: 32 },
    { src: '/assets/images/logo-avito.svg', alt: 'Avito', width: 102, height: 26 },
    { src: '/assets/images/logo-cian.svg', alt: 'Циан', width: 59, height: 22 },
    { src: '/assets/images/logo-lenta.svg', alt: 'Лента', width: 64, height: 15 },
  ],
});

export const cta = typography({
  title: 'Профессиональные материалы в фирменном стиле\nза минуты, а не дни',
  button: 'Начать сейчас',
});

export const footer = typography({
  tagline: 'Платформа, где все создается в рамках вашего бренда и дизайн-системы',
  columns: [
    {
      title: 'Навигация',
      links: [
        { label: 'Продукт', href: '#process' },
        { label: 'Возможности', href: '#use-cases' },
        { label: 'Преимущества', href: '#compare' },
        { label: 'Безопасность', href: '#features' },
        { label: 'Роадмап', href: '#roadmap' },
        { label: 'Тарифы', href: '#pricing' },
        { label: 'Частые вопросы', href: '#faq' },
      ],
    },
    {
      title: 'Документация',
      links: [
        { label: 'Политика конфиденциальности', href: '#footer' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Контакты',
      links: [
        { label: 'Запросить демо', href: '#demo' },
        { label: 'Telegram', href: 'https://t.me/snapbuild' },
      ],
    },
  ],
  copyright: '© Сгенерировано в Снэпбилде. Все права защищены.',
});

export const cookieNotice = typography({
  text: 'Мы используем файлы cookie, чтобы сделать наш сайт лучше. Используя сайт, вы принимаете нашу политику конфиденциальности и соглашение на обработку персональных данных.',
  accept: 'Принять',
});
