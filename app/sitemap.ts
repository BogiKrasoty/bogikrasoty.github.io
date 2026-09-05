import type { MetadataRoute } from 'next';
import { getAllCourses, getAllPortfolio, getAllServices, getAllTeachers, getServiceCategories } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getServiceCategories();
  const services = getAllServices();
  const courses = getAllCourses();
  const teachers = getAllTeachers();
  const portfolio = getAllPortfolio();

  const courseCategories = [...new Set(courses.map(c => c.category).filter(Boolean))] as string[];

  const staticPages: [string, number][] = [
    ['/', 1],
    ['/services', 0.9],
    ['/courses', 0.9],
    ['/teachers', 0.8],
    ['/portfolio', 0.8],
    ['/about', 0.6],
    ['/contact', 0.6],
    ['/contacts', 0.6],
    ['/privacy', 0.2],
    ['/consent', 0.2],
  ];

  const entries: (MetadataRoute.Sitemap[number] | null)[] = [
    ...staticPages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, priority })),
    ...categories.map(c => ({ url: `${SITE_URL}/services/${c.slug}`, priority: 0.8 })),
    ...services.map(s =>
      s.categorySlug ? { url: `${SITE_URL}/services/${s.categorySlug}/${s.slug}`, priority: 0.7 } : null,
    ),
    ...courseCategories.map(c => ({ url: `${SITE_URL}/courses/${c}`, priority: 0.8 })),
    ...courses
      .filter(c => c.category)
      .map(c => ({ url: `${SITE_URL}/courses/${c.category}/${c.slug}`, priority: 0.7 })),
    ...teachers.map(t => ({ url: `${SITE_URL}/teachers/${t.slug}`, priority: 0.6 })),
    ...portfolio.map(p => ({ url: `${SITE_URL}/portfolio/${p.slug}`, priority: 0.6 })),
  ];

  return entries.filter((e): e is MetadataRoute.Sitemap[number] => e !== null);
}