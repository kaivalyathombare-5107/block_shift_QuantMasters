'use client';

import { useMemo, useState } from 'react';
import type { Achievement } from '@/types';
import { usePortfolioData } from '@/lib/portfolio-store';
import { Award, Trophy, BookmarkCheck, ExternalLink, Calendar } from 'lucide-react';

interface AchievementsSectionProps {
  initialAchievements?: Achievement[];
}

export default function AchievementsSection({ initialAchievements }: AchievementsSectionProps) {
  const { achievements } = usePortfolioData({ achievements: initialAchievements });
  const [filterType, setFilterType] = useState<string>('All');

  const types = useMemo(() => {
    const set = new Set<string>();
    achievements.forEach((a) => {
      if (a.type) set.add(a.type);
    });
    return ['All', ...Array.from(set)];
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    const list = filterType === 'All'
      ? achievements
      : achievements.filter((a) => a.type === filterType);
    // Sort descending by year
    return [...list].sort((a, b) => Number(b.year) - Number(a.year));
  }, [achievements, filterType]);

  return (
    <section
      id="achievements"
      data-section="achievements"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 border-t border-border"
    >
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-muted">
        <span className="text-accent">005</span>
        <span className="mx-2 text-[#48505c]">/</span>
        Milestones &amp; Timeline
      </div>

      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Honors &amp; milestones.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            Recognitions, hackathon podiums, certifications, and technical contributions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                filterType === type
                  ? 'bg-accent text-[#08101d] font-semibold'
                  : 'border border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredAchievements.length === 0 ? (
        <div className="rounded border border-dashed border-border p-8 text-center font-mono text-sm text-muted">
          No achievements found in this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map((item, index) => {
            return (
              <div
                key={`${item.title}-${index}`}
                className="group relative flex flex-col justify-between gap-4 border border-border bg-surface p-6 transition hover:border-accent/60 md:flex-row md:items-center"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-accent">
                      {item.year}
                      {item.month ? `.${String(item.month).padStart(2, '0')}` : ''}
                    </span>
                    <span className="text-muted/40">•</span>
                    <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {item.type}
                    </span>
                    {item.featured && (
                      <span className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-medium tracking-tight text-foreground transition group-hover:text-accent">
                    {item.title}
                  </h3>

                  <div className="font-mono text-xs text-muted">
                    {item.organization}
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                </div>

                {item.url && (
                  <div className="shrink-0 pt-2 md:pt-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
                    >
                      <span>Verification</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
