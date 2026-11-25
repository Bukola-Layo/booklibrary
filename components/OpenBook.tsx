"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import BookOpeningAnimation from "@/components/BookOpeningAnimation";
import type { Book } from "@/types/book";

interface OpenBookProps {
  book: Book;
  open: boolean;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function OpenBook({ book, open, onMouseMove }: OpenBookProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 18 });
  const tiltX = useTransform(smoothY, [-1, 1], [23, 13]);
  const tiltY = useTransform(smoothX, [-1, 1], [-7, 7]);

  function handlePointerMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    onMouseMove?.(event);
  }

  return (
    <motion.div
      className="bn-stage"
      initial={{ opacity: 0, scale: 0.86, y: 54, rotateZ: -3 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 34, rotateZ: 2 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="bn-shadow" />
      <motion.div
        className="bn-tilt"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        <BookOpeningAnimation book={book} open={open} />
      </motion.div>
    </motion.div>
  );
}
