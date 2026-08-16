export interface LiveChannel {
  id: string;
  name: string;
  logo?: string;
  category: string;
  streamUrl: string;
  isLive: boolean;
  currentProgram?: string;
  nextProgram?: string;
  epg?: EPGProgram[];
}

export interface EPGProgram {
  title: string;
  start: string;
  end: string;
  description?: string;
  icon?: string;
}

export interface XtreamCredentials {
  url: string;
  username: string;
  password: string;
}

// M3U Playlist Parser
export function parseM3UPlaylist(m3uContent: string): LiveChannel[] {
  const channels: LiveChannel[] = [];
  const lines = m3uContent.split('\n');
  let currentChannel: Partial<LiveChannel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentChannel = {
        name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
        logo: logoMatch ? logoMatch[1] : undefined,
        category: groupMatch ? groupMatch[1] : 'General',
        isLive: true,
      };
    } else if (line.startsWith('http') && currentChannel.name) {
      // This is the stream URL
      channels.push({
        id: `channel-${channels.length}`,
        name: currentChannel.name!,
        logo: currentChannel.logo,
        category: currentChannel.category || 'General',
        streamUrl: line,
        isLive: true,
      });
      currentChannel = {};
    }
  }

  return channels;
}

// Fetch M3U Playlist from URL
export async function fetchM3UPlaylist(url: string): Promise<LiveChannel[]> {
  try {
    const response = await fetch(url);
    const m3uContent = await response.text();
    return parseM3UPlaylist(m3uContent);
  } catch (error) {
    console.error('M3U Fetch Error:', error);
    return [];
  }
}

// Xtream Codes API
export async function getXtreamLiveStreams(credentials: XtreamCredentials): Promise<LiveChannel[]> {
  try {
    const response = await fetch(
      `${credentials.url}/player_api.php?username=${credentials.username}&password=${credentials.password}&action=get_live_streams`
    );
    const data = await response.json();
    
    return data.map((stream: any) => ({
      id: stream.num.toString(),
      name: stream.name,
      logo: stream.stream_icon,
      category: stream.category_id.toString(),
      streamUrl: `${credentials.url}/live/${credentials.username}/${credentials.password}/${stream.num}.m3u8`,
      isLive: stream.epg_channel_id ? true : false,
    }));
  } catch (error) {
    console.error('Xtream API Error:', error);
    return [];
  }
}

