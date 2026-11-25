"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookCover from "@/components/BookCover";
import BookInformationCard from "@/components/BookInformationCard";
import BookNavigation from "@/components/BookNavigation";
import BookPage from "@/components/BookPage";
import Bookshelf from "@/components/Bookshelf";
import LibraryEnvironment from "@/components/LibraryEnvironment";
import OpenBook from "@/components/OpenBook";
import { books } from "@/data/books";

type Phase = "browsing" | "lifting" | "opening" | "reading" | "closing";

export default function BookNook() {
  const [selectedIndex, setSelectedIndex] = useState(3);
  const [shownIndex, setShownIndex] = useState(3);
  const [phase, setPhase] = useState<Phase>("browsing");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [readerOpen, setReaderOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const openAtIndex = useCallback(
    (index: number) => {
      clearTimers();
      setSelectedIndex(index);
      setShownIndex(index);
      setPhase("lifting");
      after(280, () => setPhase("opening"));
      after(1180, () => setPhase("reading"));
    },
    [after, clearTimers],
  );

  const selectBook = useCallback(
    (index: number) => {
      if (phase === "browsing") {
        openAtIndex(index);
        return;
      }
      clearTimers();
      setPhase("closing");
      after(440, () => openAtIndex(index));
    },
    [after, clearTimers, openAtIndex, phase],
  );

  const closeBook = useCallback(() => {
    clearTimers();
    setPhase("closing");
    after(520, () => setPhase("browsing"));
  }, [after, clearTimers]);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      const next = selectedIndex + direction;
      if (next < 0 || next >= books.length) return;
      selectBook(next);
    },
    [selectBook, selectedIndex],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (readerOpen) {
        if (event.key === "Escape") setReaderOpen(false);
        return;
      }
      if (phase === "reading" || phase === "opening") {
        if (event.key === "Escape") closeBook();
        if (event.key === "ArrowLeft") navigate(-1);
        if (event.key === "ArrowRight") navigate(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBook, navigate, phase, readerOpen]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const book = books[shownIndex];
  const isOpen = phase === "opening" || phase === "reading";
  const isActive = phase !== "browsing";
  const saved = savedIds.includes(book.id);

  function toggleSave() {
    setSavedIds((current) =>
      current.includes(book.id) ? current.filter((id) => id !== book.id) : [...current, book.id],
    );
    setToast(saved ? "Removed from My Books" : "Saved to My Books");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-canvas text-espresso">
      <LibraryEnvironment />

      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-7 py-7 sm:px-12 sm:py-9">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-canvas/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M12 6c-2-1.6-4.6-2-8-1.4v12c3.4-.6 6-.2 8 1.4 2-1.6 4.6-2 8-1.4v-12c-3.4-.6-6-.2-8 1.4Zm0 0v12" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-display text-[20px] leading-none tracking-[-0.01em]">BookNook</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-espresso/45">
              A free digital bookstore
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-7 sm:flex">
          <span className="text-[10px] uppercase tracking-[0.22em] text-espresso/45">The Library</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-espresso/45">
            My Books <span className="ml-1 text-terracotta">{savedIds.length}</span>
          </span>
          <span className="h-4 w-px bg-espresso/15" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-espresso/35">Est. 2024</span>
        </div>
      </header>

      <div className="bn-scene-content pointer-events-none absolute inset-x-0 top-[43%] z-20 flex -translate-y-1/2 items-center justify-center gap-12 px-6 lg:gap-16">
        <div className="bn-book-wrap relative">
          <AnimatePresence>
            {isActive ? (
              <OpenBook key={book.id} book={book} open={isOpen} />
            ) : null}
          </AnimatePresence>
        </div>
        <div className="bn-card-wrap relative w-[340px] shrink-0">
          <AnimatePresence>
            {phase === "reading" ? (
              <BookInformationCard
                key={book.id}
                book={book}
                saved={saved}
                onClose={closeBook}
                onSave={toggleSave}
                onRead={() => setReaderOpen(true)}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <BookNavigation
        onPrevious={() => navigate(-1)}
        onNext={() => navigate(1)}
        canPrevious={selectedIndex > 0}
        canNext={selectedIndex < books.length - 1}
        visible={phase === "reading"}
      />

      <Bookshelf books={books} activeIndex={selectedIndex} dimmed={isActive} onSelect={selectBook} />

      <AnimatePresence>
        {phase === "browsing" ? (
          <motion.div
            className="absolute bottom-[3.5%] left-1/2 z-30 -translate-x-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-espresso/45">
              Choose a spine to take a book from the shelf
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="absolute bottom-6 right-7 z-50 border border-beige/10 bg-ink px-5 py-3 text-[11px] tracking-[0.08em] text-beige shadow-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {readerOpen ? (
          <motion.div
            className="absolute inset-0 z-[60] flex flex-col bg-[#1B1410]/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-beige/10 px-7 py-5 sm:px-12">
              <div className="flex items-center gap-3">
                <div className="h-11 w-8 overflow-hidden">
                  <BookCover cover={book.cover} title={book.title} author={book.author} />
                </div>
                <div>
                  <p className="font-display text-lg text-beige">{book.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-beige/45">{book.author}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReaderOpen(false)}
                className="flex items-center gap-2 border border-beige/20 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-beige/70 transition hover:border-terracotta hover:text-beige"
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to the shelf
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center gap-1 overflow-auto p-6">
              <div className="bn-reader-page">
                <div className="paper-face">
                  <BookPage content={book.leftPage} side="left" accent={book.cover.accent} />
                </div>
              </div>
              <div className="bn-reader-spine" />
              <div className="bn-reader-page">
                <div className="paper-face">
                  <BookPage content={book.rightPage} side="right" accent={book.cover.accent} />
                </div>
              </div>
            </div>
            <div className="pb-6 text-center text-[10px] uppercase tracking-[0.22em] text-beige/30">
              BookNook Reader · Pages {book.leftPage.pageNumber}–{book.rightPage.pageNumber}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
