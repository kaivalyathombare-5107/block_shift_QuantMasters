'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RotateCcw,
  Download,
  Layers,
  Award,
  Terminal,
  ExternalLink,
  Search,
  Code2,
  Sparkles,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { usePortfolioData, exportPortfolioJSON } from '@/lib/portfolio-store';
import type {
  TechStackItem,
  TechCategory,
  ProficiencyLevel,
  Project,
  ProjectStatus,
  Achievement,
  AchievementType,
} from '@/types';

type AdminTab = 'skills' | 'projects' | 'achievements';

const TECH_CATEGORIES: TechCategory[] = [
  'Languages',
  'Frameworks',
  'AI_ML',
  'Databases',
  'Tools',
  'Cloud',
  'Libraries',
  'Other',
];

const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['Expert', 'Proficient', 'Familiar'];

const PROJECT_STATUSES: ProjectStatus[] = [
  'Active',
  'Completed',
  'InProgress',
  'Live',
  'Archived',
];

const ACHIEVEMENT_TYPES: AchievementType[] = [
  'Hackathon',
  'Award',
  'Certification',
  'Recognition',
  'Publication',
  'Other',
];

export default function AdminPage() {
  const {
    projects,
    skills,
    achievements,
    isLoaded,
    isCustomized,
    updateProjects,
    updateSkills,
    updateAchievements,
    reset,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Skill modal state
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<Partial<TechStackItem>>({
    name: '',
    category: 'Languages',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2,
    icon: '',
    tags: [],
  });
  const [skillTagsInput, setSkillTagsInput] = useState('');

  // Project modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    shortDescription: '',
    status: 'Active',
    date: new Date().toISOString().slice(0, 7),
    category: 'AI & Developer Tools',
    featured: true,
    githubUrl: '',
    liveDemoUrl: '',
    technologies: [],
  });
  const [projectTechInput, setProjectTechInput] = useState('');

  // Achievement modal state
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({
    title: '',
    organization: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    type: 'Hackathon',
    description: '',
    url: '',
    featured: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ─── Skill Handlers ────────────────────────────────────────────────────────
  const handleOpenNewSkill = () => {
    setEditingSkillIndex(null);
    setSkillForm({
      name: '',
      category: 'Languages',
      proficiencyLevel: 'Proficient',
      yearsOfExperience: 2,
      icon: '',
      tags: [],
    });
    setSkillTagsInput('');
    setSkillModalOpen(true);
  };

  const handleEditSkill = (index: number) => {
    const item = skills[index];
    setEditingSkillIndex(index);
    setSkillForm({ ...item });
    setSkillTagsInput(item.tags?.join(', ') || '');
    setSkillModalOpen(true);
  };

  const handleDeleteSkill = (index: number) => {
    const name = skills[index]?.name;
    if (confirm(`Delete skill "${name}"?`)) {
      const next = skills.filter((_, i) => i !== index);
      updateSkills(next);
      showToast(`Skill "${name}" deleted`);
    }
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name?.trim()) return;

    const tags = skillTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newSkill: TechStackItem = {
      name: skillForm.name.trim(),
      category: skillForm.category || 'Languages',
      proficiencyLevel: skillForm.proficiencyLevel || 'Proficient',
      proficiency: skillForm.proficiencyLevel || 'Proficient',
      yearsOfExperience: Number(skillForm.yearsOfExperience) || 1,
      years: Number(skillForm.yearsOfExperience) || 1,
      icon: skillForm.icon?.trim() || skillForm.name.trim().slice(0, 2).toUpperCase(),
      tags,
    };

    let next: TechStackItem[];
    if (editingSkillIndex !== null) {
      next = [...skills];
      next[editingSkillIndex] = newSkill;
      showToast(`Skill "${newSkill.name}" updated`);
    } else {
      next = [newSkill, ...skills];
      showToast(`Skill "${newSkill.name}" added`);
    }

    updateSkills(next);
    setSkillModalOpen(false);
  };

  // ─── Project Handlers ──────────────────────────────────────────────────────
  const handleOpenNewProject = () => {
    setEditingProjectIndex(null);
    setProjectForm({
      title: '',
      slug: '',
      shortDescription: '',
      status: 'Active',
      date: new Date().toISOString().slice(0, 10),
      category: 'AI & Developer Tools',
      featured: true,
      githubUrl: '',
      liveDemoUrl: '',
      technologies: [],
    });
    setProjectTechInput('');
    setProjectModalOpen(true);
  };

  const handleEditProject = (index: number) => {
    const p = projects[index];
    setEditingProjectIndex(index);
    setProjectForm({ ...p });
    setProjectTechInput(p.technologies?.join(', ') || '');
    setProjectModalOpen(true);
  };

  const handleDeleteProject = (index: number) => {
    const title = projects[index]?.title;
    if (confirm(`Delete project "${title}"?`)) {
      const next = projects.filter((_, i) => i !== index);
      updateProjects(next);
      showToast(`Project "${title}" deleted`);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim()) return;

    const slug =
      projectForm.slug?.trim() ||
      projectForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const tech = projectTechInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: Project = {
      title: projectForm.title.trim(),
      slug,
      shortDescription:
        projectForm.shortDescription?.trim() || 'No description provided.',
      description: projectForm.shortDescription?.trim() || '',
      status: projectForm.status || 'Active',
      date: projectForm.date || new Date().toISOString().slice(0, 10),
      category: projectForm.category || 'General',
      featured: Boolean(projectForm.featured),
      githubUrl: projectForm.githubUrl?.trim() || '',
      liveDemoUrl: projectForm.liveDemoUrl?.trim() || '',
      technologies: tech.length > 0 ? tech : ['TypeScript'],
    };

    let next: Project[];
    if (editingProjectIndex !== null) {
      next = [...projects];
      next[editingProjectIndex] = newProject;
      showToast(`Project "${newProject.title}" updated`);
    } else {
      next = [newProject, ...projects];
      showToast(`Project "${newProject.title}" added`);
    }

    updateProjects(next);
    setProjectModalOpen(false);
  };

  // ─── Achievement Handlers ──────────────────────────────────────────────────
  const handleOpenNewAchievement = () => {
    setEditingAchievementIndex(null);
    setAchievementForm({
      title: '',
      organization: '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      type: 'Hackathon',
      description: '',
      url: '',
      featured: false,
    });
    setAchievementModalOpen(true);
  };

  const handleEditAchievement = (index: number) => {
    const a = achievements[index];
    setEditingAchievementIndex(index);
    setAchievementForm({ ...a });
    setAchievementModalOpen(true);
  };

  const handleDeleteAchievement = (index: number) => {
    const title = achievements[index]?.title;
    if (confirm(`Delete achievement "${title}"?`)) {
      const next = achievements.filter((_, i) => i !== index);
      updateAchievements(next);
      showToast(`Achievement "${title}" deleted`);
    }
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title?.trim() || !achievementForm.organization?.trim()) return;

    const newAch: Achievement = {
      title: achievementForm.title.trim(),
      organization: achievementForm.organization.trim(),
      year: Number(achievementForm.year) || new Date().getFullYear(),
      month: Number(achievementForm.month) || undefined,
      type: achievementForm.type || 'Award',
      description: achievementForm.description?.trim() || '',
      url: achievementForm.url?.trim() || '',
      featured: Boolean(achievementForm.featured),
    };

    let next: Achievement[];
    if (editingAchievementIndex !== null) {
      next = [...achievements];
      next[editingAchievementIndex] = newAch;
      showToast(`Achievement updated`);
    } else {
      next = [newAch, ...achievements];
      showToast(`Achievement added`);
    }

    updateAchievements(next);
    setAchievementModalOpen(false);
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = exportPortfolioJSON();
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast('JSON copied to clipboard!');
    }).catch(() => {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-data.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded portfolio-data.json');
    });
  };

  // Reset
  const handleReset = () => {
    if (confirm('Reset all skills, projects, and achievements to default built-in data?')) {
      reset();
      showToast('Restored original data');
    }
  };

  // Filtered lists for rendering
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    const q = searchQuery.toLowerCase();
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [skills, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.technologies?.some((t) => t.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  const filteredAchievements = useMemo(() => {
    if (!searchQuery.trim()) return achievements;
    const q = searchQuery.toLowerCase();
    return achievements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.organization.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [achievements, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent/40 bg-[#08090c] px-4 py-3 font-mono text-xs text-accent shadow-2xl animate-fade-in">
          <Check size={14} />
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-[#08090c]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition"
            >
              <ArrowLeft size={14} />
              <span>Live Site</span>
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-accent font-semibold">[ ADMIN MODE ]</span>
              <span className="hidden sm:inline text-muted text-[11px]">
                Portfolio Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCustomized && (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] text-accent">
                <Sparkles size={11} />
                Custom Data Active
              </span>
            )}
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted hover:border-accent/60 hover:text-accent transition"
              title="Copy or download configuration JSON"
            >
              <Copy size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted hover:border-red-400/60 hover:text-red-400 transition"
              title="Reset all changes to defaults"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
        {/* Banner / Overview */}
        <div className="mb-8 border border-border bg-surface p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                Content &amp; Systems Management
              </h1>
              <p className="mt-1 text-sm text-muted">
                Add, modify, or delete skills, career milestones, and selected projects. Changes persist locally and reflect instantly on your live portfolio.
              </p>
            </div>

            {/* Metrics */}
            <div className="flex gap-4 font-mono text-xs">
              <div className="border border-border bg-[#08090c] p-3 text-center min-w-[75px]">
                <div className="text-xl font-display text-accent">{skills.length}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted">Skills</div>
              </div>
              <div className="border border-border bg-[#08090c] p-3 text-center min-w-[75px]">
                <div className="text-xl font-display text-foreground">{projects.length}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted">Projects</div>
              </div>
              <div className="border border-border bg-[#08090c] p-3 text-center min-w-[75px]">
                <div className="text-xl font-display text-foreground">{achievements.length}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted">Timeline</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex border border-border bg-[#08090c] p-1">
            <button
              onClick={() => { setActiveTab('skills'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition ${
                activeTab === 'skills'
                  ? 'bg-accent text-[#08101d] font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Layers size={14} />
              Skills ({skills.length})
            </button>
            <button
              onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition ${
                activeTab === 'projects'
                  ? 'bg-accent text-[#08101d] font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Code2 size={14} />
              Projects ({projects.length})
            </button>
            <button
              onClick={() => { setActiveTab('achievements'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition ${
                activeTab === 'achievements'
                  ? 'bg-accent text-[#08101d] font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Award size={14} />
              Achievements ({achievements.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-border bg-surface py-2 pl-9 pr-4 font-mono text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
              />
            </div>

            {activeTab === 'skills' && (
              <button
                onClick={handleOpenNewSkill}
                className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff] transition"
              >
                <Plus size={15} />
                <span>Add Skill</span>
              </button>
            )}

            {activeTab === 'projects' && (
              <button
                onClick={handleOpenNewProject}
                className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff] transition"
              >
                <Plus size={15} />
                <span>Add Project</span>
              </button>
            )}

            {activeTab === 'achievements' && (
              <button
                onClick={handleOpenNewAchievement}
                className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff] transition"
              >
                <Plus size={15} />
                <span>Add Achievement</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── TAB 1: SKILLS ───────────────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <div>
            {filteredSkills.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center font-mono text-sm text-muted">
                No skills found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill, index) => {
                  const originalIndex = skills.findIndex((s) => s.name === skill.name);
                  const proficiency = skill.proficiencyLevel || skill.proficiency || 'Proficient';

                  return (
                    <div
                      key={`${skill.name}-${index}`}
                      className="group flex flex-col justify-between border border-border bg-surface p-4 transition hover:border-accent/60"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded border border-border bg-[#08090c] font-mono text-xs font-semibold text-accent">
                              {skill.icon || skill.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <div className="font-display font-medium text-foreground">
                                {skill.name}
                              </div>
                              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                {skill.category}
                              </div>
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

                        {skill.tags && skill.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {skill.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded border border-border/70 bg-[#08090c] px-1.5 py-0.5 font-mono text-[9px] text-muted"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                        <span className="font-mono text-[10px] text-muted">
                          {skill.yearsOfExperience ?? skill.years ?? 1} yrs experience
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditSkill(originalIndex)}
                            className="rounded p-1 text-muted hover:bg-accent/10 hover:text-accent transition"
                            title="Edit skill"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(originalIndex)}
                            className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-400 transition"
                            title="Delete skill"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: PROJECTS ─────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div>
            {filteredProjects.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center font-mono text-sm text-muted">
                No projects found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((p, index) => {
                  const originalIndex = projects.findIndex(
                    (item) => item.slug === p.slug || item.title === p.title
                  );

                  return (
                    <div
                      key={p.slug || index}
                      className="group flex flex-col justify-between gap-4 border border-border bg-surface p-5 transition hover:border-accent/60 md:flex-row md:items-center"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-accent">
                            {p.date?.slice(0, 4) || '2024'}
                          </span>
                          <span className="text-muted/40">•</span>
                          <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
                            {p.status || 'Active'}
                          </span>
                          {p.category && (
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                              {p.category}
                            </span>
                          )}
                          {p.featured && (
                            <span className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-medium text-foreground">
                          {p.title}
                        </h3>

                        <p className="max-w-2xl text-xs leading-relaxed text-muted line-clamp-2">
                          {p.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.technologies?.map((tech) => (
                            <span
                              key={tech}
                              className="rounded border border-border bg-[#08090c] px-2 py-0.5 font-mono text-[9px] text-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-border pt-3 md:border-t-0 md:pt-0">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-2 text-muted hover:text-accent transition"
                            title="GitHub repository"
                          >
                            <Code2 size={15} />
                          </a>
                        )}
                        {p.liveDemoUrl && (
                          <a
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-2 text-muted hover:text-accent transition"
                            title="Live Demo"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEditProject(originalIndex)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-[#08090c] px-3 py-1.5 font-mono text-xs text-muted hover:border-accent/60 hover:text-accent transition"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(originalIndex)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-[#08090c] px-3 py-1.5 font-mono text-xs text-muted hover:border-red-500/60 hover:text-red-400 transition"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: ACHIEVEMENTS ─────────────────────────────────────────── */}
        {activeTab === 'achievements' && (
          <div>
            {filteredAchievements.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center font-mono text-sm text-muted">
                No achievements found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAchievements.map((item, index) => {
                  const originalIndex = achievements.findIndex(
                    (a) => a.title === item.title && a.organization === item.organization
                  );

                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="group flex flex-col justify-between gap-4 border border-border bg-surface p-5 transition hover:border-accent/60 md:flex-row md:items-center"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-accent">
                            {item.year}
                            {item.month ? `.${String(item.month).padStart(2, '0')}` : ''}
                          </span>
                          <span className="text-muted/40">•</span>
                          <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
                            {item.type}
                          </span>
                          {item.featured && (
                            <span className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-medium text-foreground">
                          {item.title}
                        </h3>

                        <div className="font-mono text-xs text-muted">
                          {item.organization}
                        </div>

                        <p className="max-w-3xl text-xs leading-relaxed text-muted">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-border pt-3 md:border-t-0 md:pt-0">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-2 text-muted hover:text-accent transition"
                            title="Certificate / Verification"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEditAchievement(originalIndex)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-[#08090c] px-3 py-1.5 font-mono text-xs text-muted hover:border-accent/60 hover:text-accent transition"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAchievement(originalIndex)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-[#08090c] px-3 py-1.5 font-mono text-xs text-muted hover:border-red-500/60 hover:text-red-400 transition"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── MODAL: SKILL EDIT/CREATE ──────────────────────────────────────── */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-[#0e1117] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h2 className="font-display text-xl font-medium">
                {editingSkillIndex !== null ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch, Rust, TypeScript"
                  value={skillForm.name || ''}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Category
                  </label>
                  <select
                    value={skillForm.category || 'Languages'}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, category: e.target.value as TechCategory })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    {TECH_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Proficiency
                  </label>
                  <select
                    value={skillForm.proficiencyLevel || 'Proficient'}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        proficiencyLevel: e.target.value as ProficiencyLevel,
                      })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    {PROFICIENCY_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={skillForm.yearsOfExperience ?? 2}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        yearsOfExperience: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Icon Text (2-3 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. TS, PY"
                    value={skillForm.icon || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. web, async, neural-nets"
                  value={skillTagsInput}
                  onChange={(e) => setSkillTagsInput(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 font-mono text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-accent px-5 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff]"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: PROJECT EDIT/CREATE ────────────────────────────────────── */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg border border-border bg-[#0e1117] p-6 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h2 className="font-display text-xl font-medium">
                {editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralReview: AI Code Reviewer"
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Slug (URL ID)
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from title"
                    value={projectForm.slug || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Status
                  </label>
                  <select
                    value={projectForm.status || 'Active'}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Summary / Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="1-2 sentences outlining the core purpose and architecture."
                  value={projectForm.shortDescription || ''}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, shortDescription: e.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, PyTorch, Redis"
                  value={projectTechInput}
                  onChange={(e) => setProjectTechInput(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.githubUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.liveDemoUrl || ''}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredProject"
                  checked={Boolean(projectForm.featured)}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border bg-surface text-accent focus:ring-accent"
                />
                <label htmlFor="featuredProject" className="font-mono text-xs text-muted">
                  Featured Project (highlighted prominently)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 font-mono text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-accent px-5 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ACHIEVEMENT EDIT/CREATE ────────────────────────────────── */}
      {achievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-[#0e1117] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h2 className="font-display text-xl font-medium">
                {editingAchievementIndex !== null ? 'Edit Achievement' : 'Add New Achievement'}
              </h2>
              <button
                onClick={() => setAchievementModalOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place Winner — Hackathon"
                  value={achievementForm.title || ''}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, title: e.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Organization / Issuer *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Hackathon, AWS, University"
                  value={achievementForm.organization || ''}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, organization: e.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={achievementForm.year || 2024}
                    onChange={(e) =>
                      setAchievementForm({ ...achievementForm, year: parseInt(e.target.value) || 2024 })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={achievementForm.month || 1}
                    onChange={(e) =>
                      setAchievementForm({ ...achievementForm, month: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                    Type
                  </label>
                  <select
                    value={achievementForm.type || 'Award'}
                    onChange={(e) =>
                      setAchievementForm({
                        ...achievementForm,
                        type: e.target.value as AchievementType,
                      })
                    }
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    {ACHIEVEMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key highlight, impact, or technologies involved."
                  value={achievementForm.description || ''}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, description: e.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
                  Certificate / Proof URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={achievementForm.url || ''}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, url: e.target.value })
                  }
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredAch"
                  checked={Boolean(achievementForm.featured)}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border bg-surface text-accent focus:ring-accent"
                />
                <label htmlFor="featuredAch" className="font-mono text-xs text-muted">
                  Featured Milestone
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAchievementModalOpen(false)}
                  className="px-4 py-2 font-mono text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-accent px-5 py-2 font-mono text-xs font-semibold text-[#08101d] hover:bg-[#9bc2ff]"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
