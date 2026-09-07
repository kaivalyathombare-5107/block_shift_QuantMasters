import { NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return NextResponse.json(
      {
        data: null,
        error: `Project "${slug}" not found`,
        status: 404,
        emptyState: { reason: 'not_found' },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: project,
    error: null,
    status: 200,
  });
}
