import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
    const page = searchParams.get('page') || '1';

    if (!providerId) {
      return NextResponse.json({ error: 'providerId is required' }, { status: 400 });
    }

    const data = await fetchFromTMDB(
      `/discover/${type}?watch_region=US&with_watch_providers=${providerId}&sort_by=popularity.desc&page=${page}`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Provider discovery error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
