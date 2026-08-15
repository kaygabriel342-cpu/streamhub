import { NextResponse } from 'next/server';
import { db } from '@/db';
import { watchParties, watchPartyMembers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get('id');
    
    if (partyId) {
      const [party] = await db.select().from(watchParties).where(eq(watchParties.id, partyId));
      
      if (!party) {
        return NextResponse.json({ error: 'Party not found' }, { status: 404 });
      }
      
      const members = await db.select().from(watchPartyMembers).where(eq(watchPartyMembers.partyId, partyId));
      
      return NextResponse.json({ ...party, members });
    }
    
    // Get all active parties
    const parties = await db.select().from(watchParties).orderBy(desc(watchParties.createdAt)).limit(20);
    
    return NextResponse.json(parties);
  } catch (error) {
    console.error('Error fetching watch parties:', error);
    return NextResponse.json({ error: 'Failed to fetch watch parties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, hostId, tmdbId, mediaType } = body;
    
    if (!name || !hostId || !tmdbId || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const [party] = await db.insert(watchParties).values({
      name,
      hostId,
      tmdbId,
      mediaType,
      currentTime: 0,
      isPlaying: false,
    }).returning();
    
    // Add host as first member
    await db.insert(watchPartyMembers).values({
      partyId: party.id,
      userId: hostId,
    });
    
    return NextResponse.json(party, { status: 201 });
  } catch (error) {
    console.error('Error creating watch party:', error);
    return NextResponse.json({ error: 'Failed to create watch party' }, { status: 500 });
  }
}
