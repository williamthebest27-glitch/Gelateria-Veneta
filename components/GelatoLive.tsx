"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useRef } from "react";
import choco from "@/public/img/gusti/colata-di-cioccolato.webp";
import cone from "@/public/img/gusti/puffo-cono.webp";
import fruit from "@/public/img/gusti/frutta-di-stagione.webp";
import scoop from "@/public/img/gusti/cucchiaio-gelato.webp";
import splash from "@/public/img/gusti/splash-di-latte.webp";
import { clamp01, easeOut, lerp, useInView, useReducedMotion, useScrollProgress } from "@/lib/hooks";

/** Stato di un livello in un istante della coreografia. */
type LayerState = { x: number; y: number; scale: number; rotate: number; opacity: number };

type LayerSpec = {
  key: string;
  /** Inizio e fine del livello sulla timeline 0→1 della sezione. */
  start: number;
  end: number;
  from: LayerState;
  to: LayerState;
};

const IMAGE_LAYERS: (LayerSpec & {
  src: StaticImageData;
  alt: string;
  width: string;
  z: string;
})[] = [
  {
    key: "splash",
    src: splash,
    alt: "",
    width: "w-[clamp(320px,54vw,720px)]",
    z: "z-[1]",
    start: 0.04,
    end: 0.3,
    from: { x: 0, y: 0, scale: 0.3, rotate: 0, opacity: 0 },
    to: { x: 0, y: -3, scale: 1.15, rotate: 0, opacity: 0.85 },
  },
  {
    key: "fruit",
    src: fruit,
    alt: "",
    width: "w-[clamp(170px,26vw,360px)]",
    z: "z-[2]",
    start: 0.14,
    end: 0.4,
    from: { x: -130, y: 14, scale: 0.6, rotate: -35, opacity: 0 },
    to: { x: -58, y: 24, scale: 0.85, rotate: -6, opacity: 1 },
  },
  {
    key: "choco",
    src: choco,
    alt: "",
    width: "w-[clamp(280px,46vw,600px)]",
    z: "z-[5]",
    start: 0.32,
    end: 0.58,
    from: { x: 0, y: -150, scale: 0.95, rotate: 0, opacity: 0 },
    to: { x: 6, y: -40, scale: 1, rotate: 0, opacity: 1 },
  },
  {
    key: "scoop",
    src: scoop,
    alt: "",
    width: "w-[clamp(150px,22vw,300px)]",
    z: "z-[3]",
    start: 0.42,
    end: 0.7,
    from: { x: 140, y: -10, scale: 0.5, rotate: 40, opacity: 0 },
    to: { x: 60, y: 10, scale: 0.78, rotate: -8, opacity: 1 },
  },
  {
    key: "cone",
    src: cone,
    alt: "",
    width: "w-[clamp(170px,25vw,360px)]",
    z: "z-[4]",
    start: 0.58,
    end: 0.99,
    from: { x: 0, y: 150, scale: 0.75, rotate: 0, opacity: 0 },
    to: { x: 0, y: 14, scale: 1, rotate: 0, opacity: 1 },
  },
];

const MINT_LAYERS: LayerSpec[] = [
  {
    key: "mint-1",
    start: 0.6,
    end: 0.88,
    from: { x: -40, y: -260, scale: 0.4, rotate: -60, opacity: 0 },
    to: { x: -380, y: -160, scale: 1, rotate: -30, opacity: 0.95 },
  },
  {
    key: "mint-2",
    start: 0.66,
    end: 0.92,
    from: { x: 40, y: -260, scale: 0.4, rotate: 60, opacity: 0 },
    to: { x: 360, y: -130, scale: 1, rotate: 40, opacity: 0.95 },
  },
  {
    key: "mint-3",
    start: 0.72,
    end: 0.98,
    from: { x: 0, y: -260, scale: 0.4, rotate: 0, opacity: 0 },
    to: { x: 120, y: -220, scale: 0.9, rotate: 20, opacity: 0.9 },
  },
];

