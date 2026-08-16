import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#222] bg-[#0a0a0a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold text-white">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-[#666] transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/movies" className="text-[#666] transition-colors hover:text-white">Movies</Link></li>
              <li><Link href="/tv" className="text-[#666] transition-colors hover:text-white">TV Shows</Link></li>
              <li><Link href="/anime" className="text-[#666] transition-colors hover:text-white">Anime</Link></li>
              <li><Link href="/live" className="text-[#666] transition-colors hover:text-white">Live TV</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/trending" className="text-[#666] transition-colors hover:text-white">Trending</Link></li>
              <li><Link href="/movies" className="text-[#666] transition-colors hover:text-white">Popular Movies</Link></li>
              <li><Link href="/tv" className="text-[#666] transition-colors hover:text-white">Popular TV</Link></li>
              <li><Link href="/anime" className="text-[#666] transition-colors hover:text-white">Anime</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Features</h3>
            <ul className="space-y-2">
              <li><span className="text-[#666]">Multi-Provider Streaming</span></li>
              <li><span className="text-[#666]">HLS Live TV Player</span></li>
              <li><span className="text-[#666]">Anime Integrations</span></li>
              <li><span className="text-[#666]">PWA Install</span></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Platform</h3>
            <ul className="space-y-2">
              <li><span className="text-[#666]">Provider Discovery</span></li>
              <li><span className="text-[#666]">Live TV Player</span></li>
              <li><span className="text-[#666]">Anime Catalogs</span></li>
              <li><span className="text-[#666]">Responsive PWA</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#222] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-2xl font-bold text-[#e50914]">Marqueeflix</div>
            <p className="text-sm text-[#666]">© {new Date().getFullYear()} Marqueeflix. All rights reserved.</p>
            <p className="text-sm text-[#666]">Powered by TMDB, AniList, Jikan and HLS streams</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
