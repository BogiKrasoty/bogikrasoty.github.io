import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllServices, getServiceCategoriesBySlug } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const services = await getAllServices();
  const categoriesBySlug = getServiceCategoriesBySlug();
  return services
    .filter(s => s.category && categoriesBySlug.get(s.categorySlug ?? ''))
    .map(s => ({ category: s.categorySlug, slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const cat = getServiceCategoriesBySlug().get(category);
  const service = (await getAllServices()).find(s => s.slug === slug && s.category === cat?.contentSlug);
  if (!service) return { title: 'Услуга не найдена', robots: { index: false } };
  return {
    title: service.title,
    description: service.description ?? '',
    alternates: { canonical: `/services/${category}/${slug}` },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const cat = getServiceCategoriesBySlug().get(category);
  if (!cat) notFound();

  const service = (await getAllServices()).find(s => s.slug === slug && s.category === cat.contentSlug);
  if (!service) notFound();

  const { title, price, description, image, content } = service;
  const showImage = hasPublicFile(image ?? null);

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow="Услуга"
          title={title}
          description={description}
          meta={[
            { label: 'Направление', value: cat.title },
            { label: 'Стоимость', value: price ?? 'по запросу' },
          ]}
        />

        <section className="py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            {showImage ? (
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden mb-14 max-w-xl mx-auto">
                <Image src={image as string} alt={title} fill className="object-cover" />
              </div>
            ) : (
              <div className="cover-panel aspect-[3/4] md:aspect-[4/5] bg-surface border border-border-soft mb-14 max-w-xl mx-auto">
                <span className="cover-monogram">S</span>
                <div className="relative z-10 flex items-end justify-between gap-6 w-full p-8 md:p-12">
                  <div>
                    <p className="eyebrow text-accent mb-3">{cat.title}</p>
                    <h2 className="display-3 text-2xl md:text-4xl text-text">{title}</h2>
                  </div>
                  {price && <span className="font-display text-3xl md:text-4xl text-accent">{price}</span>}
                </div>
              </div>
            )}

            {content && (
              <div className="md-body mb-14">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}
          </div>

          <div className="max-w-6xl mx-auto px-6 mt-4">
            <div className="gold-rule mb-10" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <h2 className="display-2 text-3xl md:text-4xl text-text max-w-lg">
                Запишитесь на эту услугу
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться</Link>
                <Link href="/services" className="btn-editorial">Все услуги</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}