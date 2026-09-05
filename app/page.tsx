import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import FaqSection from '@/components/FaqSection';
import Image from 'next/image';
import Link from 'next/link';
import { getAllServices, getAllCourses, getAllTeachers, getAllPortfolio, getAllReviews, getAllFaq, getServiceCategories } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { CONTACTS } from '@/lib/contacts';
import home from '@/content/site/home.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Боги красоты — услуги и обучение',
  description: 'Премиальное пространство красоты: ногти, визаж, брови, ресницы, перманент и тату. Услуги мастеров и профессиональные курсы.',
  alternates: { canonical: '/' },
};

const gradByContentSlug: Record<string, string> = {
  'nail-service': 'from-rose-950/70 via-red-900/30 to-transparent',
  'vizazh': 'from-violet-950/70 via-purple-900/30 to-transparent',
  'brow': 'from-amber-950/70 via-orange-900/30 to-transparent',
  'lashes': 'from-emerald-950/70 via-teal-900/30 to-transparent',
  'pmu': 'from-blue-950/70 via-indigo-900/30 to-transparent',
  'tattoo': 'from-zinc-900/80 via-stone-900/40 to-transparent',
};

export default async function HomePage() {
  const services = await getAllServices();
  const courses = await getAllCourses();
  const teachers = await getAllTeachers();
  const portfolio = await getAllPortfolio();
  const reviews = await getAllReviews();
  const faq = await getAllFaq();
  const serviceCategories = await getServiceCategories();

  const directions = serviceCategories.map((cat, i) => ({
    num: String(i + 1).padStart(2, '0'),
    name: cat.title,
    slug: cat.slug,
    desc: cat.description ?? '',
    grad: gradByContentSlug[cat.contentSlug] ?? 'from-zinc-900/80 via-stone-900/40 to-transparent',
  }));

  const featuredServices = services.slice(0, 4);
  const baseCourses = courses.filter(c => c.category === 'base');
  const featuredCourses = (baseCourses.length > 0 ? baseCourses : courses).slice(0, 3);
  const featuredTeachers = teachers.slice(0, 4);
  const featuredPortfolio = portfolio.slice(0, 1);

  const serviceHref = (s: { categorySlug?: string; slug: string }) =>
    s.categorySlug ? `/services/${s.categorySlug}/${s.slug}` : '/services';

  const courseHref = (c: { category?: string; slug: string }) =>
    c.category ? `/courses/${c.category}/${c.slug}` : '/courses';

  return (
    <>
      <Header />
      <main>
        {/* ============ HERO — full-bleed campaign ============ */}
        <section className="relative min-h-[100svh] w-full flex flex-col overflow-hidden grain">
          {/* full-bleed photograph as the hero canvas */}
          <Image
            src={home.hero.image}
            alt="Премиальная beauty-кампания «Боги красоты»"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover object-[75%_32%] md:object-[72%_36%] lg:object-[70%_38%] lg:origin-[85%_50%] lg:scale-[1.16]"
          />

          {/* controlled darkening: left stays calm for typography, right keeps the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-transparent to-transparent" />

          {/* editorial overlay — text lives over the photograph */}
          <div className="relative z-10 mx-auto w-full px-5 sm:px-7 lg:px-10 xl:px-14 flex flex-col min-h-[100svh] pt-[88px] sm:pt-[92px] md:pt-[104px] lg:pt-[112px] xl:pt-[120px]">
            {/* meta line */}
            <div className="flex items-center justify-between mb-5 md:mb-6 shrink-0">
              <p className="eyebrow text-text-muted/80">{home.hero.metaLeft}</p>
              <p className="eyebrow text-text-muted/80 hidden md:block">{home.hero.metaRight}</p>
            </div>

            {/* campaign statement + headline + description + CTA, left-anchored over image */}
            <div className="flex-1 flex flex-col justify-center pb-24 md:pb-14 lg:pb-16">
              <div className="flex items-center gap-8 mb-8 lg:mb-10 max-w-[46vw]">
                <p className="eyebrow text-accent whitespace-nowrap">{home.hero.eyebrow}</p>
                <div className="h-px flex-1 bg-accent/30" />
              </div>

              <h1 className="font-display">
                <span className="block text-text text-[clamp(48px,9.8vw,140px)] leading-[0.98]">{home.hero.titleLine1}</span>
                <span className="block text-outline text-[clamp(48px,9.8vw,140px)] leading-[0.98]">{home.hero.titleLine2}</span>
              </h1>

              <p className="font-display italic text-text-warm text-lg md:text-xl xl:text-2xl max-w-lg leading-snug mt-8 lg:mt-10">
                {home.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10 lg:mt-12">
                <Link href={home.hero.ctaPrimaryHref} className="btn-editorial btn-editorial-solid justify-center">
                  {home.hero.ctaPrimaryText}
                </Link>
                <Link href={home.hero.ctaSecondaryHref} className="btn-editorial justify-center">
                  {home.hero.ctaSecondaryText}
                </Link>
              </div>
            </div>

            {/* bottom indicator */}
            <div className="border-t border-white/10 py-5 flex items-center justify-between shrink-0">
              <p className="eyebrow text-text-muted/70">{home.hero.bottomLabel}</p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* ============ MARQUEE ============ */}
        <div className="marquee border-y border-border/60 py-5">
          <div className="marquee-track">
            {[0, 1].map(dup => (
              <span key={dup} className="inline-flex items-center gap-10 pr-10">
                {home.marquee.map(w => (
                  <span key={w} className="inline-flex items-center gap-10">
                    <span className="font-display italic text-text-muted/80 text-xl md:text-2xl">{w}</span>
                    <span className="text-accent/60 text-sm">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ============ НАПРАВЛЕНИЯ — editorial index ============ */}
        <section className="py-24 md:py-32" aria-label="Направления">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 md:items-end">
              <div>
                <p className="eyebrow text-accent mb-5">{home.directions.eyebrow}</p>
                <h2 className="font-display text-4xl md:text-6xl font-medium leading-none">
                  {home.directions.titleLine1}<br />{home.directions.titleLine2}
                </h2>
              </div>
              <p className="md:pb-3 text-text-muted max-w-sm md:ml-auto leading-relaxed">
                {home.directions.text}
              </p>
            </div>

            <Reveal>
              {directions.map(dir => (
                <Link
                  key={dir.slug}
                  href={`/services/${dir.slug}`}
                  className="index-row group flex flex-col md:flex-row md:items-center gap-3 md:gap-8 py-7 md:py-9 px-2"
                >
                  <div className={`index-bg bg-gradient-to-r ${dir.grad}`} />
                  <span className="relative z-10 index-num font-display italic text-text-muted/50 text-lg w-12 shrink-0">
                    {dir.num}
                  </span>
                  <h3 className="relative z-10 index-name font-display text-3xl md:text-5xl font-medium text-text/90 transition-colors">
                    {dir.name}
                  </h3>
                  <p className="relative z-10 index-desc text-text-muted text-sm md:text-base md:ml-auto max-w-xs">
                    {dir.desc}
                  </p>
                  <span className="relative z-10 index-arrow text-accent text-xl md:text-2xl ml-auto md:ml-6">
                    →
                  </span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============ УСЛУГИ — editorial price-list ============ */}
        <section className="py-24 md:py-32 border-t border-border" aria-label="Услуги">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Left — statement */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <p className="eyebrow text-accent mb-5">{home.services.eyebrow}</p>
                  <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] mb-6">
                    {home.services.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed mb-10">
                    {home.services.text}
                  </p>
                  <Link href="/services" className="btn-editorial">
                    {home.services.btnText} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              {/* Right — menu list */}
              <div className="lg:col-span-8">
                {featuredServices.length > 0 ? (
                  <Reveal>
                    <div>
                      {featuredServices.map((service, i) => (
                        <Link
                          key={service.slug}
                          href={serviceHref(service)}
                          className="group flex items-baseline gap-4 py-7 border-b border-border-soft first:pt-0 hover:border-accent/35 transition-colors"
                        >
                          <span className="font-display italic text-text-muted/40 text-base w-8 shrink-0">
                            0{i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-2xl md:text-3xl font-medium text-text group-hover:text-accent transition-colors">
                              {service.title}
                            </h3>
                            {service.description && (
                              <p className="text-sm text-text-muted mt-2 max-w-md leading-relaxed">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {service.price && (
                              <span className="font-display text-xl md:text-2xl text-accent">{service.price}</span>
                            )}
                            <span className="hidden md:block text-[11px] uppercase tracking-[0.2em] text-text-muted/60 mt-1">
                              {home.services.priceNote}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <p className="text-sm text-text-muted/70 mt-8 max-w-md leading-relaxed">
                        {home.services.note}
                      </p>
                      <div className="pt-8">
                        <Link href="/services" className="btn-editorial btn-editorial-solid">
                          {home.services.btnSolidText} <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                ) : (
                  <Reveal className="lg:py-16">
                    <p className="text-text-muted leading-relaxed">
                      Каталог услуг наполняется. Загляните на страницу услуг — там все направления и мастера.
                    </p>
                    <Link href="/contact" className="btn-editorial mt-8">
                      Записаться <span aria-hidden>→</span>
                    </Link>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ ОБУЧЕНИЕ — full width feature ============ */}
        {featuredCourses.length > 0 && (
          <section className="py-24 md:py-32 border-t border-border" aria-label="Обучение">
            <div className="max-w-7xl mx-auto px-6">
              <p className="eyebrow text-accent mb-5">{home.courses.eyebrow}</p>
              <h2 className="font-display text-4xl md:text-6xl font-medium leading-none mb-16">
                {home.courses.title}
              </h2>

              <Reveal>
                <div className="space-y-0">
                  {featuredCourses.map((course, i) => (
                    <Link
                      key={course.slug}
                      href={courseHref(course)}
                      className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-10 py-9 border-t border-border-soft md:last:border-b md:last:border-border-soft hover:border-accent/35 transition-colors"
                    >
                      <span className="font-display italic text-text-muted/40 text-lg w-14 shrink-0">
                        0{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-2xl md:text-4xl font-medium text-text group-hover:text-accent transition-colors">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-text-muted mt-2 max-w-lg leading-relaxed">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-6 md:ml-8 shrink-0">
                        {course.duration && (
                          <span className="text-sm uppercase tracking-[0.15em] text-text-muted">{course.duration}</span>
                        )}
                        {course.price && (
                          <span className="font-display text-2xl text-accent">{course.price}</span>
                        )}
                        <span className="text-accent text-2xl group-hover:translate-x-1.5 transition-transform">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>

              <div className="pt-12">
                <Link href="/courses" className="btn-editorial">
                  {home.courses.btnText} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============ ПОРТФОЛИО — feature cover ============ */}
        {featuredPortfolio.length > 0 && (
          <section className="py-24 md:py-32 border-t border-border" aria-label="Портфолио">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                {/* Cover visual */}
                <Reveal className="lg:col-span-7">
                  <Link
                    href={`/portfolio/${featuredPortfolio[0].slug}`}
                    className="group block relative aspect-[4/5] max-h-[560px] overflow-hidden bg-surface border border-border"
                  >
                    {hasPublicFile(featuredPortfolio[0].image ?? null) ? (
                      <Image
                        src={featuredPortfolio[0].image as string}
                        alt={featuredPortfolio[0].title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    ) : (
                      <div className="cover-panel absolute inset-0">
                        <span className="cover-monogram">БК</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent pointer-events-none" />
                    {featuredPortfolio[0].category && (
                      <span className="absolute top-5 left-5 eyebrow text-accent">
                        {featuredPortfolio[0].category}
                      </span>
                    )}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-display text-3xl md:text-4xl font-medium text-text">
                        {featuredPortfolio[0].title}
                      </h3>
                      <span className="link-line inline-block mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {home.portfolio.coverLinkText}
                      </span>
                    </div>
                  </Link>
                </Reveal>

                {/* Statement */}
                <div className="lg:col-span-5">
                  <Reveal delay={80}>
                    <p className="eyebrow text-accent mb-5">{home.portfolio.eyebrow}</p>
                    <h2 className="display-2 text-4xl md:text-6xl text-text mb-6">
                      {home.portfolio.titleLine1}<br />
                      <span className="text-outline">{home.portfolio.titleLine2}</span>
                    </h2>
                    <p className="text-text-muted leading-relaxed mb-10 max-w-md">
                      {home.portfolio.text}
                    </p>
                    <Link href="/portfolio" className="btn-editorial">
                      {home.portfolio.btnText} <span aria-hidden>→</span>
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============ ОТЗЫВЫ — editorial quotes ============ */}
        {reviews.length > 0 && (
          <section className="py-24 md:py-32 border-t border-border" aria-label="Отзывы">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
                <div>
                  <p className="eyebrow text-accent mb-5">{home.reviews.eyebrow}</p>
                  <h2 className="font-display text-4xl md:text-6xl font-medium leading-none">
                    {home.reviews.title}
                  </h2>
                </div>
                <p className="text-text-muted max-w-xs md:pb-2 leading-relaxed">
                  {home.reviews.text}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {reviews.map((review, i) => (
                  <Reveal key={review.slug} delay={i * 40}>
                    <figure className="border border-border-soft p-8 flex flex-col gap-6 h-full">
                      <blockquote className="text-text-muted leading-relaxed flex-1">
                        «{review.text}»
                      </blockquote>
                      <figcaption className="flex items-center justify-between gap-4 pt-5 border-t border-border-soft">
                        <span className="font-display text-lg text-text">{review.name}</span>
                        {review.service && (
                          <span className="text-sm text-accent">{review.service}</span>
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ МАСТЕРА — editorial covers ============ */}
        {featuredTeachers.length > 0 && (
          <section className="py-24 md:py-32 border-t border-border" aria-label="Мастера">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
                <div>
                  <p className="eyebrow text-accent mb-5">{home.teachers.eyebrow}</p>
                  <h2 className="font-display text-4xl md:text-6xl font-medium leading-none">
                    {home.teachers.title}
                  </h2>
                </div>
                <p className="text-text-muted max-w-xs md:pb-2 leading-relaxed">
                  {home.teachers.text}
                </p>
              </div>

              <div className="space-y-0">
                {featuredTeachers.map(teacher => {
                  const initials = teacher.name
                    .split(' ')
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('');
                  const showPhoto = hasPublicFile(teacher.photo ?? null);
                  return (
                    <Reveal key={teacher.slug}>
                      <Link
                        href={`/teachers/${teacher.slug}`}
                        className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center py-12 md:py-16 border-t border-border-soft first:border-t-0"
                      >
                        <div className="md:col-span-5 relative aspect-[4/5] max-h-[420px] overflow-hidden bg-surface border border-border-soft">
                          {showPhoto ? (
                            <Image
                              src={teacher.photo as string}
                              alt={teacher.name}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                          ) : (
                            <div className="cover-panel absolute inset-0">
                              <span className="cover-monogram">{initials || 'БК'}</span>
                            </div>
                          )}
                          <p className="eyebrow text-text-muted/70 absolute top-5 left-6 z-10">Мастер</p>
                        </div>

                        <div className="md:col-span-7">
                          <p className="eyebrow text-accent mb-4">{teacher.specialization}</p>
                          <h3 className="font-display text-4xl md:text-6xl font-medium leading-none text-text group-hover:text-accent transition-colors">
                            {teacher.name}
                          </h3>
                          {teacher.bio && (
                            <p className="text-text-muted leading-relaxed mt-6 max-w-lg">
                              {teacher.bio}
                            </p>
                          )}
                          <div className="mt-10">
                            <span className="btn-editorial">
                              {home.teachers.profileLabel} <span aria-hidden>→</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              <div className="pt-14">
                <Link href="/teachers" className="link-line">
                  {home.teachers.allLabel}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============ FAQ ============ */}
        {faq.length > 0 && (
          <section className="py-24 md:py-32 border-t border-border" aria-label="Вопросы и ответы">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                <Reveal className="lg:col-span-4">
                  <p className="eyebrow text-accent mb-5">Вопросы и ответы</p>
                  <h2 className="font-display text-4xl md:text-5xl font-medium leading-none text-text mb-6">
                    Частые<br />
                    <span className="text-outline">вопросы</span>
                  </h2>
                  <p className="text-text-muted leading-relaxed mb-10 max-w-sm">
                    Ответы на то, что спрашивают чаще всего. Не нашли свой вопрос — напишите нам, ответим лично.
                  </p>
                  <Link href="/contact" className="btn-editorial">
                    Задать вопрос <span aria-hidden>→</span>
                  </Link>
                </Reveal>
                <div className="lg:col-span-8">
                  <FaqSection items={faq} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============ ФИНАЛЬНЫЙ CTA ============ */}
        <section className="py-32 md:py-44 border-t border-border relative overflow-hidden grain" aria-label="Записаться">
          <div className="hero-glow top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/[0.05]" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <Reveal>
              <p className="eyebrow text-accent mb-8">Запишитесь сегодня</p>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95]">
                Начни своё<br />
                <span className="text-outline-accent italic">преображение</span>
              </h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto mt-10 mb-12 leading-relaxed">
                Оставьте заявку — мы подберём удобное время, мастера и решение именно под вас.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/contact" className="btn-editorial btn-editorial-solid">
                  Записаться
                </Link>
                <a href={CONTACTS.phoneHref} className="btn-editorial">
                  {CONTACTS.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center justify-center gap-8 mt-16">
                <a href={CONTACTS.emailHref} className="text-sm text-text-muted hover:text-accent transition-colors tracking-wide">
                  {CONTACTS.email}
                </a>
                <span className="text-accent/40">·</span>
                <span className="text-sm text-text-muted tracking-wide">Москва, приём по записи</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}