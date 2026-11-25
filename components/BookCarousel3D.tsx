"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./BookCarousel3D.module.css";

export interface CarouselBook {
  title: string;
  color: string;
  textColor: string;
  spineW: number;
  h: number;
  rotZ?: number;
  img: string;
  isMain?: boolean;
}

interface BookCarousel3DProps {
  books: CarouselBook[];
  initialIndex?: number;
  onOpenBook?: (index: number, book: CarouselBook) => void;
  onCloseBook?: () => void;
  openIndex?: number;
}

const OPEN_W = 240;
const GAP = 80;

const smoothstep = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function BookCarousel3D({
  books,
  initialIndex = 0,
  onOpenBook,
  onCloseBook,
  openIndex = -1,
}: BookCarousel3DProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const [activeTitle, setActiveTitle] = useState(books[initialIndex]?.title ?? "");
  const [reading, setReading] = useState(false);
  const titleRef = useRef(activeTitle);

  const state = useRef({
    target: initialIndex,
    current: initialIndex,
    dragging: false,
    startX: 0,
    scrollStart: 0,
    opened: -1,
    openness: new Array<number>(books.length).fill(0),
  });

  useEffect(() => {
    const spineWidths = books.map((b) => b.spineW || 40);
    const rotZs = books.map((b) => b.rotZ || 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const follow = reduceMotion ? 1 : 0.08;
    const openFollow = reduceMotion ? 1 : 0.06;

    function step() {
      const s = state.current;
      s.current += (s.target - s.current) * follow;

      const positions: number[] = [];
      let left = 0;
      for (let i = 0; i < books.length; i++) {
        positions[i] = left;
        const openness = Math.max(0, 1 - Math.abs(i - s.current));
        const eo = smoothstep(openness);
        const w = spineWidths[i] + eo * (OPEN_W - spineWidths[i]);
        left += w + GAP;
      }

      const getCenter = (i: number, prog: number) => {
        const openness = Math.max(0, 1 - Math.abs(i - prog));
        const eo = smoothstep(openness);
        const w = spineWidths[i] + eo * (OPEN_W - spineWidths[i]);
        return positions[i] + w / 2;
      };

      const prev = Math.floor(s.current);
      const next = prev + 1;
      const frac = s.current - prev;
      const c1 = getCenter(prev, s.current);
      const c2 = next < books.length ? getCenter(next, s.current) : c1;
      const cameraX = c1 * (1 - frac) + c2 * frac;

      const activeIndex = Math.max(0, Math.min(books.length - 1, Math.round(s.current)));
      if (books[activeIndex].title !== titleRef.current) {
        titleRef.current = books[activeIndex].title;
        setActiveTitle(titleRef.current);
      }

      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = i - s.current;
        const openness = Math.max(0, 1 - Math.abs(diff));
        const eo = smoothstep(openness);

        let x = positions[i] - cameraX + (1 - eo) * (spineWidths[i] / 2);
        let z = eo * 60;
        let y = 0;
        const rotateY = (1 - eo) * 90;
        const zIndex = Math.round(100 - Math.abs(diff) * 10);
        const scale = 1 + eo * 0.05;
        const rotZ = rotZs[i] * (1 - eo);

        const target = s.opened === i ? 1 : 0;
        s.openness[i] += (target - s.openness[i]) * openFollow;
        const cOpen = s.openness[i];

        const easeRise = smoothstep(Math.min(1, cOpen * 2));
        const easeSwing = smoothstep(Math.max(0, (cOpen - 0.5) * 2));

        x += easeSwing * (OPEN_W / 2);
        z += easeRise * 150;
        y += easeRise * -120;

        el.style.zIndex = String(zIndex);
        el.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(${z}px) scale(${scale}) rotateZ(${rotZ}deg)`;

        const book = el.querySelector<HTMLElement>('[data-part="book"]');
        if (book) book.style.transform = `rotateY(${rotateY}deg)`;

        const hinge = el.querySelector<HTMLElement>('[data-part="hinge"]');
        if (hinge) hinge.style.transform = `translateZ(${spineWidths[i] / 2}px) rotateY(${easeSwing * -140}deg)`;

        const spine = el.querySelector<HTMLElement>('[data-part="spine"]');
        if (spine) spine.style.filter = `brightness(${0.6 + eo * 0.4})`;
      });

      if (progressRef.current) {
        progressRef.current.style.width = `${(s.current / (books.length - 1)) * 100}%`;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    const clamp = (v: number) => Math.max(0, Math.min(v, books.length - 1));
    const onWheel = (e: WheelEvent) => {
      if (state.current.opened !== -1) return;
      state.current.target = clamp(state.current.target + Math.sign(e.deltaY) * 0.3);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (state.current.opened !== -1) return;
      state.current.dragging = true;
      state.current.startX = e.clientX;
      state.current.scrollStart = state.current.target;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!state.current.dragging || state.current.opened !== -1) return;
      state.current.target = clamp(state.current.scrollStart + (e.clientX - state.current.startX) * -0.01);
    };
    const onMouseUp = () => {
      state.current.dragging = false;
    };
    const onTouchStart = (e: TouchEvent) => {
      if (state.current.opened !== -1) return;
      state.current.dragging = true;
      state.current.startX = e.touches[0].clientX;
      state.current.scrollStart = state.current.target;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!state.current.dragging || state.current.opened !== -1) return;
      state.current.target = clamp(state.current.scrollStart + (e.touches[0].clientX - state.current.startX) * -0.01);
    };
    const onTouchEnd = () => {
      state.current.dragging = false;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [books]);

  useEffect(() => {
    if (openIndex === -1 && state.current.opened !== -1) {
      state.current.opened = -1;
      setReading(false);
    }
  }, [openIndex]);

  function closeReading() {
    if (state.current.opened === -1) return;
    state.current.opened = -1;
    setReading(false);
    onCloseBook?.();
  }

  function handleClick(i: number) {
    const s = state.current;
    if (s.opened === i) {
      closeReading();
      return;
    }

    s.target = i;
    s.opened = i;
    setReading(true);
    onOpenBook?.(i, books[i]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, i: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(i);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      state.current.target = Math.min(books.length - 1, i + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      state.current.target = Math.max(0, i - 1);
    } else if (event.key === "Escape" && state.current.opened !== -1) {
      closeReading();
    }
  }

  return (
    <div className={styles.root}>
      <div className={`${styles.header} ${reading ? styles.hidden : ""}`}>
        <h2 className={styles.title}>{activeTitle}</h2>
      </div>

      <div className={styles.scene}>
        <div className={styles.track}>
          {books.map((b, i) => {
            const sW = b.spineW || 40;
            return (
              <div
                key={`${b.title}-${i}`}
                ref={(el) => {
                  wrapperRefs.current[i] = el;
                }}
                className={styles.wrapper}
                role="button"
                tabIndex={0}
                aria-label={`Open ${b.title}`}
                aria-pressed={reading && state.current.opened === i}
                onClick={() => handleClick(i)}
                onKeyDown={(event) => handleKeyDown(event, i)}
              >
                <div data-part="book" className={styles.book} style={{ height: `${b.h}px` }}>
                  <div
                    data-part="hinge"
                    className={`${styles.face} ${styles.hinge}`}
                    style={{ transform: `translateZ(${sW / 2}px)` }}
                  >
                    <div className={`${styles.face} ${styles.front}`} style={{ width: OPEN_W, background: b.color }}>
                      <div className={styles.overlay} />
                      <Image
                        src={b.img}
                        alt={`${b.title} cover`}
                        fill
                        unoptimized
                        sizes="240px"
                        className={styles.coverImg}
                      />
                    </div>
                    <div className={`${styles.face} ${styles.inside}`} style={{ width: OPEN_W }} />
                  </div>

                  <div
                    className={`${styles.face} ${styles.page}`}
                    style={{ transform: `translateZ(${sW / 2 - 1}px)` }}
                  >
                    <div className={styles.pageInner}>
                      <div className={styles.pageEyebrow}>Selected Work</div>
                      <h3 className={styles.pageTitle}>{b.title}</h3>
                      <div className={styles.pageRule} />
                    </div>
                  </div>

                  <div
                    className={`${styles.face} ${styles.back}`}
                    style={{ width: OPEN_W, background: b.color, transform: `rotateY(180deg) translateZ(${sW / 2}px)` }}
                  />

                  <div
                    data-part="spine"
                    className={`${styles.face} ${styles.spine}`}
                    style={{ width: sW, left: -sW / 2, background: b.isMain ? "#121830" : b.color }}
                  >
                    <div className={styles.spineText} style={{ color: b.textColor }}>
                      {b.title}
                    </div>
                  </div>

                  <div
                    className={`${styles.face} ${styles.pages} ${styles.pagesRight}`}
                    style={{ width: sW, left: OPEN_W - sW / 2 }}
                  />
                  <div
                    className={`${styles.face} ${styles.pages} ${styles.pagesTop}`}
                    style={{ height: sW, top: -sW / 2 }}
                  />
                  <div
                    className={`${styles.face} ${styles.pages} ${styles.pagesBottom}`}
                    style={{ height: sW, bottom: -sW / 2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <div ref={progressRef} className={styles.progressBar} />
      </div>

      <button
        type="button"
        className={`${styles.close} ${reading ? styles.visible : ""}`}
        onClick={closeReading}
        aria-label="Close book"
      >
        <span className={styles.closeWrap} aria-hidden="true">
          <span className={`${styles.line} ${styles.line1}`} />
          <span className={`${styles.line} ${styles.line2}`} />
        </span>
      </button>
    </div>
  );
}
