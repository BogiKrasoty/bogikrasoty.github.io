export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://god-beauty.ru').replace(/\/+$/, '');

export function absoluteUrl(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p === '/' ? '' : p}`;
}