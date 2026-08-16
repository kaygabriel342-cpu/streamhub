import { NextResponse } from 'next/server';
import { encodeSession, getAllAccounts, sanitizeAccount } from '@/lib/auth/accounts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const account = getAllAccounts().find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!account) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const profile = sanitizeAccount(account);
    const response = NextResponse.json({ user: profile });
    response.cookies.set('marquee_session', encodeSession(profile), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Unable to login' }, { status: 500 });
  }
}
