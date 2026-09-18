"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------
   Utility matematiche condivise dalle sezioni scroll-driven
   ------------------------------------------------------------------ */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const pad2 = (n: number) => String(Math.floor(n)).padStart(2, "0");

/* ------------------------------------------------------------------
   prefers-reduced-motion
   ------------------------------------------------------------------ */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------
   Puntatore fine (mouse) — per effetti magnetici e spotlight
   ------------------------------------------------------------------ */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(hover:hover) and (pointer:fine)").matches);
  }, []);

  return fine;
}

/* ------------------------------------------------------------------
   Entrata in viewport (una sola volta)
   ------------------------------------------------------------------ */
export function useInView(
  ref: RefObject<Element | null>,
  { threshold = 0.15, once = true }: { threshold?: number; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);

  return inView;
}

/* ------------------------------------------------------------------
   Progresso di scroll di una sezione "pinnata".

   Il valore NON passa mai dallo state di React: viene consegnato a
   `onProgress` dentro un loop rAF con smoothing (lerp), così le
   sezioni scrivono direttamente sullo stile degli elementi e restano
   a 60fps senza ri-renderizzare l'albero.

   `ref` va sull'elemento alto (es. 400vh) che contiene lo sticky.
   ------------------------------------------------------------------ */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { smoothing = 0.1, enabled = true }: { smoothing?: number; enabled?: boolean } = {},
): void {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Movimento ridotto: mostra lo stato finale e non aggancia nulla.
    if (!enabled) {
      cb.current(1);
      return;
    }

    let top = 0;
    let dist = 1;
    let current = 0;
    let target = 0;
    let running = false;
    let frame = 0;

    const measure = () => {
      top = el.getBoundingClientRect().top + window.scrollY;
      dist = el.offsetHeight - window.innerHeight || 1;
    };

    const readTarget = () => clamp01((window.scrollY - top) / dist);

    const tick = () => {
      current += (target - current) * smoothing;
      const settled = Math.abs(target - current) < 0.0006;
      if (settled) current = target;

      cb.current(current);

      if (running && !settled) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      target = readTarget();
      start();
    };

    const onResize = () => {
      measure();
      target = readTarget();
      start();
    };

    measure();
    target = readTarget();
    current = target;
    cb.current(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);

    // Font e immagini cambiano le altezze: rimisura quando si assestano.
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      ro.disconnect();
    };
  }, [ref, smoothing, enabled]);
}

/* ------------------------------------------------------------------
   Pulsanti magnetici: l'elemento insegue leggermente il cursore.
   ------------------------------------------------------------------ */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  { strengthX = 0.3, strengthY = 0.4 }: { strengthX?: number; strengthY?: number } = {},
): void {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      el.style.transform = `translate(${dx * strengthX}px, ${dy * strengthY}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, fine, reduced, strengthX, strengthY]);
}
