"use client";

import { motion } from "framer-motion";

interface BookInformationCardProps {
  book: {
    title: string;
    author: string;
    genre: string;
    rating: number;
    description: string;
    pages: number;
    year: number;
  };
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onRead: () => void;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex gap-[2px]">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
            <path
              d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"
              fill={i < Math.round(rating) ? "#C87551" : "rgba(233,226,214,0.18)"}
            />
          </svg>
        ))}
      </span>
      <span className="text-[11px] font-medium text-beige/70">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function BookInformationCard({
  book,
  saved,
  onClose,
  onSave,
  onRead,
}: BookInformationCardProps) {
  return (
    <motion.aside
      className="bn-info-card"
      initial={{ opacity: 0, x: 46, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 34, y: 8, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 110, damping: 20, delay: 0.12 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-beige/45">
            Now viewing
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close book"
          className="group -mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-beige/10 text-beige/55 transition hover:border-terracotta/60 hover:text-beige"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-6">
        <span className="inline-block border border-terracotta/35 bg-terracotta/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          {book.genre}
        </span>
        <h2 className="mt-4 font-display text-[34px] leading-[1.06] text-beige">{book.title}</h2>
        <p className="mt-2 text-[12px] tracking-[0.08em] text-beige/55">
          by <span className="text-beige/85">{book.author}</span>
        </p>
      </div>

      <div className="mt-5 flex items-center gap-4 border-y border-beige/10 py-3.5">
        <StarRow rating={book.rating} />
        <span className="h-3.5 w-px bg-beige/15" />
        <span className="text-[11px] text-beige/55">
          <span className="text-beige/85">{book.pages}</span> pages
        </span>
        <span className="h-3.5 w-px bg-beige/15" />
        <span className="text-[11px] text-beige/55">
          <span className="text-beige/85">{book.year}</span>
        </span>
      </div>

      <p className="mt-5 text-[12.5px] leading-[1.75] text-beige/65">{book.description}</p>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-beige/70">
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-terracotta" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M10 2.5v11m0 0l-4-4m4 4l4-4M3.5 15.5v2h13v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>
          <span className="font-semibold text-beige">Free to read</span> — no account required
        </span>
      </div>

      <div className="mt-7 space-y-2.5">
        <button
          type="button"
          onClick={onRead}
          className="group flex w-full items-center justify-between bg-terracotta px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-[#d48561]"
        >
          Read Book
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 10h11m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex w-full items-center justify-center gap-2 border border-beige/18 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-beige/75 transition hover:border-beige/40 hover:text-beige"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={saved ? "#C87551" : "none"} stroke={saved ? "#C87551" : "currentColor"} strokeWidth="1.5">
            <path d="M5 3.5h10v13l-5-3.5-5 3.5z" strokeLinejoin="round" />
          </svg>
          {saved ? "Saved to My Books" : "Save to My Books"}
        </button>
      </div>
    </motion.aside>
  );
}
