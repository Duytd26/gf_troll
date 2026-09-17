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

