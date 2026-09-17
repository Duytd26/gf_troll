import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { TIME_SLOTS } from '../utils/messages';
import { playPop } from '../utils/sound';

export default function TimeStep({ selectedTime, onSelectTime, onConfirm, onBack }) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customVal, setCustomVal] = useState(selectedTime || '18:30');

  const handleSelectSlot = (timeStr) => {
    playPop();
    setIsCustomMode(false);
    onSelectTime(timeStr);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomVal(val);
    onSelectTime(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] mx-auto p-6 sm:p-8 rounded-[28px] stationery-card text-center relative overflow-hidden"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
          playPop();
          onBack();
        }}
        className="absolute top-5 sm:top-6 left-5 sm:left-6 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200/80 text-stone-600 transition-colors cursor-pointer active:scale-90 border border-stone-200/60"
        title="Quay lại chọn ngày"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Badge */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs mb-3 border border-rose-200/60"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>⏰ Sắp tới đích rồi nè</span>
      </motion.div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-[28px] font-serif font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
        Mấy giờ anh được đón em nhò? 🥺
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-[15px] text-stone-600 font-normal mb-5 leading-relaxed">
        Đúng giờ này anh sẽ có mặt trước cửa nhà em nha!
      </p>

      {/* Preset Time Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedTime === slot.time && !isCustomMode;

          return (
            <motion.button
              key={slot.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectSlot(slot.time)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-btn-rose ring-2 ring-rose-200/80 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-stone-800 border border-stone-200/80 shadow-subtle'
              }`}
            >
              <span className="text-lg sm:text-xl">{slot.icon}</span>
              <span className="font-bold text-base sm:text-[17px] tracking-tight leading-tight">{slot.time}</span>
              <span className={`text-[11px] font-medium leading-tight ${isSelected ? 'text-white/90' : 'text-stone-500'}`}>
                {slot.label}
              </span>
            </motion.button>
          );
        })}

        {/* Custom time button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            playPop();
            setIsCustomMode(true);
            onSelectTime(customVal);
          }}
          className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
            isCustomMode
              ? 'bg-rose-600 text-white shadow-btn-rose ring-2 ring-rose-200/80 scale-[1.02]'
              : 'bg-white/80 hover:bg-white text-stone-800 border border-stone-200/80 shadow-subtle'
          }`}
        >
          <Clock className={`w-5 h-5 mb-0.5 ${isCustomMode ? 'text-white' : 'text-rose-600'}`} />
          <span className="font-bold text-sm sm:text-base tracking-tight leading-tight">Giờ khác</span>
          <span className={`text-[11px] font-medium leading-tight ${isCustomMode ? 'text-white/90' : 'text-stone-500'}`}>
            Tùy chọn
          </span>
        </motion.button>
      </div>

      {/* Custom Time Picker Input if selected */}
      {isCustomMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-stone-50/90 p-3 rounded-2xl border border-stone-200/80 mb-4 flex items-center justify-center gap-3"
        >
          <span className="text-xs font-bold text-stone-800">Chọn giờ chính xác:</span>
          <input
            type="time"
            value={customVal}
            onChange={handleCustomChange}
            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer text-base"
          />
        </motion.div>
      )}

      {/* Selected indicator */}
      {selectedTime && (
        <div className="text-xs font-semibold text-stone-700 mb-5 bg-rose-50/70 py-1.5 px-3.5 rounded-xl inline-block border border-rose-200/50">
          Đón lúc: <span className="font-bold text-rose-700 text-sm">{selectedTime}</span> 🚗💨
        </div>
      )}

      {/* Chốt Kèo Button */}
      <motion.button
        type="button"
        disabled={!selectedTime}
        onClick={() => {
          playPop();
          onConfirm();
        }}
        whileHover={{ scale: selectedTime ? 1.02 : 1 }}
        whileTap={{ scale: selectedTime ? 0.97 : 1 }}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white text-base sm:text-lg shadow-btn-rose transition-all flex items-center justify-center gap-2 ${
          selectedTime
            ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 cursor-pointer'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>Chốt kèo ❤️</span>
      </motion.button>
    </motion.div>
  );
}

