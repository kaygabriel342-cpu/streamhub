'use client';

import { useEffect, useState } from 'react';

interface StartupAnimationProps {
  onComplete: () => void;
}

export default function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play startup sound
    const playSound = async () => {
      try {
        // Create audio context for Netflix-style "ta-dum" sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create the iconic Netflix "ta-dum" sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Frequency sweep for the "ta-dum" effect
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setAudioPlayed(true);
      } catch (error) {
        console.error('Audio play error:', error);
        setAudioPlayed(true);
      }
    };

    playSound();

    // Animation phases
    const timers = [
      setTimeout(() => setPhase(1), 100),      // Start animation
      setTimeout(() => setPhase(2), 800),      // Full brightness
      setTimeout(() => setPhase(3), 2000),     // Start fade
      setTimeout(() => setPhase(4), 3000),     // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === 4) {
      onComplete();
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-all duration-1000 ${
        phase >= 3 ? 'opacity-0' : 'opacity-100'
      } ${phase >= 4 ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      {/* Netflix-style N animation */}
      <div className="relative">
        {/* Main N letter */}
        <svg
          className={`w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Red N */}
          <path
            d="M10 10 L10 90 L30 90 L30 35 L70 90 L90 90 L90 10 L70 10 L70 65 L30 10 L10 10 Z"
            fill="#E50914"
            className={`transition-all duration-1000 ${
              phase >= 2 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: phase >= 2 ? 'drop-shadow(0 0 20px rgba(229, 9, 20, 0.8))' : 'none',
            }}
          />
          
          {/* Glow effect */}
          <path
            d="M10 10 L10 90 L30 90 L30 35 L70 90 L90 90 L90 10 L70 10 L70 65 L30 10 L10 10 Z"
            fill="#E50914"
            className={`transition-all duration-1000 blur-xl ${
              phase >= 2 ? 'opacity-50' : 'opacity-0'
            }`}
          />
        </svg>

        {/* MARQUEEFLIX text */}
        <h1
          className={`absolute -bottom-16 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-black tracking-[0.2em] text-[#E50914] transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          MARQUEEFLIX
        </h1>
      </div>

      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#E50914]/10 via-transparent to-[#E50914]/10 transition-opacity duration-1000 ${
          phase >= 1 && phase < 3 ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
