'use client';

import { useMemo, useState } from 'react';
import type { TechStackItem, TechCategory } from '@/types';
import { usePortfolioData } from '@/lib/portfolio-store';
import { Sparkles, Layers, Cpu } from 'lucide-react';

interface StackSectionProps {
  initialSkills?: TechStackItem[];
}

export default function StackSection({ initialSkills }: StackSectionProps) {
  const { skills } = usePortfolioData({ skills: initialSkills });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  return (
    <section id="stack" data-section="stack" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 border-t border-border">
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-muted">
        <span className="text-accent">002</span>
        <span className="mx-2 text-[#48505c]">/</span>
        Stack &amp; Capabilities
      </div>

      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Technical arsenal.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            Engineered systems across languages, AI architectures, distributed databases, and runtime environments.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? 'bg-accent text-[#08101d] font-semibold'
                  : 'border border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="rounded border border-dashed border-border p-8 text-center font-mono text-sm text-muted">
          No skills found in this category.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, index) => {
            const proficiency = skill.proficiencyLevel || skill.proficiency || 'Proficient';
            const years = skill.yearsOfExperience ?? skill.years;
            const iconBadge = skill.icon || skill.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={`${skill.name}-${index}`}
                className="group relative flex flex-col justify-between border border-border bg-surface p-5 transition hover:border-accent/60 hover:bg-surface-2"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded border border-border bg-[#08090c] font-mono text-xs font-semibold text-accent group-hover:border-accent/40">
                        {iconBadge}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-medium tracking-tight group-hover:text-accent transition">
                          {skill.name}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        proficiency === 'Expert'
                          ? 'border border-accent/40 bg-accent/10 text-accent'
                          : proficiency === 'Proficient'
                          ? 'border border-[#73d69b]/40 bg-[#73d69b]/10 text-[#73d69b]'
                          : 'border border-border bg-surface text-muted'
                      }`}
                    >
                      {proficiency}
                    </span>
                  </div>

                  {/* Tags */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {skill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-border/70 bg-[#08090c]/40 px-2 py-0.5 font-mono text-[9px] text-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {years !== undefined && years > 0 && (
                  <div className="mt-4 border-t border-border/70 pt-3 flex items-center justify-between font-mono text-[10px] text-muted">
                    <span>Experience</span>
                    <span className="text-foreground">{years} yrs</span>
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
