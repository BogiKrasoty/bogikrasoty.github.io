import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative pt-36 md:pt-44 pb-28 md:pb-36 overflow-hidden">
        <div className="hero-glow top-[-10%] right-[-8%] w-[420px] h-[360px] bg-accent/[0.04]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="eyebrow text-accent mb-6">404</p>
          <h1 className="display-1 text-[clamp(44px,7vw,104px)] text-text">
            Страница<br />не найдена
          </h1>
          <div className="gold-rule mt-10 md:mt-14 w-24" />
          <p className="lead max-w-xl mt-8">
            Возможно, эта страница была перемещена или удалена. Вернитесь на главную или посмотрите услуги и обучение.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/" className="btn-editorial btn-editorial-solid">На главную</Link>
            <Link href="/services" className="btn-editorial">Услуги</Link>
            <Link href="/courses" className="btn-editorial">Обучение</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}