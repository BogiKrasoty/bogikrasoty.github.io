'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { CONTACTS } from '@/lib/contacts';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          topic: fd.get('topic'),
          message: fd.get('message'),
          company: fd.get('company'),
        }),
      });
      if (!res.ok) throw new Error('send_failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
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
              Оставьте контакты и опишите запрос — мастер перезвонит, уточнит детали и подберёт удобное время.
            </p>
          </div>
        </header>

        <section className="py-10 md:py-16" aria-label="Форма записи">
          <div className="max-w-7xl mx-auto px-6">
            {status === 'success' ? (
              <div className="max-w-2xl py-10">
                <div className="gold-rule mb-12 w-24" />
                <p className="eyebrow text-accent mb-6">Заявка отправлена</p>
                <h2 className="display-2 text-4xl md:text-5xl text-text mb-6">Мы свяжемся с вами в ближайшее время</h2>
                <p className="text-text-warm leading-relaxed mb-10 max-w-xl">
                  Мастер перезвонит, ответит на вопросы и подберёт удобное время. Если запрос срочный — позвоните нам напрямую.
                </p>
                <Link href="/services" className="btn-editorial">Пока посмотреть услуги</Link>
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

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="lg:col-span-7 space-y-8"
                >
                  <div
                    aria-hidden="true"
                    className="fixed top-0 left-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
                  >
                    <label htmlFor="company">Не заполняйте это поле</label>
                    <input type="text" name="company" id="company" tabIndex={-1} autoComplete="off" />
                  </div>

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
                      <select name="topic" id="topic" className="input-editorial">
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
                    <button type="submit" disabled={status === 'sending'} className="btn-editorial btn-editorial-solid disabled:opacity-60 disabled:pointer-events-none">
                      {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
                    </button>
                    <p className="text-xs text-text-muted/60 leading-relaxed max-w-xs">
                      Отправляя форму, вы соглашаетесь на обработку персональных данных в соответствии с{' '}
                      <Link href="/consent" className="underline decoration-accent/40 hover:text-accent transition-colors">согласием</Link>{' '}
                      и{' '}
                      <Link href="/privacy" className="underline decoration-accent/40 hover:text-accent transition-colors">политикой конфиденциальности</Link>.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="border border-accent/40 bg-accent/[0.06] px-5 py-4 max-w-xl">
                      <p className="text-sm text-text leading-relaxed">
                        Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.
                      </p>
                    </div>
                  )}
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