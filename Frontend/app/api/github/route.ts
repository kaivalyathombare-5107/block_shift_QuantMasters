import { NextResponse } from 'next/server';
import { fetchGitHubStatsService } from '@/lib/backend/github';

export async function GET() {
  const result = await fetchGitHubStatsService();
  return NextResponse.json(result, { status: result.status });
}
