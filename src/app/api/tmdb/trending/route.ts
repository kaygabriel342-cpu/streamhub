import { NextResponse } from 'next/server';
import { getTrending, getTrendingMovies, getTrendingTV } from '@/lib/tmdb/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const timeWindow = (searchParams.get('timeWindow') as 'day' | 'week') || 'week';
    
    let data;
    if (type === 'movie') {
      data = await getTrendingMovies(timeWindow);
    } else if (type === 'tv') {
      data = await getTrendingTV(timeWindow);
    } else {
      data = await getTrending(timeWindow);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending:', error);
    return NextResponse.json({ error: 'Failed to fetch trending content' }, { status: 500 });
  }
}
