import type { DeveloperProfile } from '@/types';

export const DEVELOPER_PROFILE: DeveloperProfile = {
  // PLACEHOLDER: replace with your actual full name
  name: 'Alex Rivera',

  // PLACEHOLDER: replace with your actual professional tagline
  tagline: 'Software & AI Systems Engineer',

  // PLACEHOLDER: replace with your actual roles (4 entries)
  roles: [
    'Software Engineer', // PLACEHOLDER: replace with role 1
    'AI Systems Builder', // PLACEHOLDER: replace with role 2
    'Computer Engineering Student', // PLACEHOLDER: replace with role 3
    'Open Source Contributor', // PLACEHOLDER: replace with role 4
  ],

  // PLACEHOLDER: replace with your actual short bio
  shortBio:
    'Computer engineering student specializing in distributed systems, machine learning infrastructure, and high-performance web applications.',

  // PLACEHOLDER: replace with your actual long bio (3 paragraphs)
  longBio: [
    // PLACEHOLDER: paragraph 1 - background & core focus
    'I am a software engineer and computer engineering student dedicated to building robust, data-intensive systems and production-grade artificial intelligence pipelines. My work bridges low-level system design with scalable cloud-native architectures.',

    // PLACEHOLDER: paragraph 2 - engineering philosophy & experience
    'Throughout my academic and project career, I have focused on building distributed data workflows, low-latency microservices, and end-to-end ML deployment frameworks. I prioritize type safety, deterministic testing, and observable system behavior in every codebase I contribute to.',

    // PLACEHOLDER: paragraph 3 - current endeavors & interests
    'Currently, I am researching high-throughput retrieval systems and developing open-source tooling for modern web and data stacks. When not engineering software, I contribute to community technical initiatives, compete in hackathons, and publish technical write-ups.',
  ],

  // PLACEHOLDER: replace with your actual email address
  email: 'alex.rivera@example.com',

  // PLACEHOLDER: replace with your actual location
  location: 'San Francisco, CA',

  // PLACEHOLDER: replace with your actual availability status
  openToWork: true,

  // Avatar URL remains empty string — dynamically populated from GitHub API by frontend
  avatarUrl: '',

  // PLACEHOLDER: replace with your actual social links
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com/placeholder-username', // PLACEHOLDER: replace with your GitHub URL
      handle: 'placeholder-username', // PLACEHOLDER: replace with your GitHub handle
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/placeholder-profile', // PLACEHOLDER: replace with your LinkedIn URL
      handle: 'alex-rivera', // PLACEHOLDER: replace with your LinkedIn handle
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/placeholder-handle', // PLACEHOLDER: replace with your Twitter/X URL
      handle: '@alexrivera_dev', // PLACEHOLDER: replace with your Twitter/X handle
    },
    {
      platform: 'email',
      url: 'mailto:alex.rivera@example.com', // PLACEHOLDER: replace with your mailto URL
      handle: 'alex.rivera@example.com', // PLACEHOLDER: replace with your email handle
    },
  ],
};
