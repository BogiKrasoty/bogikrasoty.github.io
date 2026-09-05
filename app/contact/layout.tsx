import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Записаться',
  description: 'Запись в пространство «Боги красоты»: оставьте контакты — мастер перезвонит, уточнит детали и подберёт удобное время.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}