export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'email'
  | 'youtube'
  | 'website';

export interface SocialLink {
  platform: string;
  url?: string;
  href?: string;
  handle?: string;
  label?: string;
}

export interface DeveloperProfile {
  name: string;
  tagline?: string;
  title?: string;
  roles: string[];
  shortBio?: string;
  longBio?: string[];
  bio?: string[] | string;
  email: string;
  location: string;
  openToWork?: boolean;
  avatarUrl?: string;
  socialLinks: SocialLink[];
}

export type TechCategory =
  | 'Languages'
  | 'Frameworks'
  | 'Libraries'
  | 'AI_ML'
  | 'AI/ML'
  | 'Cloud'
  | 'Databases'
  | 'Tools'
  | 'Other';

export type ProficiencyLevel = 'Familiar' | 'Proficient' | 'Expert';
export type Proficiency = ProficiencyLevel;

export interface TechStackItem {
  name: string;
  category: TechCategory;
  proficiencyLevel?: ProficiencyLevel;
  proficiency?: Proficiency;
  yearsOfExperience?: number;
  years?: number;
  iconSlug?: string;
  icon?: string;
  tags?: string[];
}

export type ProjectStatus = 'Active' | 'Completed' | 'Archived' | 'InProgress' | 'Live' | 'In progress';

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  features?: string[];
  impact?: string;
  technologies: string[];
  tags?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  liveUrl?: string;
  imageUrls?: string[];
  imageSrc?: string;
  videoUrl?: string;
  status: ProjectStatus;
  date: string;
  category?: string;
  featured: boolean;
  order?: number;
}

export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  coverImageUrl?: string;
  relatedTechnologies?: string[];
  draft?: boolean;
}

export interface BlogPost {
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  date?: string;
  readingTime?: number;
  readTime?: string;
  tag?: string;
  draft?: boolean;
  coverImageUrl?: string;
  relatedTechnologies?: string[];
}

export type BlogListItem = Omit<BlogPost, 'content'>;

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
  year: number | string;
  month?: number;
  type: AchievementType;
  description: string;
  url?: string;
  featured?: boolean;
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
  id?: number;
  name: string;
  fullName?: string;
  description: string;
  url?: string;
  homepage?: string;
  stars: number;
  forks: number;
  language?: string;
  topics?: string[];
  updatedAt?: string;
  isArchived?: boolean;
  isFork?: boolean;
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
  commits?: number;
  repos?: number;
  pullRequests?: number;
  stars?: number;
}

export interface ResumeMetadata {
  fileName: string;
  lastUpdated: string;
  fileSizeKb: number;
  pageCount: number | null;
  downloadUrl: string;
  viewUrl: string;
  updatedAt?: string;
  pages?: number;
  fileSize?: string;
}

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

export interface NavItem {
  label: string;
  href: string;
}

export interface ProjectTag {
  name: string;
  color?: string;
}