export async function getXtreamCategories(credentials: XtreamCredentials): Promise<any[]> {
  try {
    const response = await fetch(
      `${credentials.url}/player_api.php?username=${credentials.username}&password=${credentials.password}&action=get_live_categories`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Xtream Categories Error:', error);
    return [];
  }
}

export async function getXtreamEPG(credentials: XtreamCredentials, streamId: string): Promise<EPGProgram[]> {
  try {
    const response = await fetch(
      `${credentials.url}/player_api.php?username=${credentials.username}&password=${credentials.password}&action=get_short_epg&stream_id=${streamId}`
    );
    const data = await response.json();
    return data.epg_listings?.map((epg: any) => ({
      title: epg.title,
      start: epg.start,
      end: epg.end,
      description: epg.description,
      icon: epg.programme_icon,
    })) || [];
  } catch (error) {
    console.error('Xtream EPG Error:', error);
    return [];
  }
}

// Free M3U Playlists (Publicly available)
export const FREE_M3U_PLAYLISTS = [
  {
    name: 'IPTV-org (Global)',
    url: 'https://iptv-org.github.io/iptv/index.m3u',
    category: 'All',
  },
  {
    name: 'IPTV-org (Sports)',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    category: 'Sports',
  },
  {
    name: 'IPTV-org (News)',
    url: 'https://iptv-org.github.io/iptv/categories/news.m3u',
    category: 'News',
  },
  {
    name: 'IPTV-org (Kids)',
    url: 'https://iptv-org.github.io/iptv/categories/kids.m3u',
    category: 'Kids',
  },
  {
    name: 'IPTV-org (Movies)',
    url: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
    category: 'Movies',
  },
  {
    name: 'Free TV Channels',
    url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
    category: 'All',
  },
];

// TiviMate compatible format
export function exportToTiviMate(channels: LiveChannel[]): string {
  let m3u = '#EXTM3U\n';
  channels.forEach(channel => {
    m3u += `#EXTINF:-1 tvg-logo="${channel.logo || ''}" group-title="${channel.category}",${channel.name}\n`;
    m3u += `${channel.streamUrl}\n`;
  });
  return m3u;
}

// Sample channels for demo (when APIs are not available)
export const SAMPLE_CHANNELS: LiveChannel[] = [
  {
    id: 'espn',
    name: 'ESPN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/ESPN_wordmark.svg/1200px-ESPN_wordmark.svg.png',
    category: 'Sports',
    streamUrl: 'https://demo-stream.example.com/espn.m3u8',
    isLive: true,
    currentProgram: 'SportsCenter',
    nextProgram: 'NBA Live',
  },
  {
    id: 'nickelodeon',
    name: 'Nickelodeon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nickelodeon_2009_logo.svg/1200px-Nickelodeon_2009_logo.svg.png',
    category: 'Kids',
    streamUrl: 'https://demo-stream.example.com/nick.m3u8',
    isLive: true,
    currentProgram: 'SpongeBob SquarePants',
    nextProgram: 'The Loud House',
  },
  {
    id: 'nickjr',
    name: 'Nick Jr.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nick_Jr._logo_2009.svg/1200px-Nick_Jr._logo_2009.svg.png',
    category: 'Kids',
    streamUrl: 'https://demo-stream.example.com/nickjr.m3u8',
    isLive: true,
    currentProgram: 'PAW Patrol',
    nextProgram: 'Blue\'s Clues',
  },
  {
    id: 'cartoon-network',
    name: 'Cartoon Network',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Cartoon_Network_2010_logo.svg/1200px-Cartoon_Network_2010_logo.svg.png',
    category: 'Kids',
    streamUrl: 'https://demo-stream.example.com/cn.m3u8',
    isLive: true,
    currentProgram: 'Adventure Time',
    nextProgram: 'Regular Show',
  },
  {
    id: 'disney',
    name: 'Disney Channel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Disney_Channel_2019.svg/1200px-Disney_Channel_2019.svg.png',
    category: 'Kids',
    streamUrl: 'https://demo-stream.example.com/disney.m3u8',
    isLive: true,
    currentProgram: 'Phineas and Ferb',
    nextProgram: 'Gravity Falls',
  },
  {
    id: 'fox-sports',
    name: 'FOX Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Fox_Sports_2019.svg/1200px-Fox_Sports_2019.svg.png',
    category: 'Sports',
    streamUrl: 'https://demo-stream.example.com/foxsports.m3u8',
    isLive: true,
    currentProgram: 'NFL Live',
    nextProgram: 'MLB Tonight',
  },
  {
    id: 'sky-sports',
    name: 'Sky Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sky_Sports_2020_logo.svg/1200px-Sky_Sports_2020_logo.svg.png',
    category: 'Sports',
    streamUrl: 'https://demo-stream.example.com/skysports.m3u8',
    isLive: true,
    currentProgram: 'Premier League Live',
    nextProgram: 'Cricket',
  },
  {
    id: 'bbc-news',
    name: 'BBC News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_%28Alt%29.svg/1200px-BBC_News_2022_%28Alt%29.svg.png',
    category: 'News',
    streamUrl: 'https://demo-stream.example.com/bbcnews.m3u8',
    isLive: true,
    currentProgram: 'BBC News at Ten',
    nextProgram: 'Newsnight',
  },
  {
    id: 'cnn',
    name: 'CNN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/1200px-CNN_International_logo.svg.png',
    category: 'News',
    streamUrl: 'https://demo-stream.example.com/cnn.m3u8',
    isLive: true,
    currentProgram: 'CNN Newsroom',
    nextProgram: 'Anderson Cooper',
  },
  {
    id: 'mtv',
    name: 'MTV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/MTV_2021.svg/1200px-MTV_2021.svg.png',
    category: 'Entertainment',
    streamUrl: 'https://demo-stream.example.com/mtv.m3u8',
    isLive: true,
    currentProgram: 'MTV Unplugged',
    nextProgram: 'Total Request Live',
  },
];
