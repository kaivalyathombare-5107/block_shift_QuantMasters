'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project, TechStackItem, Achievement } from '@/types';
import { PROJECTS, TECH_STACK, ACHIEVEMENTS } from '@/lib/data';

const STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects_v1',
  SKILLS: 'portfolio_skills_v1',
  ACHIEVEMENTS: 'portfolio_achievements_v1',
} as const;

const UPDATE_EVENT = 'portfolio-data-updated';

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch (e) {
    console.warn(`[portfolio-store] Failed to read key ${key} from localStorage: ${(e as Error)?.message || String(e)}`);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { key } }));
    return true;
  } catch (e) {
    console.error(`[portfolio-store] Failed to save key ${key} to localStorage: ${(e as Error)?.message || String(e)}`);
    return false;
  }
}

export function getStoredProjects(): Project[] {
  return safeGet<Project[]>(STORAGE_KEYS.PROJECTS, PROJECTS);
}

export function saveStoredProjects(projects: Project[]): boolean {
  return safeSet(STORAGE_KEYS.PROJECTS, projects);
}

export function getStoredSkills(): TechStackItem[] {
  return safeGet<TechStackItem[]>(STORAGE_KEYS.SKILLS, TECH_STACK);
}

export function saveStoredSkills(skills: TechStackItem[]): boolean {
  return safeSet(STORAGE_KEYS.SKILLS, skills);
}

export function getStoredAchievements(): Achievement[] {
  return safeGet<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, ACHIEVEMENTS);
}

export function saveStoredAchievements(achievements: Achievement[]): boolean {
  return safeSet(STORAGE_KEYS.ACHIEVEMENTS, achievements);
}

export function resetAllPortfolioData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { reset: true } }));
  } catch (e) {
    console.error('[portfolio-store] Failed to reset data: ' + ((e as Error)?.message || String(e)));
  }
}

export function isDataCustomized(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(STORAGE_KEYS.PROJECTS) !== null ||
    localStorage.getItem(STORAGE_KEYS.SKILLS) !== null ||
    localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) !== null
  );
}

export function exportPortfolioJSON(): string {
  const data = {
    projects: getStoredProjects(),
    skills: getStoredSkills(),
    achievements: getStoredAchievements(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * React hook to access and mutate portfolio data with live multi-tab synchronization
 */
export function usePortfolioData(initialData?: {
  projects?: Project[];
  skills?: TechStackItem[];
  achievements?: Achievement[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialData?.projects ?? PROJECTS);
  const [skills, setSkills] = useState<TechStackItem[]>(initialData?.skills ?? TECH_STACK);
  const [achievements, setAchievements] = useState<Achievement[]>(
    initialData?.achievements ?? ACHIEVEMENTS
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [customized, setCustomized] = useState(false);

  const loadFromStorage = useCallback(() => {
    setProjects(getStoredProjects());
    setSkills(getStoredSkills());
    setAchievements(getStoredAchievements());
    setCustomized(isDataCustomized());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadFromStorage();

    const handleUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadFromStorage]);

  const updateProjects = (newProjects: Project[]) => {
    saveStoredProjects(newProjects);
    setProjects(newProjects);
    setCustomized(true);
  };

  const updateSkills = (newSkills: TechStackItem[]) => {
    saveStoredSkills(newSkills);
    setSkills(newSkills);
    setCustomized(true);
  };

  const updateAchievements = (newAchievements: Achievement[]) => {
    saveStoredAchievements(newAchievements);
    setAchievements(newAchievements);
    setCustomized(true);
  };

  const reset = () => {
    resetAllPortfolioData();
    setProjects(PROJECTS);
    setSkills(TECH_STACK);
    setAchievements(ACHIEVEMENTS);
    setCustomized(false);
  };

  return {
    projects,
    skills,
    achievements,
    isLoaded,
    isCustomized: customized,
    updateProjects,
    updateSkills,
    updateAchievements,
    reset,
  };
}
