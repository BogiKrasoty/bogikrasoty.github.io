'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { CONTACTS } from '@/lib/contacts';

type Step = 'form' | 'choose' | 'success';

const TOPIC_LABELS: Record<string, string> = {
  'nail-service': 'Ногтевой сервис',
  vizazh: 'Визаж',
  brow: 'Брови',
  lashes: 'Ресницы',
  pmu: 'Перманентный макияж',
  tattoo: 'Тату',
  course: 'Обучение',
};

// Цифры телефона салона — для wa.me и tg://resolve?phone=.
const SALON_DIGITS = CONTACTS.phoneHref.replace('tel:', '');

interface Lead {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
}

function buildText(lead: Lead): string {
  const lines = [
    'Новая заявка с сайта «Боги красоты»',
    '',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : 'Email: не указан',
    `Направление: ${TOPIC_LABELS[lead.topic] ?? lead.topic}`,
    lead.message ? `Сообщение: ${lead.message}` : 'Сообщение: не указано',
  ];
  return lines.join('\n');
}

export default function ContactPage() {
  const [step, setStep] = useState<Step>('form');
  const [lead, setLead] = useState<Lead | null>(null);
  const [channel, setChannel] = useState<'whatsapp' | 'telegram' | null>(null);

  function handleContinue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLead({
      name: String(fd.get('name') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      topic: String(fd.get('topic') ?? 'nail-service'),
      message: String(fd.get('message') ?? '').trim(),
    });
    setStep('choose');
  }

  const text = lead ? buildText(lead) : '';
  const waHref = `https://wa.me/${SALON_DIGITS}?text=${encodeURIComponent(text)}`;
  const tgHref = `tg://resolve?phone=${SALON_DIGITS}`;

  async function openTelegram() {
    // tg://-ссылка не умеет подставлять текст — кладём его в буфер обмена.
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* буфер недоступен — пользователь скопирует текст с экрана */
    }
    setChannel('telegram');
    window.location.href = tgHref;
    setStep('success');
  }

  function openWhatsApp() {
    setChannel('whatsapp');
    window.open(waHref, '_blank', 'noopener');
    setStep('success');
  }

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <header className="relative pt-36 md:pt-44 pb-14 md:pb-20 overflow-hidden">
          <div className="hero-glow top-[-30%] right-[-10%] w-[500px] h-[420px] bg-accent/[0.04]" />
          <div className="relative max-w-7xl mx-auto px-6">
            <p className="eyebrow text-accent mb-6">Запись</p>
            <h1 className="display-1 text-[clamp(48px,8vw,112px)] text-text">Записаться</h1>
            <div className="gold-rule mt-10 md:mt-14 w-24" />
            <p className="lead max-w-xl mt-8">
              Оставьте контакты и опишите запрос — заявка уйдёт в мессенджер, мастер перезвонит и подберёт удобное время.
            </p>
          </div>
        </header>

        <section className="py-10 md:py-16" aria-label="Форма записи">
          <div className="max-w-7xl mx-auto px-6">
            {step === 'success' && lead ? (
              <div className="max-w-2xl py-10">
                <div className="gold-rule mb-12 w-24" />
                <p className="eyebrow text-accent mb-6">Заявка готова</p>
                <h2 className="display-2 text-4xl md:text-5xl text-text mb-6">
                  {channel === 'telegram' ? 'Откройте Telegram и вставьте текст' : 'Нажмите «Отправить» в чате'}
                </h2>
                <p className="text-text-warm leading-relaxed mb-10 max-w-xl">
                  {channel === 'telegram'
                    ? 'Чат с салоном открыт в приложении, текст заявки скопирован — вставьте его и отправьте. Мастер перезвонит и подберёт удобное время.'
                    : 'Чат WhatsApp открыт в новой вкладке — нажмите «Отправить», и мастер свяжется с вами в ближайшее время.'}
                </p>
                <div className="border border-border-soft bg-surface p-6 mb-10 max-w-xl">
                  <p className="eyebrow text-text-muted/60 mb-4">Текст заявки</p>
                  <p className="text-sm text-text-warm whitespace-pre-line leading-relaxed">{text}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep('form')} className="btn-editorial">
                    Заполнить заново
                  </button>
                  <Link href="/services" className="btn-editorial">Пока посмотреть услуги</Link>
                </div>
              </div>
            ) : step === 'choose' && lead ? (
              <div className="max-w-2xl">
                <p className="eyebrow text-accent mb-6">Шаг 2 из 2</p>
                <h2 className="display-2 text-4xl md:text-5xl text-text mb-6">Как вам удобно связаться?</h2>
                <p className="text-text-muted leading-relaxed mb-10 max-w-xl">
                  {lead.name}, заявка собрана — выберите мессенджер, и она откроется готовым сообщением.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <button
                    onClick={openWhatsApp}
                    className="group border border-border-soft bg-surface p-7 text-left transition-colors duration-300 hover:border-accent/40"
                  >
                    <span className="font-display text-2xl text-text group-hover:text-accent transition-colors">WhatsApp</span>
                    <span className="block text-sm text-text-muted mt-2 leading-relaxed">
                      Откроется чат с готовым текстом — нажмите «Отправить»
                    </span>
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-muted group-hover:text-accent transition-colors mt-5">
                      Открыть чат <span aria-hidden>→</span>
                    </span>
                  </button>

                  <button
                    onClick={openTelegram}
                    className="group border border-border-soft bg-surface p-7 text-left transition-colors duration-300 hover:border-accent/40"
                  >
                    <span className="font-display text-2xl text-text group-hover:text-accent transition-colors">Telegram</span>
                    <span className="block text-sm text-text-muted mt-2 leading-relaxed">
                      Откроется приложение, текст заявки скопируется — вставьте его в чат
                    </span>
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-muted group-hover:text-accent transition-colors mt-5">
                      Открыть чат <span aria-hidden>→</span>
                    </span>
                  </button>
                </div>

                <p className="text-xs text-text-muted/60 leading-relaxed max-w-xl mb-10">
                  * WhatsApp — мессенджер, принадлежащий Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории Российской Федерации.
                </p>

                <button onClick={() => setStep('form')} className="link-line">
                  ← Назад к форме
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
                {/* Aside */}
                <div className="lg:col-span-5">
                  <p className="eyebrow text-accent mb-8">Удобные способы</p>
                  <div className="space-y-6 text-sm">
                    <div className="flex items-baseline justify-between gap-6 border-b border-border-soft pb-5">
                      <span className="eyebrow text-text-muted/60">Телефон</span>
                      <a href={CONTACTS.phoneHref} className="text-text hover:text-accent transition-colors">{CONTACTS.phoneDisplay}</a>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 border-b border-border-soft pb-5">
                      <span className="eyebrow text-text-muted/60">Почта</span>
                      <a href={CONTACTS.emailHref} className="text-text hover:text-accent transition-colors">{CONTACTS.email}</a>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted/70 mt-8 leading-relaxed max-w-sm">
                    Бронируем время после подтверждения мастера. За 2 часа до визита напомним о записи.
                  </p>
                </div>

                {/* Form — шаг 1 */}
                <form
                  onSubmit={handleContinue}
                  className="lg:col-span-7 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="eyebrow text-text-muted block mb-3">Имя</label>
                      <input type="text" name="name" id="name" required placeholder="Как к вам обращаться" className="input-editorial" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="eyebrow text-text-muted block mb-3">Телефон</label>
                      <input type="tel" name="phone" id="phone" required placeholder="+7 (___)-___-__-__" className="input-editorial" />
                    </div>
                    <div>
                      <label htmlFor="email" className="eyebrow text-text-muted block mb-3">Email <span className="normal-case tracking-normal">(необязательно)</span></label>
                      <input type="email" name="email" id="email" placeholder="email@example.com" className="input-editorial" />
                    </div>
                    <div>
                      <label htmlFor="topic" className="eyebrow text-text-muted block mb-3">Направление</label>
                      <select name="topic" id="topic" className="input-editorial" defaultValue="nail-service">
                        <option value="nail-service">Ногтевой сервис</option>
                        <option value="vizazh">Визаж</option>
                        <option value="brow">Брови</option>
                        <option value="lashes">Ресницы</option>
                        <option value="pmu">Перманентный макияж</option>
                        <option value="tattoo">Тату</option>
                        <option value="course">Обучение</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="eyebrow text-text-muted block mb-3">Сообщение</label>
                    <textarea name="message" id="message" rows={3} placeholder="Опишите, что нужно сделать" className="input-editorial resize-none" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
                    <button type="submit" className="btn-editorial btn-editorial-solid">
                      Продолжить <span aria-hidden>→</span>
                    </button>
                    <p className="text-xs text-text-muted/60 leading-relaxed max-w-xs">
                      Далее вы выберете мессенджер — WhatsApp или Telegram. Отправляя форму, вы соглашаетесь на обработку персональных данных в соответствии с{' '}
                      <Link href="/consent" className="underline decoration-accent/40 hover:text-accent transition-colors">согласием</Link>{' '}
                      и{' '}
                      <Link href="/privacy" className="underline decoration-accent/40 hover:text-accent transition-colors">политикой конфиденциальности</Link>.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
