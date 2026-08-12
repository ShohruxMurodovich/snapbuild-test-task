import { Compare } from '@/components/sections/Compare';
import { Cta } from '@/components/sections/Cta';
import { DemoForm } from '@/components/sections/DemoForm';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { Integrations } from '@/components/sections/Integrations';
import { Logos } from '@/components/sections/Logos';
import { Pricing } from '@/components/sections/Pricing';
import { Process } from '@/components/sections/Process';
import { Roadmap } from '@/components/sections/Roadmap';
import { Scenarios } from '@/components/sections/Scenarios';
import { Security } from '@/components/sections/Security';
import { Testimonials } from '@/components/sections/Testimonials';
import { UseCases } from '@/components/sections/UseCases';

/**
 * Порядок секций. Воспроизведённые блоки идут в том же порядке, что на
 * snapbuild.ru; пять новых вставлены между ними там, где они продолжают
 * логику страницы:
 *
 *   продукт → форматы → [сценарии по командам] → сравнение → безопасность
 *   → [интеграции и внедрение] → роадмап → [тарифы] → [отзывы] → FAQ
 *   → [заявка на демо] → финальный CTA
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Logos />
      <Process />
      <UseCases />
      <Scenarios />
      <Compare />
      <Security />
      <Integrations />
      <Roadmap />
      <Pricing />
      <Testimonials />
      <Faq />
      <DemoForm />
      <Cta />
    </>
  );
}
