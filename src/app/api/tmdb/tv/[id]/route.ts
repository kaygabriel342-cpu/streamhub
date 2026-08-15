import { NextResponse } from 'next/server';
import { getTVDetails, getSimilarTV, getRecommendationsTV } from '@/lib/tmdb/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tvId = parseInt(id);
    
    if (isNaN(tvId)) {
      return NextResponse.json({ error: 'Invalid TV show ID' }, { status: 400 });
    }
    
    const details = await getTVDetails(tvId);
    const similar = await getSimilarTV(tvId);
    const recommendations = await getRecommendationsTV(tvId);
    
    return NextResponse.json({
      ...details,
      media_type: 'tv',
      similar: similar.results,
      recommendations: recommendations.results,
    });
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return NextResponse.json({ error: 'Failed to fetch TV details' }, { status: 500 });
  }
}
