/**
 * Frontend API Client
 * Typed fetch wrapper for all Backend endpoints.
 *
 * SETUP: set NEXT_PUBLIC_API_URL in .env.local to the Backend's deployed URL.
 * e.g.  NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
 *
 * When both apps run locally, the Backend is usually on :3001 and the
 * Frontend on :3000. In production they can be different Vercel projects.
 */

// ─── Types (from @/types) ──────────────────────────────────────────────────

export * from '@/types';
import type {
  APIResponse,
  BlogListItem,
  BlogPost,
  ContactFormPayload,
  ContactFormResult,
  GitHubStats,
  Project,
  ResumeMetadata,
} from '@/types';

import { PROJECTS, RESUME_METADATA, BLOG_POSTS } from '@/lib/data';
import { fetchGitHubStatsService } from '@/lib/backend/github';

// ─── Core fetch helper ─────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  nextOptions?: { revalidate?: number | false; tags?: string[] }
): Promise<APIResponse<T>> {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Next.js 14+ cache control
      next: nextOptions,
    });

    const json: APIResponse<T> = await res.json();
    return json;
  } catch (err) {
    console.error(`[api] fetch failed for ${path}:`, err);
    return {
      data: null,
      error: 'Network error — could not reach backend.',
      status: 0,
      emptyState: { reason: 'api_error' },
    };
  }
}

// ─── Public API functions ──────────────────────────────────────────────────

/** GET /api/github — ISR 1 hour */
export async function fetchGitHubStats(): Promise<APIResponse<GitHubStats>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    return fetchGitHubStatsService();
  }
  return apiFetch<GitHubStats>('/api/github', undefined, { revalidate: 3600 });
}

/** GET /api/blog — ISR 1 hour, returns list items (no body content) */
export async function fetchBlogList(): Promise<APIResponse<BlogListItem[]>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const list: BlogListItem[] = BLOG_POSTS.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description || p.excerpt || '',
      tags: p.tags || [],
      publishedAt: p.publishedAt || p.date || '',
      readingTime: p.readingTime || 3,
      draft: false,
    }));
    return {
      data: list,
      error: null,
      status: 200,
    };
  }
  return apiFetch<BlogListItem[]>('/api/blog', undefined, { revalidate: 3600 });
}

/** GET /api/blog/:slug — ISR 1 hour */
export async function fetchBlogPost(slug: string): Promise<APIResponse<BlogPost>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const post = BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    return {
      data: post,
      error: post ? null : 'Not found',
      status: post ? 200 : 404,
      emptyState: post ? undefined : { reason: 'not_found' },
    };
  }
  return apiFetch<BlogPost>(`/api/blog/${slug}`, undefined, { revalidate: 3600 });
}

/** GET /api/projects — ISR 24 hours */
export async function fetchProjects(): Promise<APIResponse<Project[]>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    return {
      data: PROJECTS,
      error: null,
      status: 200,
    };
  }
  return apiFetch<Project[]>('/api/projects', undefined, { revalidate: 86400 });
}

/** GET /api/projects/:slug — ISR 24 hours */
export async function fetchProject(slug: string): Promise<APIResponse<Project>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const project = PROJECTS.find((p) => p.slug === slug) ?? null;
    return {
      data: project,
      error: project ? null : 'Not found',
      status: project ? 200 : 404,
      emptyState: project ? undefined : { reason: 'not_found' },
    };
  }
  return apiFetch<Project>(`/api/projects/${slug}`, undefined, { revalidate: 86400 });
}

/** GET /api/resume — ISR 24 hours */
export async function fetchResumeMetadata(): Promise<APIResponse<ResumeMetadata>> {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    return {
      data: RESUME_METADATA,
      error: null,
      status: 200,
    };
  }
  return apiFetch<ResumeMetadata>('/api/resume', undefined, { revalidate: 86400 });
}

/**
 * POST /api/contact
 * Include an empty `_honeypot` field to pass the bot trap.
 * Rate limited to 3 requests per IP per hour.
 */
export async function submitContactForm(
  payload: ContactFormPayload
): Promise<APIResponse<ContactFormResult>> {
  return apiFetch<ContactFormResult>('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ _honeypot: '', ...payload }),
  });
}

/** Direct download URL for the resume PDF */
export function getResumeDownloadUrl(): string {
  return `${BASE_URL}/api/resume/download`;
}