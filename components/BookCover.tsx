import type { BookCoverStyle, Motif } from "@/types/book";

interface CoverMotifProps {
  motif: Motif;
  accent: string;
}

function CoverMotif({ motif, accent }: CoverMotifProps) {
  const common = { stroke: accent, fill: "none", strokeWidth: 1.4, strokeLinecap: "round" as const };

  if (motif === "sun") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="20" {...common} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 27}
              y1={50 + Math.sin(a) * 27}
              x2={50 + Math.cos(a) * 34}
              y2={50 + Math.sin(a) * 34}
              {...common}
            />
          );
        })}
      </svg>
    );
  }

  if (motif === "moon") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <path d="M62 20a34 34 0 1 0 18 56A30 30 0 0 1 62 20Z" {...common} />
        <circle cx="68" cy="34" r="2" fill={accent} />
        <circle cx="76" cy="48" r="1.5" fill={accent} />
      </svg>
    );
  }

  if (motif === "waves") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M8 ${30 + i * 14} q 14 -10 28 0 t 28 0 t 28 0`} {...common} />
        ))}
      </svg>
    );
  }

  if (motif === "flower") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <ellipse
              key={i}
              cx={50 + Math.cos(a) * 15}
              cy={50 + Math.sin(a) * 15}
              rx="9"
              ry="15"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${50 + Math.cos(a) * 15} ${50 + Math.sin(a) * 15})`}
              {...common}
            />
          );
        })}
        <circle cx="50" cy="50" r="7" {...common} />
      </svg>
    );
  }

  if (motif === "lines") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        {[20, 32, 44, 56, 68, 80].map((x, i) => (
          <line key={x} x1={x} y1={i % 2 ? 18 : 26} x2={x} y2={i % 2 ? 82 : 74} {...common} />
        ))}
        <path d="M14 50 h72" stroke={accent} strokeWidth="0.6" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <path d="M22 84 V46 a28 28 0 0 1 56 0 V84" {...common} />
      <path d="M34 84 V48 a16 16 0 0 1 32 0 V84" {...common} opacity="0.6" />
      <circle cx="50" cy="44" r="4" fill={accent} />
    </svg>
  );
}

interface BookCoverProps {
  cover: BookCoverStyle;
  title: string;
  author: string;
  variant?: "front" | "spine";
  className?: string;
}

export default function BookCover({
  cover,
  title,
  author,
  variant = "front",
  className = "",
}: BookCoverProps) {
  if (variant === "spine") {
    return (
      <div
        className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 18%, rgba(255,255,255,0.06) 52%, rgba(0,0,0,0.32) 100%), ${cover.background}`,
          color: cover.text,
        }}
      >
        <span className="absolute inset-x-[3px] top-[6px] h-px opacity-60" style={{ background: cover.accent }} />
        <span className="absolute inset-x-[3px] bottom-[6px] h-px opacity-60" style={{ background: cover.accent }} />
        <span
          className="mt-5 max-h-[62%] text-[11px] font-semibold leading-tight tracking-[0.18em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {title}
        </span>
        <span
          className="mb-4 text-[8px] tracking-[0.16em] uppercase opacity-80"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {author}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden p-7 ${className}`}
      style={{
        background: `linear-gradient(115deg, rgba(255,255,255,0.09), rgba(0,0,0,0.22) 72%), ${cover.background}`,
        color: cover.text,
      }}
    >
      <div className="absolute inset-3 border opacity-40" style={{ borderColor: cover.accent }} />
      <div className="absolute inset-0 opacity-25">
        <div className="absolute right-4 top-10 h-24 w-24">
          <CoverMotif motif={cover.motif} accent={cover.accent} />
        </div>
      </div>
      <div className="relative">
        <p className="text-[9px] tracking-[0.32em] uppercase opacity-70">BookNook Editions</p>
      </div>
      <div className="relative">
        <h2 className="font-display text-[26px] leading-[1.08]">{title}</h2>
        <div className="my-3 h-px w-9" style={{ background: cover.accent }} />
        <p className="text-[11px] tracking-[0.22em] uppercase opacity-85">{author}</p>
      </div>
    </div>
  );
}
