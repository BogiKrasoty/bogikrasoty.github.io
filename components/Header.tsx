'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CONTACTS } from '@/lib/contacts';

const navLinks = [
  { href: '/services', label: 'Услуги' },
  { href: '/courses', label: 'Обучение' },
  { href: '/teachers', label: 'Мастера' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main bar */}
      <div className="bg-gradient-to-b from-primary/90 via-primary/35 to-transparent border-b border-white/5">
        <div className="mx-auto w-full px-5 sm:px-7 lg:px-10 xl:px-14 flex items-center justify-between gap-6 xl:gap-10 h-[80px] sm:h-[84px] md:h-[88px] lg:h-[96px] xl:h-[100px]">
          <Link href="/" className="flex items-center gap-3 md:gap-4 lg:gap-5 shrink-0 group">
            <span className="flex h-[58px] w-[58px] sm:h-[64px] sm:w-[64px] md:h-[72px] md:w-[72px] lg:h-[86px] lg:w-[86px] xl:h-[92px] xl:w-[92px] items-center justify-center ring-1 ring-accent/45">
              <Image
                src="/logo.webp"
                alt="Боги красоты"
                width={1254}
                height={1254}
                className="h-[86%] w-[86%] object-contain brightness-[1.28] contrast-[1.05]"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[18px] sm:text-[20px] md:text-[23px] lg:text-[27px] xl:text-[30px] tracking-[0.02em] text-text">
                Боги красоты
              </span>
              <span className="mt-[6px] text-[10px] sm:text-[10px] md:text-[11px] lg:text-[12px] lowercase tracking-[0.45em] text-accent">
                beauty·space
              </span>
            </span>
          </Link>

          <nav className="hidden min-[1366px]:flex items-center gap-9 2xl:gap-12 shrink-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[13px] xl:text-[14px] uppercase tracking-[0.15em] text-text-muted hover:text-text transition-colors"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1.5 h-px w-0 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <a
              href={CONTACTS.phoneHref}
              className="hidden md:inline-flex text-[15px] text-text-muted hover:text-accent transition-colors tracking-wide"
            >
              {CONTACTS.phoneDisplay}
            </a>
            <Link
              href={CONTACTS.bookingHref}
              className="sm:hidden inline-flex items-center text-[11px] uppercase tracking-[0.15em] text-accent border-b border-accent/40 pb-0.5"
            >
              {CONTACTS.bookingLabel}
            </Link>
            <Link
              href={CONTACTS.bookingHref}
              className="hidden sm:inline-flex items-center gap-2 text-[13px] xl:text-[14px] uppercase tracking-[0.18em] text-text hover:text-accent transition-colors border-b border-accent/50 pb-1"
            >
              {CONTACTS.bookingLabel}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="min-[1366px]:hidden flex flex-col items-center justify-center w-10 h-11 text-text-muted hover:text-accent transition-colors gap-1.5"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="min-[1366px]:hidden bg-primary border-b border-border">
          <nav className="mx-auto w-full flex flex-col px-5 sm:px-7 lg:px-10 xl:px-14 py-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 text-sm uppercase tracking-[0.18em] text-text-muted hover:text-accent transition-colors border-b border-border/60 last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={CONTACTS.bookingHref}
              onClick={() => setMenuOpen(false)}
              className="btn-editorial btn-editorial-solid mt-6 justify-center"
            >
              {CONTACTS.bookingLabel}
            </Link>
            <a
              href={CONTACTS.phoneHref}
              className="py-4 text-sm text-text-muted hover:text-accent transition-colors mt-2 text-center"
            >
              {CONTACTS.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}