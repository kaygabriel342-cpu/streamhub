import { NextResponse } from 'next/server';
import { getMovieGenres, getTVGenres } from '@/lib/tmdb/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie';
    
    let data;
    if (type === 'tv') {
      data = await getTVGenres();
    } else {
      data = await getMovieGenres();
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
