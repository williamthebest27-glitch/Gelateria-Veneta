import type { Metadata } from "next";
import Link from "next/link";
import { FlavorGrid } from "@/components/FlavorGrid";
import { SiteHeader } from "@/components/SiteHeader";
import { FLAVORS, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Carta dei gusti",
  description: `${FLAVORS.length} gusti artigianali mantecati freschi ogni giorno: creme, sorbetti di frutta, cioccolato e frutta secca. Zero conservanti.`,
};

export default function FlavorsPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative isolate min-h-screen overflow-clip bg-[linear-gradient(180deg,#160c0e_0%,#0a0608_100%)] text-ink">
        {/* Bagliori d'ambiente coerenti con la homepage */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_85%_at_12%_-5%,#2a1418_0%,transparent_55%),radial-gradient(100%_70%_at_88%_8%,#20121a_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 grain opacity-[0.035] [mix-blend-mode:soft-light]" />

        <div className="relative z-[1] mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)] pb-[clamp(64px,8vw,120px)] pt-[clamp(120px,12vw,180px)]">
          <header className="mb-[clamp(40px,5vw,72px)] max-w-[780px]">
            <span className="inline-flex items-center gap-[0.8em] text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent before:h-px before:w-[34px] before:bg-current before:opacity-70 before:content-['']">
              I Nostri Gusti
            </span>

            <h1 className="my-[0.5em_0_0.35em] mt-[0.5em] font-editorial text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-cream">
              {FLAVORS.length} gusti.{" "}
              <em className="font-medium italic text-accent">Zero</em>{" "}
              <em className="font-medium italic text-glow-b">conservanti.</em>
            </h1>

            <p className="mt-[0.35em] max-w-[46ch] text-[clamp(1rem,1.2vw,1.12rem)] leading-[1.6] text-muted">
              Ogni gusto nasce da materie prime selezionate e mantecato fresco ogni giorno.
              Filtra per categoria e scegli il tuo preferito.
            </p>
          </header>

          <FlavorGrid />

          <div className="mt-[clamp(48px,7vw,90px)] flex flex-wrap items-center gap-4 border-t border-line pt-[clamp(32px,4vw,52px)]">
            <p className="flex-1 text-[clamp(1.1rem,2vw,1.5rem)] font-light text-muted">
              La carta cambia con le stagioni. Passa a trovarci e chiedi le novità del giorno.
            </p>
            <Link
              href="/#contatti"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-[30px] py-4 text-[15px] font-semibold text-[#0a0a0a] no-underline transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-300 ease-soft hover:-translate-y-0.5"
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
          </div>

          <footer className="mt-[clamp(40px,6vw,70px)] flex flex-wrap items-center justify-between gap-5 border-t border-line pt-[clamp(28px,4vw,44px)]">
            <Link href="/" className="inline-flex items-center gap-2.5 text-[1.2rem] font-bold tracking-[-0.02em] text-ink no-underline">
              <i className="h-2.5 w-2.5 animate-[pulse-dot_2.4s_infinite] rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
              {SITE.name}
            </Link>
            <small className="text-[12px] text-muted">
              © {new Date().getFullYear()} {SITE.name} · P.IVA {SITE.vat}
            </small>
          </footer>
        </div>
      </main>
    </>
  );
}
