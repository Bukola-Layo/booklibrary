"use client";

import { motion } from "framer-motion";

interface BookNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
  visible: boolean;
}

interface ArrowButtonProps {
  direction: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function ArrowButton({ direction, label, disabled, onClick }: ArrowButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="bn-nav-button group flex flex-col items-center gap-2 disabled:cursor-default disabled:opacity-30"
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso/20 bg-canvas/55 text-espresso shadow-sm backdrop-blur-sm transition-colors group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-ink">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
          {direction === "left" ? (
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </span>
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-espresso/50">
        {label}
      </span>
    </motion.button>
  );
}

export default function BookNavigation({
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  visible,
}: BookNavigationProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-between px-5 sm:px-10"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? "-50%" : "-35%" }}
      transition={{ duration: 0.4 }}
    >
      <div className="pointer-events-auto">
        <ArrowButton direction="left" label="Previous" disabled={!canPrevious} onClick={onPrevious} />
      </div>
      <div className="pointer-events-auto">
        <ArrowButton direction="right" label="Next" disabled={!canNext} onClick={onNext} />
      </div>
    </motion.div>
  );
}
