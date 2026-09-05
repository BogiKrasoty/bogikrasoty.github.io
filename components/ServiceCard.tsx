import Image from 'next/image';
import Link from 'next/link';
import { hasPublicFile } from '@/lib/media';

interface ServiceCardProps {
  href: string;
  title: string;
  description?: string;
  price?: string;
  image?: string;
  categoryLabel?: string;
}

export default function ServiceCard({ href, title, description, price, image, categoryLabel }: ServiceCardProps) {
  const showImage = hasPublicFile(image ?? null);
  const monogram = (title?.trim()?.charAt(0) ?? 'Б').toUpperCase();

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden border border-border-soft bg-surface transition-colors duration-300 hover:border-accent/40"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-light">
        {showImage ? (
          <Image
            src={image as string}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="cover-panel absolute inset-0">
            <span className="cover-monogram">{monogram}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/5 to-transparent pointer-events-none" />
        {categoryLabel && (
          <span className="absolute left-4 top-4 border border-white/10 bg-primary/70 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-text-warm backdrop-blur-sm">
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-[26px] font-medium leading-[1.15] text-text transition-colors duration-300 group-hover:text-accent">
          {title}
        </h3>
        {description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">{description}</p>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-5">
            <div className="min-w-0">
              {price ? (
                <span className="font-display block truncate text-xl text-accent">{price}</span>
              ) : (
                <span className="block text-sm text-text-muted">по запросу</span>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-muted transition-colors duration-300 group-hover:text-accent">
              Подробнее
              <span aria-hidden className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
