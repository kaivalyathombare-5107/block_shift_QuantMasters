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

// ─── Types (mirrors Backend/types/index.ts) ───────────────────────────────

export type EmptyStateReason =
  | 'not_configured'
  | 'api_error'
  | 'rate_limited'
  | 'not_found'
  | 'empty';

export interface EmptyState {
  reason: EmptyStateReason;
}

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  cachedAt?: string;
  emptyState?: EmptyState;
}

// Profile
export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface DeveloperProfile {
  name: string;
  tagline: string;
  roles: string[];
  shortBio: string;
  longBio: string[];
  email: string;
  location: string;
  openToWork: boolean;
  avatarUrl: string;
  socialLinks: SocialLink[];
}

// Tech Stack
export type TechCategory =
  | 'Languages'
  | 'Frameworks'
  | 'Libraries'
  | 'AI_ML'
  | 'Cloud'
  | 'Databases'
  | 'Tools'
  | 'Other';

export type ProficiencyLevel = 'Familiar' | 'Proficient' | 'Expert';

export interface TechStackItem {
  name: string;
  category: TechCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
  iconSlug: string;
  tags: string[];
}

// Projects
export type ProjectStatus = 'Active' | 'Completed' | 'Archived' | 'InProgress';

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  solution: string;
  architecture: string;
  features: string[];
  impact: string;
  technologies: string[];
  githubUrl: string;
  liveDemoUrl: string;
  imageUrls: string[];
  videoUrl: string;
  status: ProjectStatus;
  date: string;
  category: string;
  featured: boolean;
  order: number;
}

// Blog
export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  coverImageUrl?: string;
  relatedTechnologies: string[];
  draft: boolean;
}

export type BlogPost = BlogFrontmatter & { content: string };
export type BlogListItem = Omit<BlogPost, 'content'>;

// Achievements & Education
export type AchievementType =
  | 'Hackathon'
  | 'Award'
  | 'Certification'
  | 'Publication'
  | 'Recognition'
  | 'Other';

export interface Achievement {
  title: string;
  organization: string;
  year: number;
  month?: number;
  type: AchievementType;
  description: string;
  url?: string;
  featured: boolean;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | 'Present';
  gpa?: number;
  maxGpa?: number;
  highlights: string[];
}

// GitHub
export interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  profileUrl: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  stars: number;
  forks: number;
  language?: string;
  topics: string[];
  updatedAt: string;
  isArchived: boolean;
  isFork: boolean;
}

export interface GitHubLanguageStats {
  language: string;
  percentage: number;
  color: string;
}

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionWeek {
  week: string;
  days: ContributionDay[];
}

export interface GitHubStats {
  profile: GitHubProfile;
  topRepos: GitHubRepo[];
  languageStats: GitHubLanguageStats[];
  totalStars: number;
  contributionData: ContributionWeek[];
  fetchedAt: string;
}

// Resume
export interface ResumeMetadata {
  fileName: string;
  lastUpdated: string;
  fileSizeKb: number;
  pageCount: number | null;
  downloadUrl: string;
  viewUrl: string;
}

// Contact
export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot?: string;
}

export interface ContactFormResult {
  success: boolean;
  message: string;
}

// ─── Core fetch helper ─────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

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
  return apiFetch<GitHubStats>('/api/github', undefined, { revalidate: 3600 });
}

/** GET /api/blog — ISR 1 hour, returns list items (no body content) */
export async function fetchBlogList(): Promise<APIResponse<BlogListItem[]>> {
  return apiFetch<BlogListItem[]>('/api/blog', undefined, { revalidate: 3600 });
}

/** GET /api/blog/:slug — ISR 1 hour */
export async function fetchBlogPost(slug: string): Promise<APIResponse<BlogPost>> {
  return apiFetch<BlogPost>(`/api/blog/${slug}`, undefined, { revalidate: 3600 });
}

/** GET /api/projects — ISR 24 hours */
export async function fetchProjects(): Promise<APIResponse<Project[]>> {
  return apiFetch<Project[]>('/api/projects', undefined, { revalidate: 86400 });
}

/** GET /api/projects/:slug — ISR 24 hours */
export async function fetchProject(slug: string): Promise<APIResponse<Project>> {
  return apiFetch<Project>(`/api/projects/${slug}`, undefined, { revalidate: 86400 });
}

/** GET /api/resume — ISR 24 hours */
export async function fetchResumeMetadata(): Promise<APIResponse<ResumeMetadata>> {
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