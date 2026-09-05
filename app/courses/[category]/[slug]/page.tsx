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

interface ContentSection {
  heading: string;
  body: string;
}

// Режем HTML тела на секции по <h2>: «Программа» — вправо,
// «Результат» — в короткий блок, остальное — в левую колонку «О курсе».
function splitSections(html: string): ContentSection[] {
  const parts = html.split(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const sections: ContentSection[] = [];
  const lead = (parts[0] ?? '').trim();
  if (lead) sections.push({ heading: '', body: parts[0] });
  for (let i = 1; i < parts.length; i += 2) {
    sections.push({ heading: (parts[i] ?? '').trim(), body: parts[i + 1] ?? '' });
  }
  return sections;
}

function programItems(body: string): string[] {
  const items: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) items.push(m[1].trim());
  return items;
}

export default async function CourseDetail({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const course = (await getAllCourses()).find(c => c.slug === slug && c.category === category);
  if (!course) notFound();

  const { title, titleLines, price, duration, description, image, content, features } = course;
  const showImage = hasPublicFile(image ?? null);
  const categoryLabel = categoryMeta[category] ?? category;

  const sections = content ? splitSections(content) : [];
  const program = sections.find(s => s.heading === 'Программа');
  const result = sections.find(s => s.heading === 'Результат');
  const rest = sections.filter(s => s !== program && s !== result);
  const programList = program ? programItems(program.body) : [];
  const priceLine = [price, duration].filter(Boolean).join(' · ');

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-32">
        {/* ============ HERO — двухколоночный spread, в пределах экрана ============ */}
        <section className="relative pt-28 md:pt-36 pb-8 md:pb-12 overflow-hidden">
          <div className="hero-glow top-[-20%] right-[-10%] w-[600px] h-[500px] bg-accent/[0.03]" />

          <div className="relative max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* LEFT — информация, шире */}
              <div className="lg:col-span-7">
                <p className="eyebrow text-accent mb-5">Обучение</p>

                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.02] text-text mb-7">
                  {titleLines && titleLines.length > 0
                    ? titleLines.map(line => (
                        <span key={line} className="block">{line}</span>
                      ))
                    : <span className="block text-balance">{title}</span>}
                </h1>

                {description && (
                  <p className="text-text-warm leading-relaxed text-lg md:text-xl max-w-xl mb-8">
                    {description}
                  </p>
                )}

                {/* Характеристики — компактно */}
                <dl className="max-w-xl">
                  <div className="flex items-baseline justify-between gap-4 py-3 border-t border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Длительность</dt>
                    <dd className="font-display text-xl md:text-2xl text-text text-right">
                      {duration ?? '—'}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3 border-t border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Стоимость</dt>
                    <dd className="font-display text-xl md:text-2xl text-accent text-right">
                      {price ?? 'по запросу'}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3 border-t border-b border-border-soft">
                    <dt className="eyebrow text-text-muted/60 shrink-0">Направление</dt>
                    <dd className="text-text-warm text-right">
                      {categoryLabel}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">
                    Оставить заявку
                  </Link>
                  <Link href="/courses" className="btn-editorial">
                    Все курсы
                  </Link>
                </div>
              </div>

              {/* RIGHT — большой постер курса, целиком */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-[62vh] min-h-[480px] md:h-[68vh] lg:h-[74vh] lg:max-h-[800px] max-w-sm md:max-w-md lg:max-w-none mx-auto w-full">

                  {showImage ? (
                    <>
                      <Image
                        src={image as string}
                        alt={title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent rounded-lg pointer-events-none" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                        <p className="eyebrow text-accent mb-3">{categoryLabel}</p>
                        <h2 className="font-display text-2xl md:text-3xl font-medium text-text leading-tight mb-4">
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

        {/* ============ ВХОДИТ В КУРС — editorial list, шире ============ */}
        {features && features.length > 0 && (
          <section className="py-14 md:py-20 border-t border-border-soft" aria-label="Входит в курс">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="eyebrow text-accent mb-8">Входит в курс</p>
                  <ul className="space-y-0">
                    {features.map((feature, i) => (
                      <li key={feature} className="flex items-baseline gap-5 py-5 border-b border-border-soft first:border-t">
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
            </div>
          </section>
        )}

        {/* ============ О КУРСЕ + ПРОГРАММА — двухколоночный контент ============ */}
        {program && programList.length > 0 ? (
          <section className="py-14 md:py-20 border-t border-border-soft" aria-label="О курсе и программа">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <p className="eyebrow text-accent mb-8">О курсе</p>
                  {rest.map((s, i) => (
                    <div key={i} className="mb-10 last:mb-0">
                      {s.heading && (
                        <h3 className="font-display text-2xl md:text-3xl font-medium text-text leading-tight mb-4">
                          {s.heading}
                        </h3>
                      )}
                      <div className="md-body" dangerouslySetInnerHTML={{ __html: s.body }} />
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="eyebrow text-accent mb-8">Программа</p>
                  <ol className="space-y-0">
                    {programList.map((item, i) => (
                      <li key={i} className="flex items-baseline gap-5 py-5 border-b border-border-soft first:border-t">
                        <span className="font-display italic text-text-muted/50 w-10 shrink-0 text-lg md:text-xl">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="text-lg md:text-xl text-text-warm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        ) : (
          rest.length > 0 && (
            <section className="py-14 md:py-20 border-t border-border-soft" aria-label="О курсе">
              <div className="max-w-[1400px] mx-auto px-6">
                <div className="max-w-3xl">
                  <p className="eyebrow text-accent mb-8">О курсе</p>
                  {rest.map((s, i) => (
                    <div key={i} className="mb-10 last:mb-0">
                      {s.heading && (
                        <h3 className="font-display text-2xl md:text-3xl font-medium text-text leading-tight mb-4">
                          {s.heading}
                        </h3>
                      )}
                      <div className="md-body" dangerouslySetInnerHTML={{ __html: s.body }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        )}

        {/* ============ РЕЗУЛЬТАТ — короткий сильный блок ============ */}
        {result && (
          <section className="py-12 md:py-16 border-t border-border-soft" aria-label="Результат">
            <div className="max-w-[1400px] mx-auto px-6">
              <p className="eyebrow text-accent mb-5">Результат</p>
              <div
                className="text-text text-lg md:text-2xl leading-relaxed max-w-4xl font-display"
                dangerouslySetInnerHTML={{ __html: result.body }}
              />
            </div>
          </section>
        )}

        {/* ============ CTA — компактно ============ */}
        <section className="py-12 md:py-16 border-t border-border-soft" aria-label="Запись">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="gold-rule mb-8" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="display-2 text-3xl md:text-5xl text-text">
                  Запишитесь на курс
                </h2>
                {priceLine && (
                  <p className="font-display text-xl md:text-2xl text-accent mt-4">
                    {priceLine}
                  </p>
                )}
              </div>
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
