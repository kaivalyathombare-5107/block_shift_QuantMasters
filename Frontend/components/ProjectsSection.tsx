'use client';

import type { Project } from '@/types';
import { usePortfolioData } from '@/lib/portfolio-store';
import { ArrowUpRight, Code2, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  initialProjects?: Project[];
}

export default function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const { projects } = usePortfolioData({ projects: initialProjects });

  return (
    <section id="projects" data-section="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 border-t border-border">
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-muted">
        <span className="text-accent">003</span>
        <span className="mx-2 text-[#48505c]">/</span>
        Projects
      </div>

      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Selected signals.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            A few experiments and production systems from the lab.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted font-mono text-sm">No projects yet — check back soon.</p>
      ) : (
        <div className="space-y-5">
          {projects.map((p, i) => (
            <article
              key={p.slug || p.title}
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
                    {p.date?.slice(0, 4) || '2024'} ·{' '}
                    <span className="text-accent">{p.status || 'Active'}</span>
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
                  {p.technologies?.map((t) => (
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
    </section>
  );
}
