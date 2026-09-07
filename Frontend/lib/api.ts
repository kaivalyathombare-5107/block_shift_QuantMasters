/**
 * Frontend API Client
 * Typed fetch wrapper for all endpoints with resilient local fallbacks.
 *
 * Safe for both server-side rendering (build/ISR) and client-side execution.
 * If NEXT_PUBLIC_API_URL is configured, it attempts to fetch from the external API;
 * if that API is unreachable, offline, or returns non-JSON (such as a 404 HTML page),
 * it seamlessly falls back to the embedded data layer.
 */

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  nextOptions?: { revalidate?: number | false; tags?: string[] }
): Promise<APIResponse<T>> {
  // During SSR / static generation, if BASE_URL is not set, relative fetch will fail in Node.
  if (typeof window === 'undefined' && !BASE_URL) {
    return {
      data: null,
      error: 'No BASE_URL provided during server-side fetch.',
      status: 0,
      emptyState: { reason: 'api_error' },
    };
  }

  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: nextOptions,
    });

    const contentType = res.headers.get('content-type') || '';

    // Guard against HTML error pages (e.g. Vercel 404 "The page could not be found")
    if (!contentType.includes('application/json')) {
      const text = await res.text().catch(() => '');
      console.warn(
        `[api] Non-JSON response for ${path} (status ${res.status}): ${text.slice(0, 80)}...`
      );
      return {
        data: null,
        error: `Expected JSON from ${path}, received ${contentType || 'HTML/Text'} (HTTP ${res.status})`,
        status: res.status,
        emptyState: { reason: res.status === 404 ? 'not_found' : 'api_error' },
      };
    }

    const json: APIResponse<T> = await res.json();
    return json;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[api] fetch failed for ${path}: ${message}`);
    return {
      data: null,
      error: `Network error — could not reach ${path}`,
      status: 0,
      emptyState: { reason: 'api_error' },
    };
  }
}

// ─── Public API functions with resilient fallbacks ──────────────────────────

/** GET /api/github — ISR 1 hour */
export async function fetchGitHubStats(): Promise<APIResponse<GitHubStats>> {
  if (BASE_URL) {
    const res = await apiFetch<GitHubStats>('/api/github', undefined, { revalidate: 3600 });
    if (res.data) {
      return res;
    }
  }

  // Fallback to internal GitHub service if external API fails or is not configured
  return fetchGitHubStatsService();
}

/** GET /api/blog — ISR 1 hour, returns list items (no body content) */
export async function fetchBlogList(): Promise<APIResponse<BlogListItem[]>> {
  if (BASE_URL) {
    const res = await apiFetch<BlogListItem[]>('/api/blog', undefined, { revalidate: 3600 });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  }

  // Fallback to local blog posts
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

/** GET /api/blog/:slug — ISR 1 hour */
export async function fetchBlogPost(slug: string): Promise<APIResponse<BlogPost>> {
  if (BASE_URL) {
    const res = await apiFetch<BlogPost>(`/api/blog/${slug}`, undefined, { revalidate: 3600 });
    if (res.data) {
      return res;
    }
  }

  // Fallback to local blog posts
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  return {
    data: post,
    error: post ? null : `Post "${slug}" not found`,
    status: post ? 200 : 404,
    emptyState: post ? undefined : { reason: 'not_found' },
  };
}

/** GET /api/projects — ISR 24 hours */
export async function fetchProjects(): Promise<APIResponse<Project[]>> {
  if (BASE_URL) {
    const res = await apiFetch<Project[]>('/api/projects', undefined, { revalidate: 86400 });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  }

  // Fallback to local projects
  return {
    data: PROJECTS,
    error: null,
    status: 200,
  };
}

/** GET /api/projects/:slug — ISR 24 hours */
export async function fetchProject(slug: string): Promise<APIResponse<Project>> {
  if (BASE_URL) {
    const res = await apiFetch<Project>(`/api/projects/${slug}`, undefined, { revalidate: 86400 });
    if (res.data) {
      return res;
    }
  }

  // Fallback to local project
  const project = PROJECTS.find((p) => p.slug === slug) ?? null;
  return {
    data: project,
    error: project ? null : `Project "${slug}" not found`,
    status: project ? 200 : 404,
    emptyState: project ? undefined : { reason: 'not_found' },
  };
}

/** GET /api/resume — ISR 24 hours */
export async function fetchResumeMetadata(): Promise<APIResponse<ResumeMetadata>> {
  if (BASE_URL) {
    const res = await apiFetch<ResumeMetadata>('/api/resume', undefined, { revalidate: 86400 });
    if (res.data) {
      return res;
    }
  }

  // Fallback to local resume metadata
  return {
    data: RESUME_METADATA,
    error: null,
    status: 200,
  };
}

/**
 * POST /api/contact
 * Include an empty `_honeypot` field to pass the bot trap.
 * Rate limited to 5 requests per IP per hour.
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
