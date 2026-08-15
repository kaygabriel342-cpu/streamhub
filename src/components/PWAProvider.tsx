'use client';

import { useEffect, useState } from 'react';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return (
    <>
      {children}
      
      {/* Update notification */}
      {updateAvailable && isClient && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#e50914] text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 animate-fade-in">
          <div>
            <p className="font-semibold">New version available!</p>
            <p className="text-sm opacity-90">Click to update and refresh</p>
          </div>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white text-[#e50914] rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => setUpdateAvailable(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
