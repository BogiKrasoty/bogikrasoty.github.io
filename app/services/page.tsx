import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllServices, getServiceCategories } from '@/lib/content';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description: 'Все направления и услуги пространства «Боги красоты»: ногти, визаж, брови, ресницы, перманентный макияж, тату.',
  alternates: { canonical: '/services' },
};

export default async function ServicesIndex() {
  const services = await getAllServices();
  const serviceCategories = await getServiceCategories();

  const categories = serviceCategories
    .filter(c => services.some(s => s.category === c.contentSlug))
    .map((c, i) => ({ ...c, num: String(i + 1).padStart(2, '0') }));

  const plural = (n: number, one: string, few: string, many: string) => {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Услуги"
          title="Услуги"
          description="Шесть направлений, в которых работают мастера «Боги красоты». Выберите своё — от ухода до перманента."
          meta={[
            { label: 'Направлений', value: String(categories.length) },
            { label: 'Приём', value: 'по записи' },
            { label: 'Город', value: 'Москва' },
          ]}
        />

        {/* Directions index */}
        <section className="py-16 md:py-24" aria-label="Направления">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="flex items-baseline justify-between mb-8 md:mb-12">
                <h2 className="display-3 text-2xl md:text-3xl text-text">Направления</h2>
                <span className="eyebrow text-text-muted/60 hidden sm:block">индекс</span>
              </div>
              {categories.map(cat => (
                <Link key={cat.slug} href={`/services/${cat.slug}`} className="index-line group">
                  <span className="il-num">{cat.num}</span>
                  <span className="flex-1 min-w-0">
                    <span className="il-title block text-balance">{cat.title}</span>
                    <span className="il-desc hidden md:block mt-2">{cat.description}</span>
                  </span>
                  <span className="il-arrow" aria-hidden>→</span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Actual services menu — grouped photo cards */}
        {services.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Услуги и цены">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <p className="eyebrow text-accent mb-5">Услуги и цены</p>
                  <h2 className="display-2 text-3xl md:text-5xl text-text">
                    Меню<br />мастеров
                  </h2>
                </div>
                <p className="text-sm text-text-muted leading-relaxed max-w-sm md:text-right md:pb-2">
                  Стоимость зависит от сложности и расходников. Точную цену мастер назовёт после консультации.
                </p>
              </div>

              <div className="space-y-14 md:space-y-20">
                {categories.map(cat => {
                  const catServices = services.filter(s => s.category === cat.contentSlug);
                  if (catServices.length === 0) return null;
                  return (
                    <div key={cat.slug}>
                      <div className="mb-7 md:mb-8 flex items-baseline justify-between gap-6 border-b border-border-soft pb-5">
                        <Link href={`/services/${cat.slug}`} className="group flex min-w-0 items-baseline gap-4">
                          <span className="font-display italic text-text-muted/50 text-base shrink-0">{cat.num}</span>
                          <span className="display-3 text-2xl md:text-3xl text-text transition-colors group-hover:text-accent">
                            {cat.title}
                          </span>
                        </Link>
                        <div className="flex shrink-0 items-center gap-5">
                          <span className="text-sm text-text-muted/70">
                            {catServices.length} {plural(catServices.length, 'услуга', 'услуги', 'услуг')}
                          </span>
                          <Link href={`/services/${cat.slug}`} className="link-line hidden sm:inline-block">
                            Все →
                          </Link>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {catServices.map((service, i) => (
                          <Reveal key={service.slug} delay={(i % 3) * 60} className="h-full">
                            <ServiceCard
                              href={service.categorySlug ? `/services/${service.categorySlug}/${service.slug}` : '/services'}
                              title={service.title}
                              description={service.description}
                              price={service.price}
                              image={service.image}
                            />
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-text-muted/70 mt-12 max-w-xl leading-relaxed">
                Прайс по остальным направлениям — у мастеров перед записью. Напишите нам, и мы сориентируем.
              </p>
            </div>
          </section>
        )}

        {/* Booking strip */}
        <section className="py-20 md:py-28" aria-label="Запись">
          <div className="max-w-7xl mx-auto px-6">
            <div className="gold-rule mb-10 md:mb-14" />
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <h2 className="display-2 text-[clamp(30px,5vw,58px)] text-text max-w-2xl">
                  Не уверены, что выбрать? Мастер подберёт под вас.
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться</Link>
                  <a href={CONTACTS.phoneHref} className="btn-editorial">{CONTACTS.phoneDisplay}</a>
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