import { NextResponse } from 'next/server';
import { getMovieDetails, getSimilarMovies, getRecommendationsMovies } from '@/lib/tmdb/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }
    
    const details = await getMovieDetails(movieId);
    const similar = await getSimilarMovies(movieId);
    const recommendations = await getRecommendationsMovies(movieId);
    
    return NextResponse.json({
      ...details,
      media_type: 'movie',
      similar: similar.results,
      recommendations: recommendations.results,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
