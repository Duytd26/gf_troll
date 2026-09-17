import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TROLL_MESSAGES } from '../utils/messages';
import { playRunaway } from '../utils/sound';

export default function RunawayButton({ onEvade, rejectCount, yesButtonRef, headingRef }) {
  const buttonRef = useRef(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [smokeEmoji, setSmokeEmoji] = useState(null);

  // Determine button text
  const currentText = rejectCount >= 15
    ? "Thôi em chịu rồi 😭"
    : TROLL_MESSAGES[messageIndex % TROLL_MESSAGES.length];

  // Calculate safe next coordinates
  const moveButton = useCallback((triggerX, triggerY) => {
    playRunaway();

    if (rejectCount >= 14) {
      console.log('Nice try 😏');
    }

    if (typeof window === 'undefined') return;

    // Trigger phone vibration if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(25); } catch (e) {}
    }

    const btnWidth = buttonRef.current ? buttonRef.current.offsetWidth : 140;
    const btnHeight = buttonRef.current ? buttonRef.current.offsetHeight : 50;

    const clientW = window.innerWidth || document.documentElement.clientWidth;
    const clientH = window.innerHeight || document.documentElement.clientHeight;

    // Safety margins from screen edges to avoid any overflow or notch overlap
    const padX = 20;
    const padTop = 85; // safe distance from header / status bar
    const padBottom = 85; // safe distance from bottom safe area / footer

    // Obstacles to avoid: Yes button & Main Heading
    const obstacles = [];
    if (yesButtonRef?.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      obstacles.push({
        left: rect.left - 20,
        right: rect.right + 20,
        top: rect.top - 20,
        bottom: rect.bottom + 20,
      });
    }
    if (headingRef?.current) {
      const rect = headingRef.current.getBoundingClientRect();
      obstacles.push({
        left: rect.left - 15,
        right: rect.right + 15,
        top: rect.top - 15,
        bottom: rect.bottom + 15,
      });
    }

    const isColliding = (x, y) => {
      const rLeft = x;
      const rRight = x + btnWidth;
      const rTop = y;
      const rBottom = y + btnHeight;

      for (const obs of obstacles) {
        if (
          rLeft < obs.right &&
          rRight > obs.left &&
          rTop < obs.bottom &&
          rBottom > obs.top
        ) {
          return true;
        }
      }
      return false;
    };

    // Constrained bounds
    const minX = padX;
    const maxX = Math.max(minX, clientW - btnWidth - padX);
    const minY = padTop;
    const maxY = Math.max(minY, clientH - btnHeight - padBottom);

    let chosenX = minX;
    let chosenY = minY;
    let found = false;

    for (let attempts = 0; attempts < 40; attempts++) {
      const candidateX = Math.floor(minX + Math.random() * (maxX - minX));
      const candidateY = Math.floor(minY + Math.random() * (maxY - minY));

      if (isColliding(candidateX, candidateY)) continue;

      if (triggerX !== undefined && triggerY !== undefined) {
        const dist = Math.hypot(candidateX + btnWidth / 2 - triggerX, candidateY + btnHeight / 2 - triggerY);
        if (dist < 115) continue;
      }

      chosenX = candidateX;
      chosenY = candidateY;
      found = true;
      break;
    }

    if (!found) {
      chosenX = Math.random() > 0.5 ? minX : maxX;
      chosenY = maxY;
    }

    // Spawn cute subtle runaway particle
    const currentRect = buttonRef.current?.getBoundingClientRect();
    if (currentRect) {
      setSmokeEmoji({
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top,
        key: Date.now(),
      });
      setTimeout(() => setSmokeEmoji(null), 500);
    }

    setHasMoved(true);
    setPosition({ x: chosenX, y: chosenY });
    setRotation(Math.floor(-8 + Math.random() * 16)); // tasteful, subtle tilt

    setMessageIndex((prev) => prev + 1);
    onEvade();
  }, [onEvade, rejectCount, yesButtonRef, headingRef]);

  // Desktop proximity evasion
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

      // If cursor gets within 60px, playfully flee
      if (dist < 60) {
        moveButton(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [moveButton]);

  const handleInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches ? e.touches[0] : e;
    moveButton(touch?.clientX, touch?.clientY);
  };

  return (
    <>
      {/* Smoke / Dash particle animation on escape */}
      <AnimatePresence>
        {smokeEmoji && (
          <motion.div
            key={smokeEmoji.key}
            initial={{ opacity: 0.9, scale: 0.8, y: 0 }}
            animate={{ opacity: 0, scale: 1.25, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 text-base font-bold select-none"
            style={{ left: smokeEmoji.x, top: smokeEmoji.y }}
          >
            💨 😝
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        onClick={handleInteraction}
        animate={
          hasMoved
            ? {
                left: position.x,
                top: position.y,
                rotate: rotation,
              }
            : {
                rotate: 0,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 340,
          damping: 22,
          mass: 0.8,
        }}
        style={{
          position: hasMoved ? 'fixed' : 'relative',
          zIndex: hasMoved ? 40 : 'auto',
          touchAction: 'none',
        }}
        className="px-5 py-3.5 rounded-2xl bg-white/85 hover:bg-white text-stone-700 font-semibold text-sm sm:text-base border border-stone-200/90 shadow-subtle backdrop-blur-md transition-shadow select-none cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
      >
        <span>{currentText}</span>
      </motion.button>
    </>
  );
}

