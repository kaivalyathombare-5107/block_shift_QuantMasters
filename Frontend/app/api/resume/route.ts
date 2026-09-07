import { NextResponse } from 'next/server';
import { RESUME_METADATA } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    data: RESUME_METADATA,
    error: null,
    status: 200,
    cachedAt: new Date().toISOString(),
  });
}
