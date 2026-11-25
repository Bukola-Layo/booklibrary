"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import BeamsBackground from "@/components/BeamsBackground";
import BookCarousel3D, { type CarouselBook } from "@/components/BookCarousel3D";
import OriginButton from "@/components/OriginButton";

interface ShelfBook extends CarouselBook {
  tag: string;
  description: string;
}

const books: ShelfBook[] = [
  {
    title: "Editions",
    color: "#f4a3c0",
    textColor: "#fff",
    spineW: 30,
    h: 225,
    img: "https://cdn.21st.dev/assets/mirror/13/1337c2df55b023426b593e0e6dc69cdd2a792a365a603c839bb031696f01c550.jpg",
    tag: "Edition no. 1",
    description:
      "A curated study of editorial identities, printed matter and the quiet decisions that give a publication its character.",
  },
  {
    title: "Notes",
    color: "#2f7a49",
    textColor: "#fff",
    spineW: 26,
    h: 170,
    img: "https://cdn.21st.dev/assets/mirror/06/06defc3f0286eedbe5f21b980f2449eb5e18e877af5801721ec9f08db4f599a7.jpg",
    tag: "Field notes",
    description:
      "Observations gathered from studios and sketchbooks — small reminders about process, place and the habits of making.",
  },
  {
    title: "PRINTABLE",
    color: "#ee5a24",
    textColor: "#fff",
    spineW: 26,
    h: 278,
    img: "https://cdn.21st.dev/assets/mirror/ab/abefd6ae4f7b86fe7c2bfaed21a1862f03de9fdfda983ec2efe460cf472a3fa5.jpg",
    tag: "Printable",
    description:
      "A hands-on collection of grids, templates and reproducible layouts designed to be cut, folded and pinned up.",
  },
  {
    title: "UTILITARIAN",
    color: "#3f4a45",
    textColor: "#fff",
    spineW: 15,
    h: 240,
    img: "https://cdn.21st.dev/assets/mirror/11/11991281bc0fcea8f13b2cc7a2b552e23fbb07e14db66949638329c7da6d8729.jpg",
    tag: "New Utilitarian",
    description:
      "An argument for purposeful design: durable forms, honest materials and nothing that asks for attention it has not earned.",
  },
  {
    title: "BOOKSIA",
    color: "#f5a7c6",
    textColor: "#161616",
    spineW: 40,
    h: 270,
    img: "https://cdn.21st.dev/assets/mirror/c3/c32758ce3b98179fca69bf1eeaa48389d3f385a01678e0ce2ceccf79b34b4ed2.jpg",
    tag: "Ukrainian Photographic Alternative",
    description:
      "A survey of Ukrainian photographic practice, pairing image-led essays with the people who shaped the scene.",
  },
  {
    title: "Looking",
    color: "#d28bb5",
    textColor: "#fff",
    spineW: 22,
    h: 215,
    rotZ: 7,
    img: "https://cdn.21st.dev/assets/mirror/c2/c25bd0d5231182a488a7ab2f178b787fed5d36c3544912075b94d4657e78d06c.jpg",
    tag: "Leaning in",
    description:
      "Essays on attention — how we look at images, objects and the everyday spaces we pass through without noticing.",
  },
  {
    title: "The Thinker",
    color: "#1e3550",
    textColor: "#fff",
    spineW: 48,
    h: 285,
    img: "https://cdn.21st.dev/assets/mirror/f2/f269f4df939bd42627fdfb9c2ed273ab8ca96a8ef1f67a3ddb633d7baac2ed76.jpg",
    tag: "Featured: The Thinker",
    description:
      "A visual meditation on ideas in motion, tracing the instruments and sketches that turn thought into form.",
  },
  {
    title: "The Creative Act",
    color: "#e8402f",
    textColor: "#fff",
    spineW: 18,
    h: 240,
    rotZ: -4,
    img: "https://cdn.21st.dev/assets/mirror/2d/2df30dc60d23046c9aacf01637d546fb710061f4c3dce82387ff8f51033a887a.jpg",
    tag: "The Creative Act",
    description:
      "A companion to creative practice, built around presence, curiosity and the discipline of showing up.",
  },
  {
    title: "Teach design",
    color: "#2e61b8",
    textColor: "#fff",
    spineW: 30,
    h: 225,
    img: "https://cdn.21st.dev/assets/mirror/82/824bf3414918c54790f63452ae5ba1d86329b40cb19a6f936594ebbcd5b05382.jpg",
    tag: "How to teach design",
    description:
      "Notes from the studio classroom on teaching design with clarity, generosity and constructive critique.",
  },
  {
    title: "S M L XL",
    color: "#ededea",
    textColor: "#161616",
    spineW: 48,
    h: 260,
    img: "https://cdn.21st.dev/assets/mirror/cd/cd6f4679f2d46dbce92233eb72a0cd6914aed7bdb3f188a6e9f3547f027a46dc.jpg",
    tag: "S, M, L, XL",
    description:
      "A wide-ranging look at scale in architecture and graphics, from intimate details to city-sized systems.",
  },
  {
    title: "Visible Signs",
    color: "#34478f",
    textColor: "#fff",
    spineW: 20,
    h: 240,
    img: "https://cdn.21st.dev/assets/mirror/06/06defc3f0286eedbe5f21b980f2449eb5e18e877af5801721ec9f08db4f599a7.jpg",
    tag: "Visible Signs",
    description:
      "A close reading of the signs around us and the subtle ways they direct, reassure and persuade.",
  },
  {
    title: "Lovell",
    color: "#f0b323",
    textColor: "#161616",
    spineW: 19,
    h: 185,
    img: "https://cdn.21st.dev/assets/mirror/13/1337c2df55b023426b593e0e6dc69cdd2a792a365a603c839bb031696f01c550.jpg",
    tag: "Rotation",
    description:
      "A rotation of posters, identities and experiments collected from a career spent bending the grid.",
  },
  {
    title: "Volume II",
    color: "#2a1d1a",
    textColor: "#fff",
    spineW: 36,
    h: 225,
    img: "https://cdn.21st.dev/assets/mirror/c3/c32758ce3b98179fca69bf1eeaa48389d3f385a01678e0ce2ceccf79b34b4ed2.jpg",
    tag: "Volume II, 5 Books",
    description:
      "Five books bound as one — a compact archive of essays, images and ephemera from the collection.",
  },
  {
    title: "Offprint",
    color: "#ee5a24",
    textColor: "#fff",
    spineW: 20,
    h: 160,
    img: "https://cdn.21st.dev/assets/mirror/f2/f269f4df939bd42627fdfb9c2ed273ab8ca96a8ef1f67a3ddb633d7baac2ed76.jpg",
    tag: "Offprint",
    description:
      "Independent publishing in its most direct form: small runs, sharp ideas and room for chance.",
  },
];

