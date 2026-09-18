"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";

/**
 * Navigazione principale.
 *
 * All'apertura è trasparente sopra il video della hero (come nel design
 * originale); superata la hero diventa fissa e opaca, così resta
 * raggiungibile lungo tutta la pagina.
 */
export function SiteHeader() {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReady(true), reduced ? 0 : 300);

    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      data-ready={ready}
      className={[
        "fixed inset-x-0 top-0 z-50 flex items-center justify-center px-pad",
        "py-[clamp(18px,2.4vw,30px)] transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-brand",
        scrolled
          ? "border-b border-line bg-bg/80 py-4 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav aria-label="Navigazione principale">
        <ul className="flex list-none gap-[clamp(16px,2.6vw,48px)] [perspective:700px]">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              className="opacity-0 [transform:translateY(-22px)_rotateX(-60deg)] [transform-origin:top_center] transition-[opacity,transform,translate,scale,rotate] duration-700 ease-brand data-[ready=true]:translate-y-0 data-[ready=true]:opacity-100 data-[ready=true]:[transform:none]"
              data-ready={ready}
              style={{ transitionDelay: `${0.05 + i * 0.09}s` }}
            >
              <Link
                href={item.href}
                className="group relative inline-block text-[clamp(14px,1.15vw,17px)] font-medium tracking-[0.02em] text-white no-underline [text-shadow:0_1px_12px_rgb(0_0_0/0.45)] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[350ms] ease-brand hover:scale-[1.18]"
              >
                {item.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-[7px] left-0 right-0 h-[2px] origin-center scale-x-0 rounded-sm bg-[linear-gradient(90deg,transparent_0%,var(--color-accent)_18%,#ffe9b0_50%,var(--color-accent)_82%,transparent_100%)] bg-[length:200%_100%] shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_70%,transparent)] transition-[transform,translate,scale,rotate,translate,scale,rotate] duration-[450ms] ease-brand group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
