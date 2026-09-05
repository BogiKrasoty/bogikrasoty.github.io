import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllPortfolio } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Портфолио',
  description: 'Работы мастеров и студентов пространства «Боги красоты»: до и после, детали, результаты.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioIndex() {
  const items = await getAllPortfolio();
  const first = items[0];
  const instagram = CONTACTS.socials.find(s => s.label === 'Instagram');

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Работы"
          title={<>Портфель<br />мастеров</>}
          description="Каждая работа — история трансформации. Смотрите детали, до и после, и выбирайте мастера по близкому стилю."
          meta={[
            { label: 'Направлений', value: '6' },
            { label: 'Работы', value: 'обновляются' },
          ]}
        />

        {/* Featured work */}
        {first && (
          <section className="py-16 md:py-24" aria-label="Избранные работы">
            <div className="max-w-7xl mx-auto px-6">
              <Reveal>
                <Link href={`/portfolio/${first.slug}`} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-stretch">
                    <div className="lg:col-span-8 relative">
                      {hasPublicFile(first.image ?? null) ? (
                        <div className="relative aspect-[4/5] lg:aspect-auto lg:absolute lg:inset-0 overflow-hidden">
                          <Image
                            src={first.image as string}
                            alt={first.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                          />
                        </div>
                      ) : (
                        <div className="cover-panel aspect-[4/5] lg:aspect-auto lg:absolute lg:inset-0 bg-surface border border-border-soft">
                          <span className="cover-monogram">БК</span>
                          <div className="relative z-10 w-full p-8 md:p-12">
                            <p className="eyebrow text-accent mb-3">
                              {first.category || 'Работа'}
                            </p>
                            <h2 className="display-2 text-3xl md:text-5xl text-text">{first.title}</h2>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-between gap-8 lg:pl-12">
                      <div className="pt-2">
                        <p className="eyebrow text-text-muted/60 mb-4">Избранное</p>
                        {first.description && (
                          <p className="text-text-warm leading-relaxed mb-6">{first.description}</p>
                        )}
                        <p className="text-sm text-text-muted/70 leading-relaxed">
                          Фотографии до и после, детали выполнения — как в студии, так и на улице.
                        </p>
                      </div>
                      <div>
                        <span className="btn-editorial group-hover:border-accent group-hover:text-accent transition-colors">
                          Смотреть работу <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          </section>
        )}

        {/* All works */}
        {items.length > 0 && (
          <section className="py-16 md:py-24" aria-label="Все работы">
            <div className="max-w-7xl mx-auto px-6">
              <Reveal>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                  <div>
                    <p className="eyebrow text-accent mb-4">Все работы</p>
                    <h2 className="display-2 text-3xl md:text-4xl text-text">
                      Итоги за последнее время
                    </h2>
                  </div>
                  <p className="text-text-muted text-sm max-w-sm leading-relaxed">
                    Каждая работа — отдельная история: смотрите детали и выбирайте мастера по близкому стилю.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.slice(1).map(item => {
                    const initial = item.title.trim()[0];
                    return (
                      <Link
                        key={item.slug}
                        href={`/portfolio/${item.slug}`}
                        className="group block"
                      >
                        <div className="cover-panel aspect-[4/5] bg-surface border border-border-soft group-hover:border-accent/40 transition-colors">
                          <span className="cover-monogram">{initial || 'БК'}</span>
                          <div className="relative z-10 w-full p-6 md:p-8 flex flex-col justify-end h-full">
                            {item.category && (
                              <p className="eyebrow text-accent mb-3">{item.category}</p>
                            )}
                            <h3 className="display-3 text-xl md:text-2xl text-text">
                              {item.title}
                            </h3>
                            {item.teacher && (
                              <p className="text-sm text-text-muted mt-3">{item.teacher}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* More works hint */}
        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Больше работ">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div>
                  <p className="eyebrow text-accent mb-5">Больше работ</p>
                  <h2 className="display-2 text-[clamp(28px,4.5vw,48px)] text-text max-w-xl">
                    Свежие результаты публикуем первыми в соцсетях
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                  {instagram && (
                    <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="btn-editorial">
                      Instagram*
                    </a>
                  )}
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться к мастеру</Link>
                </div>
                {instagram && (
                  <p className="text-[10px] leading-relaxed text-text-muted/60 max-w-[300px]">
                    * Instagram — социальная сеть, принадлежащая Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории Российской Федерации.
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}