const CAPTIONS = [
  { text: "Solo ingredienti veri", start: 0, end: 0.16 },
  { text: "Frutta di stagione", start: 0.14, end: 0.4 },
  { text: "Latte fresco", start: 0.36, end: 0.58 },
  { text: "Cioccolato fondente", start: 0.54, end: 0.74 },
  { text: "Il gelato prende vita", start: 0.72, end: 1.02 },
];

const ALL_LAYERS: LayerSpec[] = [...IMAGE_LAYERS, ...MINT_LAYERS];

/**
 * "Il gelato prende vita" — gli ingredienti volano dentro l'inquadratura
 * e si assemblano seguendo lo scroll, come in uno spot montato al
 * contrario. Ogni livello ha il proprio intervallo sulla timeline.
 */
export function GelatoLive() {
  const rootRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const layerRefs = useRef<Record<string, HTMLElement | null>>({});
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reduced = useReducedMotion();
  const inView = useInView(rootRef, { threshold: 0 });

  const onProgress = useCallback((p: number) => {
    for (const layer of ALL_LAYERS) {
      const el = layerRefs.current[layer.key];
      if (!el) continue;

      const t = easeOut(clamp01((p - layer.start) / (layer.end - layer.start)));
      const x = lerp(layer.from.x, layer.to.x, t);
      const y = lerp(layer.from.y, layer.to.y, t);
      const scale = lerp(layer.from.scale, layer.to.scale, t);
      const rotate = lerp(layer.from.rotate, layer.to.rotate, t);

      el.style.transform = `translate3d(${x}%, ${y}%, 0) rotate(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(lerp(layer.from.opacity, layer.to.opacity, t));
    }

    if (glowRef.current) {
      const g = easeOut(clamp01((p - 0.5) / 0.45));
      glowRef.current.style.opacity = String(g * 0.9);
      glowRef.current.style.transform = `translate(-50%,-50%) scale(${0.6 + g * 0.5})`;
    }

    CAPTIONS.forEach((caption, i) => {
      const el = captionRefs.current[i];
      if (!el) return;
      let opacity = 0;
      let shift = 12;
      if (p >= caption.start && p <= caption.end) {
        const k = (p - caption.start) / (caption.end - caption.start);
        opacity = k < 0.2 ? k / 0.2 : k > 0.8 ? (1 - k) / 0.2 : 1;
        shift = (1 - (k < 0.2 ? k / 0.2 : 1)) * 12;
      }
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${shift}px)`;
    });

    if (progressRef.current) {
      progressRef.current.style.width = `${p * 100}%`;
    }
  }, []);

  useScrollProgress(wrapRef, onProgress, { smoothing: 0.1, enabled: !reduced });

  const setLayer = (key: string) => (el: HTMLElement | null) => {
    layerRefs.current[key] = el;
  };

  return (
    <section
      ref={rootRef}
      className="relative isolate w-full overflow-clip bg-[#070708] text-ink"
    >
      <div ref={wrapRef} className={reduced ? "relative z-[1]" : "relative z-[1] h-[400vh]"}>
        <div
          className={
            reduced
              ? "relative py-[90px]"
              : "sticky top-0 h-screen overflow-hidden"
          }
        >
          {/* Luce d'ambiente dietro la scena */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(45%_40%_at_50%_46%,rgb(255_255_255/0.06),transparent_70%),radial-gradient(60%_50%_at_18%_20%,color-mix(in_srgb,var(--color-glow-a)_14%,transparent),transparent_70%),radial-gradient(60%_50%_at_82%_80%,color-mix(in_srgb,var(--color-glow-b)_14%,transparent),transparent_70%)]" />

          <div className="absolute left-pad top-[clamp(22px,4.5vh,46px)] z-[8] flex items-center gap-2.5 text-[12px] uppercase tracking-[0.26em] text-accent">
            Il Gelato prende vita <b className="font-normal tracking-[0.1em] text-muted">· lo spot</b>
          </div>
          <div className="absolute right-pad top-[clamp(22px,4.5vh,46px)] z-[8] text-[13px] tracking-[3px] text-accent">
            ★★★★★
          </div>

          {/* ---------- Scena ---------- */}
          <div className={reduced ? "relative h-[70vh]" : "absolute inset-0 z-[1]"}>
            <div
              ref={glowRef}
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(90vw,820px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent)_34%,transparent),color-mix(in_srgb,var(--color-glow-b)_14%,transparent)_45%,transparent_70%)] opacity-0"
            />

            {IMAGE_LAYERS.map((layer) => (
              <div
                key={layer.key}
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${layer.width} ${layer.z}`}
              >
                <Image
                  ref={setLayer(layer.key)}
                  src={layer.src}
                  alt={layer.alt}
                  sizes="(max-width: 768px) 60vw, 720px"
                  className="block h-auto w-full opacity-0 will-change-[transform,opacity]"
                />
              </div>
            ))}

            {MINT_LAYERS.map((layer) => (
              <div
                key={layer.key}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[6] aspect-square w-[clamp(26px,3.4vw,46px)] -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  ref={setLayer(layer.key)}
                  className="relative block h-full w-full rounded-[0_100%_0_100%] bg-[radial-gradient(circle_at_35%_30%,#b6f06a,#3da35d_70%,#2c7d46)] opacity-0 shadow-[inset_-3px_-4px_8px_rgb(0_0_0/0.25),inset_3px_3px_6px_rgb(255_255_255/0.3)] will-change-[transform,opacity] after:absolute after:left-1/2 after:top-[18%] after:h-[64%] after:w-[2px] after:origin-top after:-translate-x-1/2 after:rotate-45 after:bg-white/35 after:content-['']"
                />
              </div>
            ))}
          </div>

          {/* ---------- Didascalie ---------- */}
          <div
            className={
              reduced
                ? "relative mt-8 px-pad text-center"
                : "pointer-events-none absolute inset-x-0 bottom-[clamp(70px,12vh,120px)] z-[8] h-[1.2em] text-center"
            }
          >
            {CAPTIONS.map((caption, i) =>
              reduced && i > 0 ? null : (
                <div
                  key={caption.text}
                  ref={(el) => {
                    captionRefs.current[i] = el;
                  }}
                  className={[
                    "font-display text-[clamp(1.6rem,5vw,3.4rem)] font-bold leading-[1.1] tracking-[0.04em]",
                    "bg-[linear-gradient(100deg,var(--color-accent),#fff_45%,var(--color-glow-b)_70%,var(--color-accent))] bg-[length:220%_auto] bg-clip-text text-transparent",
                    "[text-shadow:0_6px_40px_rgb(0_0_0/0.4)] will-change-[opacity,transform]",
                    reduced ? "" : "absolute inset-x-0 top-0 opacity-0",
                  ].join(" ")}
                >
                  {caption.text}
                </div>
              ),
            )}
          </div>

          {!reduced && (
            <>
              <div
                data-inview={inView}
                className="absolute bottom-[clamp(26px,5vh,48px)] left-1/2 z-[8] flex -translate-x-1/2 items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted opacity-0 transition-opacity duration-[600ms] ease-brand data-[inview=true]:opacity-100"
              >
                <span className="relative h-8 w-5 rounded-xl border border-line after:absolute after:left-1/2 after:top-1.5 after:h-[7px] after:w-[3px] after:-translate-x-1/2 after:animate-[wheel_1.8s_var(--ease-brand)_infinite] after:rounded-[3px] after:bg-accent after:content-['']" />
                Scorri
              </div>

              <div className="absolute bottom-[clamp(14px,2.4vh,22px)] left-pad right-pad z-[8] h-[2px] overflow-hidden rounded-sm bg-line">
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
