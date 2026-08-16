'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid login');
        return;
      }

      localStorage.setItem('currentProfile', JSON.stringify(data.user));
      router.push(next);
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (accountEmail: string, accountPassword: string) => {
    setEmail(accountEmail);
    setPassword(accountPassword);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <Link href="/" className="mb-12 text-3xl font-black tracking-tighter text-[#e50914]">
          MARQUEEFLIX
        </Link>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_460px]">
          <section>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#e50914]">Secure Access</p>
            <h1 className="mb-5 max-w-3xl text-5xl font-black leading-tight md:text-7xl">
              Sign in and continue anywhere.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#b3b3b3]">
              Use the same account across phones, laptops, TVs, and tablets. Admin tools are only shown after an admin login.
            </p>
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#111]/95 p-6 shadow-2xl md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Sign in</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[#b3b3b3]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white outline-none transition-colors focus:border-[#e50914]"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#b3b3b3]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white outline-none transition-colors focus:border-[#e50914]"
                  required
                />
              </div>

              {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#e50914] px-6 py-3 font-bold text-white transition-colors hover:bg-[#f40612] disabled:bg-[#555]"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8 border-t border-[#222] pt-5">
              <p className="mb-3 text-sm font-semibold text-[#b3b3b3]">Quick demo accounts</p>
              <div className="grid gap-2">
                <button onClick={() => quickFill('you@marquee.com', 'Marquee@123')} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-left text-sm text-[#d0d0d0] hover:bg-[#222]">Marquee profile</button>
                <button onClick={() => quickFill('kids@marquee.com', 'Kids@123')} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-left text-sm text-[#d0d0d0] hover:bg-[#222]">Kids profile</button>
                <button onClick={() => quickFill('guest@marquee.com', 'Guest@123')} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-left text-sm text-[#d0d0d0] hover:bg-[#222]">Guest profile</button>
              </div>
              <p className="mt-4 text-xs text-[#666]">
                Admin credentials are configured through Netlify environment variables and are not listed here.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginContent />
    </Suspense>
  );
}
