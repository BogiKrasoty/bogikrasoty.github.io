import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTeachers, getAllPortfolio } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = (await getAllTeachers()).find(t => t.slug === slug);
  if (!teacher) return { title: 'Мастер не найден', robots: { index: false } };
  return {
    title: teacher.name,
    description: teacher.bio ?? '',
    alternates: { canonical: `/teachers/${slug}` },
  };
}

export default async function TeacherDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = (await getAllTeachers()).find(t => t.slug === slug);
  if (!teacher) notFound();

  const { name, specialization, bio, photo, socials } = teacher;
  const showPhoto = hasPublicFile(photo ?? null);
  const teacherWorks = (await getAllPortfolio()).filter(p => p.teacher === name);

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Мастер"
          title={name}
          meta={specialization ? [{ label: 'Специализация', value: specialization }] : undefined}
        />

        <section className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {showPhoto && (
                <div className="lg:col-span-5">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={photo as string} alt={name} fill className="object-cover" />
                  </div>
                </div>
              )}

              <div className={`${showPhoto ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col justify-between gap-10`}>
                <div>
                  {specialization && (
                    <p className="eyebrow text-accent mb-6">{specialization}</p>
                  )}
                  {bio ? (
                    <p className="lead max-w-2xl">{bio}</p>
                  ) : (
                    <p className="lead max-w-2xl text-text-muted/70">
                      Профиль мастера наполняется. Запишитесь на услугу, чтобы познакомиться и обсудить работу.
                    </p>
                  )}

                  <div className="gold-rule mt-12 w-24" />

                  {socials && socials.length > 0 && (
                    <div className="flex gap-8 mt-8">
                      {socials.map(s => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="eyebrow text-text-muted hover:text-accent transition-colors"
                        >
                          {s.label}{s.label === 'Instagram' ? '*' : ''}
                        </a>
                      ))}
                      {socials.some(s => s.label === 'Instagram') && (
                        <p className="text-[10px] leading-relaxed text-text-muted/60 max-w-[280px]">
                          * Instagram — социальная сеть, принадлежащая Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории Российской Федерации.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться к мастеру</Link>
                  <Link href="/teachers" className="btn-editorial">Вся команда</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" aria-label="Работы мастера">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <p className="eyebrow text-text-muted/60 mb-8">Работы мастера</p>
              {teacherWorks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacherWorks.map(work => {
                    const initial = work.title.trim()[0];
                    return (
                      <Link
                        key={work.slug}
                        href={`/portfolio/${work.slug}`}
                        className="group block"
                      >
                        <div className="cover-panel aspect-[4/5] bg-surface border border-border-soft group-hover:border-accent/40 transition-colors">
                          <span className="cover-monogram">{initial || 'БК'}</span>
                          <div className="relative z-10 w-full p-6 md:p-8 flex flex-col justify-end h-full">
                            {work.category && (
                              <p className="eyebrow text-accent mb-3">{work.category}</p>
                            )}
                            <h3 className="display-3 text-xl md:text-2xl text-text">
                              {work.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <p className="text-text-warm max-w-xl text-sm">
                    Портфолио этого мастера публикуем по мере накопления работ. Загляните в общий раздел — там работы всех направлений.
                  </p>
                  <Link href="/portfolio" className="link-line shrink-0">Смотреть портфолио</Link>
                </div>
              )}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}