import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BackgroundLayer from './components/BackgroundLayer';
import FloatingHearts from './components/FloatingHearts';
import CursorHeartTrail from './components/CursorHeartTrail';
import ProgressSteps from './components/ProgressSteps';
import InviteStep from './components/InviteStep';
import DateStep from './components/DateStep';
import TimeStep from './components/TimeStep';
import SuccessStep from './components/SuccessStep';
import EasterEggModal from './components/EasterEggModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to upcoming Saturday if possible, or tomorrow
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [rejectCount, setRejectCount] = useState(0);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  const formatVietnameseDate = (date) => {
    if (!date) return 'Chưa chọn';
    const dt = new Date(date);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[dt.getDay()];
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  };

  const inputSummary = [
    { label: 'Ngày chọn', value: formatVietnameseDate(selectedDate) },
    { label: 'Giờ đón', value: selectedTime || 'Chưa chọn' },
    { label: 'Lần từ chối', value: `${rejectCount} lần` },
  ];

  const handleRestart = () => {
    setCurrentStep(1);
    setRejectCount(0);
    setIsEasterEggOpen(false);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 py-4 sm:py-8 pt-safe pb-safe overflow-hidden">
      {/* Dynamic Background with fallback & overlay */}
      <BackgroundLayer />

      {/* Floating background heart particles */}
      <FloatingHearts />

      {/* Subtle cursor trail on desktop */}
      <CursorHeartTrail />

      {/* Top Header / Progress Indicator */}
      <header className="w-full max-w-md z-10 mb-auto">
        <ProgressSteps currentStep={currentStep} />
      </header>

      <aside className="fixed right-3 top-3 z-50 w-[220px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-rose-200/70 bg-white/85 p-3 shadow-lg backdrop-blur-md sm:right-5 sm:top-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700">Dashboard</p>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-semibold text-rose-700">Live</span>
        </div>
        <div className="space-y-2 text-left">
          {inputSummary.map((item) => (
            <div key={item.label} className="rounded-xl bg-stone-50/90 px-2.5 py-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-500">{item.label}</div>
              <div className="mt-1 text-xs font-bold text-stone-800">{item.value}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Interactive Stage */}
      <main className="w-full max-w-lg my-auto py-2 sm:py-4 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <InviteStep
              key="step-1"
              rejectCount={rejectCount}
              setRejectCount={setRejectCount}
              onAccept={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <DateStep
              key="step-2"
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <TimeStep
              key="step-3"
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              onConfirm={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <SuccessStep
              key="step-4"
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onOpenEasterEgg={() => setIsEasterEggOpen(true)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Easter Egg Modal (Step 5) */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
        onRestart={handleRestart}
      />

      {/* Footer subtle brand / note */}
      <footer className="w-full text-center z-10 mt-auto pt-2 text-[10px] sm:text-[11px] text-stone-500/80 tracking-widest uppercase font-semibold select-none">
        Made with ❤️ for you
      </footer>
    </div>
  );
}

