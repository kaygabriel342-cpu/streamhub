'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import CinemaPlayer from './CinemaPlayer';

interface WatchPartyProps {
  partyId: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
}

interface Member {
  socketId: string;
  userId: string;
  username: string;
}

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export default function WatchParty({
  partyId,
  tmdbId,
  mediaType,
  title,
  season,
  episode,
}: WatchPartyProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [username] = useState(() => `User${Math.random().toString(36).substring(7)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io({
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('join-party', {
        partyId,
        userId: 'anonymous',
        username,
      });
    });

    newSocket.on('party-state', (state: { members: Member[] }) => {
      setMembers(state.members);
    });

    newSocket.on('member-joined', (member: Member) => {
      setMembers((prev) => [...prev, member]);
      setChatMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: `${member.username} joined the party`,
          timestamp: Date.now(),
        },
      ]);
    });

    newSocket.on('member-left', (member: Member) => {
      setMembers((prev) => prev.filter((m) => m.socketId !== member.socketId));
      setChatMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: `${member.username} left the party`,
          timestamp: Date.now(),
        },
      ]);
    });

    newSocket.on('chat-message', (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-party', { partyId });
      newSocket.disconnect();
    };
  }, [partyId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !chatMessage.trim()) return;

    socket.emit('chat-message', {
      partyId,
      userId: 'anonymous',
      username,
      message: chatMessage.trim(),
    });

    setChatMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Video Player */}
      <div className="flex-1 bg-black">
        <CinemaPlayer
          tmdbId={tmdbId}
          mediaType={mediaType}
          season={season}
          episode={episode}
          title={title}
        />
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#1a1a1a] border-l border-[#333] flex flex-col">
        {/* Party Info */}
        <div className="p-4 border-b border-[#333]">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <p className="text-[#666] text-sm">{members.length} members watching</p>
        </div>

        {/* Members List */}
        <div className="p-4 border-b border-[#333]">
          <h4 className="text-[#666] text-sm font-medium mb-2">Watching With</h4>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <div
                key={member.socketId}
                className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-full"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-white text-sm">{member.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 bg-[#2a2a2a] rounded">
                <span className="text-[#e50914] font-medium">{msg.username}: </span>
                <span className="text-white">{msg.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendChat} className="p-4 border-t border-[#333]">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#e50914]"
              />
              <button
                type="submit"
                className="p-2 text-[#e50914] hover:text-[#f40612] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
