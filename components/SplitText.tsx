import type { ReactNode } from "react";

type SplitTextProps = {
  /** Testo da spezzare in singoli caratteri. */
  text: string;
  /** Classi applicate a ogni carattere. */
  charClassName?: string;
  /** Indice di partenza per lo stagger (`--i` su ogni carattere). */
  startIndex?: number;
};

/**
 * Spezza una stringa in uno <span> per carattere, esponendo `--i`
 * (indice progressivo) per gli stagger CSS. Gli spazi restano nodi di
 * testo, così le parole vanno a capo normalmente.
 *
 * Renderizzato lato server: nessun flash di testo non animato.
 */
export function SplitText({ text, charClassName, startIndex = 0 }: SplitTextProps) {
  const nodes: ReactNode[] = [];
  let index = startIndex;

  Array.from(text).forEach((char, position) => {
    if (char === " ") {
      nodes.push(" ");
      return;
    }
    nodes.push(
      <span
        key={`${position}-${char}`}
        className={charClassName}
        style={{ "--i": index } as React.CSSProperties}
      >
        {char}
      </span>,
    );
    index += 1;
  });

  return <>{nodes}</>;
}

/** Numero di caratteri non-spazio: utile per continuare lo stagger. */
export function charCount(text: string): number {
  return Array.from(text).filter((c) => c !== " ").length;
}
