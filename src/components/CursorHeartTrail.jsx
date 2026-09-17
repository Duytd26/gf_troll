import React, { useEffect, useState } from 'react';

export default function CursorHeartTrail() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Only run on desktop devices with a mouse pointer
    if (typeof window === 'undefined') return;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    let idCounter = 0;
    let lastTime = 0;

    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttle particle creation to ~90ms for very subtle ambient feel
      if (now - lastTime < 90) return;
      lastTime = now;

      const particle = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(8 + Math.random() * 6),
      };

      setParticles((prev) => [...prev.slice(-6), particle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, 550);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            opacity: 0.5,
            transform: 'translate(-50%, -50%) scale(0.9)',
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
}

