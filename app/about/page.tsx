import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import about from '@/content/site/about.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас',
  description: '«Боги красоты» — премиальное beauty-пространство: услуги мастеров и обучение в одном месте.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow={about.pageHeader.eyebrow}
          title={<>{about.pageHeader.titleLine1}<br />{about.pageHeader.titleLine2}</>}
          description={about.pageHeader.description}
          meta={[
            { label: 'Город', value: about.pageHeader.metaCity },
            { label: 'Приём', value: about.pageHeader.metaReception },
          ]}
        />

        {/* Story */}
        <section className="py-16 md:py-24" aria-label="О нас">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <h2 className="display-2 text-3xl md:text-5xl text-text leading-[1.05]">
                    {about.story.title}
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal delay={80}>
                  <div className="space-y-6 text-text-warm leading-relaxed max-w-2xl">
                    {about.story.paragraphs.map((p, i) =>
                      i === 0 ? (
                        <p key={i} className="lead">{p}</p>
                      ) : (
                        <p key={i}>{p}</p>
                      )
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Stats — editorial index lines */}
        <section className="py-16 md:py-20" aria-label="Цифры">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="max-w-3xl">
                {about.stats.map((stat, i) => (
                  <div key={stat.label} className="index-line">
                    <span className="il-num">0{i + 1}</span>
                    <span className="font-display text-4xl md:text-6xl text-accent w-36 shrink-0">{stat.value}</span>
                    <span className="il-desc">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mission quote */}
        <section className="py-16 md:py-24" aria-label="Миссия">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="max-w-3xl">
                <div className="gold-rule mb-12" />
                <p className="eyebrow text-accent mb-6">{about.mission.eyebrow}</p>
                <blockquote className="font-display italic text-[clamp(28px,4.5vw,52px)] leading-[1.15] text-text">
                  {about.mission.text}
                </blockquote>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 border-t border-border-soft" aria-label="Ценности">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="eyebrow text-accent mb-5">{about.values.eyebrow}</p>
                <h2 className="display-2 text-3xl md:text-4xl text-text mb-6">{about.values.title}</h2>
              </div>
              <div className="lg:col-span-8">
                <Reveal>
                  {about.values.items.map((v, i) => (
                    <div key={v.name} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-7 border-b border-border-soft first:border-t items-baseline">
                      <span className="md:col-span-1 font-display italic text-text-muted/50">0{i + 1}</span>
                      <h3 className="md:col-span-4 display-3 text-xl md:text-2xl text-text">{v.name}</h3>
                      <p className="md:col-span-7 text-sm text-text-muted leading-relaxed">{v.text}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Visit / CTA */}
        <section className="py-20 md:py-28" aria-label="Приходите">
          <div className="max-w-7xl mx-auto px-6">
            <div className="gold-rule mb-10 md:mb-14" />
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <h2 className="display-2 text-[clamp(30px,5vw,54px)] text-text lg:col-span-8">
                  {about.visit.title}
                </h2>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-4">
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">{about.visit.ctaPrimaryText}</Link>
                  <Link href="/services" className="btn-editorial">{about.visit.ctaSecondaryText}</Link>
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