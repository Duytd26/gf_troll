import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import RunawayButton from './RunawayButton';
import { getHeadingForRejection, getSubtitleForRejection } from '../utils/messages';
import { playSuccessChime, playPop } from '../utils/sound';

export default function InviteStep({ onAccept, rejectCount, setRejectCount, onEvade }) {
  const yesButtonRef = useRef(null);
  const headingRef = useRef(null);
  const [isAccepted, setIsAccepted] = useState(false);

  // Growth factor for "Dạ đi ❤️" button after evasions
  const yesScale = 1 + Math.min(rejectCount * 0.04, 0.45); // up to ~45% larger

  const handleEvade = () => {
    if (onEvade) {
      onEvade();
    } else if (setRejectCount) {
      setRejectCount((prev) => prev + 1);
    }
  };

  const handleYesClick = () => {
    if (isAccepted) return;
    setIsAccepted(true);
    playSuccessChime();

    // Trigger lovely confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff', '#e11d48'],
        shapes: ['circle'],
      });
    } catch (e) {}

    // Transition to Step 2 after 1.25s
    setTimeout(() => {
      onAccept();
    }, 1300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] mx-auto p-6 sm:p-8 rounded-[28px] stationery-card text-center relative overflow-hidden"
    >
      {/* Editorial badge */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs mb-4 border border-rose-200/60"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>💌 Có một lời mời dành riêng cho em</span>
      </motion.div>

      {/* Main Heading with dynamic milestone reaction */}
      <div ref={headingRef}>
        <motion.h1
          key={getHeadingForRejection(rejectCount)}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="text-2xl sm:text-[28px] font-serif font-bold text-stone-900 tracking-tight mb-2.5 leading-snug"
        >
          {getHeadingForRejection(rejectCount)}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={getSubtitleForRejection(rejectCount)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm sm:text-[15px] text-stone-600 font-normal mb-6 px-1 leading-relaxed max-w-[340px] mx-auto"
        >
          {getSubtitleForRejection(rejectCount)}
        </motion.p>
      </div>

      {/* Interactive Buttons Container */}
      <div className="relative min-h-[85px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2">
        {/* Button "Dạ đi ❤️" */}
        <motion.button
          ref={yesButtonRef}
          type="button"
          onClick={handleYesClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            scale: isAccepted ? 1.08 : yesScale,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className={`relative z-20 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold text-white text-base sm:text-lg shadow-btn-rose bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all cursor-pointer flex items-center justify-center gap-2 group overflow-hidden ${
            isAccepted ? 'ring-4 ring-rose-200 bg-rose-700' : ''
          }`}
        >
          {isAccepted ? (
            <span className="flex items-center gap-2 animate-pulse">
              <span>Yeeee 🥰 Biết ngay em sẽ đồng ý mà!</span>
            </span>
          ) : (
            <>
              <Heart className="w-4.5 h-4.5 fill-white transition-transform group-hover:scale-110" />
              <span>Dạ đi ❤️</span>
            </>
          )}
        </motion.button>

        {/* Button "Không đi 😝" (Runaway) */}
        {!isAccepted && (
          <RunawayButton
            onEvade={handleEvade}
            rejectCount={rejectCount}
            yesButtonRef={yesButtonRef}
            headingRef={headingRef}
          />
        )}
      </div>

      {/* Cute small counter if user tried to evade */}
      {rejectCount > 0 && !isAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-xs text-stone-600 font-medium bg-rose-50/70 py-1.5 px-3.5 rounded-full inline-block border border-rose-200/50"
        >
          <span>Số lần em định từ chối anh: </span>
          <span className="text-rose-700 font-extrabold text-sm">{rejectCount}</span>
          <span> 😭</span>
        </motion.div>
      )}
    </motion.div>
  );
}

