import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { serverEnv } from '@/lib/config/env';
import type { BlogPost, BlogListItem } from '@/types';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function computeReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.ceil(stats.minutes) || 1;
}

export function parseBlogFile(filename: string): BlogListItem | null {
  const filePath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`[Blog Parser] File not found: ${filePath}`);
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const missingFields: string[] = [];
    if (!data.title || typeof data.title !== 'string') missingFields.push('title');
    if (!data.slug || typeof data.slug !== 'string') missingFields.push('slug');
    if (!data.description || typeof data.description !== 'string') missingFields.push('description');
    if (!data.publishedAt || typeof data.publishedAt !== 'string') missingFields.push('publishedAt');

    if (missingFields.length > 0) {
      console.warn(
        `[Blog Parser] Warning: File "${filename}" is missing required frontmatter fields: ${missingFields.join(
          ', '
        )}. Skipping.`
      );
      return null;
    }

    const calculatedReadingTime =
      typeof data.readingTime === 'number' && data.readingTime > 0
        ? data.readingTime
        : computeReadingTime(content);

    const item: BlogListItem = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      tags: Array.isArray(data.tags) ? data.tags : [],
      publishedAt: data.publishedAt,
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
      readingTime: calculatedReadingTime,
      coverImageUrl: typeof data.coverImageUrl === 'string' ? data.coverImageUrl : undefined,
      relatedTechnologies: Array.isArray(data.relatedTechnologies) ? data.relatedTechnologies : [],
      draft: Boolean(data.draft),
    };

    return item;
  } catch (error) {
    console.warn(`[Blog Parser] Error parsing "${filename}":`, error);
    return null;
  }
}

export function getAllBlogPosts(): BlogListItem[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  let isDev = false;
  try {
    isDev = serverEnv.nodeEnv === 'development';
  } catch {
    isDev = process.env.NODE_ENV === 'development';
  }

  const filenames = fs.readdirSync(BLOG_DIR);
  const posts: BlogListItem[] = [];

  for (const filename of filenames) {
    if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
      const parsed = parseBlogFile(filename);
      if (parsed) {
        if (isDev || !parsed.draft) {
          posts.push(parsed);
        }
      }
    }
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) {
    return null;
  }

  let isDev = false;
  try {
    isDev = serverEnv.nodeEnv === 'development';
  } catch {
    isDev = process.env.NODE_ENV === 'development';
  }

  const filenames = fs.readdirSync(BLOG_DIR);

  for (const filename of filenames) {
    if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
      const filePath = path.join(BLOG_DIR, filename);
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        if (data.slug === slug) {
          if (!isDev && Boolean(data.draft)) {
            return null;
          }

          const parsed = parseBlogFile(filename);
          if (!parsed) {
            return null;
          }

          return {
            ...parsed,
            content,
          };
        }
      } catch (error) {
        console.warn(`[Blog Parser] Error reading "${filename}":`, error);
      }
    }
  }

  return null;
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
