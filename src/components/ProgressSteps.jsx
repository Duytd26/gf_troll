import React from 'react';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Lời mời' },
  { num: 2, label: 'Chọn ngày' },
  { num: 3, label: 'Chọn giờ' },
  { num: 4, label: 'Chốt kèo', isHeart: true },
];

export default function ProgressSteps({ currentStep }) {
  return (
    <div className="w-full flex items-center justify-center py-2 select-none">
      <div className="flex items-center space-x-2 sm:space-x-3.5 bg-white/80 backdrop-blur-md px-3.5 sm:px-5 py-2 rounded-full border border-stone-200/70 shadow-stationery">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              {/* Step indicator circle */}
              <div className="flex items-center space-x-1.5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`relative flex items-center justify-center w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-rose-700 text-white shadow-xs'
                      : isActive
                      ? 'bg-rose-600 text-white ring-2 ring-rose-200/80 shadow-btn-rose'
                      : 'bg-stone-100 text-stone-400 border border-stone-200/80'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[2.8]" />
                  ) : step.isHeart ? (
                    <Heart className={`w-3 h-3 fill-current ${isActive ? 'animate-heartbeat' : ''}`} />
                  ) : (
                    <span>{step.num}</span>
                  )}
                </motion.div>
                
                {/* Micro label */}
                <span
                  className={`hidden sm:inline text-xs transition-colors tracking-tight ${
                    isActive ? 'text-stone-900 font-bold' : isCompleted ? 'text-stone-600 font-medium' : 'text-stone-400 font-normal'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting hairline between steps */}
              {idx < STEPS.length - 1 && (
                <div className="w-3.5 sm:w-5 h-[1.5px] rounded-full bg-stone-200 overflow-hidden">
                  <motion.div
                    className="h-full bg-rose-600"
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > step.num ? '100%' : '0%' }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

