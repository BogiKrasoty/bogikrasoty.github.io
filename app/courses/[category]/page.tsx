import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCourses } from '@/lib/content';
import { notFound } from 'next/navigation';

const categoryMeta: Record<string, { name: string; description: string }> = {
  'base': { name: 'База', description: 'Курсы с нуля: маникюр, педикюр, наращивание — до профессии мастера.' },
  'advanced': { name: 'Повышение квалификации', description: 'Новые техники и дизайны для практикующих мастеров: короткие интенсивы и расширение навыков.' },
  'beauty': { name: 'Визаж, брови, ресницы', description: 'Визаж, брови и ресницы: короткие курсы для старта и развития.' },
  'permanent': { name: 'Перманентный макияж', description: 'Перманентный макияж бровей, межреснички и губ — освоение профессии.' },
  'tattoo': { name: 'Художественная татуировка', description: 'Художественная татуировка: базовая программа мастера.' },
};

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return [...new Set(courses.map(c => c.category))].map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const name = categoryMeta[category]?.name ?? category.replace(/-/g, ' ');
  return {
    title: `Курсы — ${name}`,
    description: `Курсы в направлении «${name}» в пространстве «Боги красоты».`,
    alternates: { canonical: `/courses/${category}` },
  };
}

export default async function CoursesCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const courses = (await getAllCourses()).filter(c => c.category === category);
  if (courses.length === 0) notFound();

  const displayName = categoryMeta[category]?.name ?? category.replace(/-/g, ' ');
  const displayDescription = categoryMeta[category]?.description ?? 'Курсы направления: программа, график и стоимость.';

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Обучение"
          title={displayName}
          description={displayDescription}
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              {courses.map((course, i) => (
                <Link
                  key={course.slug}
                  href={`/courses/${category}/${course.slug}`}
                  className="group flex items-baseline gap-4 py-8 border-b border-border-soft first:border-t hover:border-accent/35 transition-colors"
                >
                  <span className="font-display italic text-text-muted/50 text-lg w-8 shrink-0">0{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="display-3 text-2xl md:text-4xl text-text group-hover:text-accent transition-colors">
                      {course.title}
                    </h2>
                    {course.description && (
                      <p className="text-sm text-text-muted mt-3 max-w-xl leading-relaxed">{course.description}</p>
                    )}
                    {course.features && course.features.length > 0 && (
                      <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted/60 mt-4 hidden lg:block">
                        {course.features.slice(0, 4).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl text-accent block">{course.price}</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted/60 mt-1">{course.duration}</span>
                  </div>
                  <span className="il-arrow hidden md:block" aria-hidden>→</span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}