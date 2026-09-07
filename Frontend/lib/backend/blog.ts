import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { BlogPost, BlogListItem } from '@/types';
import { BLOG_POSTS } from '@/lib/data';

function getBlogDir(): string | null {
  const localDir = path.join(process.cwd(), 'content', 'blog');
  if (fs.existsSync(localDir)) {
    return localDir;
  }
  const monorepoDir = path.join(process.cwd(), 'Frontend', 'content', 'blog');
  if (fs.existsSync(monorepoDir)) {
    return monorepoDir;
  }
  return null;
}

export function computeReadingTime(content: string): number {
  try {
    const stats = readingTime(content);
    return Math.ceil(stats.minutes) || 1;
  } catch {
    return 1;
  }
}

export function parseBlogFile(dir: string, filename: string): BlogListItem | null {
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!data.title || !data.slug) {
      return null;
    }

    const calculatedReadingTime =
      typeof data.readingTime === 'number' && data.readingTime > 0
        ? data.readingTime
        : computeReadingTime(content);

    return {
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
      readingTime: calculatedReadingTime,
      coverImageUrl: typeof data.coverImageUrl === 'string' ? data.coverImageUrl : undefined,
      relatedTechnologies: Array.isArray(data.relatedTechnologies) ? data.relatedTechnologies : [],
      draft: Boolean(data.draft),
    };
  } catch {
    return null;
  }
}

export function getAllBlogPosts(): BlogListItem[] {
  const dir = getBlogDir();
  if (!dir) {
    return BLOG_POSTS.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description || p.excerpt || '',
      tags: p.tags || [],
      publishedAt: p.publishedAt || p.date || '',
      readingTime: p.readingTime || 3,
      draft: false,
    }));
  }

  try {
    const filenames = fs.readdirSync(dir);
    const posts: BlogListItem[] = [];

    for (const filename of filenames) {
      if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
        const parsed = parseBlogFile(dir, filename);
        if (parsed) {
          posts.push(parsed);
        }
      }
    }

    if (posts.length === 0) {
      return BLOG_POSTS.map((p) => ({
        title: p.title,
        slug: p.slug,
        description: p.description || p.excerpt || '',
        tags: p.tags || [],
        publishedAt: p.publishedAt || p.date || '',
        readingTime: p.readingTime || 3,
        draft: false,
      }));
    }

    return posts.sort(
      (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  } catch {
    return BLOG_POSTS.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description || p.excerpt || '',
      tags: p.tags || [],
      publishedAt: p.publishedAt || p.date || '',
      readingTime: p.readingTime || 3,
      draft: false,
    }));
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const dir = getBlogDir();
  if (!dir) {
    return BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const filenames = fs.readdirSync(dir);
    for (const filename of filenames) {
      if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
        const filePath = path.join(dir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        if (data.slug === slug) {
          const parsed = parseBlogFile(dir, filename);
          if (!parsed) return null;
          return {
            ...parsed,
            content,
          };
        }
      }
    }
  } catch {
    // fallback
  }

  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
