"use client";

import { motion } from "framer-motion";
import BookCover from "@/components/BookCover";
import type { Book } from "@/types/book";

interface BookshelfProps {
  books: Book[];
  activeIndex: number;
  dimmed: boolean;
  onSelect: (index: number) => void;
}

export default function Bookshelf({ books, activeIndex, dimmed, onSelect }: BookshelfProps) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[9%] z-20 flex justify-center px-6"
      animate={{ opacity: dimmed ? 0.42 : 1, y: dimmed ? 18 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: dimmed ? "none" : "auto" }}
    >
      <div className="relative flex items-end gap-[5px]">
        {books.map((book, index) => {
          const isActive = index === activeIndex;
          const height = Math.round(book.height * 0.68);
          const width = Math.round(book.spineWidth * 0.78);

          return (
            <motion.button
              key={book.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Select ${book.title}`}
              className="bn-shelf-book relative block cursor-pointer outline-none"
              style={{ width, height, transformStyle: "preserve-3d", zIndex: isActive ? 10 : 1 }}
              animate={{
                y: isActive ? -16 : 0,
                rotateZ: isActive ? -1.5 : (book.tilt ?? 0) * 0.5,
              }}
              whileHover={{ y: isActive ? -20 : -12, rotateZ: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div
                className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-[2px_3px_1px_1px]"
                style={{
                  boxShadow: "inset -3px 0 5px rgba(0,0,0,0.35), 4px 6px 10px -4px rgba(30,16,8,0.6)",
                }}
              >
                <BookCover cover={book.cover} title={book.title} author={book.author} variant="spine" />
              </div>

              <div
                className="absolute -right-[6px] bottom-[2px] top-[3px] w-[7px] rounded-r-[2px]"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, #EAE0CC 0 2px, #CDBDA0 2px 3px)",
                  transform: "skewY(-3deg)",
                  boxShadow: "2px 2px 5px rgba(30,16,8,0.35)",
                }}
              />

              <div
                className="absolute -top-[5px] left-0 right-[-5px] h-[6px] origin-bottom"
                style={{
                  background: "linear-gradient(#D8C9AB, #B9A788)",
                  transform: "skewX(-42deg)",
                }}
              />

              {isActive ? (
                <motion.span
                  className="absolute -bottom-2 left-1/2 h-[6px] w-[130%] -translate-x-1/2 rounded-full bg-terracotta"
                  style={{ filter: "blur(7px)" }}
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
