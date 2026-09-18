"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "@/components/SplitText";
import { SITE } from "@/lib/content";
import { clamp01, useFinePointer, useMagnetic, useReducedMotion } from "@/lib/hooks";

const TITLE_TOP = "Il piacere";
const TITLE_BOTTOM = "del ";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);
  const ghostRef = useRef<HTMLAnchorElement>(null);

  const reduced = useReducedMotion();
  const fine = useFinePointer();

  const [ready, setReady] = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  useMagnetic(primaryRef);
  useMagnetic(ghostRef);

  /* Il video gira da solo per 3s, poi entra tutto in cascata. */
  useEffect(() => {
    if (reduced) {
      setReady(true);
      setRevealDone(true);
      return;
    }
    const t1 = window.setTimeout(() => setReady(true), 3000);
    const t2 = window.setTimeout(() => setRevealDone(true), 5400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  /* Parallax dello sfondo + dissolvenza del testo mentre la hero esce. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      const progress = clamp01(-rect.top / (rect.height || 1));

      if (progressRef.current) {
        progressRef.current.style.width = `${progress * 100}%`;
      }
      if (!reduced) {
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${progress * 14}%, 0)`;
        }
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(0, ${progress * -9}%, 0)`;
          innerRef.current.style.opacity = String(1 - progress * 1.1);
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  /* Riflettore che segue il mouse sul titolo (solo puntatore fine). */
  useEffect(() => {
    const title = titleRef.current;
    if (!title || !fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const b = title.getBoundingClientRect();
      title.style.setProperty("--mx", `${((e.clientX - b.left) / b.width) * 100}%`);
      title.style.setProperty("--my", `${((e.clientY - b.top) / b.height) * 100}%`);
    };

    title.addEventListener("mousemove", onMove, { passive: true });
    return () => title.removeEventListener("mousemove", onMove);
  }, [fine, reduced]);

  return (
    <section
      id="home"
      ref={heroRef}
      data-ready={ready}
      data-reveal-done={revealDone}
      className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-bg text-ink"
    >
      {/* ---------- Sfondo ---------- */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <video
          className="absolute -inset-[2%] h-[104%] w-[104%] scale-[1.06] object-cover [filter:saturate(1.08)_contrast(1.03)]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.webp"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {/* Sfumatura a sinistra: il testo resta leggibile, il video pieno a destra. */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgb(8_8_10/0.78)_0%,rgb(8_8_10/0.42)_26%,rgb(8_8_10/0.05)_52%,transparent_70%),linear-gradient(180deg,rgb(8_8_10/0.5)_0%,transparent_16%,transparent_60%,rgb(8_8_10/0.45)_100%)]" />

        {/* Mesh di colore che deriva lentamente. */}
        <div className="pointer-events-none absolute -inset-[30%] z-[1] animate-[mesh-drift_22s_ease-in-out_infinite_alternate] bg-[radial-gradient(38%_38%_at_22%_30%,color-mix(in_srgb,var(--color-glow-a)_55%,transparent),transparent_70%),radial-gradient(34%_34%_at_80%_25%,color-mix(in_srgb,var(--color-glow-b)_45%,transparent),transparent_70%),radial-gradient(40%_40%_at_65%_85%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_70%)] opacity-[0.32] blur-[40px] [filter:blur(40px)_saturate(1.2)] [mix-blend-mode:screen]" />

        <div className="pointer-events-none absolute -inset-1/2 z-[2] animate-[grain-shift_500ms_steps(2)_infinite] grain opacity-10" />
      </div>

      {/* Cornice sottile che compare a reveal concluso. */}
      <div
        data-ready={ready}
        className="pointer-events-none absolute inset-[14px] z-[6] rounded-[10px] border border-[rgb(244_241_234/0.1)] opacity-0 transition-opacity duration-[1200ms] ease-brand [transition-delay:0.9s] data-[ready=true]:opacity-100"
      />

      {/* Barra di avanzamento dell'uscita della hero. */}
      <div
        ref={progressRef}
        className="absolute left-0 top-0 z-30 h-[2px] w-0 bg-[linear-gradient(90deg,var(--color-accent),var(--color-glow-b))] shadow-[0_0_18px_var(--color-accent)]"
      />

      {/* ---------- Contenuto ---------- */}
      <div
        ref={innerRef}
        className="relative z-[12] mx-auto flex h-full max-w-[1500px] flex-col items-start justify-center px-pad text-left"
      >
        <h1
          ref={titleRef}
          className="relative text-[clamp(3rem,9.5vw,9rem)] font-medium leading-[0.96] tracking-[-0.035em] before:pointer-events-none before:absolute before:-inset-x-[8%] before:-inset-y-[14%] before:-z-10 before:bg-[radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--color-accent)_42%,transparent),color-mix(in_srgb,var(--color-glow-a)_22%,transparent)_38%,transparent_62%)] before:opacity-0 before:blur-[26px] before:transition-opacity before:duration-500 before:ease-brand before:content-[''] hover:before:opacity-100 max-[900px]:before:hidden"
        >
          <span className="line-mask">
            <i className="line-rise" style={{ "--d": "0.4s" } as React.CSSProperties}>
              <SplitText text={TITLE_TOP} charClassName="char-lift" />
            </i>
          </span>
          <span className="line-mask">
            <i className="line-rise" style={{ "--d": "0.55s" } as React.CSSProperties}>
              <SplitText text={TITLE_BOTTOM} charClassName="char-lift" />
              <em className="inline-block px-[0.08em] font-serif text-[1em] font-normal italic text-shine drop-shadow-[0_0_34px_color-mix(in_srgb,var(--color-glow-b)_38%,transparent)] transition-[transform,translate,scale,rotate,filter] duration-[400ms] [transition-timing-function:cubic-bezier(0.2,0.9,0.3,1.6)] hover:scale-[1.12] hover:-translate-y-[0.05em] hover:drop-shadow-[0_0_54px_color-mix(in_srgb,var(--color-glow-a)_60%,transparent)]">
                Gusto
              </em>
            </i>
          </span>
        </h1>

        <p className="mt-[clamp(20px,2.8vw,34px)] w-fit origin-left font-display text-[clamp(1.2rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.12] tracking-[0.12em] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[400ms] ease-brand hover:scale-[1.08]">
          <SplitText text={SITE.name} charClassName="char-tagline" />
        </p>

        <div className="mt-[clamp(30px,3.6vw,44px)] flex flex-wrap justify-start gap-4">
          <span
            data-ready={ready}
            className="inline-block translate-y-[30px] scale-[0.88] opacity-0 transition-[opacity,transform,translate,scale,rotate] duration-700 [transition-timing-function:cubic-bezier(0.34,1.5,0.5,1)] [transition-delay:1.3s] data-[ready=true]:translate-y-0 data-[ready=true]:scale-100 data-[ready=true]:opacity-100"
          >
            <Link
              ref={primaryRef}
              href="/gusti"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-[30px] py-4 text-[15px] font-semibold text-[#0a0a0a] no-underline transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-300 ease-soft will-change-transform"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_0%,rgb(255_255_255/0.65)_45%,transparent_70%)] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[800ms] ease-brand group-hover:translate-x-[120%]"
              />
              <span className="relative">Scopri i gusti</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden
                className="relative h-[17px] w-[17px] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[450ms] ease-brand group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </Link>
          </span>

          <span
            data-ready={ready}
            className="inline-block translate-y-[30px] scale-[0.88] opacity-0 transition-[opacity,transform,translate,scale,rotate] duration-700 [transition-timing-function:cubic-bezier(0.34,1.5,0.5,1)] [transition-delay:1.46s] data-[ready=true]:translate-y-0 data-[ready=true]:scale-100 data-[ready=true]:opacity-100"
          >
            <Link
              ref={ghostRef}
              href="/#contatti"
              className="group inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.03] px-[30px] py-4 text-[15px] font-semibold text-ink no-underline backdrop-blur-lg transition-[transform,translate,scale,rotate,border-color] duration-300 ease-soft will-change-transform hover:border-ink"
            >
              Dove trovarci
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden
                className="h-[17px] w-[17px] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[450ms] ease-brand group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </span>
        </div>
      </div>

      {/* ---------- Invito allo scroll ---------- */}
      <div
        data-ready={ready}
        className="absolute bottom-[clamp(28px,6vh,60px)] left-pad z-[12] flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-muted opacity-0 transition-opacity duration-[1100ms] ease-brand [transition-delay:1.6s] data-[ready=true]:opacity-100"
      >
        <span className="relative h-[34px] w-[22px] rounded-[14px] border border-line after:absolute after:left-1/2 after:top-[7px] after:h-[7px] after:w-[3px] after:-translate-x-1/2 after:animate-[wheel_1.8s_var(--ease-brand)_infinite] after:rounded-[3px] after:bg-accent after:content-['']" />
        Scorri
      </div>
    </section>
  );
}
