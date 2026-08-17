import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Header />
      <main className="mx-auto max-w-[1400px] px-6 pb-20 pt-32">
        <h1 className="mb-4 text-4xl font-black">Watchlist</h1>
        <p className="text-[#aaa]">Saved movies, shows, and anime will appear here.</p>
      </main>
      <Footer />
    </div>
  );
}
