import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCourses } from '@/lib/content';
import type { Course } from '@/lib/types';
import coursesData from '@/content/site/courses.json';

export const metadata: Metadata = {
  title: 'Обучение',
  description: 'Профессиональные курсы обучения для будущих мастеров красоты: маникюр, педикюр, визаж, брови, ресницы, перманент и тату.',
  alternates: { canonical: '/courses' },
};

const categoryOrder = ['base', 'advanced', 'beauty', 'permanent', 'tattoo'];

const categoryMeta: Record<string, { name: string; description: string; wide: boolean }> = {
  'base': {
    name: 'База',
    description: 'Курсы с нуля: маникюр, педикюр, наращивание — до профессии мастера.',
    wide: true,
  },
  'advanced': {
    name: 'Повышение квалификации',
    description: 'Новые техники и дизайны для практикующих мастеров: короткие интенсивы и расширение навыков.',
    wide: false,
  },
  'beauty': {
    name: 'Визаж, брови, ресницы',
    description: 'Визаж, брови и ресницы: короткие курсы для старта и развития.',
    wide: false,
  },
  'permanent': {
    name: 'Перманентный макияж',
    description: 'Перманентный макияж бровей, межреснички и губ — освоение профессии.',
    wide: false,
  },
  'tattoo': {
    name: 'Художественная татуировка',
    description: 'Художественная татуировка: базовая программа мастера.',
    wide: false,
  },
};

export default async function CoursesIndex() {
  const courses = await getAllCourses();
  const groups = categoryOrder
    .map((category, i) => ({ category, ...categoryMeta[category], index: i, courses: courses.filter(c => c.category === category) }))
    .filter(group => group.courses.length > 0);

  const totalCourses = courses.length;

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow={coursesData.pageHeader.eyebrow}
          title={<>{coursesData.pageHeader.titleLine1}<br />{coursesData.pageHeader.titleLine2}</>}
          description={coursesData.pageHeader.description}
          meta={[
            { label: 'Курсов в каталоге', value: String(totalCourses) },
            { label: 'Формат', value: 'теория + практика' },
            { label: 'Старт', value: 'по набору' },
            ...(coursesData.pageHeader.price
              ? [{ label: 'От', value: coursesData.pageHeader.price as string }]
              : []),
          ]}
        />

        <section className="py-16 md:py-24" aria-label="Курсы">
          <div className="max-w-7xl mx-auto px-6">
            {groups.map(group => (
              <Reveal key={group.category}>
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-14 border-t border-border first:border-t-0 lg:py-20`}>
                  <header className={`lg:col-span-5 ${group.wide ? 'lg:col-span-5' : 'lg:col-span-4'}`}>
                    <span className="font-display italic text-text-muted/50 text-2xl">0{group.index + 1}</span>
                    <h2 className="display-2 text-4xl md:text-5xl text-text mt-5">{group.name}</h2>
                    <p className="eyebrow text-text-muted/60 mt-4">{group.courses.length} курс{group.courses.length === 1 ? '' : group.courses.length < 5 ? 'а' : 'ов'}</p>
                    <p className="text-sm text-text-muted mt-8 max-w-sm leading-relaxed hidden lg:block">
                      {group.description}
                    </p>
                  </header>

                  <div className="lg:col-span-7">
                    {group.courses.map((course: Course, j) => (
                      <Link
                        key={course.slug}
                        href={`/courses/${course.category}/${course.slug}`}
                        className="group flex items-baseline gap-4 py-6 border-b border-border-soft first:border-t hover:border-accent/35 transition-colors"
                      >
                        <span className="font-display italic text-text-muted/50 text-lg w-10 shrink-0 hidden sm:block">
                          0{group.index + 1}.0{j + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="display-3 text-xl md:text-2xl text-text group-hover:text-accent transition-colors">
                            {course.title}
                          </h3>
                          {course.description && (
                            <p className="text-sm text-text-muted mt-2 max-w-xl leading-relaxed hidden md:block">
                              {course.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted/60 block">
                            {course.duration ?? '1 день'}
                          </span>
                          <span className="font-display text-xl md:text-2xl text-accent block mt-1">{course.price}</span>
                        </div>
                        <span className="il-arrow hidden md:block" aria-hidden>→</span>
                      </Link>
                    ))}

                    {group.wide && (
                      <Link href="/contact" className="mt-8 inline-block link-line text-sm text-text-warm">
                        Записаться на курс в «Боги красоты»
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-20 md:py-28" aria-label="Запись на обучение">
          <div className="max-w-7xl mx-auto px-6">
            <div className="gold-rule mb-10 md:mb-14" />
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <h2 className="display-2 text-[clamp(30px,5vw,54px)] text-text lg:col-span-7">
                  Обучение ведут практикующие мастера — те, кто работает с клиентами каждый день.
                </h2>
                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Оставить заявку</Link>
                  <Link href="/teachers" className="btn-editorial">Познакомиться с командой</Link>
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