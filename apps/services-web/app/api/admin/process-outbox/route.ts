import { NextRequest, NextResponse } from 'next/server';
import { processOutbox } from '@/lib/outbox';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-api-key');
  const expectedKey = process.env.GARAGE_ADMIN_API_KEY;

  if (!expectedKey || authHeader !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processOutbox();
    return NextResponse.json(result);
  } catch (err) {
    console.error('[outbox-route] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
