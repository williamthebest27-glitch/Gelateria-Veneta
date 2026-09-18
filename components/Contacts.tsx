"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { INITIAL_CONTACT_STATE, sendContactMessage } from "@/app/actions";
import { MARQUEE_CONTACTS, NAV, SITE } from "@/lib/content";
import { useInView, useMagnetic } from "@/lib/hooks";

const MAPS_URL = `https://maps.google.com/?q=${SITE.mapsQuery}`;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "WhatsApp", href: "https://wa.me/390000000000" },
];

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden className={className}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export function Contacts() {
  const rootRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLAnchorElement>(null);
  const inView = useInView(rootRef, { threshold: 0.12 });

  useMagnetic(badgeRef, { strengthX: 0.3, strengthY: 0.3 });

  return (
    <section
      id="contatti"
      ref={rootRef}
      data-inview={inView}
      className="relative isolate w-full overflow-hidden bg-bg text-ink"
    >
      {/* Ambiente: mesh di colore + grana */}
      <div className="pointer-events-none absolute -inset-[20%] z-0 animate-[mesh-drift_20s_ease-in-out_infinite_alternate] bg-[radial-gradient(34%_34%_at_18%_18%,color-mix(in_srgb,var(--color-glow-a)_40%,transparent),transparent_70%),radial-gradient(34%_34%_at_84%_30%,color-mix(in_srgb,var(--color-glow-b)_36%,transparent),transparent_70%),radial-gradient(40%_40%_at_60%_92%,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_70%)] opacity-50 blur-[50px]" />
      <div className="pointer-events-none absolute -inset-1/2 z-[1] animate-[grain-shift_600ms_steps(2)_infinite] grain opacity-[0.07]" />

      {/* ---------- Marquee ---------- */}
      <div className="relative z-[2] overflow-hidden whitespace-nowrap border-b border-line py-[18px] [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        <div className="inline-flex animate-[marquee_24s_linear_infinite] will-change-transform">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex">
              {MARQUEE_CONTACTS.map((text) => (
                <span
                  key={`${copy}-${text}`}
                  className="inline-flex items-center gap-7 px-7 font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] italic text-ink before:font-sans before:text-[14px] before:not-italic before:text-accent before:content-['✺']"
                >
                  {text}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[3] mx-auto max-w-[1300px] px-pad pb-[clamp(40px,6vw,70px)] pt-[clamp(60px,9vw,120px)]">
        <div className="fade-rise flex items-center gap-2.5 text-[12px] uppercase tracking-[0.28em] text-accent before:h-px before:w-[26px] before:bg-accent before:content-['']">
          Contatti
        </div>

        <h2 className="fade-rise mt-4 max-w-[14ch] text-[clamp(2.6rem,9vw,7rem)] font-medium leading-[0.98] tracking-[-0.035em] [transition-delay:0.07s]">
          Vieni a <em className="font-serif font-normal italic text-shine">trovarci</em>
        </h2>

        <p className="fade-rise mt-[22px] max-w-[46ch] text-[clamp(1rem,1.3vw,1.18rem)] font-light leading-[1.6] text-muted [transition-delay:0.14s]">
          Ti aspettiamo in gelateria, oppure scrivici: rispondiamo in giornata. Per eventi e
          catering, raccontaci la tua idea e la rendiamo deliziosa.
        </p>

        <div className="mt-[clamp(40px,6vw,72px)] grid grid-cols-2 items-start gap-[clamp(28px,4vw,64px)] max-[820px]:grid-cols-1">
          {/* ---------- Informazioni ---------- */}
          <div className="fade-rise [transition-delay:0.21s]">
            <InfoRow label="Indirizzo" value={SITE.address} href={MAPS_URL} external />
            <InfoRow label="Telefono" value={SITE.phone} href={SITE.phoneHref} />
            <InfoRow label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
            <div className="flex items-center justify-between gap-[18px] border-b border-t border-line py-[22px]">
              <span className="min-w-24 text-[12px] uppercase tracking-[0.16em] text-muted">Orari</span>
              <span className="flex-1 text-[clamp(1.05rem,1.7vw,1.4rem)] font-medium tracking-[-0.01em]">
                {SITE.hours}
              </span>
              <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth={2.2} aria-hidden className="h-[15px] w-[15px]">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
            </div>

            <div className="mt-[26px] flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-[18px] py-2.5 text-[13px] font-medium text-ink no-underline transition-[border-color,color,transform] duration-[350ms] ease-brand hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* ---------- Modulo ---------- */}
          <ContactForm />
        </div>
      </div>

      {/* ---------- Distintivo rotante ---------- */}
      <a
        ref={badgeRef}
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Apri ${SITE.address} su Google Maps`}
        className="absolute right-[clamp(16px,4vw,60px)] top-[clamp(90px,10vw,140px)] z-[6] grid aspect-square w-[clamp(120px,12vw,160px)] place-items-center no-underline will-change-transform max-[820px]:hidden"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin-slow_16s_linear_infinite]" aria-hidden>
          <defs>
            <path id="badge-circle" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
          </defs>
          <text className="fill-ink text-[13.5px] font-semibold uppercase tracking-[2px]">
            <textPath href="#badge-circle">
              Vieni a trovarci · Gelateria Veneta ·
            </textPath>
          </text>
        </svg>
        <span className="grid aspect-square w-[46%] place-items-center rounded-full bg-accent text-[#0a0a0a] shadow-[0_0_30px_rgb(255_197_61/0.5)] transition-transform duration-[400ms] ease-brand hover:scale-[1.12]">
          <ArrowIcon className="h-5 w-5" />
        </span>
      </a>

      {/* ---------- Mappa ---------- */}
      <div className="fade-rise relative z-[3] mx-pad mt-[clamp(20px,4vw,40px)] h-[clamp(220px,32vw,340px)] overflow-hidden rounded-[24px] border border-line bg-[radial-gradient(120%_120%_at_30%_20%,color-mix(in_srgb,var(--color-glow-b)_18%,transparent),transparent_60%),repeating-linear-gradient(0deg,rgb(244_241_234/0.05)_0_1px,transparent_1px_46px),repeating-linear-gradient(90deg,rgb(244_241_234/0.05)_0_1px,transparent_1px_46px),linear-gradient(180deg,#0c0c10,#090909)] [transition-delay:0.28s]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_44%,rgb(255_197_61/0.25)_45%_47%,transparent_48%),linear-gradient(28deg,transparent_60%,rgb(244_241_234/0.12)_61%_62.5%,transparent_63%)]" />
        <div className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.16em] text-muted">
          La nostra sede
        </div>
        <span className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 animate-[ping-ring_2.4s_ease-out_infinite] rounded-full border-2 border-accent" />
        <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-full place-items-center after:absolute after:-bottom-1 after:h-2.5 after:w-[30px] after:rounded-[50%] after:bg-black/50 after:blur-[3px] after:content-['']">
          <b className="h-[18px] w-[18px] rotate-[-45deg] rounded-[50%_50%_50%_0] bg-accent shadow-[0_0_0_6px_rgb(255_197_61/0.18)]" />
        </span>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg/70 px-[18px] py-[11px] text-[13px] font-semibold text-ink no-underline backdrop-blur-lg transition-[border-color,color] duration-[350ms] ease-brand hover:border-accent hover:text-accent"
        >
          Apri su Google Maps
          <ArrowIcon className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* ---------- Footer ---------- */}
      <footer className="relative z-[3] mx-auto mt-[clamp(40px,6vw,70px)] flex max-w-[1300px] flex-wrap items-center justify-between gap-5 border-t border-line px-pad pb-[clamp(28px,4vw,44px)] pt-[clamp(40px,6vw,70px)]">
        <div className="inline-flex items-center gap-2.5 text-[1.4rem] font-bold tracking-[-0.02em]">
          <i className="h-2.5 w-2.5 animate-[pulse-dot_2.4s_infinite] rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
          {SITE.name}
        </div>
        <nav className="flex flex-wrap gap-6" aria-label="Navigazione secondaria">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted no-underline transition-colors duration-300 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <small className="text-[12px] text-muted">
          © {new Date().getFullYear()} {SITE.name} · P.IVA {SITE.vat}
        </small>
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function InfoRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      className="group flex items-center justify-between gap-[18px] border-t border-line py-[22px] text-ink no-underline"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="min-w-24 text-[12px] uppercase tracking-[0.16em] text-muted">{label}</span>
      <span className="flex-1 text-[clamp(1.05rem,1.7vw,1.4rem)] font-medium tracking-[-0.01em] transition-[transform,color] duration-[400ms] ease-brand group-hover:translate-x-2 group-hover:text-accent">
        {value}
      </span>
      <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-line transition-all duration-[400ms] ease-brand group-hover:border-accent group-hover:bg-accent group-hover:text-[#0a0a0a]">
        <ArrowIcon className="h-[15px] w-[15px] transition-transform duration-[400ms] ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */

const FIELD_CLASS =
  "peer w-full rounded-[14px] border border-line bg-black/25 p-4 font-sans text-base text-ink transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-transparent focus:border-accent focus:shadow-[0_0_0_4px_rgb(255_197_61/0.12)]";

const LABEL_CLASS =
  "pointer-events-none absolute left-4 top-[15px] text-[0.95rem] text-muted transition-all duration-[250ms] ease-brand peer-focus:-top-[9px] peer-focus:left-3 peer-focus:bg-[#0d0d10] peer-focus:px-1.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.08em] peer-focus:text-accent peer-[:not(:placeholder-shown)]:-top-[9px] peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:bg-[#0d0d10] peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.08em] peer-[:not(:placeholder-shown)]:text-accent";

function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_CONTACT_STATE);

  return (
    <form
      action={formAction}
      className="fade-rise rounded-[24px] border border-line bg-white/[0.04] p-[clamp(24px,3vw,38px)] backdrop-blur-xl [transition-delay:0.28s]"
    >
      <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em]">Scrivici due righe</h3>
      <p className="mt-1.5 text-[0.92rem] font-light text-muted">
        Domande, eventi, collaborazioni: ci pensiamo noi.
      </p>

      <div className="relative mt-5">
        <input id="ct-name" name="name" type="text" placeholder=" " required className={FIELD_CLASS} />
        <label htmlFor="ct-name" className={LABEL_CLASS}>
          Nome e cognome
        </label>
      </div>

      <div className="relative mt-5">
        <input id="ct-mail" name="email" type="email" placeholder=" " required className={FIELD_CLASS} />
        <label htmlFor="ct-mail" className={LABEL_CLASS}>
          Email
        </label>
      </div>

      <div className="relative mt-5">
        <textarea
          id="ct-msg"
          name="message"
          placeholder=" "
          required
          maxLength={4000}
          className={`${FIELD_CLASS} min-h-[120px] resize-y`}
        />
        <label htmlFor="ct-msg" className={LABEL_CLASS}>
          Il tuo messaggio
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group relative mt-[22px] inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent p-[17px] font-sans text-base font-semibold text-[#0a0a0a] transition-transform duration-300 ease-brand hover:-translate-y-0.5 disabled:cursor-progress disabled:opacity-70"
      >
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent,rgb(255_255_255/0.6)_45%,transparent_70%)] transition-transform duration-[800ms] ease-brand group-hover:translate-x-[120%]"
        />
        <span className="relative">{pending ? "Invio in corso…" : "Invia messaggio"}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden className="relative h-[17px] w-[17px]">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <p
        aria-live="polite"
        className={[
          "mt-3.5 text-center text-[0.82rem]",
          state.status === "ok" ? "text-accent" : state.status === "error" ? "text-glow-a" : "text-muted",
        ].join(" ")}
      >
        {state.message}
      </p>
    </form>
  );
}
