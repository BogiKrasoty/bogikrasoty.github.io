export interface Service {
  slug: string;
  title: string;
  price?: string;
  description?: string;
  image?: string;
  category: string; // внутренний slug категории (имя папки в content/services/)
  categorySlug?: string; // публичный slug категории (часть URL)
  content?: string; // markdown content rendered as HTML
  published?: boolean;
  order?: number;
}

export interface Course {
  slug: string;
  title: string;
  price?: string;
  duration?: string;
  description?: string;
  image?: string;
  category: string;
  content?: string; // markdown content rendered as HTML
  features?: string[]; // short benefits / deliverables
  published?: boolean;
  order?: number;
}

export interface Teacher {
  slug: string;
  name: string;
  specialization?: string;
  bio?: string;
  photo?: string;
  socials?: { label: string; href: string }[];
  published?: boolean;
  order?: number;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  image?: string;
  category: string;
  description?: string;
  teacher?: string;
  published?: boolean;
  order?: number;
}

export interface Review {
  slug: string;
  name: string;
  service?: string;
  text: string;
  published?: boolean;
  order?: number;
}

export interface FaqItem {
  slug: string;
  question: string;
  answer: string;
  published?: boolean;
  order?: number;
}