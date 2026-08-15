'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#141414]/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-[#141414] to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl md:text-3xl font-bold text-[#e50914]">
              StreamHub
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-[#e50914] transition-colors">
              Home
            </Link>
            <Link href="/movies" className="text-white hover:text-[#e50914] transition-colors">
              Movies
            </Link>
            <Link href="/tv" className="text-white hover:text-[#e50914] transition-colors">
              TV Shows
            </Link>
            <Link href="/watch-parties" className="text-white hover:text-[#e50914] transition-colors">
              Watch Parties
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-64 lg:w-80 px-4 py-2 pl-10 bg-[#1f1f1f] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-[#333]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-white hover:text-[#e50914] transition-colors">
                Home
              </Link>
              <Link href="/movies" className="text-white hover:text-[#e50914] transition-colors">
                Movies
              </Link>
              <Link href="/tv" className="text-white hover:text-[#e50914] transition-colors">
                TV Shows
              </Link>
              <Link href="/watch-parties" className="text-white hover:text-[#e50914] transition-colors">
                Watch Parties
              </Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 bg-[#1f1f1f] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#e50914]"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
