import { LANGUAGE_COLORS } from './language-colors';
import type {
  GitHubRepo,
  GitHubLanguageStats,
  ContributionWeek,
  ContributionDay,
  ContributionLevel,
} from '@/types';

export function transformRepo(raw: unknown): GitHubRepo {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  return {
    id: typeof r.id === 'number' ? r.id : 0,
    name: typeof r.name === 'string' ? r.name : '',
    fullName: typeof r.full_name === 'string' ? r.full_name : '',
    description: typeof r.description === 'string' ? r.description : '',
    url: typeof r.html_url === 'string' ? r.html_url : '',
    homepage:
      typeof r.homepage === 'string' && r.homepage.trim().length > 0 ? r.homepage : undefined,
    stars: typeof r.stargazers_count === 'number' ? r.stargazers_count : 0,
    forks: typeof r.forks_count === 'number' ? r.forks_count : 0,
    language: typeof r.language === 'string' ? r.language : undefined,
    topics: Array.isArray(r.topics)
      ? r.topics.filter((t): t is string => typeof t === 'string')
      : [],
    updatedAt: typeof r.updated_at === 'string' ? r.updated_at : new Date().toISOString(),
    isArchived: Boolean(r.archived),
    isFork: Boolean(r.fork),
  };
}

export function countToLevel(count: number): ContributionLevel {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function aggregateLanguageStats(
  repoLanguages: Record<string, number>[]
): GitHubLanguageStats[] {
  const totals: Record<string, number> = {};
  let overallBytes = 0;

  for (const repo of repoLanguages) {
    if (!repo || typeof repo !== 'object') continue;

    for (const [language, bytes] of Object.entries(repo)) {
      if (typeof bytes === 'number' && bytes > 0) {
        totals[language] = (totals[language] || 0) + bytes;
        overallBytes += bytes;
      }
    }
  }

  if (overallBytes === 0) {
    return [];
  }

  const entries = Object.entries(totals).map(([language, bytes]) => {
    const percentage = Math.round((bytes / overallBytes) * 1000) / 10;
    const color = LANGUAGE_COLORS[language] || '#858585';
    return {
      language,
      percentage,
      color,
    };
  });

  return entries
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);
}

export function transformContributions(raw: unknown): ContributionWeek[] {
  if (!raw || typeof raw !== 'object') return [];

  const rawObj = raw as {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: Array<{
            firstDay?: string;
            contributionDays?: Array<{
              date?: string;
              contributionCount?: number;
              contributionLevel?: string;
            }>;
          }>;
        };
      };
    };
  };

  const rawWeeks =
    rawObj.user?.contributionsCollection?.contributionCalendar?.weeks;

  if (!Array.isArray(rawWeeks)) {
    return [];
  }

  const weeks: ContributionWeek[] = [];

  for (const rawWeek of rawWeeks) {
    const weekStr = typeof rawWeek.firstDay === 'string' ? rawWeek.firstDay : '';
    const days: ContributionDay[] = [];

    if (Array.isArray(rawWeek.contributionDays)) {
      for (const day of rawWeek.contributionDays) {
        const count = typeof day.contributionCount === 'number' ? day.contributionCount : 0;
        days.push({
          date: typeof day.date === 'string' ? day.date : '',
          count,
          level: countToLevel(count),
        });
      }
    }

    weeks.push({
      week: weekStr,
      days,
    });
  }

  return weeks;
}

export function computeTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((acc, repo) => acc + repo.stars, 0);
}

export function selectTopRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos]
    .filter((repo) => !repo.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6);
}
