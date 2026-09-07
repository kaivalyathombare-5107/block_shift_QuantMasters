/**
 * app/page.tsx  —  Portfolio homepage
 *
 * This is a Next.js Server Component. All data is fetched at build/revalidation
 * time from the Backend API. No client-side data fetching on page load.
 *
 * The Contact section is the only interactive part; it uses <ContactSection>
 * which is a Client Component that calls the API on submit via useContact().
 */

import {
  fetchGitHubStats,
  fetchProjects,
  fetchBlogList,
  fetchResumeMetadata,
  getResumeDownloadUrl,
  type DeveloperProfile,
  type TechStackItem,
  type Project,
  type BlogListItem,
  type Achievement,
  type GitHubStats,
  type ResumeMetadata,
} from '@/lib/api';

// Static content lives in the Backend content layer.
// Import them directly if the Frontend is deployed inside the same Next.js
// app as the Backend, OR replace with additional API calls if they are
// separate deployments. The INTEGRATION.md calls this the "Content Layer".
//
// If they are separate apps, add these routes to the Backend:
//   GET /api/profile  →  APIResponse<DeveloperProfile>
//   GET /api/stack    →  APIResponse<TechStackItem[]>
//   GET /api/achievements → APIResponse<Achievement[]>
//
// For now we keep a thin local fallback so the Frontend can render
// even if those routes haven't been added yet.

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  CircleDot,
  Mail,
  Menu,
  Minus,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

import ContactSection from '@/components/ContactSection';

// ─── Helpers ──────────────────────────────────────────────────────────────

const nav = [
  ['about', 'About'],
  ['stack', 'Stack'],
  ['projects', 'Projects'],
  ['lab', 'Lab'],
  ['achievements', 'Timeline'],
  ['stats', 'Activity'],
  ['connect', 'Connect'],
];

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-muted">
      <span className="text-accent">{n}</span>
      <span className="mx-2 text-[#48505c]">/</span>
      {children}
    </div>
  );
}

