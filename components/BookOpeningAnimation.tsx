"use client";

import { motion, useReducedMotion } from "framer-motion";
import BookCover from "@/components/BookCover";
import BookPage from "@/components/BookPage";
import type { Book } from "@/types/book";

const PAGE_W = 250;
const PAGE_H = 340;
const SHEET_COUNT = 4;

interface BookOpeningAnimationProps {
  book: Book;
  open: boolean;
}

export default function BookOpeningAnimation({ book, open }: BookOpeningAnimationProps) {
  const reduceMotion = useReducedMotion();
  const transition = (delay: number) =>
    reduceMotion
      ? { duration: 0 }
      : {
          type: "spring" as const,
          stiffness: 68,
          damping: 17,
          mass: 0.9,
          delay: open ? delay : (SHEET_COUNT + 1 - delay / 0.075) * 0.032,
        };

  const sheets = Array.from({ length: SHEET_COUNT }, (_, i) => i);

  return (
    <div
      className="bn-book"
      style={{ width: PAGE_W * 2, height: PAGE_H, transformStyle: "preserve-3d" }}
    >
      <div className="bn-half bn-half-right" style={{ left: PAGE_W, width: PAGE_W, height: PAGE_H }}>
        <div
          className="bn-board"
          style={{ background: book.cover.background, transform: "translateZ(-14px)" }}
        />
        {sheets.map((i) => (
          <div
            key={`right-sheet-${i}`}
            className="bn-sheet"
            style={{ transform: `translateZ(${-11 + i * 3}px)`, right: `${i * 0.7}px` }}
          />
        ))}
        <div className="bn-page bn-page-right" style={{ transform: "translateZ(2px)" }}>
          <BookPage content={book.rightPage} side="right" accent={book.cover.accent} />
        </div>
      </div>

      <div className="bn-half bn-half-left" style={{ left: 0, width: PAGE_W, height: PAGE_H }}>
        <motion.div
          className="bn-leaf"
          initial={false}
          animate={{ rotateY: open ? 0 : 180, z: open ? -14 : 14 }}
          transition={transition(0)}
        >
          <div className="bn-leaf-face bn-cover-inside" />
          <div
            className="bn-leaf-face bn-cover-outside"
            style={{ transform: "rotateY(180deg) translateZ(1px)", background: book.cover.background }}
          >
            <BookCover cover={book.cover} title={book.title} author={book.author} />
          </div>
        </motion.div>

        {sheets.map((i) => (
          <motion.div
            key={`left-sheet-${i}`}
            className="bn-leaf"
            initial={false}
            animate={{ rotateY: open ? 0 : 176 - i * 1.5, z: open ? -11 + i * 3 : 11 - i * 3 }}
            transition={transition((i + 1) * 0.075)}
          >
            <div className="bn-sheet bn-sheet-flat" />
          </motion.div>
        ))}

        <motion.div
          className="bn-leaf"
          initial={false}
          animate={{ rotateY: open ? 0 : 170, z: open ? 2 : -2 }}
          transition={transition((SHEET_COUNT + 1) * 0.075)}
        >
          <div className="bn-leaf-face bn-page bn-page-left">
            <BookPage content={book.leftPage} side="left" accent={book.cover.accent} />
          </div>
        </motion.div>
      </div>

      <div className="bn-spine" style={{ background: book.cover.background }} />
      <div className="bn-gutter" />
    </div>
  );
}
