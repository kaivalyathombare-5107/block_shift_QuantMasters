# Frontend Integration Guide

This guide details the backend, data, content, and API architecture implemented for this personal developer portfolio.

The backend is built with **Next.js 14 (App Router)**, **TypeScript (strict)**, **MDX**, **Zod**, **Resend**, and the **GitHub REST/GraphQL APIs**. All visual presentation, CSS/Tailwind, and UI components are decoupled and owned by the frontend layer.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Response Contract](#api-response-contract)
3. [API Route Specifications](#api-route-specifications)
   - [GET /api/github](#1-get-apigithub)
   - [GET /api/blog](#2-get-apiblog)
   - [GET /api/blog/:slug](#3-get-apiblogslug)
   - [GET /api/projects](#4-get-apiprojects)
   - [GET /api/projects/:slug](#5-get-apiprojectsslug)
   - [POST /api/contact](#6-post-apicontact)
   - [GET /api/resume](#7-get-apiresume)
   - [GET /api/resume/download](#8-get-apiresumedownload)
4. [Empty State & Error Handling](#empty-state--error-handling)
5. [Content Management Guide](#content-management-guide)
   - [Updating Developer Profile](#updating-developer-profile)
   - [Updating Tech Stack](#updating-tech-stack)
   - [Updating Achievements & Education](#updating-achievements--education)
   - [Adding / Editing Projects](#adding--editing-projects)
   - [Publishing / Editing Blog Posts](#publishing--editing-blog-posts)
   - [Updating the Resume PDF](#updating-the-resume-pdf)
6. [Environment Variables](#environment-variables)
7. [GitHub Integration Details](#github-integration-details)
8. [Contact Form & Email Delivery](#contact-form--email-delivery)
9. [Deployment Checklist](#deployment-checklist)

---

## Architecture Overview

All endpoints return a standardized `APIResponse<T>` payload. No raw database or unformatted third-party outputs leak to the frontend.

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend UI Layer                     │
│               (Server Components / Client Views)            │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        Direct Data Import              HTTP API Fetch
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│       Content Layer         │ │          API Routes         │
│  - @/lib/content/profile    │ │  - /api/github              │
│  - @/lib/content/tech-stack │ │  - /api/blog                │
│  - @/lib/content/projects   │ │  - /api/projects            │
│  - @/lib/content/education  │ │  - /api/contact             │
│  - @/lib/content/achievem.  │ │  - /api/resume              │
└─────────────────────────────┘ └──────────────┬──────────────┘
                                               │
                                ┌──────────────▼──────────────┐
                                │       Services & Utils      │
                                │  - @/lib/github/service     │
                                │  - @/lib/blog/parser        │
                                │  - @/lib/rate-limit         │
                                │  - @/lib/contact/mailer     │
                                └─────────────────────────────┘
```

---

## API Response Contract

All JSON endpoints return this contract (`APIResponse<T>` defined in `@/types`):

```typescript
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
```

### Response Scenarios

#### 1. Success Response (HTTP 200)
```json
{
  "data": { ... },
  "error": null,
  "status": 200,
  "cachedAt": "2024-09-07T12:00:00.000Z"
}
```

#### 2. Graceful Unconfigured State (HTTP 200)
Returned when optional integrations (like GitHub or Resume) are not yet configured:
```json
{
  "data": null,
  "error": null,
  "status": 200,
  "emptyState": {
    "reason": "not_configured"
  }
}
```

#### 3. Rate Limited Response (HTTP 429)
```json
{
  "data": null,
  "error": "Rate limit exceeded",
  "status": 429,
  "emptyState": {
    "reason": "rate_limited"
  }
}
```

#### 4. Not Found Response (HTTP 404)
```json
{
  "data": null,
  "error": "Project not found",
  "status": 404,
  "emptyState": {
    "reason": "not_found"
  }
}
```

#### 5. Server/API Error Response (HTTP 500 / 502)
```json
{
  "data": null,
  "error": "Failed to fetch GitHub profile",
  "status": 502,
  "emptyState": {
    "reason": "api_error"
  }
}
```

---

## API Route Specifications

### 1. GET `/api/github`
Returns profile statistics, top public non-fork repositories, language percentage breakdown, total star count, and weekly contribution matrices.

- **Revalidation**: ISR 3600 seconds (1 hour).
- **TypeScript Type**: `APIResponse<GitHubStats>`

#### Example Response
```json
{
  "data": {
    "profile": {
      "login": "octocat",
      "name": "The Octocat",
      "bio": "Building open-source software.",
      "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
      "followers": 9500,
      "following": 9,
      "publicRepos": 8,
      "profileUrl": "https://github.com/octocat"
    },
    "topRepos": [
      {
        "id": 1296269,
        "name": "Hello-World",
        "fullName": "octocat/Hello-World",
        "description": "My first repository on GitHub!",
        "url": "https://github.com/octocat/Hello-World",
        "homepage": "https://octocat.github.io/hello-world",
        "stars": 2450,
        "forks": 1200,
        "language": "TypeScript",
        "topics": ["starter", "tutorial"],
        "updatedAt": "2024-08-15T14:20:00Z",
        "isArchived": false,
        "isFork": false
      }
    ],
    "languageStats": [
      { "language": "TypeScript", "percentage": 64.2, "color": "#3178c6" },
      { "language": "Python", "percentage": 22.8, "color": "#3572A5" },
      { "language": "Rust", "percentage": 13.0, "color": "#dea584" }
    ],
    "totalStars": 3890,
    "contributionData": [
      {
        "week": "2024-01-07",
        "days": [
          { "date": "2024-01-07", "count": 4, "level": 2 },
          { "date": "2024-01-08", "count": 11, "level": 4 }
        ]
      }
    ],
    "fetchedAt": "2024-09-07T12:00:00.000Z"
  },
  "error": null,
  "status": 200,
  "cachedAt": "2024-09-07T12:00:00.000Z"
}
```

---

### 2. GET `/api/blog`
Returns all blog posts as metadata items (excluding the raw markdown body content). Drafts are excluded in production and included in development.

- **Revalidation**: ISR 3600 seconds.
- **TypeScript Type**: `APIResponse<BlogListItem[]>`

#### Example Response
```json
{
  "data": [
    {
      "title": "Hello, World: Building in Public",
      "slug": "hello-world",
      "description": "An introduction to this blog and what to expect.",
      "tags": ["meta", "engineering"],
      "publishedAt": "2024-01-01",
      "readingTime": 3,
      "coverImageUrl": null,
      "relatedTechnologies": ["Next.js", "MDX"],
      "draft": false
    }
  ],
  "error": null,
  "status": 200
}
```

---

### 3. GET `/api/blog/:slug`
Returns full blog post metadata and body content for the specified slug.

- **Revalidation**: ISR 3600 seconds.
- **TypeScript Type**: `APIResponse<BlogPost>`

#### Example Response
```json
{
  "data": {
    "title": "Hello, World: Building in Public",
    "slug": "hello-world",
    "description": "An introduction to this blog and what to expect.",
    "tags": ["meta", "engineering"],
    "publishedAt": "2024-01-01",
    "readingTime": 3,
    "relatedTechnologies": ["Next.js", "MDX"],
    "draft": false,
    "content": "\nWelcome to my personal engineering journal..."
  },
  "error": null,
  "status": 200
}
```

---

### 4. GET `/api/projects`
Returns all portfolio projects sorted with featured projects first, then ordered by date descending.

- **Revalidation**: ISR 86400 seconds (24 hours).
- **TypeScript Type**: `APIResponse<Project[]>`

#### Example Response
```json
{
  "data": [
    {
      "slug": "neural-code-reviewer",
      "title": "NeuralReview: AI-Powered Automated Code Reviewer",
      "shortDescription": "Autonomous static analysis and LLM-assisted code review engine.",
      "problem": "Code reviews are time-consuming...",
      "solution": "Engineered an event-driven bot...",
      "architecture": "Built on Next.js, FastAPI, LangChain, and PostgreSQL...",
      "features": [
        "Automated AST parsing",
        "Contextual vector search"
      ],
      "impact": "Reduced pull request turnaround latency by 45%.",
      "technologies": ["FastAPI", "Python", "Next.js", "PostgreSQL"],
      "githubUrl": "https://github.com/...",
      "liveDemoUrl": "https://demo.example.com",
      "imageUrls": [],
      "videoUrl": "",
      "status": "Active",
      "date": "2024-03-15",
      "category": "AI & Developer Tools",
      "featured": true,
      "order": 1
    }
  ],
  "error": null,
  "status": 200
}
```

---

### 5. GET `/api/projects/:slug`
Returns a single project matching the slug parameter.

- **Revalidation**: ISR 86400 seconds.
- **TypeScript Type**: `APIResponse<Project>`

#### Example Response
```json
{
  "data": {
    "slug": "neural-code-reviewer",
    "title": "NeuralReview: AI-Powered Automated Code Reviewer",
    "shortDescription": "Autonomous static analysis...",
    "status": "Active",
    "featured": true
  },
  "error": null,
  "status": 200
}
```

---

### 6. POST `/api/contact`
Handles inbound contact form messages with rate limiting, Zod validation, honeypot protection, and transactional email dispatch via Resend.

- **Rate Limit**: 3 requests per IP per hour (sliding window).
- **TypeScript Payload**: `ContactFormPayload`
- **TypeScript Response**: `APIResponse<ContactFormResult>`

#### Request Payload
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Collaboration on distributed systems",
  "message": "Hi Alex, I read your post on CRDTs and would like to discuss an opportunity.",
  "_honeypot": ""
}
```

#### Success Response (HTTP 200)
```json
{
  "data": {
    "success": true,
    "message": "Thanks for reaching out! I'll get back to you soon."
  },
  "error": null,
  "status": 200
}
```

#### Validation Error Response (HTTP 422)
```json
{
  "data": {
    "success": false,
    "message": "Please check the form fields and try again."
  },
  "error": "{\"email\":\"Please enter a valid email address\"}",
  "status": 422
}
```

#### Rate Limited Response (HTTP 429)
```json
{
  "data": {
    "success": false,
    "message": "Too many requests. Please try again later."
  },
  "error": "Rate limit exceeded",
  "status": 429
}
```

---

### 7. GET `/api/resume`
Returns metadata regarding the uploaded resume PDF located at `/public/resume/resume.pdf`.

- **Revalidation**: ISR 86400 seconds.
- **TypeScript Type**: `APIResponse<ResumeMetadata>`

#### Example Response (File Present)
```json
{
  "data": {
    "fileName": "resume.pdf",
    "lastUpdated": "2024-09-01T10:00:00.000Z",
    "fileSizeKb": 128,
    "pageCount": null,
    "downloadUrl": "https://your-portfolio.vercel.app/api/resume/download",
    "viewUrl": "https://your-portfolio.vercel.app/resume/resume.pdf"
  },
  "error": null,
  "status": 200
}
```

#### Example Response (File Absent)
```json
{
  "data": {
    "fileName": "resume.pdf",
    "lastUpdated": "",
    "fileSizeKb": 0,
    "pageCount": null,
    "downloadUrl": "",
    "viewUrl": ""
  },
  "error": null,
  "status": 200,
  "emptyState": {
    "reason": "not_configured"
  }
}
```

---

### 8. GET `/api/resume/download`
Direct binary download stream for `/public/resume/resume.pdf` with `Content-Disposition: attachment; filename="resume.pdf"`.
- If file exists: returns HTTP 200 binary `application/pdf`.
- If file missing: returns HTTP 404 JSON `{ "error": "Resume not found" }`.

---

## Empty State & Error Handling

When developing frontend components, check `response.data === null` and inspect `response.emptyState?.reason`:

| Reason Code | Explanation | Recommended Frontend Behavior |
| :--- | :--- | :--- |
| `not_configured` | Environment variable or local file is missing | Render placeholder card or hide the section cleanly. |
| `api_error` | Upstream network or service failure (e.g. GitHub API 500) | Show a non-blocking error badge with a "Retry" button. |
| `rate_limited` | Exceeded API rate limits | Show a "Rate limit exceeded. Please try again in an hour." banner. |
| `not_found` | Resource matching slug does not exist | Render a Next.js `notFound()` or custom 404 view. |
| `empty` | Valid response, but list contains 0 items | Show an empty state card ("No articles published yet."). |

---

## Content Management Guide

All content is strictly typed and decoupled from rendering components.

### Updating Developer Profile
Edit `lib/content/profile.ts`:
- Modify `DEVELOPER_PROFILE.name`, `tagline`, `roles`, `shortBio`, `longBio`, `email`, and `location`.
- Update `socialLinks` array with handles and URLs.
- Notice: `avatarUrl` is left blank because the frontend dynamically merges the GitHub avatar fetched via `/api/github`.

### Updating Tech Stack
Edit `lib/content/tech-stack.ts`:
- Add or modify items in the `TECH_STACK` array.
- Fields:
  - `name`: Human-readable name (`"TypeScript"`).
  - `category`: One of `'Languages' | 'Frameworks' | 'Libraries' | 'AI_ML' | 'Cloud' | 'Databases' | 'Tools' | 'Other'`.
  - `proficiencyLevel`: `'Familiar' | 'Proficient' | 'Expert'`.
  - `yearsOfExperience`: Number (e.g. `2.5`).
  - `iconSlug`: Slug used for icon mapping (e.g., SimpleIcons identifier like `'next-dot-js'`).
  - `tags`: Array of string keywords.

### Updating Achievements & Education
- **Achievements**: Edit `lib/content/achievements.ts`. Each item conforms to `Achievement` with `type` in `'Hackathon' | 'Award' | 'Certification' | 'Publication' | 'Recognition' | 'Other'`.
- **Education**: Edit `lib/content/education.ts`. Each item conforms to `Education` (`degree`, `institution`, `gpa`, `highlights`).

### Adding / Editing Projects
Edit `lib/content/projects.ts`:
1. Add an entry to the `PROJECTS` array conforming to `Project`.
2. Ensure `slug` is URL-safe and unique.
3. Set `featured: true` to prioritize it at the top of the project showcase.
4. Populate `problem`, `solution`, `architecture`, `features`, and `impact` for high-depth project case studies.

### Publishing / Editing Blog Posts
Blog posts live in the `content/blog/` directory as `.mdx` files.

#### Step-by-Step: Adding a New Post
1. Create a new file: `content/blog/my-new-post.mdx`.
2. Add the required frontmatter at the top:
   ```yaml
   ---
   title: "Building an In-Memory Cache in Go"
   slug: "in-memory-cache-go"
   description: "Architectural considerations for high-concurrency eviction strategies."
   tags: ["go", "systems", "concurrency"]
   publishedAt: "2024-09-07"
   readingTime: 5
   relatedTechnologies: ["Go", "Distributed Systems"]
   draft: false
   ---
   ```
3. Write your MDX content below the frontmatter.
4. **Drafts**: Set `draft: true` while working. Drafts appear in local development (`npm run dev`) but are excluded automatically in production builds.

#### Rendering MDX in Frontend Components
Use `serializeMDX` from `@/lib/blog/mdx`:
```tsx
import { getBlogPostBySlug } from '@/lib/blog/parser';
import { serializeMDX } from '@/lib/blog/mdx';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const serialized = await serializeMDX(post.content);
  if (!serialized) return <div>Failed to compile article.</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{serialized.content}</div>
    </article>
  );
}
```

### Updating the Resume PDF
1. Place your resume PDF in `public/resume/resume.pdf`.
2. The file is immediately available at `/resume/resume.pdf` for in-browser PDF viewers and `/api/resume/download` for one-click attachment downloads.
3. The metadata route `/api/resume` will automatically report the real file size and last modified date.

---

## Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GITHUB_USERNAME` | **Yes** | Your GitHub username (e.g., `octocat`). |
| `GITHUB_TOKEN` | Optional | GitHub Personal Access Token (PAT). Required for private/public GraphQL contributions calendar and raising rate limits from 60 to 5,000 req/hr. |
| `RESEND_API_KEY` | Optional | Resend API key (`re_...`). In dev, mailer falls back to console logging. |
| `CONTACT_EMAIL` | Optional | Destination email address where contact submissions are forwarded. |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL for distributed rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST Token. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Production canonical URL (defaults to `http://localhost:3000`). |

---

## GitHub Integration Details

- **Unauthenticated Mode**: If `GITHUB_TOKEN` is not provided, the service still fetches public profiles, repositories, and language stats using standard REST v3 (limited to 60 requests per hour per IP). `contributionData` will be empty.
- **Authenticated Mode**: If `GITHUB_TOKEN` is provided:
  1. Rate limit increases to 5,000 requests per hour.
  2. The GraphQL v4 contributions calendar is queried for the last 52 weeks and converted to a 5-level heatmap (`level: 0 | 1 | 2 | 3 | 4`).
- **Language Calculation**: Queries the top 10 starred public repositories, sums byte counts, and calculates percentages mapped to canonical GitHub Linguist hex colors.

---

## Contact Form & Email Delivery

- **Honeypot Trap**: Forms should include an invisible input `<input type="text" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />`. If filled by automated bots, the API silently succeeds without sending emails.
- **Development Mode**: If `RESEND_API_KEY` or `CONTACT_EMAIL` is missing during local development (`NODE_ENV === 'development'`), the API logs the submitted payload to stdout and returns `{ success: true }`, allowing you to develop and test form states without an active Resend account.
- **Production Mode**: Sends clean, responsive HTML emails with `replyTo` set directly to the submitter's email.

---

## Deployment Checklist

- [ ] Add `GITHUB_USERNAME` to environment variables in your deployment platform (e.g. Vercel).
- [ ] Add `GITHUB_TOKEN` with `read:user` and `repo` scopes.
- [ ] Add `RESEND_API_KEY` and verify your domain in Resend.
- [ ] Set `CONTACT_EMAIL` to your inbox.
- [ ] (Optional) Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for Redis-backed rate limiting.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g., `https://alexrivera.dev`).
- [ ] Update `public/robots.txt` with your production domain.
- [ ] Replace `public/resume/resume.pdf` with your actual resume.
- [ ] Replace placeholder strings in `lib/content/` (`profile.ts`, `tech-stack.ts`, `projects.ts`, `achievements.ts`, `education.ts`).