function Btn({
  children,
  href,
  ghost = false,
}: {
  children: React.ReactNode;
  href?: string;
  ghost?: boolean;
}) {
  return (
    <a
      href={href ?? '#connect'}
      className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
        ghost
          ? 'border border-border text-foreground hover:border-accent hover:text-accent'
          : 'bg-accent text-[#08101d] hover:bg-[#9bc2ff]'
      }`}
    >
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}

function Section({
  id,
  children,
  className = '',
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={`mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────

export default async function Page() {
  // Parallel data fetching — all requests fire simultaneously
  const [githubRes, projectsRes, blogRes, resumeRes] = await Promise.all([
    fetchGitHubStats(),
    fetchProjects(),
    fetchBlogList(),
    fetchResumeMetadata(),
  ]);

  const github: GitHubStats | null = githubRes.data;
  const projects: Project[] = projectsRes.data ?? [];
  const blogPosts: BlogListItem[] = blogRes.data ?? [];
  const resume: ResumeMetadata | null = resumeRes.data;

  // Contribution heatmap — flatten weeks → days for rendering
  const contribDays =
    github?.contributionData?.flatMap((week) => week.days) ?? [];

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-border/70 bg-[#08090c]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="font-mono text-sm tracking-widest">
            <span className="text-accent">[</span> YN <span className="text-accent">]</span>
          </a>
          <nav className="hidden gap-5 lg:flex">
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="font-mono text-[11px] uppercase tracking-wider text-muted transition hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#connect"
            className="hidden rounded-full border border-accent/50 px-4 py-2 font-mono text-[11px] uppercase text-accent md:block"
          >
            Let&apos;s talk
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section
          id="top"
          className="grid-fade relative flex min-h-[720px] items-center overflow-hidden px-5 pb-20 pt-32 md:px-8"
        >
          <div className="pointer-events-none absolute right-[8%] top-32 h-[440px] w-[440px] rounded-full border border-accent/20 animate-float">
            <div className="absolute inset-8 rounded-full border border-accent/15" />
            <div className="absolute inset-20 rounded-full border border-accent/20" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_36px_12px_rgba(110,168,255,.35)]" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-6 font-mono text-xs uppercase tracking-[.28em] text-accent">
                Computer Engineering · AI Systems
              </p>
              {/* Name pulled from GitHub profile when available */}
              <h1 className="font-display text-[clamp(3.8rem,10vw,8.5rem)] font-medium leading-[.86] tracking-[-.08em]">
                {(github?.profile.name || 'Alex Rivera').split(' ').map((word, i) => (
                  <span key={word} className="block">
                    {word}
                    {i === 0 && <span className="text-accent">.</span>}
                  </span>
                ))}
              </h1>
              <p className="mt-8 font-mono text-sm text-muted">
                <span className="text-accent">&gt;_</span> Software & AI Systems Engineer
              </p>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted">
                {github?.profile.bio ||
                  'Building robust, data-intensive systems and production-grade AI pipelines.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href="#projects">View my work</Btn>
                {resume && resume.downloadUrl ? (
                  <Btn href={getResumeDownloadUrl()} ghost>
                    Resume <span className="font-mono text-xs">PDF</span>
                  </Btn>
                ) : (
                  <Btn href="#connect" ghost>
                    Request résumé
                  </Btn>
                )}
              </div>
            </div>
            <div className="mt-20 flex items-center gap-8 font-mono text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#73d69b]" />
                Available for select work
              </span>
              {github?.profile.login && (
                <a
                  href={github.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1 hover:text-accent transition"
                >
                  @{github.profile.login} <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-muted">
            <ArrowDownRight className="animate-bounce" size={18} />
          </div>
        </section>

        {/* ── About ──────────────────────────────────────────────────── */}
        <Section id="about">
          <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <Label n="001">About</Label>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Making complex systems <span className="text-accent">feel clear.</span>
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                I am a software engineer and computer engineering student dedicated to building
                robust, data-intensive systems and production-grade artificial intelligence
                pipelines.
              </p>
              <p>
                Throughout my academic and project career, I have focused on distributed data
                workflows, low-latency microservices, and end-to-end ML deployment frameworks.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-6">
                {[
                  [String(projects.length || '—'), 'Projects'],
                  [String(github?.topRepos?.length ?? '—'), 'Repos'],
                  ['∞', 'Curiosity'],
                ].map(([n, l]) => (
                  <div key={l} className="border-t border-border pt-3">
                    <div className="font-display text-3xl text-foreground">{n}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Projects ───────────────────────────────────────────────── */}
        <Section id="projects">
          <Label n="003">Projects</Label>
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">Selected signals.</h2>
            <p className="max-w-sm text-sm leading-6 text-muted">
              A few experiments and production systems from the lab.
            </p>
          </div>

          {projects.length === 0 ? (
            <p className="text-muted font-mono text-sm">No projects yet — check back soon.</p>
          ) : (
            <div className="space-y-5">
              {projects.map((p, i) => (
                <article
                  key={p.slug}
                  className={`group grid gap-6 border-t border-border py-8 md:grid-cols-[1fr_1.5fr] md:items-center ${
                    i % 2 ? 'md:pl-16' : ''
                  }`}
                >
                  <div className="flex aspect-[16/8] items-center justify-center overflow-hidden rounded-md border border-border bg-surface-2">
                    {p.imageUrls?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrls[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="relative h-28 w-28 rounded-full border border-accent/30">
                        <div className="absolute inset-5 rounded-full border border-accent/50" />
                        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-accent" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted">
                        {p.date?.slice(0, 4)} ·{' '}
                        <span className="text-accent">{p.status}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted transition hover:text-accent"
                            aria-label="GitHub"
                          >
                            <Code2 size={16} />
                          </a>
                        )}
                        {p.liveDemoUrl && (
                          <a
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted transition hover:text-accent"
                            aria-label="Live demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <ArrowUpRight
                          className="text-muted transition group-hover:text-accent"
                          size={20}
                        />
                      </div>
                    </div>
                    <h3 className="font-display text-3xl transition group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl leading-7 text-muted">{p.shortDescription}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>

        {/* ── Lab / Blog ─────────────────────────────────────────────── */}
        <Section id="lab" className="border-t border-border">
          <Label n="004">Lab / Writing</Label>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">
              Notes from the edge.
            </h2>
            <a
              href="/blog"
              className="hidden font-mono text-xs uppercase tracking-widest text-accent md:block"
            >
              View all posts <ArrowUpRight className="inline" size={14} />
            </a>
          </div>

          {blogPosts.length === 0 ? (
            <p className="mt-10 text-muted font-mono text-sm">No articles published yet.</p>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, i) => (
                <a
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className={`group border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/60 ${
                    i === 0 ? 'md:row-span-2 md:pt-10' : ''
                  }`}
                >
                  <div className="mb-10 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
                    <span className="text-accent">{post.tags?.[0] ?? 'Note'}</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-muted">{post.description}</p>
                  <div className="mt-8 border-t border-border pt-4 font-mono text-[10px] text-muted">
                    {post.publishedAt}
                  </div>
                </a>
              ))}
            </div>
          )}
        </Section>

        {/* ── GitHub Stats ───────────────────────────────────────────── */}
        <Section id="stats" className="border-t border-border">
          <Label n="006">Activity</Label>
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">
            Quietly consistent.
          </h2>

          {!github ? (
            <p className="mt-10 font-mono text-sm text-muted">
              GitHub stats not configured — add{' '}
              <code className="text-accent">GITHUB_USERNAME</code> to your Backend env.
            </p>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
                {(
                  [
                    ['Repositories', github.profile.publicRepos, CircleDot],
                    ['Stars earned', github.totalStars, Star],
                    ['Followers', github.profile.followers, Check],
                    ['Following', github.profile.following, Code2],
                  ] as const
                ).map(([label, n, Icon]) => (
                  <div key={label} className="bg-surface p-5">
                    <Icon size={16} className="text-accent" />
                    <div className="mt-5 font-display text-3xl">{n ?? '—'}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Language breakdown */}
              {github.languageStats.length > 0 && (
                <div className="mt-6 border border-border bg-surface p-5">
                  <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted">
                    Languages
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {github.languageStats.slice(0, 8).map((ls) => (
                      <div key={ls.language} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: ls.color }}
                        />
                        <span className="font-mono text-xs text-muted">{ls.language}</span>
                        <span className="font-mono text-xs text-accent">
                          {ls.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contribution heatmap */}
              {contribDays.length > 0 && (
                <div className="mt-6 border border-border bg-surface p-5">
                  <div className="mb-4 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
                    <span>Contribution matrix</span>
                    <span>Last 52 weeks</span>
                  </div>
                  <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-hidden">
                    {contribDays.map((d) => (
                      <i
                        key={d.date}
                        title={`${d.date}: ${d.count} contributions`}
                        className={`h-3 w-3 rounded-sm ${
                          d.level === 0
                            ? 'bg-surface-3'
                            : d.level === 1
                            ? 'bg-accent/30'
                            : d.level === 2
                            ? 'bg-accent/50'
                            : d.level === 3
                            ? 'bg-accent/75'
                            : 'bg-accent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Top repos */}
              {github.topRepos.length > 0 && (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {github.topRepos.slice(0, 4).map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 border border-border bg-surface p-4 transition hover:border-accent/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm group-hover:text-accent transition">
                          {repo.name}
                        </span>
                        <div className="flex items-center gap-3 font-mono text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Star size={11} /> {repo.stars}
                          </span>
                          {repo.language && (
                            <span className="text-accent">{repo.language}</span>
                          )}
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted leading-5">{repo.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </Section>

        {/* ── Resume ─────────────────────────────────────────────────── */}
        <Section id="resume" className="border-t border-border">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <Label n="007">Résumé</Label>
              <h2 className="font-display text-4xl tracking-tight">A document of intent.</h2>
              <p className="mt-5 text-muted">
                Experience, selected work, and the systems behind it.
              </p>
              {resume?.downloadUrl ? (
                <Btn href={getResumeDownloadUrl()}>Download PDF</Btn>
              ) : (
                <Btn href="#connect">Request résumé</Btn>
              )}
            </div>
            <div className="flex min-h-56 items-center justify-center border border-dashed border-border bg-surface font-mono text-xs text-muted">
              {resume?.lastUpdated ? (
                <>
                  Updated {new Date(resume.lastUpdated).toLocaleDateString()} <Minus className="mx-3 text-accent" />{' '}
                  {resume.fileSizeKb}KB PDF
                  {resume.pageCount && ` · ${resume.pageCount} pages`}
                </>
              ) : (
                'Resume not yet uploaded'
              )}
            </div>
          </div>
        </Section>

        {/* ── Contact ────────────────────────────────────────────────── */}
        {/*
         * ContactSection is a Client Component — it needs interactivity
         * (form state, submission). Create it in components/ContactSection.tsx.
         * See the companion file included in this output.
         */}
        <ContactSection />
      </main>

      <footer className="border-t border-border px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted md:flex-row">
          <span>
            <span className="text-accent">[</span> YN <span className="text-accent">]</span> —
            digital engineering lab
          </span>
          <span>Built with intent · 2026</span>
        </div>
      </footer>
    </>
  );
}