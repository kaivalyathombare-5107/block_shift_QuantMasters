export type TechCategory = 'Languages' | 'Frameworks' | 'AI/ML' | 'Cloud' | 'Tools'
export type Proficiency = 'Familiar' | 'Proficient' | 'Expert'
export type ProjectStatus = 'Live' | 'In progress' | 'Archived'
export type AchievementType = 'Award' | 'Certification' | 'Publication' | 'Hackathon'
export interface SocialLink { platform: string; label: string; href: string; handle: string }
export interface DeveloperProfile { name: string; title: string; location: string; roles: string[]; bio: string[]; email: string; socialLinks: SocialLink[] }
export interface TechStackItem { name: string; category: TechCategory; proficiency: Proficiency; icon: string; years: number }
export interface Project { title: string; slug: string; description: string; tags: string[]; imageSrc: string; githubUrl: string; liveUrl: string; status: ProjectStatus; featured: boolean; date: string }
export interface BlogPost { title: string; slug: string; excerpt: string; content: string; date: string; readTime: string; tag: string }
export interface Achievement { year: string; title: string; organization: string; type: AchievementType; description: string }
export interface GitHubStats { commits: number; repos: number; pullRequests: number; stars: number; contributionData: number[][]; topRepos: GitHubRepo[] }
export interface GitHubRepo { name: string; description: string; language: string; stars: number; forks: number }
export interface ResumeMetadata { updatedAt: string; pages: number; fileSize: string }
export interface ContactFormPayload { name: string; email: string; subject: string; message: string }
export interface NavItem { label: string; href: string }
export interface ProjectTag { name: string; color?: string }
