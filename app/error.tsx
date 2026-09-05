'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Site error:', error);
  }, [error]);

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center">
      <div className="hero-glow top-[-10%] right-[-8%] w-[420px] h-[360px] bg-accent/[0.04]" />
      <div className="relative max-w-7xl mx-auto px-6 w-full py-20">
        <p className="eyebrow text-accent mb-6">Ошибка</p>
        <h1 className="display-1 text-[clamp(44px,7vw,104px)] text-text">
          Что-то пошло<br />не так
        </h1>
        <div className="gold-rule mt-10 w-24" />
        <p className="lead max-w-xl mt-8">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу — если проблема повторится, свяжитесь с нами.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button onClick={reset} className="btn-editorial btn-editorial-solid">Попробовать снова</button>
          <Link href="/" className="btn-editorial">На главную</Link>
        </div>
      </div>
    </main>
  );
}