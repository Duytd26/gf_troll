import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { playPop } from '../utils/sound';

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function DateStep({ selectedDate, onSelectDate, onNext }) {
  // Calendar view month & year
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentViewDate, setCurrentViewDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth(); // 0 - 11

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month (0: Sunday, 1: Monday, ...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Convert so Monday is index 0, Sunday is index 6
  const startOffset = (firstDayIndex + 6) % 7;

  const prevMonth = () => {
    playPop();
    // Don't go to past month if current view is already this month
    if (year === today.getFullYear() && month <= today.getMonth()) return;
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    playPop();
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const canGoPrev = !(year === today.getFullYear() && month <= today.getMonth());

  const handleDateClick = (dayNum) => {
    const clicked = new Date(year, month, dayNum);
    clicked.setHours(0, 0, 0, 0);
    if (clicked < today) return; // Prevent past dates

    playPop();
    onSelectDate(clicked);
  };

  const isToday = (dayNum) => {
    return (
      dayNum === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (dayNum) => {
    if (!selectedDate) return false;
    const s = new Date(selectedDate);
    return (
      dayNum === s.getDate() &&
      month === s.getMonth() &&
      year === s.getFullYear()
    );
  };

  const isPast = (dayNum) => {
    const d = new Date(year, month, dayNum);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  // Vietnamese formatted date text
  const formatVietnameseDate = (d) => {
    if (!d) return '';
    const dateObj = new Date(d);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[dateObj.getDay()];
    const date = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${dayName}, ngày ${date}/${m}/${y}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] mx-auto p-6 sm:p-8 rounded-[28px] stationery-card text-center relative overflow-hidden"
    >
      {/* Badge */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs mb-3 border border-rose-200/60"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>❤️ Mission 1 Complete</span>
      </motion.div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-[28px] font-serif font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
        Thế mình đi hôm nào nhỉ? 🥰
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-[15px] text-stone-600 font-normal mb-5 leading-relaxed">
        Em chọn ngày đi, phần còn lại để anh lo 😎
      </p>

      {/* Mini Calendar Container */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 shadow-subtle border border-stone-200/70 mb-5">
        {/* Calendar Month/Year Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoPrev}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
              canGoPrev
                ? 'hover:bg-rose-50 text-stone-700 hover:text-rose-700 cursor-pointer active:scale-95'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-serif font-bold text-stone-900 text-base sm:text-lg tracking-tight">
            Tháng {month + 1}, {year}
          </span>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-rose-50 text-stone-700 hover:text-rose-700 cursor-pointer active:scale-95 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
          {WEEK_DAYS.map((wd) => (
            <div key={wd} className="py-1">
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty offset days */}
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9 sm:h-10" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const past = isPast(dayNum);
            const selected = isSelected(dayNum);
            const todayMark = isToday(dayNum);

            return (
              <motion.button
                key={`day-${dayNum}`}
                type="button"
                whileTap={past ? {} : { scale: 0.9 }}
                onClick={() => handleDateClick(dayNum)}
                disabled={past}
                className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold flex flex-col items-center justify-center relative transition-all duration-150 ${
                  past
                    ? 'text-stone-300 cursor-not-allowed'
                    : selected
                    ? 'bg-rose-600 text-white font-bold shadow-btn-rose scale-105 z-10'
                    : 'text-stone-700 hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100'
                } ${todayMark && !selected ? 'border border-rose-300 font-bold text-rose-600' : ''}`}
              >
                <span>{dayNum}</span>
                {todayMark && !selected && (
                  <span className="w-1 h-1 rounded-full bg-rose-500 mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected date display preview */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-stone-800 mb-5 bg-stone-50/80 py-2 px-3.5 rounded-xl border border-stone-200/70"
        >
          <CalendarIcon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formatVietnameseDate(selectedDate)}</span>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.button
        type="button"
        disabled={!selectedDate}
        onClick={() => {
          playPop();
          onNext();
        }}
        whileHover={{ scale: selectedDate ? 1.02 : 1 }}
        whileTap={{ scale: selectedDate ? 0.97 : 1 }}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white text-base shadow-btn-rose transition-all flex items-center justify-center gap-2 ${
          selectedDate
            ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 cursor-pointer'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>Chọn ngày này ❤️</span>
      </motion.button>
    </motion.div>
  );
}

