import { NextResponse } from 'next/server';
import { searchMulti, searchMovies, searchTV } from '@/lib/tmdb/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || 'multi';
    const page = parseInt(searchParams.get('page') || '1');
    
    if (!query) {
      return NextResponse.json({ results: [], page: 1, total_pages: 0, total_results: 0 });
    }
    
    let data;
    if (type === 'movie') {
      data = await searchMovies(query, page);
    } else if (type === 'tv') {
      data = await searchTV(query, page);
    } else {
      data = await searchMulti(query, page);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
