import Link from 'next/link';
import Header from '@/components/Header';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Header />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-32">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#e50914]">API</p>
        <h1 className="mb-5 text-4xl font-black md:text-6xl">VidKing playback integration</h1>
        <p className="mb-10 max-w-3xl text-lg leading-8 text-[#aaa]">
          This build uses VidKing as the single playback layer. Metadata and discovery use TMDB so every movie and TV show can map directly to a TMDB ID.
        </p>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-3 text-2xl font-bold">Movie embed</h2>
            <code className="block overflow-x-auto rounded-2xl bg-black p-4 text-sm text-[#ddd]">
              https://www.vidking.net/embed/movie/{'{tmdbId}'}?color=e50914&autoPlay=true
            </code>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-3 text-2xl font-bold">TV episode embed</h2>
            <code className="block overflow-x-auto rounded-2xl bg-black p-4 text-sm text-[#ddd]">
              https://www.vidking.net/embed/tv/{'{tmdbId}'}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true
            </code>
          </div>
        </section>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-3 text-2xl font-bold">Playback events</h2>
          <p className="mb-4 text-[#aaa]">VidKing sends postMessage playback events such as play, pause, seeked, ended, and timeupdate.</p>
          <pre className="overflow-x-auto rounded-2xl bg-black p-4 text-sm text-[#ddd]">{`{
  "type": "PLAYER_EVENT",
  "data": {
    "event": "timeupdate",
    "currentTime": 120.5,
    "duration": 7200,
    "progress": 1.6,
    "mediaType": "movie"
  }
}`}</pre>
        </div>

        <Link href="/" className="mt-10 inline-flex rounded-full bg-[#e50914] px-6 py-3 font-bold text-white hover:bg-[#f40612]">
          Back home
        </Link>
      </main>
    </div>
  );
}
