import type { GitHubStats, APIResponse, GitHubProfile, ContributionWeek } from '@/types';
import { serverEnv } from '@/lib/config/env';
import { githubFetch, githubGraphQL } from './client';
import { CONTRIBUTION_QUERY, buildContributionVariables } from './queries';
import {
  transformRepo,
  aggregateLanguageStats,
  transformContributions,
  computeTotalStars,
  selectTopRepos,
} from './transformers';

function transformProfile(raw: unknown): GitHubProfile {
  const p = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  return {
    login: typeof p.login === 'string' ? p.login : '',
    name: typeof p.name === 'string' ? p.name : '',
    bio: typeof p.bio === 'string' ? p.bio : '',
    avatarUrl: typeof p.avatar_url === 'string' ? p.avatar_url : '',
    followers: typeof p.followers === 'number' ? p.followers : 0,
    following: typeof p.following === 'number' ? p.following : 0,
    publicRepos: typeof p.public_repos === 'number' ? p.public_repos : 0,
    profileUrl: typeof p.html_url === 'string' ? p.html_url : '',
  };
}

export async function fetchGitHubStats(): Promise<APIResponse<GitHubStats>> {
  let username = '';
  try {
    username = serverEnv.githubUsername;
  } catch {
    return {
      data: null,
      error: null,
      status: 200,
      emptyState: { reason: 'not_configured' },
    };
  }

  if (!username || username.trim().length === 0) {
    return {
      data: null,
      error: null,
      status: 200,
      emptyState: { reason: 'not_configured' },
    };
  }

  try {
    const {
      data: profileData,
      error: profileError,
      rateLimited: profileRateLimited,
    } = await githubFetch<unknown>(`/users/${username}`);

    if (profileRateLimited) {
      return {
        data: null,
        error: null,
        status: 429,
        emptyState: { reason: 'rate_limited' },
      };
    }

    if (profileError || !profileData) {
      return {
        data: null,
        error: 'Failed to fetch GitHub profile',
        status: 502,
        emptyState: { reason: 'api_error' },
      };
    }

    const {
      data: reposData,
      rateLimited: reposRateLimited,
    } = await githubFetch<unknown[]>(
      `/users/${username}/repos?sort=updated&per_page=100&type=public`
    );

    if (reposRateLimited) {
      return {
        data: null,
        error: null,
        status: 429,
        emptyState: { reason: 'rate_limited' },
      };
    }

    const repos = Array.isArray(reposData) ? reposData.map(transformRepo) : [];

    const topReposForLanguages = [...repos]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    const languageResults = await Promise.allSettled(
      topReposForLanguages.map((repo) =>
        githubFetch<Record<string, number>>(`/repos/${username}/${repo.name}/languages`)
      )
    );

    const repoLanguages: Record<string, number>[] = [];
    for (const result of languageResults) {
      if (result.status === 'fulfilled' && result.value.data !== null) {
        repoLanguages.push(result.value.data);
      }
    }

    const languageStats = aggregateLanguageStats(repoLanguages);

    let contributionData: ContributionWeek[] = [];
    let token = '';
    try {
      token = serverEnv.githubToken;
    } catch {
      token = '';
    }

    if (token && token.trim().length > 0) {
      const { data: contribData, rateLimited: contribRateLimited } =
        await githubGraphQL<unknown>(
          CONTRIBUTION_QUERY,
          buildContributionVariables(username)
        );

      if (!contribRateLimited && contribData) {
        contributionData = transformContributions(contribData);
      }
    }

    const topRepos = selectTopRepos(repos);
    const totalStars = computeTotalStars(repos);

    const stats: GitHubStats = {
      profile: transformProfile(profileData),
      topRepos,
      languageStats,
      totalStars,
      contributionData,
      fetchedAt: new Date().toISOString(),
    };

    return {
      data: stats,
      error: null,
      status: 200,
      cachedAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error('[GitHub Service] Unexpected error:', error);
    return {
      data: null,
      error: 'Internal error fetching GitHub data',
      status: 500,
      emptyState: { reason: 'api_error' },
    };
  }
}
