import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/backend/blog';

export async function GET() {
  const posts = getAllBlogPosts();

  return NextResponse.json({
    data: posts,
    error: null,
    status: 200,
    cachedAt: new Date().toISOString(),
  });
}
