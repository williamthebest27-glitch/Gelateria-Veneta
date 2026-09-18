"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FLAVORS, type Flavor, type FlavorCategory } from "@/lib/content";

/* ------------------------------------------------------------------
   Icone di categoria (line, ereditano currentColor)
   ------------------------------------------------------------------ */
const ICONS: Record<FlavorCategory, React.ReactNode> = {
  crema: (
    <>
      <path d="M6.5 10.5h11l-1.3 8a2 2 0 0 1-2 1.7H9.8a2 2 0 0 1-2-1.7z" />
      <path d="M7.5 10.5a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  frutta: (
    <>
      <path d="M12 21c-3.3 0-6-2.8-6-6.5C6 10 9 7 12 7s6 3 6 7.5C18 18.2 15.3 21 12 21z" />
      <path d="M12 7c0-2 1-3.2 3-4" />
    </>
  ),
  cioccolato: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
      <path d="M5 10h14M5 14.5h14M10 5v14M14 5v14" />
    </>
  ),
  caffe: (
    <>
      <path d="M5 9h11v3.5a5 5 0 0 1-10 0z" />
      <path d="M16 9.5h2a2.2 2.2 0 0 1 0 4.4h-2" />
      <path d="M8 4c-.4.8.4 1.2 0 2M11.5 4c-.4.8.4 1.2 0 2" />
    </>
  ),
  "frutta-secca": (
    <>
      <path d="M12 3.5c3.2 2 5.2 5.2 5.2 9.2 0 4-2.6 7.3-5.2 7.3s-5.2-3.3-5.2-7.3c0-4 2-7.2 5.2-9.2z" />
      <path d="M12 6c-1.6 3.2-1.6 9.4 0 14" />
    </>
  ),
};

const CATEGORY_LABELS: Record<FlavorCategory | "tutti", string> = {
  tutti: "Tutti",
  crema: "Creme",
  frutta: "Frutta",
  cioccolato: "Cioccolato",
  caffe: "Caffè",
  "frutta-secca": "Frutta secca",
};

const FILTERS: (FlavorCategory | "tutti")[] = [
  "tutti",
  "crema",
  "frutta",
  "cioccolato",
  "frutta-secca",
  "caffe",
];

/* ------------------------------------------------------------------ */

