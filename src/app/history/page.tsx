import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Header />
      <main className="mx-auto max-w-[1400px] px-6 pb-20 pt-32">
        <h1 className="mb-4 text-4xl font-black">History</h1>
        <p className="text-[#aaa]">Your watched titles will appear here after playback events are captured from VidKing.</p>
      </main>
      <Footer />
    </div>
  );
}
