'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
}

export default function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Anime character avatars for profiles
  const [profiles] = useState<Profile[]>([
    { 
      id: '1', 
      name: 'You', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4' 
    },
    { 
      id: '2', 
      name: 'Kids', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lily&backgroundColor=c0aede' 
    },
    { 
      id: '3', 
      name: 'Guest', 
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=d1d4f9' 
    },
  ]);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setCurrentProfile(data.user);
          setIsSignedIn(true);
          setIsAdmin(Boolean(data.isAdmin));
          localStorage.setItem('currentProfile', JSON.stringify(data.user));
          return;
        }
      } catch {
        // Continue with local profile fallback.
      }

      const saved = localStorage.getItem('currentProfile');
      if (saved) {
        setCurrentProfile(JSON.parse(saved));
      } else if (profiles.length > 0) {
        setCurrentProfile(profiles[0]);
        localStorage.setItem('currentProfile', JSON.stringify(profiles[0]));
      }
      setIsSignedIn(false);
      setIsAdmin(false);
    }

    loadSession();
  }, [profiles]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const selectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    setShowProfiles(false);
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('currentProfile');
    setIsSignedIn(false);
    setIsAdmin(false);
    setCurrentProfile(profiles[0]);
    setShowProfileMenu(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} isAdmin={isAdmin} />
      
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-6">
              {/* Hamburger Menu */}
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="text-2xl md:text-3xl font-black text-[#e50914] tracking-tighter">
                MARQUEEFLIX
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6 ml-8">
                <Link href="/" className="text-white hover:text-[#e50914] font-medium transition-colors text-sm">
                  Home
                </Link>
                <Link href="/tv" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                  TV Shows
                </Link>
                <Link href="/movies" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                  Movies
                </Link>
                <Link href="/anime" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                  Anime
                </Link>
                <Link href="/live" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live TV
                </Link>
                <Link href="/providers" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                  Providers
                </Link>
                {isAdmin && (
                  <Link href="/crm" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                    CRM
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: Search + Profile */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="w-64 lg:w-80 px-4 py-2 pl-10 bg-[#1a1a1a] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 transition-all"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {!isSignedIn && (
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-[#e6e6e6]"
                >
                  Sign in
                </Link>
              )}

              {/* Profile Menu */}
              <div className={`relative ${!isSignedIn ? 'hidden' : ''}`}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 group"
                >
                  <img
                    src={currentProfile?.avatar || profiles[0].avatar}
                    alt={currentProfile?.name || 'Profile'}
                    className="w-8 h-8 rounded bg-[#1a1a1a]"
                  />
                  <svg className={`w-4 h-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-lg shadow-2xl border border-[#333] overflow-hidden">
                    <div className="p-3 border-b border-[#333]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold text-sm">Profiles</span>
                        <button
                          onClick={() => setShowProfiles(true)}
                          className="text-[#e50914] hover:text-white text-xs font-medium transition-colors"
                        >
                          Manage Profiles
                        </button>
                      </div>
                      <div className="space-y-2">
                        {profiles.map((profile) => (
                          <button
                            key={profile.id}
                            onClick={() => selectProfile(profile)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              currentProfile?.id === profile.id ? 'bg-[#e50914]/20' : 'hover:bg-[#2a2a2a]'
                            }`}
                          >
                            <img
                              src={profile.avatar}
                              alt={profile.name}
                              className="w-8 h-8 rounded bg-[#1a1a1a]"
                            />
                            <span className="text-white text-sm">{profile.name}</span>
                            {currentProfile?.id === profile.id && (
                              <svg className="w-4 h-4 text-[#e50914] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-2">
                      {isSignedIn ? (
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left">
                          <svg className="w-5 h-5 text-[#b3b3b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                          </svg>
                          <span className="text-white text-sm">Sign out</span>
                        </button>
                      ) : (
                        <Link href="/login" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                          <svg className="w-5 h-5 text-[#b3b3b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                          </svg>
                          <span className="text-white text-sm">Sign in</span>
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/crm" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                          <svg className="w-5 h-5 text-[#b3b3b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                          </svg>
                          <span className="text-white text-sm">CRM Dashboard</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
