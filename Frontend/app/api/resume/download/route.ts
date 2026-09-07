import { NextResponse } from 'next/server';

export async function GET() {
  // Returns a simple downloadable text/pdf placeholder or redirect
  return new NextResponse('Resume document preview - Alex Rivera', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="Resume-Alex-Rivera.txt"',
    },
  });
}
