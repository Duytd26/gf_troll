import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TROLL_MESSAGES } from '../utils/messages';
import { playRunaway } from '../utils/sound';

const ESCAPE_EMOJIS = ['💨', '🏃‍♂️💨', '😜', '👻', '✨', '💫', '🏃‍♀️💨'];

export default function RunawayButton({ onEvade, rejectCount, yesButtonRef }) {
  const buttonRef = useRef(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [smokeParticle, setSmokeParticle] = useState(null);
  const [mounted, setMounted] = useState(false);
  const sideToggleRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine button text dynamically based on rejection count
  const currentText = TROLL_MESSAGES[rejectCount % TROLL_MESSAGES.length];

  // Calculate coordinates for snappy, reliable evasion across mobile & desktop
  const moveButton = useCallback((triggerX, triggerY) => {
    playRunaway();

    // Trigger haptic vibration on mobile phones
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([20, 25, 20]);
      } catch (e) {}
    }

    if (typeof window === 'undefined') return;

    const btnWidth = buttonRef.current?.offsetWidth || 150;
    const btnHeight = buttonRef.current?.offsetHeight || 48;

    const winW = window.innerWidth || document.documentElement.clientWidth;
    const winH = window.innerHeight || document.documentElement.clientHeight;

    // Mobile safe padding (avoiding notches, status bars, browser address bars)
    const padX = 16;
    const padTop = 75;
    const padBottom = 80;

    const minX = padX;
    const maxX = Math.max(minX, winW - btnWidth - padX);
    const minY = padTop;
    const maxY = Math.max(minY, winH - btnHeight - padBottom);

    // Obstacle: "Dạ đi" button rect to avoid overlapping it
    let yesRect = null;
    if (yesButtonRef?.current) {
      const r = yesButtonRef.current.getBoundingClientRect();
      yesRect = {
        left: r.left - 15,
        right: r.right + 15,
        top: r.top - 15,
        bottom: r.bottom + 15,
      };
    }

    const isCollidingWithYes = (x, y) => {
      if (!yesRect) return false;
      const bLeft = x;
      const bRight = x + btnWidth;
      const bTop = y;
      const bBottom = y + btnHeight;
      return !(bRight < yesRect.left || bLeft > yesRect.right || bBottom < yesRect.top || bTop > yesRect.bottom);
    };

    // Toggle side for back-and-forth movement ("cứ đi đi đi lại")
    sideToggleRef.current = !sideToggleRef.current;
    const preferLeft = sideToggleRef.current;

    let chosenX = minX;
    let chosenY = minY;
    let found = false;

    // Try finding an optimal spot that is far from trigger and doesn't collide
    for (let attempts = 0; attempts < 50; attempts++) {
      let candidateX;
      if (preferLeft) {
        // Left half of screen
        const halfMax = Math.min(maxX, winW / 2 - btnWidth / 2);
        candidateX = Math.floor(minX + Math.random() * Math.max(10, halfMax - minX));
      } else {
        // Right half of screen
        const halfMin = Math.max(minX, winW / 2 - btnWidth / 2);
        candidateX = Math.floor(halfMin + Math.random() * Math.max(10, maxX - halfMin));
      }

      const candidateY = Math.floor(minY + Math.random() * (maxY - minY));

      if (isCollidingWithYes(candidateX, candidateY)) continue;

      if (triggerX !== undefined && triggerY !== undefined) {
        const cX = candidateX + btnWidth / 2;
        const cY = candidateY + btnHeight / 2;
        const dist = Math.hypot(cX - triggerX, cY - triggerY);
        // Ensure distance from finger/cursor is at least 110px
        if (dist < 110) continue;
      }

      chosenX = candidateX;
      chosenY = candidateY;
      found = true;
      break;
    }

    if (!found) {
      // Fallback: Jump to opposite side of trigger
      if (triggerX !== undefined && triggerX > winW / 2) {
        chosenX = minX + 10;
      } else {
        chosenX = maxX - 10;
      }
      chosenY = Math.min(maxY, Math.max(minY, winH * 0.65));
    }

    // Spawn cute escape smoke/emoji particle at current button location
    const currentRect = buttonRef.current?.getBoundingClientRect();
    if (currentRect) {
      const randomEmoji = ESCAPE_EMOJIS[Math.floor(Math.random() * ESCAPE_EMOJIS.length)];
      setSmokeParticle({
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top + currentRect.height / 2,
        emoji: randomEmoji,
        key: Date.now(),
      });
      setTimeout(() => setSmokeParticle(null), 450);
    }

    setHasMoved(true);
    setPosition({ x: chosenX, y: chosenY });
    // Whimsical random tilt between -10deg and +10deg
    setRotation(Math.floor(-10 + Math.random() * 20));
    onEvade();
  }, [onEvade, yesButtonRef]);

  // Desktop proximity dodge (when mouse gets close, playful flee)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      if (dist < 65) {
        moveButton(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [moveButton]);

  // Interaction handler for Touch and Pointer
  const handleInteraction = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    let clientX;
    let clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    moveButton(clientX, clientY);
  };

  const buttonElement = (
    <>
      {/* Smoke / Dash particle animation on escape */}
      <AnimatePresence>
        {smokeParticle && (
          <motion.div
            key={smokeParticle.key}
            initial={{ opacity: 1, scale: 0.8, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[100000] text-xl font-bold select-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: smokeParticle.x, top: smokeParticle.y }}
          >
            {smokeParticle.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        onPointerDown={handleInteraction}
        onTouchStart={handleInteraction}
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
        animate={
          hasMoved
            ? {
                left: position.x,
                top: position.y,
                rotate: rotation,
                scale: [0.92, 1.04, 1],
              }
            : {
                rotate: 0,
                scale: 1,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 24,
          mass: 0.7,
        }}
        style={
          hasMoved
            ? {
                position: 'fixed',
                zIndex: 99999,
                touchAction: 'none',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }
            : {
                position: 'relative',
                touchAction: 'none',
                userSelect: 'none',
              }
        }
        className="px-5 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-stone-700 font-bold text-sm sm:text-base border border-stone-300/80 shadow-md backdrop-blur-md transition-shadow select-none cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
      >
        <span>{currentText}</span>
      </motion.button>
    </>
  );

  // When moved, Portal directly into document.body to escape ANY parent overflow:hidden or transform!
  if (hasMoved && mounted && typeof document !== 'undefined') {
    return createPortal(buttonElement, document.body);
  }

  // Before initial move, render in normal document flow beside "Dạ đi"
  return buttonElement;
}
