import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#666] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-[#666] hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="text-[#666] hover:text-white transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/watch-parties" className="text-[#666] hover:text-white transition-colors">
                  Watch Parties
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies/trending" className="text-[#666] hover:text-white transition-colors">
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link href="/tv/trending" className="text-[#666] hover:text-white transition-colors">
                  Trending TV
                </Link>
              </li>
              <li>
                <Link href="/movies/top-rated" className="text-[#666] hover:text-white transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/tv/top-rated" className="text-[#666] hover:text-white transition-colors">
                  Top Rated TV
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/watch-parties" className="text-[#666] hover:text-white transition-colors">
                  Watch Parties
                </Link>
              </li>
              <li>
                <span className="text-[#666]">Multi-Provider Support</span>
              </li>
              <li>
                <span className="text-[#666]">Real-time Sync</span>
              </li>
              <li>
                <span className="text-[#666]">HD Streaming</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-[#666]">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#666]">Privacy Policy</span>
              </li>
              <li>
                <span className="text-[#666]">DMCA</span>
              </li>
              <li>
                <span className="text-[#666]">Contact</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#222] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-2xl font-bold text-[#e50914]">StreamHub</div>
            <p className="text-[#666] text-sm">
              © {new Date().getFullYear()} StreamHub. All rights reserved.
            </p>
            <p className="text-[#666] text-sm">
              Powered by TMDB API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
