'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export default function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample profiles (in real app, fetch from backend)
  const [profiles] = useState<Profile[]>([
    { id: '1', name: 'You', avatar: '/avatars/profile1.png' },
    { id: '2', name: 'Kids', avatar: '/avatars/profile2.png' },
    { id: '3', name: 'Guest', avatar: '/avatars/profile3.png' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('currentProfile');
    if (saved) {
      setCurrentProfile(JSON.parse(saved));
    } else if (profiles.length > 0) {
      setCurrentProfile(profiles[0]);
      localStorage.setItem('currentProfile', JSON.stringify(profiles[0]));
    }
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-2xl md:text-3xl font-black text-[#e50914] tracking-tighter group-hover:scale-105 transition-transform">
                MARQUEEFLIX
              </div>
            </Link>

            {/* Desktop Navigation - Netflix Style */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-white hover:text-[#e50914] font-medium transition-colors text-sm">
                Home
              </Link>
              <Link href="/tv" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                TV Shows
              </Link>
              <Link href="/movies" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                Movies
              </Link>
              <Link href="/new" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                New & Popular
              </Link>
              <Link href="/mylist" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                My List
              </Link>
              <Link href="/live" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live TV
              </Link>
              <Link href="/browse" className="text-[#b3b3b3] hover:text-white font-medium transition-colors text-sm">
                Browse
              </Link>
            </nav>
          </div>

          {/* Right: Search + Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="w-64 lg:w-80 px-4 py-2 pl-10 bg-[#1a1a1a] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] group-focus-within:text-[#e50914]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center text-white font-bold text-sm group-hover:ring-2 group-hover:ring-white transition-all">
                  {currentProfile?.name?.[0] || 'U'}
                </div>
                <svg className={`w-4 h-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-lg shadow-2xl border border-[#333] overflow-hidden">
                  {/* Profiles List */}
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
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center text-white font-bold text-sm">
                            {profile.name[0]}
                          </div>
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

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link href="/account" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                      <svg className="w-5 h-5 text-[#b3b3b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-sm">Account</span>
                    </Link>
                    <Link href="/help" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                      <svg className="w-5 h-5 text-[#b3b3b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white text-sm">Help Center</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-[#333]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-white hover:text-[#e50914] transition-colors">Home</Link>
              <Link href="/tv" className="text-[#b3b3b3] hover:text-white transition-colors">TV Shows</Link>
              <Link href="/movies" className="text-[#b3b3b3] hover:text-white transition-colors">Movies</Link>
              <Link href="/new" className="text-[#b3b3b3] hover:text-white transition-colors">New & Popular</Link>
              <Link href="/live" className="text-[#b3b3b3] hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live TV
              </Link>
              <Link href="/mylist" className="text-[#b3b3b3] hover:text-white transition-colors">My List</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
