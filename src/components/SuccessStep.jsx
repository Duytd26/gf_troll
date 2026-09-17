import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar, Clock, Heart, Sparkles, Send, Check } from 'lucide-react';
import { playSuccessChime, playPop } from '../utils/sound';
import { saveChoice } from '../utils/syncService';

export default function SuccessStep({ selectedDate, selectedTime, onOpenEasterEgg }) {
  const [copied, setCopied] = useState(false);

  // Tasteful, controlled celebration burst on mount & auto-sync
  useEffect(() => {
    playSuccessChime();

    // Auto sync completion to Cloud & LocalStorage
    saveChoice({
      selectedDate: selectedDate ? new Date(selectedDate).toISOString() : null,
      selectedTime: selectedTime || '19:00',
      status: 'completed',
    });

    const colors = ['#be123c', '#e11d48', '#fb7185', '#f59e0b', '#ffffff'];

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: colors,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 75,
          origin: { y: 0.6 },
          colors: colors,
        });
      }, 250);

      return () => clearTimeout(timer);
    } catch (e) {}
  }, [selectedDate, selectedTime]);

  const formatVietnameseDate = (d) => {
    if (!d) return 'Cuối tuần này';
    const dateObj = new Date(d);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[dateObj.getDay()];
    const date = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${dayName}, ${date}/${m}/${y}`;
  };

  const handleSendNotice = () => {
    playPop();
    const dateStr = formatVietnameseDate(selectedDate);
    const timeStr = selectedTime || '19:00';
    const message = `Anh ơiii, em chốt hẹn: ${dateStr} lúc ${timeStr} rùi nè! Nhớ qua đón em đúng giờ nha 🥰🚗💨`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {});
    }

    // Try opening sms if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] mx-auto p-6 sm:p-8 rounded-[28px] stationery-card text-center relative overflow-hidden"
    >
      {/* Celebration emblem */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
        className="w-13 h-13 sm:w-14 sm:h-14 mx-auto mb-3.5 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-subtle"
      >
        <Sparkles className="w-6 h-6 text-rose-600" />
      </motion.div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-[28px] font-serif font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
        🎉 HẸN HÒ THÀNH CÔNG!
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-[15px] text-rose-700 font-semibold mb-6 leading-relaxed">
        Anh đã đặt lịch thành công với người anh thích nhất ❤️
      </p>

      {/* Keepsake Date Summary Ticket */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 rounded-2xl p-4 sm:p-5 mb-5 border border-stone-200/80 shadow-subtle text-left relative overflow-hidden"
      >
        {/* Ticket notch cutouts */}
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF7F2] border-r border-stone-200/80" />
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FAF7F2] border-l border-stone-200/80" />

        <div className="px-2 space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Ngày hẹn
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                {formatVietnameseDate(selectedDate)}
              </span>
            </div>
          </div>

          <div className="h-[1px] border-t border-dashed border-stone-200 w-full" />

          <div className="flex items-center gap-3 text-stone-800">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Giờ đón
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                {selectedTime || '19:00'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sweet Punchline Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 mb-5 text-center space-y-1"
      >
        <p className="text-sm sm:text-[15px] text-stone-800 font-medium">
          Nhớ chuẩn bị xinh đẹp nhé.
        </p>
        <p className="text-xs text-rose-500 font-bold">À mà...</p>
        <p className="text-sm sm:text-[15px] text-rose-800 font-bold">
          Anh quên mất, em xinh sẵn rùi còn đâuu 😌❤️
        </p>
      </motion.div>

      {/* Quick Notify / Send Button */}
      <div className="space-y-2.5">
        <motion.button
          type="button"
          onClick={handleSendNotice}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-2xl font-semibold text-rose-700 text-sm bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Đã copy lời nhắn gửi anh! ❤️</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-rose-600" />
              <span>Gửi xác nhận cho anh qua Tin nhắn / Zalo 💬</span>
            </>
          )}
        </motion.button>

        {/* Button "Em biết rồi" */}
        <motion.button
          type="button"
          onClick={() => {
            playPop();
            onOpenEasterEgg();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white text-base shadow-btn-rose bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>❤️ Em biết rùi ạ</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
