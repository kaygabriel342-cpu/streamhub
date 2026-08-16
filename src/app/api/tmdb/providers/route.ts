import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
    const data = await fetchFromTMDB(`/watch/providers/${type}?watch_region=US`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Provider list error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
