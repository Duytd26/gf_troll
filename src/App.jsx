import React, { useState, useEffect, useCallback } from 'react';
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
import DashboardView from './components/DashboardView';
import { saveChoice, getLocalChoice } from './utils/syncService';

function checkIsDashboard() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  return (
    path.endsWith('/dashboard') ||
    path.endsWith('/dashboard/') ||
    search.get('dashboard') === 'true' ||
    search.get('dashboard') === '1' ||
    search.get('admin') === 'true' ||
    search.get('admin') === '1' ||
    hash === '#/dashboard' ||
    hash === '#dashboard'
  );
}

export default function App() {
  const [isDashboard, setIsDashboard] = useState(checkIsDashboard);
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

  // Secret tap counter on footer to quickly toggle dashboard
  const [secretTapCount, setSecretTapCount] = useState(0);

  // Synchronize route changes (e.g. forward/back buttons, URL changes)
  useEffect(() => {
    const handleUrlChange = () => {
      setIsDashboard(checkIsDashboard());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Save changes to sync service
  const syncCurrentState = useCallback((overrides = {}) => {
    saveChoice({
      selectedDate: selectedDate ? new Date(selectedDate).toISOString() : null,
      selectedTime,
      rejectCount,
      currentStep,
      ...overrides,
    });
  }, [selectedDate, selectedTime, rejectCount, currentStep]);

  // Handle reject increment from Step 1
  const handleRejectIncrement = () => {
    setRejectCount((prev) => {
      const next = prev + 1;
      syncCurrentState({ rejectCount: next });
      return next;
    });
  };

  // Handle date selection from Step 2
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    syncCurrentState({ selectedDate: date ? new Date(date).toISOString() : null });
  };

  // Handle time selection from Step 3
  const handleSelectTime = (time) => {
    setSelectedTime(time);
    syncCurrentState({ selectedTime: time });
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setRejectCount(0);
    setIsEasterEggOpen(false);
    syncCurrentState({ currentStep: 1, rejectCount: 0, status: 'restarted' });
  };

  // Secret footer trigger: 3 taps on "Made with ❤️ for you" opens Dashboard
  const handleFooterSecretClick = () => {
    setSecretTapCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsDashboard(true);
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '/dashboard');
        }
        return 0;
      }
      setTimeout(() => setSecretTapCount(0), 1500);
      return next;
    });
  };

  const handleBackToInvite = () => {
    setIsDashboard(false);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-3 sm:px-4 py-4 sm:py-8 pt-safe pb-safe overflow-x-hidden">
      {/* Dynamic Background with fallback & overlay */}
      <BackgroundLayer />

      {/* Floating background heart particles */}
      <FloatingHearts />

      {/* Subtle cursor trail on desktop */}
      <CursorHeartTrail />

      {/* RENDER DASHBOARD VIEW IF ON DASHBOARD ROUTE */}
      {isDashboard ? (
        <DashboardView onBackToInvite={handleBackToInvite} />
      ) : (
        /* RENDER REGULAR GIRLFRIEND INVITE FLOW (NO LIVE DASHBOARD ON SCREEN) */
        <>
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
                  onEvade={handleRejectIncrement}
                  onAccept={() => {
                    setCurrentStep(2);
                    syncCurrentState({ currentStep: 2 });
                  }}
                />
              )}

              {currentStep === 2 && (
                <DateStep
                  key="step-2"
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  onNext={() => {
                    setCurrentStep(3);
                    syncCurrentState({ currentStep: 3 });
                  }}
                />
              )}

              {currentStep === 3 && (
                <TimeStep
                  key="step-3"
                  selectedTime={selectedTime}
                  onSelectTime={handleSelectTime}
                  onConfirm={() => {
                    setCurrentStep(4);
                    syncCurrentState({ currentStep: 4, status: 'completed' });
                  }}
                  onBack={() => {
                    setCurrentStep(2);
                    syncCurrentState({ currentStep: 2 });
                  }}
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

          {/* Footer subtle brand / note with secret tap to open Dashboard */}
          <footer
            onClick={handleFooterSecretClick}
            className="w-full text-center z-10 mt-auto pt-2 text-[10px] sm:text-[11px] text-stone-500/80 tracking-widest uppercase font-semibold select-none cursor-pointer"
            title="Made with ❤️ for you"
          >
            Made with ❤️ for you
          </footer>
        </>
      )}
    </div>
  );
}
