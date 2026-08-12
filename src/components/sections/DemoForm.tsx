'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconCheck } from '@/components/ui/icons';
import { Section } from '@/components/ui/Section';
import { demo } from '@/content/added';
import { site } from '@/content/site';
import styles from './DemoForm.module.css';

type FieldName = 'name' | 'company' | 'email' | 'team' | 'task' | 'consent';
type Values = { name: string; company: string; email: string; team: string; task: string; consent: boolean };
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { name: '', company: '', email: '', team: '', task: '', consent: false };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const FREE_MAIL = ['gmail.com', 'mail.ru', 'yandex.ru', 'ya.ru', 'inbox.ru', 'list.ru', 'bk.ru', 'rambler.ru', 'outlook.com', 'icloud.com'];

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) errors.name = 'Укажите имя — как к вам обращаться';
  if (values.company.trim().length < 2) errors.company = 'Укажите компанию';

  const email = values.email.trim();
  if (!email) errors.email = 'Укажите рабочий email';
  else if (!EMAIL_RE.test(email)) errors.email = 'Проверьте адрес: похоже, в нём опечатка';

  if (!values.team) errors.team = 'Выберите размер команды';
  if (!values.consent) errors.consent = 'Нужно согласие на обработку данных';

  return errors;
}

/** Подсказка (не ошибка) для личной почты — на демо это частая правка. */
function freeMailHint(email: string) {
  const domain = email.trim().split('@')[1]?.toLowerCase();
  if (!domain || !FREE_MAIL.includes(domain)) return null;
  return 'Можно и так, но с рабочей почтой мы соберём демо на вашей дизайн-системе точнее.';
}

export function DemoForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const setField = (field: FieldName, value: string | boolean) => {
    const next = { ...values, [field]: value } as Values;
    setValues(next);
    if (touched[field] || errors[field]) setErrors(validate(next));
  };

  const blur = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const showError = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, company: true, email: true, team: true, task: true, consent: true });

    const firstInvalid = (Object.keys(found) as FieldName[])[0];
    if (firstInvalid) {
      const node = formRef.current?.elements.namedItem(firstInvalid);
      if (node instanceof HTMLElement) node.focus();
      return;
    }

    /* Бэкенда нет: имитируем отправку, чтобы показать состояние загрузки. */
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 700);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const hint = !showError('email') ? freeMailHint(values.email) : null;

  return (
    <Section id="demo" compact>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className="sb-title">{demo.title}</h2>
          <p className="sb-subtitle">{demo.subtitle}</p>

          <ul className={styles.bullets}>
            {demo.bullets.map((bullet) => (
              <li className={styles.bullet} key={bullet}>
                <span className={styles.bulletIcon} aria-hidden="true">
                  <IconCheck />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <p className={styles.contact}>
            Или напишите нам на <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>

        {status === 'sent' ? (
          <div className={styles.success} role="status" aria-live="polite">
            <span className={styles.successIcon} aria-hidden="true">
              <IconCheck />
            </span>
            <h3 className={styles.successTitle}>{demo.success.title}</h3>
            <p className={styles.successText}>{demo.success.text}</p>
            <Button variant="outline" onClick={reset}>
              {demo.success.again}
            </Button>
          </div>
        ) : (
          <form ref={formRef} className={styles.card} onSubmit={onSubmit} noValidate>
            <h3 className={styles.cardTitle}>{demo.formTitle}</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="demo-name">
                  Имя <span className={styles.required}>*</span>
                </label>
                <input
                  id="demo-name"
                  name="name"
                  className={[styles.control, showError('name') && styles.controlError]
                    .filter(Boolean)
                    .join(' ')}
                  placeholder="Алексей"
                  autoComplete="name"
                  value={values.name}
                  aria-invalid={Boolean(showError('name'))}
                  aria-describedby={showError('name') ? 'demo-name-error' : undefined}
                  onChange={(event) => setField('name', event.target.value)}
                  onBlur={() => blur('name')}
                />
                {showError('name') ? (
                  <p className={styles.error} id="demo-name-error">
                    {showError('name')}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="demo-company">
                  Компания <span className={styles.required}>*</span>
                </label>
                <input
                  id="demo-company"
                  name="company"
                  className={[styles.control, showError('company') && styles.controlError]
                    .filter(Boolean)
                    .join(' ')}
                  placeholder="Название или сайт"
                  autoComplete="organization"
                  value={values.company}
                  aria-invalid={Boolean(showError('company'))}
                  aria-describedby={showError('company') ? 'demo-company-error' : undefined}
                  onChange={(event) => setField('company', event.target.value)}
                  onBlur={() => blur('company')}
                />
                {showError('company') ? (
                  <p className={styles.error} id="demo-company-error">
                    {showError('company')}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="demo-email">
                Рабочий email <span className={styles.required}>*</span>
              </label>
              <input
                id="demo-email"
                name="email"
                type="email"
                inputMode="email"
                className={[styles.control, showError('email') && styles.controlError]
                  .filter(Boolean)
                  .join(' ')}
                placeholder="you@company.ru"
                autoComplete="email"
                value={values.email}
                aria-invalid={Boolean(showError('email'))}
                aria-describedby={
                  showError('email') ? 'demo-email-error' : hint ? 'demo-email-hint' : undefined
                }
                onChange={(event) => setField('email', event.target.value)}
                onBlur={() => blur('email')}
              />
              {showError('email') ? (
                <p className={styles.error} id="demo-email-error">
                  {showError('email')}
                </p>
              ) : null}
              {hint ? (
                <p className={styles.hint} id="demo-email-hint">
                  {hint}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="demo-team">
                Размер команды <span className={styles.required}>*</span>
              </label>
              <select
                id="demo-team"
                name="team"
                className={[styles.control, showError('team') && styles.controlError]
                  .filter(Boolean)
                  .join(' ')}
                value={values.team}
                aria-invalid={Boolean(showError('team'))}
                aria-describedby={showError('team') ? 'demo-team-error' : undefined}
                onChange={(event) => setField('team', event.target.value)}
                onBlur={() => blur('team')}
              >
                <option value="">Выберите вариант</option>
                {demo.teamSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {showError('team') ? (
                <p className={styles.error} id="demo-team-error">
                  {showError('team')}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="demo-task">
                Задача
              </label>
              <textarea
                id="demo-task"
                name="task"
                className={styles.control}
                placeholder="Например: собрать промо-страницы под четыре сегмента и баннеры к ним"
                value={values.task}
                onChange={(event) => setField('task', event.target.value)}
              />
            </div>

            <label
              className={[styles.consent, showError('consent') && styles.checkboxError]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                type="checkbox"
                name="consent"
                className={styles.checkboxInput}
                checked={values.consent}
                aria-invalid={Boolean(showError('consent'))}
                aria-describedby={showError('consent') ? 'demo-consent-error' : undefined}
                onChange={(event) => setField('consent', event.target.checked)}
                onBlur={() => blur('consent')}
              />
              <span className={styles.checkbox} aria-hidden="true" />
              <span>Согласен на обработку персональных данных</span>
            </label>
            {showError('consent') ? (
              <p className={styles.error} id="demo-consent-error">
                {showError('consent')}
              </p>
            ) : null}

            <Button type="submit" variant="dark" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? demo.sending : demo.submit}
            </Button>

            <p className={styles.note}>{demo.note}</p>
          </form>
        )}
      </div>
    </Section>
  );
}
