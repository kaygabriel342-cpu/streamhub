'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-[#222] z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#222]">
          <Link href="/" className="text-2xl font-black text-[#e50914] tracking-tighter">
            MARQUEEFLIX
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5 text-[#b3b3b3] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Home</span>
          </Link>

          <Link
            href="/tv"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">TV Shows</span>
          </Link>

          <Link
            href="/movies"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="font-medium">Movies</span>
          </Link>

          <Link
            href="/anime"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Anime</span>
          </Link>

          <Link
            href="/live"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="font-medium">Live TV</span>
          </Link>

          <Link
            href="/new"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">New & Popular</span>
          </Link>

          <Link
            href="/mylist"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="font-medium">My List</span>
          </Link>

          <Link
            href="/browse"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-medium">Browse</span>
          </Link>

          <Link
            href="/crm"
            className="flex items-center gap-4 px-4 py-3 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors group mt-4 border-t border-[#222] pt-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">CRM Dashboard</span>
          </Link>
        </nav>

        {/* Live Channels Section */}
        <div className="p-4 mt-4 border-t border-[#222]">
          <h3 className="text-[#666] text-xs font-semibold uppercase tracking-wider mb-3 px-4">Live Channels</h3>
          <div className="space-y-2">
            <Link href="/live" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#e50914] rounded flex items-center justify-center text-white font-bold text-xs">RBTV</div>
              <span className="text-sm font-medium">Live Sports</span>
            </Link>
            <Link href="/live" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">KIDS</div>
              <span className="text-sm font-medium">Kids Channels</span>
            </Link>
            <Link href="/live" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">NEWS</div>
              <span className="text-sm font-medium">News</span>
            </Link>
            <Link href="/live" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">MOV</div>
              <span className="text-sm font-medium">Movies Live</span>
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#666] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}
