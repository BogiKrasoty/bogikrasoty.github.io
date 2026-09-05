import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Service, Course, Teacher, PortfolioItem, Review, FaqItem } from '@/lib/types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const DIRECTIONS_DIR = path.join(CONTENT_ROOT, 'directions');

export interface ServiceCategory {
  title: string;
  slug: string; // публичный slug — часть URL (/services/{slug})
  contentSlug: string; // внутренний slug — имя папки в content/services/
  description?: string;
  order?: number;
  published?: boolean;
}

function readJsonDir(dir: string): string[] {
  const fullPath = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter(f => f.endsWith('.md') && !f.startsWith('_'));
}

export function getServiceCategories(): ServiceCategory[] {
  const files = readJsonDir('directions');
  const categories: ServiceCategory[] = files.map(file => {
    const raw = fs.readFileSync(path.join(DIRECTIONS_DIR, file), 'utf8');
    const { data } = matter(raw);
    return {
      title: String(data.title ?? ''),
      slug: String(data.slug ?? file.replace(/\.md$/, '')),
      contentSlug: String(
        data.contentSlug ?? data.slug ?? file.replace(/\.md$/, '')
      ),
      description: data.description ? String(data.description) : undefined,
      order: typeof data.order === 'number' ? data.order : undefined,
      published: data.published === undefined ? true : Boolean(data.published),
    };
  });
  return sortByOrder(categories.filter(c => c.title && c.slug && c.published !== false));
}

export function getServiceCategoriesBySlug(): Map<string, ServiceCategory> {
  return new Map(getServiceCategories().map(c => [c.slug, c]));
}

export function getServiceCategoriesByContentSlug(): Map<string, ServiceCategory> {
  return new Map(getServiceCategories().map(c => [c.contentSlug, c]));
}

function parseMarkdown<T>(filePath: string): T {
  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);
  // Контент в файлах — markdown (###, списки), страницам нужен готовый HTML.
  const html = marked.parse(content ?? '') as string;
  return { ...(data as Partial<T>), content: html } as T;
}

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = a.item.order ?? Infinity;
      const bo = b.item.order ?? Infinity;
      if (ao !== bo) return ao - bo;
      return a.index - b.index;
    })
    .map(x => x.item);
}

function publishedOnly<T extends { published?: boolean }>(items: T[]): T[] {
  return items.filter(item => item.published !== false);
}

export function getAllServices(): Service[] {
  const servicesRoot = path.join(CONTENT_ROOT, 'services');
  const services: Service[] = [];
  const publicByContent = getServiceCategoriesByContentSlug();

  function walk(dir: string, category: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, entry);
      } else if (stat.isFile() && entry.endsWith('.md') && !entry.startsWith('_')) {
        if (!category) continue;
        const slug = entry.replace(/\.md$/, '');
        const data = parseMarkdown<Service>(fullPath);
        const finalCategory = data.category ?? category;
        const categoryMeta = publicByContent.get(finalCategory);
        services.push({
          ...data,
          slug,
          category: finalCategory,
          categorySlug: categoryMeta?.slug,
        });
      }
    }
  }

  walk(servicesRoot, '');
  return sortByOrder(publishedOnly(services));
}

export function getAllCourses(): Course[] {
  const coursesRoot = path.join(CONTENT_ROOT, 'courses');
  const courses: Course[] = [];

  function walk(dir: string, category: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, entry);
      } else if (stat.isFile() && entry.endsWith('.md')) {
        const slug = entry.replace(/\.md$/, '');
        const data = parseMarkdown<Course>(fullPath);
        const finalCategory = data.category ?? category;
        courses.push({ ...data, slug, category: finalCategory });
      }
    }
  }

  walk(coursesRoot, '');
  return sortByOrder(publishedOnly(courses));
}

export function getAllTeachers(): Teacher[] {
  const files = readJsonDir('teachers');
  return sortByOrder(
    publishedOnly(
      files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const data = parseMarkdown<Teacher>(path.join(CONTENT_ROOT, 'teachers', file));
        return { ...data, slug };
      })
    )
  );
}

export function getAllPortfolio(): PortfolioItem[] {
  const files = readJsonDir('portfolio');
  return sortByOrder(
    publishedOnly(
      files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const data = parseMarkdown<PortfolioItem>(path.join(CONTENT_ROOT, 'portfolio', file));
        return { ...data, slug };
      })
    )
  );
}

export function getAllReviews(): Review[] {
  const files = readJsonDir('reviews');
  return sortByOrder(
    publishedOnly(
      files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const data = parseMarkdown<Review>(path.join(CONTENT_ROOT, 'reviews', file));
        return { ...data, slug };
      })
    )
  );
}

export function getAllFaq(): FaqItem[] {
  const files = readJsonDir('faq');
  return sortByOrder(
    publishedOnly(
      files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const data = parseMarkdown<FaqItem>(path.join(CONTENT_ROOT, 'faq', file));
        return { ...data, slug };
      })
    )
  );
}