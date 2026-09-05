import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllCourses } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { notFound } from 'next/navigation';

const categoryMeta: Record<string, string> = {
  base: 'База',
  advanced: 'Повышение квалификации',
  beauty: 'Визаж, брови, ресницы',
  permanent: 'Перманентный макияж',
  tattoo: 'Художественная татуировка',
};

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses
    .filter(c => c.category)
    .map(c => ({ category: c.category, slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const course = (await getAllCourses()).find(c => c.slug === slug && c.category === category);
  if (!course) return { title: 'Курс не найден', robots: { index: false } };
  return {
    title: course.title,
    description: course.description ?? '',
    alternates: { canonical: `/courses/${category}/${slug}` },
  };
}

export default async function CourseDetail({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const course = (await getAllCourses()).find(c => c.slug === slug && c.category === category);
  if (!course) notFound();

  const { title, price, duration, description, image, content, features } = course;
  const showImage = hasPublicFile(image ?? null);
  const categoryLabel = categoryMeta[category] ?? category;

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        {/* ============ EDITORIAL HERO SPREAD ============ */}
        <section className="relative pt-36 md:pt-44 pb-10 md:pb-16 overflow-hidden">
          <div className="hero-glow top-[-20%] right-[-10%] w-[600px] h-[500px] bg-accent/[0.03]" />

          <div className="relative max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

              {/* LEFT COLUMN — Course Info */}
              <div className="lg:col-span-7 xl:col-span-6 pt-4 lg:pt-12">
                <p className="eyebrow text-accent mb-6">Обучение</p>

                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[0.95] text-text text-balance mb-8">
                  {title}
                </h1>

                {description && (
                  <p className="text-text-warm leading-relaxed text-lg md:text-xl max-w-xl mb-12">
                    {description}
                  </p>
                )}

                {/* Meta items — editorial list */}
                <dl className="space-y-8 max-w-xl">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 py-4 border-t border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Длительность</dt>
                    <dd className="font-display text-2xl md:text-3xl text-text text-right sm:text-left flex-1">
                      {duration ?? '—'}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 py-4 border-t border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Стоимость</dt>
                    <dd className="font-display text-2xl md:text-3xl text-accent text-right sm:text-left flex-1">
                      {price ?? 'по запросу'}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 py-4 border-t border-border-soft border-b border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Направление</dt>
                    <dd className="text-text-warm text-right sm:text-left flex-1">
                      {categoryLabel}
                    </dd>
                  </div>
                </dl>

                {/* CTA inline */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">
                    Оставить заявку
                  </Link>
                  <Link href="/courses" className="btn-editorial">
                    Все курсы
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN — Course Card */}
              <div className="lg:col-span-5 xl:col-span-6 relative">
                <div className="relative h-[620px] md:h-[700px] lg:h-[780px] xl:h-[860px] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 lg:ml-auto">

                  {showImage ? (
                    <>
                      <Image
                        src={image as string}
                        alt={title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        priority
                      />
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent rounded-lg pointer-events-none" />

                      {/* Card content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                        <p className="eyebrow text-accent mb-3">{categoryLabel}</p>
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-text leading-tight mb-4">
                          {title}
                        </h2>
                        {features && features.length > 0 && (
                          <ul className="space-y-3 text-sm md:text-base text-text-warm leading-relaxed max-w-xs">
                            {features.slice(0, 4).map((feature, i) => (
                              <li key={feature} className="flex items-start gap-3">
                                <span className="font-display italic text-text-muted/50 text-sm shrink-0 mt-0.5">
                                  0{i + 1}
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {features.length > 4 && (
                              <li className="flex items-start gap-3 text-accent">
                                <span className="font-display italic text-text-muted/50 text-sm shrink-0 mt-0.5">+</span>
                                <span>и ещё {features.length - 4} пунктов...</span>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="cover-panel h-full w-full rounded-lg bg-surface border border-border-soft flex flex-col">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent rounded-lg pointer-events-none" />

                      <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12">
                        <div>
                          <p className="eyebrow text-accent mb-3">{categoryLabel}</p>
                          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-text leading-tight">
                            {title}
                          </h2>
                        </div>

                        <div className="mt-8 space-y-4">
                          {duration && (
                            <div className="flex items-baseline justify-between gap-4">
                              <dt className="eyebrow text-text-muted/60">Длительность</dt>
                              <dd className="font-display text-2xl text-text">{duration}</dd>
                            </div>
                          )}
                          {price && (
                            <div className="flex items-baseline justify-between gap-4">
                              <dt className="eyebrow text-text-muted/60">Стоимость</dt>
                              <dd className="font-display text-2xl text-accent">{price}</dd>
                            </div>
                          )}
                        </div>

                        {features && features.length > 0 && (
                          <ul className="space-y-3 mt-8 border-t border-border-soft pt-8 text-sm text-text-warm leading-relaxed">
                            {features.slice(0, 5).map((feature, i) => (
                              <li key={feature} className="flex items-start gap-3">
                                <span className="font-display italic text-text-muted/50 text-sm shrink-0 mt-0.5">
                                  0{i + 1}
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {features.length > 5 && (
                              <li className="text-accent flex items-start gap-3">
                                <span className="font-display italic text-text-muted/50 text-sm shrink-0 mt-0.5">+</span>
                                <span>и ещё {features.length - 5} пунктов...</span>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============ ВХОДИТ В КУРС ============ */}
        {features && features.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Входит в курс">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="max-w-3xl">
                <p className="eyebrow text-accent mb-8">Входит в курс</p>
                <ul className="space-y-0">
                  {features.map((feature, i) => (
                    <li key={feature} className="flex items-baseline gap-5 py-6 border-b border-border-soft first:border-t">
                      <span className="font-display italic text-text-muted/50 w-10 shrink-0 text-lg md:text-xl">
                        0{i + 1}
                      </span>
                      <span className="text-lg md:text-xl text-text-warm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ============ COURSE CONTENT ============ */}
        {content && (
          <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Программа курса">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="max-w-3xl md-body">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </section>
        )}

        {/* ============ FINAL CTA ============ */}
        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Запись">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="gold-rule mb-10 md:mb-14" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <h2 className="display-2 text-3xl md:text-4xl text-text max-w-lg">
                Запишитесь на курс
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link href="/contact" className="btn-editorial btn-editorial-solid">
                  Оставить заявку
                </Link>
                <Link href="/courses" className="btn-editorial">
                  Все курсы
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}