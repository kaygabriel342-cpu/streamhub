import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decodeSession } from '@/lib/auth/accounts';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('marquee_session')?.value;
  const user = decodeSession(session);

  return NextResponse.json({ user, isAdmin: user?.role === 'admin' });
}