export function FlavorGrid() {
  const [filter, setFilter] = useState<FlavorCategory | "tutti">("tutti");
  const visible = filter === "tutti" ? FLAVORS : FLAVORS.filter((f) => f.category === filter);

  return (
    <>
      {/* ---------- Filtri ---------- */}
      <div className="mb-[clamp(28px,4vw,44px)] flex flex-wrap gap-2.5" role="group" aria-label="Filtra per categoria">
        {FILTERS.map((key) => {
          const active = filter === key;
          const count = key === "tutti" ? FLAVORS.length : FLAVORS.filter((f) => f.category === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              className={[
                "rounded-full border px-[18px] py-2.5 text-[13px] font-medium transition-all duration-[350ms] ease-brand",
                active
                  ? "border-accent bg-accent text-[#1a0e0e]"
                  : "border-line bg-white/[0.03] text-muted hover:-translate-y-0.5 hover:border-accent hover:text-accent",
              ].join(" ")}
            >
              {CATEGORY_LABELS[key]}
              <span className={active ? "ml-1.5 opacity-60" : "ml-1.5 opacity-50"}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Griglia ---------- */}
      <div
        className="grid grid-cols-4 gap-[clamp(16px,1.8vw,28px)] max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1"
        role="list"
      >
        {visible.map((flavor, i) => (
          <FlavorCard key={flavor.name} flavor={flavor} index={i} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-muted">Nessun gusto in questa categoria.</p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function FlavorCard({ flavor, index }: { flavor: Flavor; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  /* Le card entrano a gruppi, con uno stagger di 70ms sul gruppo che
     attraversa la soglia nello stesso frame. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      role="listitem"
      aria-label={`Gelato al ${flavor.name}`}
      style={
        {
          "--c1": flavor.c1,
          "--c2": flavor.c2,
          transitionDelay: visible ? `${Math.min(index % 8, 7) * 0.07}s` : "0s",
        } as React.CSSProperties
      }
      className={[
        "group transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.16,0.84,0.44,1)]",
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-[30px] scale-[0.985] opacity-0",
      ].join(" ")}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(165deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015)),rgb(22_12_14/0.55)] shadow-[0_14px_34px_-16px_rgb(0_0_0/0.7)] transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-1.5 group-hover:rotate-[-1.2deg]">
        {/* Bordo che si illumina al passaggio del mouse */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-[350ms] [background:linear-gradient(135deg,rgb(244_168_44/0.75),rgb(239_126_31/0.3)_45%,transparent_70%)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] group-hover:opacity-100"
        />

        {/* ---------- Media ---------- */}
        <div className="relative grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_50%_38%,color-mix(in_srgb,var(--c1)_20%,transparent),transparent_68%)]">
          {flavor.badge && (
            <span className="absolute left-3.5 top-3.5 z-[2] rounded-full border border-[rgb(244_168_44/0.25)] bg-white/[0.08] px-[0.8em] py-[0.34em] text-[0.68rem] font-semibold tracking-[0.04em] text-accent transition-colors duration-[350ms] group-hover:border-transparent group-hover:bg-[linear-gradient(135deg,var(--color-accent),var(--color-glow-b))] group-hover:text-[#1a0e0e]">
              {flavor.badge}
            </span>
          )}

          {flavor.photo ? (
            <Image
              src={flavor.photo}
              alt={`Gelato artigianale al ${flavor.name}`}
              width={420}
              height={315}
              sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 300px"
              className="h-[78%] w-[78%] object-contain transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-105"
            />
          ) : (
            <FlavorScoop />
          )}
        </div>

        {/* ---------- Testo ---------- */}
        <div className="flex flex-col gap-[0.55rem] p-[clamp(16px,1.4vw,22px)]">
          <div className="flex items-center gap-[0.55rem]">
            <span
              aria-hidden
              className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-[rgb(244_168_44/0.1)] text-accent transition-colors duration-[350ms] group-hover:text-glow-b"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[18px] w-[18px]"
              >
                {ICONS[flavor.category]}
              </svg>
            </span>
            <h3 className="font-editorial text-[clamp(1.05rem,1.3vw,1.25rem)] font-semibold leading-[1.15] text-cream">
              {flavor.name}
            </h3>
          </div>

          <p className="text-[0.9rem] leading-[1.5] text-muted">{flavor.description}</p>

          <p className="mt-[0.2rem] border-t border-line pt-[0.7rem] text-[0.8rem] leading-[1.45] text-[#7f757a]">
            <b className="mb-[0.2em] block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-accent">
              Ingredienti
            </b>
            {flavor.ingredients}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
   Pallina disegnata in CSS per i gusti senza fotografia: usa i due
   colori del gusto, così la griglia resta coerente senza riciclare
   le stesse immagini.
   ------------------------------------------------------------------ */
function FlavorScoop() {
  return (
    <div aria-hidden className="relative grid h-[78%] w-[78%] place-items-center">
      {/* Ombra a terra */}
      <span className="absolute bottom-[11%] h-[24%] w-[64%] rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c2)_60%,transparent),transparent_76%)] blur-[15px]" />

      {/* Corpo della pallina: forma leggermente irregolare, non una sfera perfetta */}
      <span className="relative aspect-square w-[70%] rotate-[-6deg] overflow-hidden rounded-[48%_52%_44%_56%/52%_46%_54%_48%] bg-[radial-gradient(circle_at_34%_26%,color-mix(in_srgb,var(--c1)_88%,#fff),var(--c1)_42%,var(--c2)_94%)] shadow-[inset_-12px_-16px_30px_rgb(0_0_0/0.34),inset_10px_12px_24px_rgb(255_255_255/0.2),0_18px_30px_rgb(0_0_0/0.45)]">
        {/* Solchi del porzionatore: creste morbide che seguono la curvatura */}
        <span className="absolute -left-[18%] top-[12%] h-[46%] w-[86%] rotate-[-22deg] rounded-[50%] bg-[linear-gradient(180deg,rgb(255_255_255/0.18),transparent_70%)] blur-[7px]" />
        <span className="absolute -right-[22%] top-[34%] h-[52%] w-[88%] rotate-[14deg] rounded-[50%] bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_66%)] blur-[8px]" />
        <span className="absolute -left-[10%] bottom-[6%] h-[40%] w-[92%] rotate-[8deg] rounded-[50%] bg-[linear-gradient(0deg,rgb(0_0_0/0.22),transparent_72%)] blur-[9px]" />

        {/* Grana fine: toglie l'aspetto plasticoso */}
        <span className="absolute inset-0 grain opacity-[0.18]" />

        {/* Luce principale e rimbalzo in basso a destra */}
        <span className="absolute left-[20%] top-[13%] h-[24%] w-[32%] rotate-[-25deg] rounded-[50%] bg-white/40 blur-[7px]" />
        <span className="absolute bottom-[16%] right-[17%] h-[13%] w-[18%] rounded-[50%] bg-white/[0.18] blur-[5px]" />
      </span>
    </div>
  );
}
