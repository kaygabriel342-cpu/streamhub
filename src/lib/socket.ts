import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { db } from '@/db';
import { watchParties, watchPartyMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface SocketData {
  partyId: string;
  userId: string;
  username: string;
}

interface WatchPartyState {
  currentTime: number;
  isPlaying: boolean;
  members: Map<string, SocketData>;
}

const partyStates = new Map<string, WatchPartyState>();

export function initSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/socket',
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join a watch party
    socket.on('join-party', async (data: { partyId: string; userId: string; username: string }) => {
      const { partyId, userId, username } = data;
      
      socket.join(partyId);
      
      // Initialize party state if it doesn't exist
      if (!partyStates.has(partyId)) {
        // Fetch current state from database
        const [party] = await db.select().from(watchParties).where(eq(watchParties.id, partyId));
        if (party) {
          partyStates.set(partyId, {
            currentTime: party.currentTime,
            isPlaying: party.isPlaying,
            members: new Map(),
          });
        }
      }
      
      const state = partyStates.get(partyId);
      if (state) {
        state.members.set(socket.id, { partyId, userId, username });
        
        // Add member to database
        await db.insert(watchPartyMembers).values({
          partyId,
          profileId: userId,
        }).onConflictDoNothing();
        
        // Send current state to the new member
        socket.emit('party-state', {
          currentTime: state.currentTime,
          isPlaying: state.isPlaying,
          members: Array.from(state.members.values()),
        });
        
        // Notify others
        socket.to(partyId).emit('member-joined', {
          userId,
          username,
          socketId: socket.id,
        });
      }
    });

    // Sync playback
    socket.on('sync-playback', (data: { partyId: string; currentTime: number; isPlaying: boolean }) => {
      const { partyId, currentTime, isPlaying } = data;
      
      const state = partyStates.get(partyId);
      if (state) {
        state.currentTime = currentTime;
        state.isPlaying = isPlaying;
        
        // Update database
        db.update(watchParties)
          .set({ currentTime, isPlaying })
          .where(eq(watchParties.id, partyId))
          .catch(console.error);
        
        // Broadcast to all other members
        socket.to(partyId).emit('playback-synced', {
          currentTime,
          isPlaying,
          senderId: socket.id,
        });
      }
    });

    // Seek
    socket.on('seek', (data: { partyId: string; currentTime: number }) => {
      const { partyId, currentTime } = data;
      
      const state = partyStates.get(partyId);
      if (state) {
        state.currentTime = currentTime;
        
        // Update database
        db.update(watchParties)
          .set({ currentTime })
          .where(eq(watchParties.id, partyId))
          .catch(console.error);
        
        // Broadcast to all other members
        socket.to(partyId).emit('seeked', {
          currentTime,
          senderId: socket.id,
        });
      }
    });

    // Chat message
    socket.on('chat-message', (data: { partyId: string; userId: string; username: string; message: string }) => {
      const { partyId, userId, username, message } = data;
      
      socket.to(partyId).emit('chat-message', {
        userId,
        username,
        message,
        timestamp: Date.now(),
      });
    });

    // Leave party
    socket.on('leave-party', async (data: { partyId: string }) => {
      const { partyId } = data;
      
      const state = partyStates.get(partyId);
      if (state) {
        const member = state.members.get(socket.id);
        state.members.delete(socket.id);
        
        socket.to(partyId).emit('member-left', {
          userId: member?.userId,
          username: member?.username,
          socketId: socket.id,
        });
        
        // Remove from database
        if (member) {
          await db.delete(watchPartyMembers)
            .where(eq(watchPartyMembers.partyId, partyId))
            .catch(console.error);
        }
      }
      
      socket.leave(partyId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      
      // Find and remove from all parties
      for (const [partyId, state] of partyStates.entries()) {
        const member = state.members.get(socket.id);
        if (member) {
          state.members.delete(socket.id);
          
          socket.to(partyId).emit('member-left', {
            userId: member.userId,
            username: member.username,
            socketId: socket.id,
          });
          
          // Remove from database
          await db.delete(watchPartyMembers)
            .where(eq(watchPartyMembers.partyId, partyId))
            .catch(console.error);
        }
      }
    });
  });

  return io;
}
