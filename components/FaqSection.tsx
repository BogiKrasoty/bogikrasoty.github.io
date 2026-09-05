'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/types';

export default function FaqSection({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);

  return (
    <div className="mt-12 max-w-3xl">
      {items.map(faq => {
        const isOpen = open === faq.slug;
        return (
          <div
            key={faq.slug}
            className="border-t border-border-soft first:border-t-0"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.slug)}
              aria-expanded={isOpen}
              className="w-full py-6 flex items-center justify-between gap-6 text-left group"
            >
              <span className="display-3 text-lg md:text-xl text-text group-hover:text-accent transition-colors">
                {faq.question}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-2xl text-accent leading-none transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="pb-7 text-text-muted leading-relaxed md:pr-16">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}