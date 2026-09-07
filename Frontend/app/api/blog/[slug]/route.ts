import { NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/backend/blog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return NextResponse.json(
      {
        data: null,
        error: `Blog post "${slug}" not found`,
        status: 404,
        emptyState: { reason: 'not_found' },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: post,
    error: null,
    status: 200,
  });
}
