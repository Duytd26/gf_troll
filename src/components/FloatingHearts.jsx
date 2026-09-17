import React, { useMemo } from 'react';

export default function FloatingHearts() {
  // Delicate, slow ambient particles (restraint over noise)
  const hearts = useMemo(() => {
    const items = [];
    const emojis = ['✨', '🌸', '🤍', '✨'];
    const count = 6; // Restrained count for subtle elegance

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${(i * (100 / count) + 6 + (i % 3) * 4).toFixed(1)}%`,
        size: Math.floor(11 + (i % 4) * 3), // 11px to 20px (tiny, refined)
        duration: Math.floor(18 + (i % 3) * 6), // 18s to 30s (very slow and gentle)
        delay: (i * 2.8).toFixed(1),
        opacity: (0.15 + (i % 3) * 0.08).toFixed(2), // low, tasteful opacity
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes floatSubtle {
          0% {
            transform: translateY(102vh) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: var(--target-opacity);
          }
          85% {
            opacity: var(--target-opacity);
          }
          100% {
            transform: translateY(-5vh) rotate(15deg);
            opacity: 0;
          }
        }
      `}</style>
      {hearts.map((h) => (
        <span
          key={h.id}
          aria-hidden="true"
          className="absolute select-none will-change-transform"
          style={{
            left: h.left,
            bottom: '-25px',
            fontSize: `${h.size}px`,
            '--target-opacity': h.opacity,
            animation: `floatSubtle ${h.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

