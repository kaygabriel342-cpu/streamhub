// This file is a placeholder - Socket.io is initialized in the server
// See the custom server setup or use the client-side connection
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response('Socket.io endpoint - connect via socket.io-client', {
    status: 200,
  });
}
