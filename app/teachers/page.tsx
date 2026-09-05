import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllTeachers } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';

export const metadata: Metadata = {
  title: 'Мастера',
  description: 'Мастера и преподаватели пространства «Боги красоты» — люди, которые делают вас красивее.',
  alternates: { canonical: '/teachers' },
};

export default async function TeachersIndex() {
  const teachers = await getAllTeachers();

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Мастера"
          title={<>Мастера<br />пространства</>}
          description="Те, кто работает с вами каждый день: действующие специалисты и преподаватели новых поколений мастеров."
          meta={[
            { label: 'Мастеров', value: String(teachers.length || 1) },
            { label: 'Опыт', value: 'от 5 лет' },
          ]}
        />

        <section className="py-16 md:py-24" aria-label="Мастера">
          <div className="max-w-7xl mx-auto px-6">
            {teachers.length > 0 ? (
              <Reveal>
                {teachers.map((teacher, i) => {
                  const showPhoto = hasPublicFile(teacher.photo ?? null);
                  return (
                  <Link
                    key={teacher.slug}
                    href={`/teachers/${teacher.slug}`}
                    className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-9 border-b border-border-soft first:border-t hover:border-accent/35 transition-colors"
                  >
                    <span className="font-display italic text-text-muted/50 text-lg w-12 shrink-0">
                      0{i + 1}
                    </span>
                    {showPhoto && (
                      <span className="relative block w-24 h-28 md:w-28 md:h-32 shrink-0 overflow-hidden rounded-sm">
                        <Image
                          src={teacher.photo as string}
                          alt={teacher.name}
                          fill
                          sizes="128px"
                          className="object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                        />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="display-3 text-3xl md:text-5xl text-text group-hover:text-accent transition-colors">
                        {teacher.name}
                      </h2>
                      {teacher.specialization && (
                        <p className="eyebrow text-text-muted mt-3">{teacher.specialization}</p>
                      )}
                    </div>
                    {teacher.bio && (
                      <p className="text-sm text-text-muted max-w-md leading-relaxed hidden lg:block">
                        {teacher.bio}
                      </p>
                    )}
                    <span className="il-arrow" aria-hidden>→</span>
                  </Link>
                  );
                })}
              </Reveal>
            ) : (
              <Reveal>
                <div className="max-w-2xl py-10">
                  <h2 className="display-3 text-2xl md:text-3xl text-text mb-6">Мастера собираются</h2>
                  <p className="text-sm text-text-warm leading-relaxed mb-10">
                    Скоро здесь появятся действующие мастера и преподаватели. А пока вы можете записаться на услугу — мы подберём специалиста.
                  </p>
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться</Link>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Направления мастеров">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <p className="eyebrow text-text-muted/60 mb-6">Направления команды</p>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {['Ногтевой сервис', 'Визаж', 'Брови', 'Ресницы', 'Перманентный макияж', 'Тату'].map(dir => (
                  <Link key={dir} href="/services" className="link-line">{dir}</Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}