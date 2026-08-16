'use client';

import { useEffect, useState } from 'react';

interface StartupAnimationProps {
  onComplete: () => void;
}

export default function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play cinematic startup sound automatically
    const playSound = async () => {
      try {
        // Create audio context for cinematic Netflix-style sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create multiple oscillators for rich, cinematic sound
        const oscillators: OscillatorNode[] = [];
        const gainNodes: GainNode[] = [];
        
        // Bass frequency (deep, dramatic)
        const bassOsc = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(80, audioContext.currentTime);
        bassOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1.5);
        bassGain.gain.setValueAtTime(0, audioContext.currentTime);
        bassGain.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1);
        bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        bassOsc.connect(bassGain);
        bassGain.connect(audioContext.destination);
        bassOsc.start(audioContext.currentTime);
        bassOsc.stop(audioContext.currentTime + 2);
        oscillators.push(bassOsc);
        gainNodes.push(bassGain);
        
        // Mid frequency (body of the sound)
        const midOsc = audioContext.createOscillator();
        const midGain = audioContext.createGain();
        midOsc.type = 'triangle';
        midOsc.frequency.setValueAtTime(200, audioContext.currentTime);
        midOsc.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 1);
        midGain.gain.setValueAtTime(0, audioContext.currentTime);
        midGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.15);
        midGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        midOsc.connect(midGain);
        midGain.connect(audioContext.destination);
        midOsc.start(audioContext.currentTime);
        midOsc.stop(audioContext.currentTime + 1.5);
        oscillators.push(midOsc);
        gainNodes.push(midGain);
        
        // High frequency (bright, angelic shimmer)
        const highOsc = audioContext.createOscillator();
        const highGain = audioContext.createGain();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(800, audioContext.currentTime);
        highOsc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.5);
        highGain.gain.setValueAtTime(0, audioContext.currentTime);
        highGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.2);
        highGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
        highOsc.connect(highGain);
        highGain.connect(audioContext.destination);
        highOsc.start(audioContext.currentTime);
        highOsc.stop(audioContext.currentTime + 2.5);
        oscillators.push(highOsc);
        gainNodes.push(highGain);
        
        // Add reverb-like effect with delay
        const delayNode = audioContext.createDelay();
        delayNode.delayTime.value = 0.3;
        const delayGain = audioContext.createGain();
        delayGain.gain.value = 0.3;
        
        bassGain.connect(delayNode);
        delayNode.connect(delayGain);
        delayGain.connect(audioContext.destination);
        
        setAudioPlayed(true);
      } catch (error) {
        console.error('Audio play error:', error);
        setAudioPlayed(true);
      }
    };

    // Play sound immediately on mount
    playSound();

    // Animation phases - extended for dramatic effect
    const timers = [
      setTimeout(() => setPhase(1), 100),      // Start animation
      setTimeout(() => setPhase(2), 1000),     // Full brightness
      setTimeout(() => setPhase(3), 2500),     // Start fade
      setTimeout(() => setPhase(4), 3500),     // Complete
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
