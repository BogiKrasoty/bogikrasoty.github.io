import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllPortfolio } from '@/lib/content';
import { hasPublicFile } from '@/lib/media';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getAllPortfolio()).find(i => i.slug === slug);
  if (!item) return { title: 'Работа не найдена', robots: { index: false } };
  return {
    title: item.title,
    description: item.description ?? '',
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = (await getAllPortfolio()).find(i => i.slug === slug);
  if (!item) notFound();

  const { title, image, description, category, teacher } = item;
  const showImage = hasPublicFile(image ?? null);

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-36">
        <PageHeader
          eyebrow={category || 'Работа'}
          title={title}
          meta={teacher ? [{ label: 'Мастер', value: teacher }] : undefined}
        />

        <section className="py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            {showImage ? (
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden mb-14 max-w-xl mx-auto">
                <Image src={image as string} alt={title} fill className="object-cover" />
              </div>
            ) : (
              <div className="cover-panel aspect-[3/4] md:aspect-[4/5] bg-surface border border-border-soft mb-14 max-w-xl mx-auto">
                <span className="cover-monogram">БК</span>
                <div className="relative z-10 w-full p-8 md:p-12">
                  <p className="eyebrow text-accent mb-3">До / После</p>
                  <h2 className="display-2 text-3xl md:text-5xl text-text">{title}</h2>
                </div>
              </div>
            )}

            {description && (
              <div className="md-body mb-14">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="gold-rule mb-10" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <h2 className="display-2 text-3xl md:text-4xl text-text max-w-lg">
                Нравится результат? Запишитесь к мастеру
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link href="/contact" className="btn-editorial btn-editorial-solid">Записаться</Link>
                <Link href="/portfolio" className="btn-editorial">Все работы</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}