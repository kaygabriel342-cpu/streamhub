import { NextResponse } from 'next/server';
import { fetchM3UPlaylist } from '@/lib/livetv/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    const channels = await fetchM3UPlaylist(url);
    
    return NextResponse.json({ channels });
  } catch (error) {
    console.error('M3U API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch M3U playlist', channels: [] }, { status: 500 });
  }
}
