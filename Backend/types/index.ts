/**
 * Single source of truth for all types across the portfolio backend,
 * content layer, API routes, and external integrations.
 */

// ==========================================
// Profile & Social Types
// ==========================================

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'email'
  | 'youtube'
  | 'website';

export interface SocialLink {
  platform: SocialPlatform;
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

// ==========================================
// Tech Stack & Skills Types
// ==========================================

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

// ==========================================
// Project Types
// ==========================================

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

// ==========================================
// Blog & MDX Types
// ==========================================

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

export type BlogPost = BlogFrontmatter & {
  content: string;
};

export type BlogListItem = Omit<BlogPost, 'content'>;

// ==========================================
// Career, Education & Achievements Types
// ==========================================

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

// ==========================================
// GitHub Integration Types
// ==========================================

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

// ==========================================
// Resume Types
// ==========================================

export interface ResumeMetadata {
  fileName: string;
  lastUpdated: string;
  fileSizeKb: number;
  pageCount: number | null;
  downloadUrl: string;
  viewUrl: string;
}

// ==========================================
// Contact Form Types
// ==========================================

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

// ==========================================
// API Response & Empty State Contracts
// ==========================================

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

// Helper function types
export type GitHubFetchResult = APIResponse<GitHubStats>;
export type ContactResult = APIResponse<ContactFormResult>;
