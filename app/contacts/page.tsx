import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { CONTACTS } from '@/lib/contacts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контактная информация пространства «Боги красоты»: телефон, почта, адрес, соцсети, карта.',
  alternates: { canonical: '/contacts' },
};

const contacts = [
  { num: '01', label: 'Телефон', value: CONTACTS.phoneDisplay, href: CONTACTS.phoneHref },
  { num: '02', label: 'Почта', value: CONTACTS.email, href: CONTACTS.emailHref },
  { num: '03', label: 'Адрес', value: CONTACTS.addressFull, href: null },
  { num: '04', label: 'Часы работы', value: CONTACTS.workingHours, href: null },
  ...CONTACTS.maps.map((m, i) => ({
    num: String(5 + i).padStart(2, '0'),
    label: m.label,
    value: m.label,
    href: m.href,
  })),
];

const socials = CONTACTS.socials;

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Контакты"
          title={<>Мы на<br />связи</>}
          description="Записаться можно по телефону, в мессенджерах или через форму на сайте — отвечаем в течение дня."
        />

        <section className="py-16 md:py-24" aria-label="Контакты">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="max-w-3xl">
                {contacts.map(c => {
                  const inner = (
                    <>
                      <span className="il-num">{c.num}</span>
                      <div className="flex-1 min-w-0">
                        <p className="eyebrow text-text-muted mb-2">{c.label}</p>
                        <span className={`il-title ${c.href ? '' : 'pointer-events-none'} inline-block`}>{c.value}</span>
                      </div>
                      {c.href && <span className="il-arrow" aria-hidden>→</span>}
                    </>
                  );
                  return c.href ? (
                    <a key={c.num} href={c.href} className="index-line group">{inner}</a>
                  ) : (
                    <div key={c.num} className="index-line">{inner}</div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Как нас найти">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-4">
                  <p className="eyebrow text-accent mb-5">Как нас найти</p>
                  <h2 className="display-2 text-3xl md:text-4xl text-text mb-6">10 этаж, офис 21</h2>
                  <p className="text-text-warm leading-relaxed max-w-sm mb-8">
                    {CONTACTS.addressFull}. Метро и район — уточняйте при записи, подскажем удобный маршрут.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={CONTACTS.maps[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-editorial"
                    >
                      Открыть в Яндекс Картах
                    </a>
                    <a
                      href={CONTACTS.maps[1].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-editorial"
                    >
                      Открыть в 2ГИС
                    </a>
                  </div>
                </div>
                <div className="md:col-span-8">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
                    <iframe
                      src={`https://yandex.ru/map-widget/v1/?um=constructor%3A${CONTACTS.ymapsConstructor}`}
                      title="Боги красоты на карте — Москва, ул. Осенняя, д. 23, офис 21"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full border border-border-soft"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Соцсети">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                <div className="md:col-span-4">
                  <p className="eyebrow text-accent mb-5">Соцсети</p>
                  <h2 className="display-2 text-3xl md:text-4xl text-text mb-6">Следите за работой</h2>
                </div>
                <div className="md:col-span-8">
                  <div className="flex flex-col">
                    {socials.map(s => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-6 border-b border-border-soft first:border-t hover:border-accent/35 transition-colors"
                      >
                        <span className="display-3 text-2xl md:text-3xl text-text group-hover:text-accent transition-colors">
                          {s.label}{s.label === 'Instagram' ? '*' : ''}
                        </span>
                        <span className="il-arrow" aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                  {socials.some(s => s.label === 'Instagram') && (
                    <p className="text-[10px] leading-relaxed text-text-muted/60 max-w-[300px] mt-5">
                      * Instagram — социальная сеть, принадлежащая Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории Российской Федерации.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}