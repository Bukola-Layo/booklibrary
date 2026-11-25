import type { Illustration, PageContent } from "@/types/book";

interface IllustrationProps {
  kind: Illustration;
  accent: string;
}

function PageIllustration({ kind, accent }: IllustrationProps) {
  if (kind === "none") {
    return (
      <div className="my-3 flex items-center justify-center gap-2 opacity-60">
        <span className="h-px w-10" style={{ background: accent }} />
        <span className="h-[5px] w-[5px] rotate-45" style={{ background: accent }} />
        <span className="h-px w-10" style={{ background: accent }} />
      </div>
    );
  }

  if (kind === "botanical") {
    return (
      <svg viewBox="0 0 180 70" className="my-2 h-[66px] w-full" aria-hidden="true">
        <path d="M90 66 C88 48 90 32 92 10" stroke={accent} strokeWidth="1.2" fill="none" />
        {[18, 32, 46, 58].map((y, i) => (
          <g key={y}>
            <path
              d={`M91 ${y} q ${i % 2 ? 20 : -20} -12 ${i % 2 ? 26 : -26} -22`}
              stroke={accent}
              strokeWidth="1"
              fill="none"
            />
            <ellipse
              cx={91 + (i % 2 ? 17 : -17)}
              cy={y - 15}
              rx="9"
              ry="4"
              transform={`rotate(${i % 2 ? -28 : 28} ${91 + (i % 2 ? 17 : -17)} ${y - 15})`}
              fill={accent}
              opacity="0.35"
            />
          </g>
        ))}
        <circle cx="92" cy="8" r="4" fill={accent} opacity="0.75" />
        <circle cx="84" cy="12" r="3" fill={accent} opacity="0.5" />
        <circle cx="100" cy="13" r="3" fill={accent} opacity="0.5" />
      </svg>
    );
  }

  if (kind === "constellation") {
    const points = [
      [24, 48], [55, 22], [82, 44], [112, 16], [146, 40], [160, 18],
    ];
    return (
      <svg viewBox="0 0 180 70" className="my-2 h-[66px] w-full" aria-hidden="true">
        <polyline
          points={points.map((p) => p.join(",")).join(" ")}
          stroke={accent}
          strokeWidth="0.9"
          fill="none"
          opacity="0.7"
        />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 2.4 : 1.7} fill={accent} />
        ))}
        <circle cx="128" cy="55" r="1.3" fill={accent} opacity="0.5" />
        <circle cx="38" cy="18" r="1.3" fill={accent} opacity="0.5" />
      </svg>
    );
  }

  if (kind === "diagram") {
    return (
      <svg viewBox="0 0 180 70" className="my-2 h-[66px] w-full" aria-hidden="true">
        <rect x="20" y="8" width="44" height="54" fill="none" stroke={accent} strokeWidth="1" />
        <path d="M64 8 L64 62" stroke={accent} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M64 35 L138 12 M64 35 L138 58" stroke={accent} strokeWidth="0.9" fill="none" />
        <path d="M64 35 a20 20 0 0 0 8 -14" stroke={accent} strokeWidth="0.8" fill="none" />
        <path d="M64 35 a20 20 0 0 1 8 14" stroke={accent} strokeWidth="0.8" fill="none" />
        <circle cx="64" cy="35" r="2.5" fill={accent} />
        <path d="M138 12 V58" stroke={accent} strokeWidth="1" />
        <text x="146" y="39" fontSize="8" fill={accent} opacity="0.8">N</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 70" className="my-2 h-[66px] w-full" aria-hidden="true">
      <circle cx="140" cy="20" r="10" fill="#F2C56B" />
      <path d="M12 56 q 20 -14 40 0 t 40 0 t 40 0 t 40 0" stroke="#6C9BB5" strokeWidth="2" fill="none" />
      <path d="M56 44 q 12 -16 28 0 q -6 10 -18 10 q -10 0 -10 -10Z" fill="#E8A87C" />
      <path d="M84 44 l 10 -6 v 12 Z" fill="#E8A87C" />
      <circle cx="66" cy="42" r="1.5" fill="#3B2A1C" />
      <path d="M22 14 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" fill="#F2C56B" />
      <path d="M104 12 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5Z" fill="#F2C56B" />
    </svg>
  );
}

interface BookPageProps {
  content: PageContent;
  side: "left" | "right";
  accent: string;
}

export default function BookPage({ content, side, accent }: BookPageProps) {
  const isLeft = side === "left";

  return (
    <div
      className={`relative flex h-full w-full flex-col px-8 pb-7 pt-8 text-espresso ${
        isLeft ? "page-left" : "page-right"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[8px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>
          {content.eyebrow}
        </span>
        <span className="text-[8px] tracking-[0.16em] text-espresso/35">
          BookNook
        </span>
      </div>

      <h3 className="mt-4 font-display text-[24px] leading-[1.1] tracking-[-0.01em]">{content.heading}</h3>
      <div className="mt-3 h-px w-8" style={{ background: accent, opacity: 0.7 }} />

      <PageIllustration kind={content.illustration} accent={accent} />

      <div className="reading-column flex-1 space-y-2.5 overflow-hidden">
        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-[11.5px] leading-[1.72] tracking-[0.005em] text-espresso/85"
            style={{ textAlign: "justify", hyphens: "auto" }}
          >
            {index === 0 && content.dropCap ? (
              <>
                <span
                  className="float-left mr-1.5 mt-[-3px] font-display text-[38px] leading-[0.82]"
                  style={{ color: accent }}
                >
                  {paragraph.charAt(0)}
                </span>
                {paragraph.slice(1)}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}

        {content.pullQuote ? (
          <p className="pt-1 font-reading text-[13px] italic leading-[1.5] text-espresso/70">
            “{content.pullQuote}”
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-center">
        <span className="text-[10px] font-reading text-espresso/45">{content.pageNumber}</span>
      </div>
    </div>
  );
}
