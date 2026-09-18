import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Serif, Cinzel, Fraunces } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Gelateria artigianale: mantecato a freddo ogni mattina, frutta di stagione, zero conservanti. Venti gusti e ricette di famiglia dal 1998.",
  keywords: [
    "gelateria artigianale",
    "gelato",
    "sorbetto",
    "mantecato a freddo",
    "gusti gelato",
    SITE.name,
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Mantecato a freddo ogni mattina, frutta di stagione, zero conservanti. Venti gusti artigianali.",
    type: "website",
    locale: "it_IT",
    siteName: SITE.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${cinzel.variable} ${fraunces.variable}`}
    >
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
