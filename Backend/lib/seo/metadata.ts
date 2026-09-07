import type { Metadata, Viewport } from 'next';
import { DEVELOPER_PROFILE } from '@/lib/content/profile';
import { publicEnv } from '@/lib/config/env';
import type { BlogListItem, Project } from '@/types';

export const BASE_METADATA: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: `${DEVELOPER_PROFILE.name} — Software & AI Engineer`,
    template: `%s | ${DEVELOPER_PROFILE.name}`,
  },
  description: DEVELOPER_PROFILE.shortBio,
  keywords: ['software engineer', 'AI engineer', 'computer engineering', 'portfolio', 'developer'],
  authors: [{ name: DEVELOPER_PROFILE.name }],
  creator: DEVELOPER_PROFILE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: publicEnv.siteUrl,
    siteName: `${DEVELOPER_PROFILE.name} Portfolio`,
    title: `${DEVELOPER_PROFILE.name} — Software & AI Engineer`,
    description: DEVELOPER_PROFILE.shortBio,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${DEVELOPER_PROFILE.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${DEVELOPER_PROFILE.name} — Software & AI Engineer`,
    description: DEVELOPER_PROFILE.shortBio,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const BASE_VIEWPORT: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08090C',
};

export function blogPostMetadata(post: BlogListItem): Metadata {
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      tags: post.tags,
      images: post.coverImageUrl ? [post.coverImageUrl] : ['/og-image.png'],
    },
  };
}

export function projectMetadata(project: Project): Metadata {
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export function personJsonLD(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: DEVELOPER_PROFILE.name,
    url: publicEnv.siteUrl,
    sameAs: DEVELOPER_PROFILE.socialLinks.map((l) => l.url).filter(Boolean),
    jobTitle: DEVELOPER_PROFILE.tagline,
    description: DEVELOPER_PROFILE.shortBio,
  });
}