export default function Hero() {
  const [selected, setSelected] = useState<{ index: number; book: ShelfBook } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const openBook = useCallback((index: number, book: CarouselBook) => {
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected({ index, book: book as ShelfBook });
  }, []);

  const closeBook = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => lastFocusedRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!selected) return;

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeBook();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, closeBook]);

  return (
    <>
      <BeamsBackground intensity="medium" />
      <header>
        <div className="topbar">
          <span className="brand">BUKOLA AKINTOMIDE</span>
          <OriginButton>Explore Library</OriginButton>
        </div>
        <h1>My personal library</h1>
      </header>

      <BookCarousel3D
        books={books}
        initialIndex={6}
        onOpenBook={openBook}
        onCloseBook={closeBook}
        openIndex={selected?.index ?? -1}
      />

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeBook();
            }}
          >
            <motion.div
              ref={panelRef}
              className="detail-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="detail-title"
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="detail-close"
                onClick={closeBook}
                aria-label="Close book details"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <div className="detail-book-card">
                <span className="detail-card-label">Open edition</span>
                <div className="detail-book">
                  <span className="detail-book-stack" aria-hidden="true" />
                  <div className="detail-book-spread">
                    <div className="detail-book-cover">
                      <Image
                        src={selected.book.img}
                        alt={`${selected.book.title} cover`}
                        fill
                        unoptimized
                        sizes="(max-width: 700px) 180px, 320px"
                        className="detail-cover-img"
                      />
                      <span className="detail-cover-shine" aria-hidden="true" />
                    </div>
                    <div className="detail-book-sheet">
                      <span className="detail-sheet-eyebrow">{selected.book.tag}</span>
                      <span className="detail-sheet-title">{selected.book.title}</span>
                      <span className="detail-sheet-rule" />
                    </div>
                    <span className="detail-book-gutter" aria-hidden="true" />
                  </div>
                </div>
                <span className="detail-card-foot">From the personal curation</span>
              </div>

              <div className="detail-info-card">
                <span className="detail-kicker">
                  <span className="detail-kicker-dot" aria-hidden="true" />
                  Now viewing
                </span>
                <h2 id="detail-title" className="detail-title">{selected.book.title}</h2>
                <p className="detail-description">{selected.book.description}</p>

                <div className="detail-meta">
                  <span>{selected.book.tag}</span>
                  <span className="detail-meta-divider" aria-hidden="true" />
                  <span>Personal library</span>
                </div>

                <a
                  className="detail-cta"
                  href={`https://books.google.com/books?q=${encodeURIComponent(selected.book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get this book
                  <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 10h11m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <p className="detail-hint">Opens book details and reading options.</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
