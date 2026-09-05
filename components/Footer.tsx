import Link from 'next/link';
import Image from 'next/image';
import { CONTACTS } from '@/lib/contacts';

const navLinks = [
  { href: '/services', label: 'Услуги' },
  { href: '/courses', label: 'Обучение' },
  { href: '/teachers', label: 'Мастера' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

const socialIcons: Record<string, string> = {
  VK: 'M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.86 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  TikTok: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
};

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <span className="flex h-[52px] w-[52px] items-center justify-center ring-1 ring-accent/40">
                <Image src="/logo.webp" alt="Боги красоты" width={1254} height={1254} className="h-[86%] w-[86%] object-contain brightness-[1.28] contrast-[1.05]" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg tracking-[0.02em] text-text">Боги красоты</span>
                <span className="mt-[5px] text-[10px] lowercase tracking-[0.45em] text-accent">beauty·space</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted mt-3 max-w-xs leading-relaxed">
              Премиальное пространство красоты и обучения мастеров нового уровня.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <h3 className="eyebrow text-text-muted mb-3">Навигация</h3>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-text-muted hover:text-accent transition-colors w-fit">
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <h3 className="eyebrow text-text-muted mb-4">Контакты</h3>
            <p className="text-sm text-text-muted block mb-2">
              {CONTACTS.address}
            </p>
            <a href={CONTACTS.phoneHref} className="text-sm text-text hover:text-accent transition-colors block mb-2">
              {CONTACTS.phoneDisplay}
            </a>
            <a href={CONTACTS.emailHref} className="text-sm text-text-muted hover:text-accent transition-colors block mb-6">
              {CONTACTS.email}
            </a>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {CONTACTS.maps.map(m => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-accent transition-colors"
                >
                  {m.label} ↗
                </a>
              ))}
            </div>

            <div className="flex gap-3">
              {CONTACTS.socials.map(social => {
                const icon = socialIcons[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent text-text-muted transition-colors"
                    aria-label={`${social.label}${social.label === 'Instagram' ? '*' : ''}`}
                  >
                    {icon ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d={icon} />
                      </svg>
                    ) : (
                      <span className="text-xs font-display">{social.label[0]}</span>
                    )}
                    {social.label === 'Instagram' && (
                      <span className="absolute -top-1 -right-1 text-[10px] leading-none text-accent" aria-hidden>
                        *
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
            {CONTACTS.socials.some(s => s.label === 'Instagram') && (
              <p className="text-[10px] leading-relaxed text-text-muted/60 max-w-[260px] mt-4">
                * Instagram — социальная сеть, принадлежащая Meta Platforms Inc., деятельность которой признана экстремистской и запрещена на территории Российской Федерации.
              </p>
            )}
          </div>
        </div>

        <div className="rule mt-16" />

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Боги красоты. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-text-muted hover:text-accent transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/consent" className="text-xs text-text-muted hover:text-accent transition-colors">
              Согласие на обработку данных
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
