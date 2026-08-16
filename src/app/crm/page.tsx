'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscription: 'free' | 'premium' | 'family';
  joinDate: string;
  lastActive: string;
  watchHistory: number;
  favorites: number;
  liveSessions: number;
}

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalWatchTime: number;
  popularContent: Array<{ title: string; views: number }>;
  deviceBreakdown: { mobile: number; desktop: number; tv: number };
}

const sampleProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=John',
    subscription: 'premium',
    joinDate: '2024-01-15',
    lastActive: '2 minutes ago',
    watchHistory: 156,
    favorites: 42,
    liveSessions: 8,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jane',
    subscription: 'family',
    joinDate: '2024-02-20',
    lastActive: '1 hour ago',
    watchHistory: 203,
    favorites: 67,
    liveSessions: 15,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob',
    subscription: 'free',
    joinDate: '2024-03-10',
    lastActive: '3 hours ago',
    watchHistory: 45,
    favorites: 12,
    liveSessions: 2,
  },
];

const sampleAnalytics: Analytics = {
  totalUsers: 15420,
  activeUsers: 3240,
  newUsersToday: 127,
  totalWatchTime: 892340,
  popularContent: [
    { title: 'Stranger Things', views: 45230 },
    { title: 'Breaking Bad', views: 38920 },
    { title: 'The Office', views: 35670 },
    { title: 'Naruto', views: 32450 },
    { title: 'One Piece', views: 29870 },
  ],
  deviceBreakdown: { mobile: 45, desktop: 35, tv: 20 },
};

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles, setProfiles] = useState<UserProfile[]>(sampleProfiles);
  const [analytics] = useState<Analytics>(sampleAnalytics);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (!data.isAdmin) {
          window.location.href = '/login?next=/crm';
          return;
        }
        setAllowed(true);
      } catch {
        window.location.href = '/login?next=/crm';
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAdmin();
  }, []);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (checkingAuth || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
          <p className="text-[#b3b3b3]">Checking admin access...</p>
        </div>
      </div>
    );
  }

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* CRM Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">CRM Dashboard</h1>
            <p className="text-[#b3b3b3]">Manage users, analytics, and content</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[#222]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-[#e50914] border-b-2 border-[#e50914]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-[#e50914] border-b-2 border-[#e50914]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-[#e50914] border-b-2 border-[#e50914]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-[#e50914] border-b-2 border-[#e50914]'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              Content
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#666] text-sm font-medium">Total Users</h3>
                  <svg className="w-6 h-6 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
                <p className="text-green-500 text-sm mt-2">+{analytics.newUsersToday} today</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#666] text-sm font-medium">Active Users</h3>
                  <svg className="w-6 h-6 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-[#666] text-sm mt-2">Currently online</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#666] text-sm font-medium">Watch Time</h3>
                  <svg className="w-6 h-6 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{formatWatchTime(analytics.totalWatchTime)}</p>
                <p className="text-[#666] text-sm mt-2">Total this month</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#666] text-sm font-medium">Revenue</h3>
                  <svg className="w-6 h-6 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">$12,450</p>
                <p className="text-green-500 text-sm mt-2">+15% this month</p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-4 py-3 pl-12 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#e50914]"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#1a1a1a] rounded-xl border border-[#222] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#222]">
                    <tr>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">User</th>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">Subscription</th>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">Joined</th>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">Last Active</th>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">Watch History</th>
                      <th className="px-6 py-4 text-left text-[#666] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <tr key={profile.id} className="border-t border-[#222] hover:bg-[#222]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="text-white font-medium">{profile.name}</p>
                              <p className="text-[#666] text-sm">{profile.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            profile.subscription === 'premium' ? 'bg-purple-600/20 text-purple-400' :
                            profile.subscription === 'family' ? 'bg-blue-600/20 text-blue-400' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {profile.subscription.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#666]">{profile.joinDate}</td>
                        <td className="px-6 py-4 text-[#666]">{profile.lastActive}</td>
                        <td className="px-6 py-4 text-white">{profile.watchHistory} titles</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="text-[#e50914] hover:text-white font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Content */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <h3 className="text-xl font-bold text-white mb-6">Popular Content</h3>
                <div className="space-y-4">
                  {analytics.popularContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#222] rounded-full flex items-center justify-center text-[#666] text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-white font-medium">{content.title}</span>
                      </div>
                      <span className="text-[#666]">{content.views.toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
                <h3 className="text-xl font-bold text-white mb-6">Device Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#666]">Mobile</span>
                      <span className="text-white">{analytics.deviceBreakdown.mobile}%</span>
                    </div>
                    <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-[#e50914]" style={{ width: `${analytics.deviceBreakdown.mobile}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#666]">Desktop</span>
                      <span className="text-white">{analytics.deviceBreakdown.desktop}%</span>
                    </div>
                    <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-[#e50914]" style={{ width: `${analytics.deviceBreakdown.desktop}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#666]">TV</span>
                      <span className="text-white">{analytics.deviceBreakdown.tv}%</span>
                    </div>
                    <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-[#e50914]" style={{ width: `${analytics.deviceBreakdown.tv}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#222]">
              <h3 className="text-xl font-bold text-white mb-6">Content Management</h3>
              <p className="text-[#666]">Manage your content library, add new titles, and organize categories.</p>
              <div className="mt-6 flex gap-4">
                <button className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded-lg transition-colors">
                  Add New Content
                </button>
                <button className="px-6 py-3 bg-[#222] hover:bg-[#333] text-white font-semibold rounded-lg transition-colors">
                  Import from TMDB
                </button>
              </div>
            </div>
          )}

          {/* Profile Details Modal */}
          {selectedProfile && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full p-6 border border-[#222]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">User Details</h3>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="text-[#666] hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-24 h-24 rounded-full" />
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedProfile.name}</h4>
                    <p className="text-[#666]">{selectedProfile.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProfile.subscription === 'premium' ? 'bg-purple-600/20 text-purple-400' :
                      selectedProfile.subscription === 'family' ? 'bg-blue-600/20 text-blue-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {selectedProfile.subscription.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#222] rounded-lg p-4">
                    <p className="text-[#666] text-sm">Join Date</p>
                    <p className="text-white font-medium">{selectedProfile.joinDate}</p>
                  </div>
                  <div className="bg-[#222] rounded-lg p-4">
                    <p className="text-[#666] text-sm">Last Active</p>
                    <p className="text-white font-medium">{selectedProfile.lastActive}</p>
                  </div>
                  <div className="bg-[#222] rounded-lg p-4">
                    <p className="text-[#666] text-sm">Watch History</p>
                    <p className="text-white font-medium">{selectedProfile.watchHistory} titles</p>
                  </div>
                  <div className="bg-[#222] rounded-lg p-4">
                    <p className="text-[#666] text-sm">Favorites</p>
                    <p className="text-white font-medium">{selectedProfile.favorites} titles</p>
                  </div>
                  <div className="bg-[#222] rounded-lg p-4">
                    <p className="text-[#666] text-sm">Live Sessions</p>
                    <p className="text-white font-medium">{selectedProfile.liveSessions} sessions</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 px-6 py-3 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded-lg transition-colors">
                    Edit Profile
                  </button>
                  <button className="flex-1 px-6 py-3 bg-[#222] hover:bg-[#333] text-white font-semibold rounded-lg transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
