import { NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    data: PROJECTS,
    error: null,
    status: 200,
    cachedAt: new Date().toISOString(),
  });
}
