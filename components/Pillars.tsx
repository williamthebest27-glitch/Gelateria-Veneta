"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PILLARS, type Pillar } from "@/lib/content";
import { clamp01, useInView, useReducedMotion } from "@/lib/hooks";

/**
 * "Quattro regole. Zero compromessi."
 *
 * Le card sono `sticky` e si impilano: quella sotto viene coperta dalla
 * successiva mentre rimpicciolisce, si scurisce e sfoca. Ogni card
 * rivela il proprio contenuto quando è visibile per almeno il 40%.
 */
export function Pillars() {
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const sectionInView = useInView(rootRef, { threshold: 0.06 });

  /* Impilamento: scala + luminosità + sfocatura della card coperta. */
  useEffect(() => {
    if (reduced) return;
    let ticking = false;

    const update = () => {
      const vh = window.innerHeight || 1;
      cardRefs.current.forEach((card, i) => {
        const next = cardRefs.current[i + 1];
        if (!card) return;
        if (!next) {
          card.style.transform = "";
          card.style.filter = "";
          return;
        }
        const p = clamp01(1 - next.getBoundingClientRect().top / vh);
        card.style.transform = `scale(${1 - p * 0.12})`;
        card.style.filter = `brightness(${1 - p * 0.45}) blur(${p * 2.4}px)`;
      });
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

  return (
    <section
      id="storia"
      ref={rootRef}
      className="relative isolate w-full overflow-clip bg-bg text-ink before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(40%_30%_at_12%_8%,color-mix(in_srgb,var(--color-glow-a)_16%,transparent),transparent_70%),radial-gradient(40%_30%_at_88%_96%,color-mix(in_srgb,var(--color-glow-b)_16%,transparent),transparent_70%)] before:content-['']"
    >
      {/* Fascio di luce che scende una sola volta, all'ingresso. */}
      {sectionInView && !reduced && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-40 animate-[sweep-down_1.7s_var(--ease-brand)_0.15s_forwards] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent)_26%,transparent),transparent_85%)] opacity-0 [mix-blend-mode:screen]" />
      )}

      {/* ---------- Introduzione ---------- */}
      <PillarsIntro />

      {/* ---------- Card impilate ---------- */}
      <div className="relative z-[2] mx-auto max-w-[1200px] px-pad pb-[clamp(40px,8vw,90px)]">
        {PILLARS.map((pillar, i) => (
          <PillarCard
            key={pillar.slug}
            pillar={pillar}
            index={i}
            total={PILLARS.length}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PillarsIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });

  return (
    <div
      ref={ref}
      data-inview={inView}
      className="relative z-[2] mx-auto max-w-[1200px] px-pad pb-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,140px)]"
    >
      <div className="fade-rise flex items-center gap-2.5 text-[12px] uppercase tracking-[0.28em] text-accent">
        <span
          data-inview={inView}
          className="h-px w-0 bg-accent transition-[width] duration-[900ms] ease-brand [transition-delay:0.2s] data-[inview=true]:w-8"
        />
        La nostra firma
      </div>

      <h2 className="fade-rise mt-4 max-w-[16ch] text-[clamp(2.4rem,8vw,5.2rem)] font-medium leading-none tracking-[-0.035em] [transition-delay:0.08s]">
        Quattro regole.{" "}
        <em className="font-serif font-normal italic text-shine">Zero compromessi.</em>
      </h2>

      <p className="fade-rise mt-[18px] max-w-[48ch] text-[clamp(1rem,1.3vw,1.18rem)] font-light leading-[1.6] text-muted [transition-delay:0.16s]">
        Il nostro gelato nasce da un metodo preciso, ripetuto ogni giorno con la stessa
        ossessione per la qualità. Scorri per scoprirlo.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type PillarCardProps = {
  pillar: Pillar;
  index: number;
  total: number;
  ref: (el: HTMLElement | null) => void;
};

function PillarCard({ pillar, index, total, ref }: PillarCardProps) {
  const innerRef = useRef<HTMLElement>(null);
  const active = useInView(innerRef, { threshold: 0.4, once: false });
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={(el) => {
        innerRef.current = el;
        ref(el);
      }}
      data-active={active}
      style={{ "--c1": pillar.c1, "--c2": pillar.c2 } as React.CSSProperties}
      className="sticky top-[clamp(16px,3vh,40px)] isolate mb-[clamp(40px,9vh,120px)] flex min-h-[min(86svh,720px)] flex-col overflow-hidden rounded-[clamp(22px,3vw,34px)] border border-line bg-[#0b0b0f] bg-[image:linear-gradient(165deg,rgb(255_255_255/0.08),rgb(255_255_255/0.02)_42%,rgb(0_0_0/0.22))] shadow-[0_30px_80px_rgb(0_0_0/0.5)] [transform-origin:50%_0%] will-change-[transform,filter] last:mb-0"
    >
      {/* Bordo a gradiente conico rotante */}
      <span aria-hidden className="ring-conic z-[4] opacity-90" />

      <div className="relative z-[1] flex flex-1 translate-y-[66px] scale-[0.965] flex-col justify-end p-[clamp(26px,5.5vw,56px)] pb-[clamp(96px,17vh,150px)] opacity-0 transition-[opacity,transform,translate,scale,rotate] duration-[900ms] ease-brand will-change-transform data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 max-[560px]:pb-[clamp(70px,12vh,120px)]"
        data-active={active}
      >
        {/* Tinta e grana della card */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(70%_60%_at_80%_12%,color-mix(in_srgb,var(--c1)_26%,transparent),transparent_60%),radial-gradient(60%_60%_at_12%_92%,color-mix(in_srgb,var(--c2)_18%,transparent),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 grain opacity-[0.06]" />

        {/* Numero fantasma */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-[clamp(8px,2vw,26px)] top-[clamp(-10px,-1vw,2px)] z-0 select-none text-[clamp(8rem,32vw,19rem)] font-bold leading-[0.8] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgb(244_241_234/0.09)]"
        >
          {index + 1}
        </span>

        <div className="absolute left-[clamp(26px,5.5vw,56px)] top-[clamp(22px,5vw,46px)] z-[3] text-[13px] tracking-[0.18em] text-muted">
          <b className="text-ink">{number}</b> / {String(total).padStart(2, "0")}
        </div>

        {/* Illustrazione con alone e ingresso a tendina */}
        <div className="pointer-events-none absolute right-[clamp(14px,4.5vw,48px)] top-[clamp(20px,5vw,52px)] z-[2] aspect-square w-[clamp(150px,33vw,330px)] animate-[float-soft_7s_ease-in-out_infinite] [perspective:1000px] max-[560px]:right-3 max-[560px]:top-[clamp(40px,12vw,72px)] max-[560px]:w-[48vw]">
          <span
            data-active={active}
            className="absolute inset-[4%] scale-[0.6] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c1)_60%,transparent),transparent_72%)] opacity-0 blur-[26px] transition-[opacity,transform,translate,scale,rotate] duration-[1200ms] ease-brand [transition-delay:0.1s] data-[active=true]:scale-100 data-[active=true]:opacity-95"
          />
          <Image
            src={pillar.photo}
            alt={pillar.alt}
            fill
            sizes="(max-width: 560px) 48vw, (max-width: 1200px) 33vw, 330px"
            data-active={active}
            className="relative z-[1] object-contain opacity-0 drop-shadow-[0_20px_30px_rgb(0_0_0/0.55)] [clip-path:inset(0_0_100%_0)] [transform:rotateY(16deg)_scale(1.2)] transition-[opacity,transform,translate,scale,rotate,clip-path] duration-[1150ms] ease-brand [transition-delay:0.18s] will-change-[transform,clip-path] data-[active=true]:opacity-100 data-[active=true]:[clip-path:inset(0_0_0_0)] data-[active=true]:[transform:rotateY(0)_scale(1)]"
          />
        </div>

        {/* Testo */}
        <div className="relative z-[3] max-w-[min(34rem,92%)] max-[560px]:max-w-full">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-black/30 px-3.5 py-[7px] text-[12px] uppercase tracking-[0.16em] text-muted backdrop-blur-md">
            <b className="h-1.5 w-1.5 rounded-full bg-[var(--c1)] shadow-[0_0_10px_var(--c1)]" />
            {pillar.tag}
          </span>

          <h3 className="mt-[18px] text-[clamp(2.6rem,11vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.035em] max-[560px]:text-[clamp(2.6rem,12vw,3.7rem)]">
            <span className="line-mask">
              <i className="line-rise-soft" style={{ "--d": "0.28s" } as React.CSSProperties}>
                {pillar.titleTop}
              </i>
            </span>
            <span className="line-mask">
              <i className="line-rise-soft" style={{ "--d": "0.4s" } as React.CSSProperties}>
                {pillar.titleBottomLead}
                <em className="bg-[linear-gradient(100deg,var(--c1),var(--c2))] bg-clip-text font-serif font-normal italic text-transparent">
                  {pillar.titleBottomAccent}
                </em>
              </i>
            </span>
          </h3>

          <p className="rise-late mt-[18px] max-w-[40ch] text-[clamp(1rem,1.5vw,1.25rem)] font-light leading-[1.55] text-muted max-[560px]:max-w-full">
            {pillar.lead}
          </p>

          <div className="rise-late mt-[22px] flex flex-wrap gap-2.5">
            {pillar.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[color-mix(in_srgb,var(--c1)_45%,transparent)] bg-[color-mix(in_srgb,var(--c1)_10%,transparent)] px-[15px] py-[9px] text-[13px] font-medium text-[color-mix(in_srgb,var(--c1)_88%,#fff)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
