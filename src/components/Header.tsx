'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profile = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
};

const defaultProfiles: Profile[] = [
  { id: 'shinobi', name: 'Shinobi', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Shinobi&backgroundColor=1b1b2f' },
  { id: 'sakura', name: 'Sakura', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sakura&backgroundColor=32203d' },
  { id: 'akira', name: 'Akira', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Akira&backgroundColor=242424' },
  { id: 'yuki', name: 'Yuki', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Yuki&backgroundColor=10202f' },
];

export default function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const router = useRouter();
  const [showBrowse, setShowBrowse] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProfile, setCurrentProfile] = useState<Profile>(defaultProfiles[0]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setCurrentProfile(data.user);
          setIsSignedIn(true);
          return;
        }
      } catch {
        // use fallback
      }

      const saved = localStorage.getItem('currentProfile');
      if (saved) setCurrentProfile(JSON.parse(saved));
    }

    loadProfile();
  }, []);

  const doSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setShowSearch(false);
    if (onSearch) onSearch(query);
    else router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const selectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    setShowProfiles(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsSignedIn(false);
    selectProfile(defaultProfiles[0]);
    router.refresh();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-gradient-to-b from-black/95 via-black/70 to-transparent px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ff1b2d] to-[#9c000b] shadow-lg shadow-red-950/40">
              <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="text-2xl font-black tracking-tight text-white">Marquee</span>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-semibold text-white">
            <Link href="/" className="hidden items-center gap-2 rounded-full px-3 py-2 hover:bg-white/10 md:flex">
              Home
            </Link>
            <Link href="/docs" className="hidden items-center gap-2 rounded-full px-3 py-2 hover:bg-white/10 md:flex">
              API
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowBrowse((value) => !value)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${showBrowse ? 'bg-[#e50914]/20 text-[#ff3344]' : 'hover:bg-white/10'}`}
              >
                Browse
                <svg className={`h-4 w-4 transition-transform ${showBrowse ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {showBrowse && (
                <div className="absolute right-0 mt-4 w-[320px] rounded-3xl border border-white/10 bg-[#120b0d]/95 p-4 shadow-2xl backdrop-blur-xl">
                  <h3 className="mb-4 text-center text-base font-bold text-white">Browse</h3>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#777]">Content</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Link href="/movies" className="rounded-2xl border border-red-500/20 bg-black/20 p-4 text-center hover:bg-red-500/10">Movies</Link>
                    <Link href="/tv" className="rounded-2xl border border-red-500/20 bg-black/20 p-4 text-center hover:bg-red-500/10">TV Shows</Link>
                    <Link href="/anime" className="rounded-2xl border border-red-500/20 bg-black/20 p-4 text-center hover:bg-red-500/10">Anime</Link>
                  </div>
                  <p className="mb-3 mt-6 text-xs uppercase tracking-[0.25em] text-[#777]">Personal</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/history" className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-[#bbb] hover:text-white">History</Link>
                    <Link href="/watchlist" className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-[#bbb] hover:text-white">Watchlist</Link>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowSearch(true)} className="rounded-full p-2 hover:bg-white/10" aria-label="Search">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            <div className="relative">
              <button onClick={() => setShowProfiles((value) => !value)} className="rounded-full p-1 hover:bg-white/10" aria-label="Profiles">
                <img src={currentProfile.avatar} alt={currentProfile.name} className="h-9 w-9 rounded-full bg-[#222]" />
              </button>
              {showProfiles && (
                <div className="absolute right-0 mt-4 w-72 rounded-3xl border border-white/10 bg-[#101014]/95 p-4 shadow-2xl backdrop-blur-xl">
                  <h3 className="mb-4 text-center text-base font-bold text-white">Who's watching?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {defaultProfiles.map((profile) => (
                      <button key={profile.id} onClick={() => selectProfile(profile)} className="rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                        <img src={profile.avatar} alt={profile.name} className="mx-auto mb-2 h-16 w-16 rounded-xl" />
                        <span className="text-sm text-white">{profile.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3">
                    {isSignedIn ? (
                      <button onClick={handleLogout} className="w-full rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15">Sign out</button>
                    ) : (
                      <Link href="/login" className="block w-full rounded-xl bg-[#e50914] px-4 py-2 text-center text-white hover:bg-[#f40612]">Sign in</Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-lg">
          <form onSubmit={doSearch} className="w-full max-w-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Search</h2>
              <button type="button" onClick={() => setShowSearch(false)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/15">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <input
              autoFocus
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Type here to search..."
              className="w-full rounded-2xl border border-white/10 bg-[#08080b] px-5 py-4 text-lg text-white outline-none focus:border-[#e50914]"
            />
          </form>
        </div>
      )}
    </>
  );
}
