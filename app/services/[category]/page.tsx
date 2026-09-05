import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllServices, getServiceCategories, getServiceCategoriesBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getServiceCategories().map(c => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getServiceCategoriesBySlug().get(category);
  if (!cat) return { title: 'Услуги' };
  return {
    title: cat.title,
    description: cat.description ?? `Услуги в направлении «${cat.title}» в пространстве «Боги красоты».`,
    alternates: { canonical: `/services/${category}` },
  };
}

export default async function ServicesCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoriesBySlug = getServiceCategoriesBySlug();
  const categories = getServiceCategories();

  const cat = categoriesBySlug.get(category);
  if (!cat) notFound();

  const services = await getAllServices();
  const filtered = services.filter(s => s.category === cat.contentSlug);

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
          title={cat.title}
          description={cat.description ?? 'Услуги направления в пространстве «Боги красоты».'}
          meta={[
            { label: 'Услуг', value: `${filtered.length} ${plural(filtered.length, 'позиция', 'позиции', 'позиций')}` },
            { label: 'Запись', value: 'по телефону или на сайте' },
          ]}
        />

        <section className="py-16 md:py-24" aria-label="Услуги направления">
          <div className="max-w-7xl mx-auto px-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {filtered.map((service, i) => (
                  <Reveal key={service.slug} delay={(i % 3) * 60} className="h-full">
                    <ServiceCard
                      href={`/services/${cat.slug}/${service.slug}`}
                      title={service.title}
                      description={service.description}
                      price={service.price}
                      image={service.image}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <div className="max-w-2xl py-10">
                  <h2 className="display-3 text-2xl md:text-3xl text-text mb-6">Скоро здесь появятся работы</h2>
                  <p className="lead text-sm mb-10">
                    Направление уже работает, каталог услуг наполняется мастерами. Напишите или позвоните — подберём решение.
                  </p>
                  <Link href="/contact" className="btn-editorial btn-editorial-solid">Задать вопрос</Link>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <section className="py-16" aria-label="Другие направления">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <p className="eyebrow text-text-muted/60 mb-6">Другие направления</p>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {categories
                  .filter(c => c.slug !== cat.slug)
                  .map(c => (
                    <Link key={c.slug} href={`/services/${c.slug}`} className="link-line">
                      {c.title}
                    </Link>
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