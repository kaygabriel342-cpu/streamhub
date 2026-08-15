import { NextResponse } from 'next/server';
import { getTVSeasonDetails } from '@/lib/tmdb/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  try {
    const { id, season } = await params;
    const tvId = parseInt(id);
    const seasonNumber = parseInt(season);
    
    if (isNaN(tvId) || isNaN(seasonNumber)) {
      return NextResponse.json({ error: 'Invalid ID or season number' }, { status: 400 });
    }
    
    const data = await getTVSeasonDetails(tvId, seasonNumber);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching season details:', error);
    return NextResponse.json({ error: 'Failed to fetch season details' }, { status: 500 });
  }
}
