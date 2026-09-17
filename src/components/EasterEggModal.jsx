import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import { playHeartBeat, playPop } from '../utils/sound';

export default function EasterEggModal({ isOpen, onClose, onRestart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      return;
    }

    playHeartBeat();

    // Sequence timing
    const t1 = setTimeout(() => {
      setPhase(1); // "Thank you for saying yes."
      playHeartBeat();
    }, 1100);

    const t2 = setTimeout(() => {
      setPhase(2); // "See you on our date ❤️"
      playHeartBeat();
    }, 2800);

    const t3 = setTimeout(() => {
      setPhase(3); // "From Duy ❤️"
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl text-center select-none"
      >
        <div className="relative max-w-sm w-full mx-auto flex flex-col items-center justify-center">
          {/* Subtle central pulsating heart */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.15, 1.05, 1.18, 1],
              opacity: 1,
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="relative mb-8 text-rose-500"
          >
            <Heart className="w-20 h-20 fill-rose-600 text-rose-500 drop-shadow-[0_0_24px_rgba(225,29,72,0.45)]" />
            <div className="absolute inset-0 bg-rose-600/20 rounded-full blur-2xl -z-10" />
          </motion.div>

          {/* Sequential message reveals */}
          <div className="min-h-[140px] flex flex-col items-center justify-center space-y-4 px-4">
            {/* Phase 1 */}
            {phase >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-base sm:text-lg font-light text-stone-300/90 tracking-wide"
              >
                Thank you for saying yes.
              </motion.p>
            )}

            {/* Phase 2 */}
            {phase >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-xl sm:text-2xl font-serif font-semibold text-rose-100 tracking-tight"
              >
                See you on our date ❤️
              </motion.p>
            )}

            {/* Phase 3 */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="pt-2"
              >
                <span className="font-handwriting text-3xl sm:text-4xl text-rose-300 font-bold block drop-shadow-[0_0_12px_rgba(251,113,133,0.4)]">
                  From Duy ❤️
                </span>
              </motion.div>
            )}
          </div>

          {/* Buttons to close or replay */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-3.5"
            >
              <button
                type="button"
                onClick={() => {
                  playPop();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 text-sm font-medium border border-white/15 backdrop-blur-md transition-all cursor-pointer active:scale-95"
              >
                Xem lại lịch hẹn
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  onRestart();
                }}
                className="px-5 py-2.5 rounded-full bg-rose-600/70 hover:bg-rose-600 text-white text-sm font-medium border border-rose-400/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                title="Bắt đầu lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

