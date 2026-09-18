"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { SITE } from "@/lib/content";
import {
  clamp01,
  easeIn,
  easeOut,
  lerp,
  pad2,
  useInView,
  useReducedMotion,
  useScrollProgress,
} from "@/lib/hooks";

type PhraseKind = "blast" | "flip3d" | "glitch";

type Phrase = {
  kind: PhraseKind;
  start: number;
  end: number;
  /** Parole della frase; `accent` colora la parola in oro. */
  words: { text: string; accent?: boolean }[];
};

type LetterSlot = { char: string; index: number };
type WordSlot = { accent: boolean; letters: LetterSlot[] };

const PHRASES: Phrase[] = [
  {
    kind: "blast",
    start: 0.34,
    end: 0.55,
    words: [{ text: "Mantecato" }, { text: "a" }, { text: "freddo" }],
  },
  {
    kind: "flip3d",
    start: 0.55,
    end: 0.73,
    words: [{ text: "Solo" }, { text: "ingredienti" }, { text: "veri", accent: true }],
  },
  {
    kind: "glitch",
    start: 0.73,
    end: 0.88,
    words: [{ text: "Zero" }, { text: "conservanti" }],
  },
];

/** Ogni frase viene pre-spezzata: ogni lettera conosce il proprio
 *  indice nella frase, così lo stagger non dipende dall'ordine di
 *  esecuzione dei ref callback. */
const PHRASE_WORDS: WordSlot[][] = PHRASES.map((phrase) => {
  let index = 0;
  return phrase.words.map((word) => ({
    accent: Boolean(word.accent),
    letters: Array.from(word.text).map((char) => ({ char, index: index++ })),
  }));
});

const LETTER_COUNTS = PHRASE_WORDS.map((words) =>
  words.reduce((sum, word) => sum + word.letters.length, 0),
);

/**
 * "Lo spot" — un cortometraggio guidato dallo scroll.
 *
 *  1. Le barre cinema si aprono, timecode e REC in sovraimpressione.
 *  2. La parola GELATO è una finestra sul video (maschera SVG) che
 *     cresce e si dissolve rivelando la scena intera.
 *  3. Tre frasi entrano con animazioni diverse: esplosione con
 *     motion-blur, ribaltamento 3D, glitch con separazione RGB.
 *  4. Finale oro con la call to action, mentre le barre si richiudono.
 */
