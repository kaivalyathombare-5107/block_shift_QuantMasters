import { NextResponse } from 'next/server';
import { validateContact, sendContactEmail } from '@/lib/backend/contact';
import { checkRateLimit, getClientIP } from '@/lib/backend/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const rateLimitResult = await checkRateLimit(ip, 5, 3600);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        data: null,
        error: 'Too many messages sent. Please try again in an hour.',
        status: 429,
        emptyState: { reason: 'rate_limited' },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: 'Invalid JSON request body',
        status: 400,
      },
      { status: 400 }
    );
  }

  const validation = validateContact(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        data: null,
        error: Object.values(validation.errors)[0] || 'Validation error',
        status: 422,
      },
      { status: 422 }
    );
  }

  const result = await sendContactEmail(validation.data);

  if (!result.success) {
    return NextResponse.json(
      {
        data: null,
        error: result.message || 'Failed to send message',
        status: 500,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      success: true,
      message: result.message,
    },
    error: null,
    status: 200,
  });
}
