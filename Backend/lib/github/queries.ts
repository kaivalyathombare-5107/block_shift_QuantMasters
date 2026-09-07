export const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export function buildContributionVariables(username: string): {
  username: string;
  from: string;
  to: string;
} {
  const now = new Date();
  const to = now.toISOString();
  const fiftyTwoWeeksMs = 52 * 7 * 24 * 60 * 60 * 1000;
  const from = new Date(now.getTime() - fiftyTwoWeeksMs).toISOString();

  return {
    username,
    from,
    to,
  };
}