export function CinematicSpot() {
  const rootRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<SVGGElement>(null);
  const darkRef = useRef<SVGRectElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[][]>(PHRASES.map(() => []));

  const videoRef = useRef<HTMLVideoElement>(null);

  const reduced = useReducedMotion();
  const inView = useInView(rootRef, { threshold: 0 });

  /* Lo spot pesa qualche MB: lo carichiamo e lo mettiamo in play solo
     quando la sezione entra in campo, e lo fermiamo quando esce. */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* autoplay negato: resta il poster */
            });
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "25% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  /* Una lettera, secondo il tipo di animazione della frase. */
  const applyLetter = useCallback(
    (kind: PhraseKind, el: HTMLSpanElement, enter: number, exit: number) => {
      const d = 1 - enter; // quanto manca all'ingresso
      const opacity = enter * (1 - exit);
      let transform: string;
      let blur = 0;

      switch (kind) {
        case "blast": {
          const ty = d * 155 - exit * 120;
          const scale = (0.5 + enter * 0.5) * (1 - exit * 0.2);
          transform = `translate3d(0,${ty}%,0) rotateX(${d * 70}deg) scale(${scale})`;
          blur = d * 15 + exit * 6;
          break;
        }
        case "flip3d": {
          const rx = -115 * d + 115 * exit;
          transform = `perspective(800px) translate3d(0,${d * 22}%,0) rotateX(${rx}deg)`;
          blur = d * 4;
          break;
        }
        case "glitch": {
          const jx = d > 0.002 ? (Math.random() * 2 - 1) * d * 18 : 0;
          const jy = d > 0.002 ? (Math.random() * 2 - 1) * d * 9 : 0;
          const skew = (Math.random() * 2 - 1) * d * 9;
          transform = `translate3d(${jx - exit * 55}px,${jy}px,0) skewX(${skew}deg) scale(${1 - exit * 0.3})`;
          const off = d * 7;
          el.style.textShadow =
            off > 0.2
              ? `${off.toFixed(1)}px 0 rgb(255 77 109 / 0.9), ${(-off).toFixed(1)}px 0 rgb(61 224 255 / 0.9)`
              : "none";
          break;
        }
      }

      el.style.transform = transform;
      el.style.opacity = String(opacity);
      el.style.filter = blur > 0.06 ? `blur(${blur.toFixed(2)}px)` : "none";
    },
    [],
  );

  const onProgress = useCallback(
    (p: number) => {
      /* Video: parallax + zoom dolce */
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0,${p * -4}%,0) scale(${1.04 + p * 0.08})`;
      }

      /* Barre cinema: si aprono all'inizio, si richiudono nel finale */
      const open = lerp(46, 7, easeOut(clamp01(p / 0.12)));
      const close = lerp(0, 9, easeIn(clamp01((p - 0.88) / 0.12)));
      const barHeight = `${open + close}%`;
      if (barTopRef.current) barTopRef.current.style.height = barHeight;
      if (barBottomRef.current) barBottomRef.current.style.height = barHeight;

      /* Finestra-parola GELATO */
      const wordScale = lerp(0.82, 2.9, easeOut(clamp01((p - 0.04) / 0.24)));
      if (wordRef.current) {
        wordRef.current.setAttribute(
          "transform",
          `translate(640 360) scale(${wordScale.toFixed(3)}) translate(-640 -360)`,
        );
      }
      const maskOpacity =
        p < 0.04
          ? easeOut(clamp01(p / 0.04))
          : p < 0.22
            ? 1
            : 1 - easeIn(clamp01((p - 0.22) / 0.12));
      if (darkRef.current) {
        darkRef.current.style.opacity = String(clamp01(maskOpacity));
      }

      /* Parentesi di fuoco, visibili durante la fase della parola */
      if (focusRef.current) {
        focusRef.current.style.opacity = p > 0.05 && p < 0.32 ? "0.6" : "0";
      }

      /* Frasi */
      PHRASES.forEach((phrase, i) => {
        const container = phraseRefs.current[i];
        if (!container) return;

        const inRange = p >= phrase.start - 0.03 && p <= phrase.end + 0.03;
        container.style.visibility = inRange ? "visible" : "hidden";
        if (!inRange) return;

        const local = clamp01((p - phrase.start) / (phrase.end - phrase.start));
        const exit = easeIn(clamp01((local - 0.74) / 0.26));
        const letters = letterRefs.current[i];
        const count = LETTER_COUNTS[i];

        letters.forEach((letter, index) => {
          if (!letter) return;
          const stagger = (index / count) * 0.32;
          const enter = easeOut(clamp01((local - stagger) / 0.42));
          applyLetter(phrase.kind, letter, enter, exit);
        });
      });

      /* Finale */
      if (finalRef.current) {
        const localFinal = clamp01((p - 0.86) / 0.14);
        if (localFinal <= 0) {
          finalRef.current.style.visibility = "hidden";
          finalRef.current.style.opacity = "0";
        } else {
          const enter = easeOut(clamp01(localFinal / 0.55));
          finalRef.current.style.visibility = "visible";
          finalRef.current.style.opacity = String(enter);
          finalRef.current.style.transform = `translate(-50%,-50%) scale(${0.72 + enter * 0.28})`;
        }
      }

      /* Timecode */
      if (timecodeRef.current) {
        const t = p * 18;
        timecodeRef.current.textContent = `00:00:${pad2(t)}:${pad2((t - Math.floor(t)) * 25)}`;
      }

      if (progressRef.current) {
        progressRef.current.style.width = `${p * 100}%`;
      }
    },
    [applyLetter],
  );

  useScrollProgress(wrapRef, onProgress, { smoothing: 0.1, enabled: !reduced });

  return (
    <section
      ref={rootRef}
      className="relative isolate w-full overflow-clip bg-bg-deep text-[#f7f4ee]"
    >
      <div ref={wrapRef} className={reduced ? "relative z-[1]" : "relative z-[1] h-[640vh]"}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* ---------- Video ---------- */}
          <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
            <video
              ref={videoRef}
              className="absolute -inset-[4%] h-[108%] w-[108%] object-cover [filter:saturate(1.1)_contrast(1.06)]"
              muted
              loop
              playsInline
              preload="none"
              poster="/video/spot-poster.webp"
            >
              <source src="/video/spot.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(125%_95%_at_50%_50%,transparent_28%,rgb(0_0_0/0.62)_100%),linear-gradient(180deg,rgb(5_5_6/0.5)_0%,rgb(5_5_6/0.12)_38%,rgb(5_5_6/0.6)_100%)]" />
            <div className="pointer-events-none absolute -inset-1/2 z-[3] animate-[grain-shift_550ms_steps(2)_infinite] grain opacity-[0.06]" />
          </div>

          {/* ---------- Finestra-parola sul video ---------- */}
          {!reduced && (
            <svg
              className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
              viewBox="0 0 1280 720"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <defs>
                <mask id="cine-hole" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="720">
                  <rect width="1280" height="720" fill="#fff" />
                  <g ref={wordRef}>
                    <text
                      x="640"
                      y="360"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-cinzel), Georgia, serif"
                      fontWeight="800"
                      fontSize="250"
                      letterSpacing="6"
                      fill="#000"
                    >
                      GELATO
                    </text>
                  </g>
                </mask>
              </defs>
              <rect ref={darkRef} width="1280" height="720" fill="#050506" mask="url(#cine-hole)" />
            </svg>
          )}

          {/* ---------- Barre cinema ---------- */}
          <div
            ref={barTopRef}
            className="pointer-events-none absolute inset-x-0 top-0 z-[8] h-[46%] bg-[#040405] shadow-[0_0_60px_rgb(0_0_0/0.6)] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--color-line),transparent)] after:content-['']"
          />
          <div
            ref={barBottomRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[46%] bg-[#040405] shadow-[0_0_60px_rgb(0_0_0/0.6)] after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--color-line),transparent)] after:content-['']"
          />

          {/* ---------- Parentesi di fuoco ---------- */}
          <div
            ref={focusRef}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[6] h-[min(34vh,220px)] w-[min(48vw,360px)] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 ease-brand"
          >
            <span className="absolute left-0 top-0 h-[22px] w-[22px] border-l-2 border-t-2 border-accent" />
            <span className="absolute right-0 top-0 h-[22px] w-[22px] border-r-2 border-t-2 border-accent" />
            <span className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b-2 border-l-2 border-accent" />
            <span className="absolute bottom-0 right-0 h-[22px] w-[22px] border-b-2 border-r-2 border-accent" />
          </div>

          {/* ---------- HUD della macchina da presa ---------- */}
          <div className="pointer-events-none absolute inset-0 z-[9] text-[12px] uppercase tracking-[0.24em]">
            <div className="absolute left-pad top-[clamp(58px,11vh,108px)] flex items-center gap-2.5">
              <b className="h-2.5 w-2.5 animate-[blink_1.2s_infinite] rounded-full bg-[#ff3b30] shadow-[0_0_12px_#ff3b30]" />
              Rec · On Air
            </div>
            <div
              ref={timecodeRef}
              className="absolute right-pad top-[clamp(58px,11vh,108px)] tabular-nums tracking-[0.18em] text-accent"
            >
              00:00:00:00
            </div>
            <div className="absolute bottom-[clamp(58px,11vh,108px)] left-pad text-[11px] tracking-[0.22em] text-muted">
              {SITE.name} · Spot 4K
            </div>
            <div className="absolute bottom-[clamp(58px,11vh,108px)] right-pad text-[11px] tracking-[0.22em] text-muted">
              Take 01 · 25 fps
            </div>

            {/* Mirini agli angoli */}
            <span className="absolute left-[calc(clamp(20px,4vw,64px)-6px)] top-[clamp(54px,10.5vh,104px)] h-[34px] w-[34px] border-l-2 border-t-2 border-[#f7f4ee] opacity-55 max-[720px]:hidden" />
            <span className="absolute right-[calc(clamp(20px,4vw,64px)-6px)] top-[clamp(54px,10.5vh,104px)] h-[34px] w-[34px] border-r-2 border-t-2 border-[#f7f4ee] opacity-55 max-[720px]:hidden" />
            <span className="absolute bottom-[clamp(54px,10.5vh,104px)] left-[calc(clamp(20px,4vw,64px)-6px)] h-[34px] w-[34px] border-b-2 border-l-2 border-[#f7f4ee] opacity-55 max-[720px]:hidden" />
            <span className="absolute bottom-[clamp(54px,10.5vh,104px)] right-[calc(clamp(20px,4vw,64px)-6px)] h-[34px] w-[34px] border-b-2 border-r-2 border-[#f7f4ee] opacity-55 max-[720px]:hidden" />
          </div>

          {/* ---------- Frasi ---------- */}
          {!reduced && (
            <div className="absolute inset-0 z-[6] flex items-center justify-center">
              {PHRASES.map((phrase, phraseIndex) => (
                <div
                  key={phrase.kind}
                  ref={(el) => {
                    phraseRefs.current[phraseIndex] = el;
                  }}
                  className="pointer-events-none invisible absolute left-1/2 top-1/2 w-[94%] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 text-center"
                >
                  <span className="block text-[clamp(2.3rem,11vw,8.2rem)] font-bold leading-[0.95] tracking-[-0.01em] [text-shadow:0_12px_60px_rgb(0_0_0/0.5)] max-[720px]:leading-none">
                    {PHRASE_WORDS[phraseIndex].map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={[
                          "inline-block",
                          wordIndex > 0 ? "ml-[0.34em]" : "",
                          word.accent ? "text-accent" : "",
                        ].join(" ")}
                      >
                        {word.letters.map((letter) => (
                          <span
                            key={letter.index}
                            ref={(el) => {
                              letterRefs.current[phraseIndex][letter.index] = el;
                            }}
                            className="inline-block origin-center [backface-visibility:hidden] will-change-[transform,opacity,filter]"
                          >
                            {letter.char}
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ---------- Finale ---------- */}
          <div
            ref={finalRef}
            style={reduced ? undefined : { transform: "translate(-50%,-50%) scale(0.72)", opacity: 0 }}
            className={[
              "z-[7] w-[94%] max-w-[1180px] text-center",
              reduced
                ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                : "invisible absolute left-1/2 top-1/2",
            ].join(" ")}
          >
            <span className="block font-display text-[clamp(2.3rem,11vw,8.2rem)] font-extrabold leading-[0.95] tracking-[0.04em] text-shine drop-shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_42%,transparent)]">
              {SITE.name}
            </span>
            <span className="mt-[0.55em] block text-[clamp(0.95rem,2.8vw,1.7rem)] font-semibold uppercase tracking-[0.28em] text-accent">
              {SITE.tagline}
            </span>
            <div>
              <Link
                href="/#contatti"
                className="pointer-events-auto mt-[clamp(22px,4vh,40px)] inline-flex items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_60%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] px-[30px] py-[15px] text-[14px] font-semibold uppercase tracking-[0.12em] text-[#f7f4ee] no-underline transition-[box-shadow,transform,translate,scale,rotate,background] duration-[400ms] ease-brand hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] hover:shadow-[0_14px_40px_color-mix(in_srgb,var(--color-accent)_28%,transparent)]"
              >
                <b className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                Vieni a provarlo
              </Link>
            </div>
          </div>

          {!reduced && (
            <>
              <div
                data-inview={inView}
                className="absolute bottom-[clamp(80px,14vh,140px)] left-1/2 z-[9] -translate-x-1/2 text-[11px] uppercase tracking-[0.24em] text-muted opacity-0 transition-opacity duration-[600ms] ease-brand data-[inview=true]:opacity-100"
              >
                Scorri per girare lo spot
              </div>
              <div className="absolute bottom-[clamp(34px,6vh,56px)] left-pad right-pad z-[9] h-[2px] overflow-hidden rounded-sm bg-line">
                <span
                  ref={progressRef}
                  className="block h-full w-0 bg-[linear-gradient(90deg,var(--color-accent),var(--color-glow-a))] shadow-[0_0_14px_var(--color-accent)]"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
