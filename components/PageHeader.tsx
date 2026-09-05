import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  meta?: { label: string; value: string }[];
}

export default function PageHeader({ eyebrow, title, description, meta }: PageHeaderProps) {
  return (
    <header className="relative pt-36 md:pt-44 pb-14 md:pb-20 overflow-hidden">
      <div className="hero-glow top-[-30%] right-[-10%] w-[500px] h-[420px] bg-accent/[0.04]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <p className="eyebrow text-accent mb-6">{eyebrow}</p>
        <h1 className="display-2 text-[clamp(44px,7vw,100px)] text-text text-balance">
          {title}
        </h1>
        <div className="gold-rule mt-10 md:mt-14 w-24" />
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {description && (
            <p className="lead max-w-xl">{description}</p>
          )}
          {meta && meta.length > 0 && (
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {meta.map(m => (
                <div key={m.label}>
                  <p className="eyebrow text-text-muted/60 mb-1">{m.label}</p>
                  <p className="text-sm text-text">{m.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}