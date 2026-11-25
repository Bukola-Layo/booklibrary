"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

export interface CurationBook {
  title: string;
  color: string;
  textColor: string;
  spineW: number;
  h: number;
  rotZ?: number;
  img: string;
}

interface Book3DProps extends CurationBook {
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}

export default function Book3D({
  title,
  color,
  textColor,
  spineW,
  h,
  rotZ = 0,
  img,
  index,
  onEnter,
  onLeave,
}: Book3DProps) {
  const [hovered, setHovered] = useState(false);

  const enter = () => {
    setHovered(true);
    onEnter();
  };

  const leave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <button
      type="button"
      className={`book${hovered ? " active" : ""}`}
      style={{ "--i": index, "--sw": `${spineW}px` } as CSSProperties}
      aria-label={title}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      <span className="bc-book" style={{ height: `${h}px`, transform: `rotateY(${hovered ? 0 : 90}deg) rotateZ(${hovered ? 0 : rotZ}deg)` }}>
        <span className="bc-hinge" style={{ transform: `translateZ(${spineW / 2}px)` }}>
          <span className="bc-face bc-front" style={{ background: color }}>
            <span className="bc-overlay" />
            <Image src={img} alt={`${title} cover`} fill unoptimized sizes="240px" className="bc-cover-img" />
          </span>
          <span className="bc-face bc-inside" />
        </span>

        <span className="bc-face bc-page" style={{ transform: `translateZ(${spineW / 2 - 1}px)` }}>
          <span className="bc-page-inner">
            <span className="bc-page-eyebrow">Selected Work</span>
            <span className="bc-page-title">{title}</span>
            <span className="bc-page-rule" />
          </span>
        </span>

        <span className="bc-face bc-back" style={{ background: color, transform: `rotateY(180deg) translateZ(${spineW / 2}px)` }} />

        <span className="bc-face bc-spine" style={{ width: spineW, left: -spineW / 2, background: color }}>
          <span className="bc-spine-text" style={{ color: textColor }}>
            {title}
          </span>
        </span>

        <span className="bc-face bc-pages bc-pages-right" style={{ width: spineW, left: `calc(var(--cover-w) - ${spineW / 2}px)` }} />
        <span className="bc-face bc-pages bc-pages-top" style={{ height: spineW, top: -spineW / 2 }} />
        <span className="bc-face bc-pages bc-pages-bottom" style={{ height: spineW, bottom: -spineW / 2 }} />
      </span>
    </button>
  );
}
