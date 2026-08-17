'use client';

import { useRouter } from 'next/navigation';

const profiles = [
  { id: 'shinobi', name: 'Shinobi', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Shinobi&backgroundColor=1b1b2f' },
  { id: 'sakura', name: 'Sakura', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sakura&backgroundColor=32203d' },
  { id: 'akira', name: 'Akira', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Akira&backgroundColor=242424' },
  { id: 'yuki', name: 'Yuki', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Yuki&backgroundColor=10202f' },
];

export default function ProfilesPage() {
  const router = useRouter();

  const selectProfile = (profile: (typeof profiles)[number]) => {
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050507] px-6 text-white">
      <h1 className="mb-12 text-center text-4xl font-light md:text-6xl">Who's watching?</h1>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
        {profiles.map((profile) => (
          <button key={profile.id} onClick={() => selectProfile(profile)} className="group text-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-32 w-32 rounded-xl border-4 border-transparent bg-[#151518] transition-all group-hover:border-white md:h-44 md:w-44"
            />
            <p className="mt-4 text-xl text-[#999] transition-colors group-hover:text-white">{profile.name}</p>
          </button>
        ))}
      </div>
      <button className="mt-12 rounded border border-[#777] px-8 py-3 text-[#999] transition-colors hover:border-white hover:text-white">
        Manage Profiles
      </button>
    </main>
  );
}
