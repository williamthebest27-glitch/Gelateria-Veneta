"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { SplitText } from "@/components/SplitText";
import { SHOWCASE } from "@/lib/content";
import { useInView, useReducedMotion, useScrollProgress } from "@/lib/hooks";

type Measures = {
  maxX: number;
  viewport: number;
  cards: { left: number; width: number }[];
};

/**
 * "I nostri gusti" — la sezione resta pinnata e le card scorrono in
 * orizzontale seguendo lo scroll verticale. Card e foto ruotano in base
 * alla distanza dal centro dello schermo.
 *
 * Con `prefers-reduced-motion` diventa un carosello a scorrimento
 * manuale con snap, senza pin.
 */
export function FlavorShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const photoRefs = useRef<(HTMLElement | null)[]>([]);
  const measures = useRef<Measures>({ maxX: 0, viewport: 0, cards: [] });

  const reduced = useReducedMotion();
  const inView = useInView(rootRef, { threshold: 0.12 });

  /* Misure precalcolate: nessuna lettura del layout dentro il rAF. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    measures.current = {
      viewport: window.innerWidth,
      maxX: Math.max(0, track.scrollWidth - window.innerWidth),
      cards: cardRefs.current.map((c) => ({
        left: c?.offsetLeft ?? 0,
        width: c?.offsetWidth ?? 0,
      })),
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [measure, reduced]);

  const onProgress = useCallback(
    (p: number) => {
      const { maxX, viewport, cards } = measures.current;
      const x = maxX * p;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-x}px,0,0)`;
      }
      if (progressRef.current) {
        progressRef.current.style.width = `${maxX ? (x / maxX) * 100 : 0}%`;
      }

      const center = viewport / 2;
      let active = 0;
      let best = Infinity;

      for (let i = 0; i < cards.length; i += 1) {
        const cardCenter = cards[i].left + cards[i].width / 2 - x;
        const d = (cardCenter - center) / (viewport || 1);
        const dd = Math.max(-1, Math.min(1, d));

        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = `rotate(${dd * 9}deg) translateY(${Math.abs(d) * 22}px)`;
        }
        const photo = photoRefs.current[i];
        if (photo) {
          photo.style.transform = `rotate(${-d * 16}deg) scale(${1 - Math.abs(d) * 0.12})`;
        }

        const distance = Math.abs(cardCenter - center);
        if (distance < best) {
          best = distance;
          active = i;
        }
      }

      if (counterRef.current) {
        counterRef.current.textContent = String(active + 1).padStart(2, "0");
      }
    },
    [],
  );

  useScrollProgress(wrapRef, onProgress, { smoothing: 0.12, enabled: !reduced });

  return (
    <section
      id="gusti"
      ref={rootRef}
      data-ready={inView}
      className="relative isolate w-full bg-bg text-ink before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(50%_40%_at_15%_20%,color-mix(in_srgb,var(--color-glow-a)_18%,transparent),transparent_70%),radial-gradient(50%_40%_at_85%_80%,color-mix(in_srgb,var(--color-glow-b)_16%,transparent),transparent_70%)] before:content-[''] max-[900px]:before:hidden"
    >
      <div
        ref={wrapRef}
        className={reduced ? "relative z-[1]" : "relative z-[1] h-[360vh]"}
      >
        <div
          className={
            reduced
              ? "flex flex-col justify-center py-[120px]"
              : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
          }
        >
          {/* ---------- Intestazione ---------- */}
          <div
            className={[
              "z-[5] flex items-end justify-between gap-5",
              reduced
                ? "px-pad pb-10 max-[640px]:flex-col max-[640px]:items-start"
                : "pointer-events-none absolute left-pad right-pad top-[clamp(26px,5vh,60px)] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2",
            ].join(" ")}
          >
            <div>
              <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-[0.28em] text-accent">
                <span
                  data-ready={inView}
                  className="h-px w-0 bg-accent transition-[width] duration-[800ms] ease-brand [transition-delay:0.15s] data-[ready=true]:w-[26px]"
                />
                <span
                  data-ready={inView}
                  className="inline-block translate-y-2 opacity-0 transition-[opacity,transform] duration-700 ease-brand [transition-delay:0.1s] data-[ready=true]:translate-y-0 data-[ready=true]:opacity-100"
                >
                  Carta dei gusti
                </span>
              </div>

              <h2 className="pointer-events-auto mt-1.5 text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-none tracking-[-0.03em] [perspective:700px]">
                <SplitText text="I nostri " charClassName="char-flip" />
                <em
                  data-ready={inView}
                  className="inline-block translate-y-[0.18em] scale-[0.92] font-serif font-normal italic opacity-0 text-shine drop-shadow-[0_0_26px_color-mix(in_srgb,var(--color-glow-b)_32%,transparent)] transition-[opacity,transform] duration-[900ms] [transition-timing-function:var(--ease-spring)] [transition-delay:0.15s] hover:scale-[1.07] data-[ready=true]:translate-y-0 data-[ready=true]:scale-100 data-[ready=true]:opacity-100"
                >
                  gusti
                </em>
              </h2>

              <span
                data-ready={inView}
                className="mt-[0.18em] block h-[3px] w-0 rounded-[3px] bg-[linear-gradient(90deg,var(--color-accent),var(--color-glow-a))] shadow-[0_0_14px_var(--color-accent)] transition-[width] duration-1000 ease-brand [transition-delay:0.55s] data-[ready=true]:w-[clamp(70px,9vw,150px)]"
              />
            </div>

            {!reduced && (
              <div className="whitespace-nowrap text-[13px] tracking-[0.2em] text-muted">
                <b ref={counterRef} className="text-ink">
                  01
                </b>{" "}
                / <span>{String(SHOWCASE.length).padStart(2, "0")}</span>
              </div>
            )}
          </div>

          {/* ---------- Binario delle card ---------- */}
          <div
            ref={trackRef}
            className={[
              "flex items-center gap-[clamp(24px,3vw,52px)] will-change-transform",
              reduced
                ? "snap-x snap-mandatory overflow-x-auto px-pad pb-6"
                : "px-[12vw]",
            ].join(" ")}
          >
            {SHOWCASE.map((flavor, i) => (
              <article
                key={flavor.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{ "--c1": flavor.c1, "--c2": flavor.c2 } as React.CSSProperties}
                className="w-[clamp(260px,26vw,360px)] flex-none snap-center will-change-transform max-[640px]:w-[78vw]"
              >
                <div className="group relative z-[1] rounded-[26px] border border-line bg-white/[0.035] px-7 pb-8 pt-[30px] backdrop-blur-[10px] transition-[transform,box-shadow,border-color,background] duration-[550ms] [transition-timing-function:var(--ease-spring)] will-change-transform hover:z-[6] hover:-translate-y-3.5 hover:scale-[1.07] hover:border-[color-mix(in_srgb,var(--c1)_75%,transparent)] hover:bg-white/[0.07] hover:shadow-[0_38px_74px_rgb(0_0_0/0.55),0_0_70px_color-mix(in_srgb,var(--c1)_30%,transparent)] max-[900px]:bg-[rgb(20_20_25/0.55)] max-[900px]:backdrop-blur-none">
                  <div
                    className="relative flex h-[clamp(220px,24vw,300px)] items-end justify-center max-[900px]:animate-none"
                    style={{
                      animation: `bob 6s ease-in-out infinite`,
                      animationDelay: `${-1.2 * i}s`,
                    }}
                  >
                    <span className="absolute inset-x-0 bottom-[8%] top-auto h-[60%] rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c1)_60%,transparent),transparent_75%)] opacity-85 blur-[28px] transition-[opacity,transform] duration-[600ms] [transition-timing-function:var(--ease-spring)] group-hover:scale-[1.18] group-hover:opacity-100" />
                    <span
                      ref={(el) => {
                        photoRefs.current[i] = el;
                      }}
                      className="relative z-[1] block h-full w-full will-change-transform"
                    >
                      <Image
                        src={flavor.photo}
                        alt={flavor.name}
                        fill
                        sizes="(max-width: 640px) 78vw, (max-width: 1400px) 26vw, 360px"
                        className="pointer-events-none object-contain drop-shadow-[0_18px_26px_rgb(0_0_0/0.5)] transition-[filter] duration-500 ease-brand group-hover:brightness-110 group-hover:saturate-[1.08] max-[900px]:drop-shadow-none"
                      />
                    </span>
                  </div>

                  <div className="mt-[18px] text-[12px] tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, "0")} — {flavor.kind}
                  </div>
                  <h3 className="mt-1.5 text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold leading-[1.05] tracking-[-0.02em] transition-colors duration-[400ms] ease-brand group-hover:text-[color-mix(in_srgb,var(--c1)_90%,#fff)]">
                    {flavor.name}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] font-light leading-[1.55] text-muted">
                    {flavor.description}
                  </p>
                  <div className="mt-[18px] flex items-center justify-start">
                    <span className="rounded-full border border-[color-mix(in_srgb,var(--c1)_60%,transparent)] px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--c1)_85%,#fff)] transition-[border-color,background] duration-[400ms] ease-brand group-hover:border-[color-mix(in_srgb,var(--c1)_85%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--c1)_14%,transparent)]">
                      {flavor.tag}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!reduced && (
            <>
              <div className="absolute bottom-[clamp(40px,8vh,74px)] right-pad z-[5] text-[11px] uppercase tracking-[0.2em] text-muted">
                Scorri ↓
              </div>
              <div className="absolute bottom-[clamp(28px,6vh,58px)] left-pad right-pad z-[5] h-[2px] overflow-hidden rounded-sm bg-line">
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
