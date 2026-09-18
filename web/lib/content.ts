/* ==================================================================
   Contenuti del sito — fonte unica di verità.
   Nessun testo duplicato dentro i componenti.
   ================================================================== */

export const SITE = {
  name: "Gelateria Veneta",
  tagline: "il gusto prende vita",
  since: 1998,
  address: "Via del Gelato 1, Lugano",
  mapsQuery: "Via+del+Gelato+1+Lugano",
  phone: "+39 000 000 00 00",
  phoneHref: "tel:+390000000000",
  email: "ciao@gelateriaveneta.it",
  hours: "Tutti i giorni · 11:00 — 24:00",
  vat: "00000000000",
} as const;

export const NAV = [
  { label: "Home", href: "/#home" },
  { label: "Gusti", href: "/gusti" },
  { label: "Storia", href: "/#storia" },
  { label: "Contatti", href: "/#contatti" },
] as const;

/* ------------------------------------------------------------------
   Vetrina in scorrimento orizzontale (homepage)
   ------------------------------------------------------------------ */
export type ShowcaseFlavor = {
  slug: string;
  name: string;
  kind: string;
  description: string;
  tag: string;
  photo: string;
  c1: string;
  c2: string;
};

export const SHOWCASE: ShowcaseFlavor[] = [
  {
    slug: "pistacchio",
    name: "Pistacchio di Bronte",
    kind: "Classico",
    description: "Solo pistacchio DOP, tostato lentamente. Cremoso, intenso, inconfondibile.",
    tag: "Bestseller",
    photo: "/img/gusti/pistacchio.webp",
    c1: "#9bbf3f",
    c2: "#6f9e2e",
  },
  {
    slug: "cioccolato",
    name: "Cioccolato Fondente",
    kind: "Intenso",
    description: "Cacao monorigine 72%. Avvolgente e profondo, per veri intenditori.",
    tag: "Vegano",
    photo: "/img/gusti/cioccolato.webp",
    c1: "#8a4a2a",
    c2: "#4a2412",
  },
  {
    slug: "lampone",
    name: "Lampone & Rosa",
    kind: "Fresco",
    description: "Sorbetto di lamponi freschi con un soffio di acqua di rose.",
    tag: "Sorbetto",
    photo: "/img/gusti/lampone.webp",
    c1: "#e23d6d",
    c2: "#a51d44",
  },
  {
    slug: "fior-di-latte",
    name: "Fior di Latte",
    kind: "Tradizione",
    description: "Latte fresco di montagna. La semplicità che conquista al primo assaggio.",
    tag: "Classico",
    photo: "/img/gusti/fior-di-latte.webp",
    c1: "#e7d3a6",
    c2: "#cdb27a",
  },
  {
    slug: "mango",
    name: "Mango & Passion",
    kind: "Esotico",
    description: "Sorbetto di mango maturo e frutto della passione. Pura energia tropicale.",
    tag: "Sorbetto",
    photo: "/img/gusti/mango.webp",
    c1: "#ffb13d",
    c2: "#ef8a12",
  },
  {
    slug: "nocciola",
    name: "Nocciola Piemonte",
    kind: "Goloso",
    description: "Nocciola IGP tostata artigianalmente. Rotonda, dolce, irresistibile.",
    tag: "Bestseller",
    photo: "/img/gusti/nocciola.webp",
    c1: "#c79a5b",
    c2: "#9c6e34",
  },
];

/* ------------------------------------------------------------------
   "Quattro regole. Zero compromessi." — card impilate
   ------------------------------------------------------------------ */
export type Pillar = {
  slug: string;
  tag: string;
  titleTop: string;
  titleBottomLead: string;
  titleBottomAccent: string;
  lead: string;
  chips: string[];
  photo: string;
  alt: string;
  c1: string;
  c2: string;
};

export const PILLARS: Pillar[] = [
  {
    slug: "mantecato",
    tag: "Metodo",
    titleTop: "Mantecato",
    titleBottomLead: "a ",
    titleBottomAccent: "freddo",
    lead: "Lavorato lentamente a bassa temperatura: aria minima, cremosità massima. Si scioglie in bocca, non nel bicchiere.",
    chips: ["−18°C", "Aria < 30%", "Fresco ogni giorno"],
    photo: "/img/gusti/mantecato-a-freddo.webp",
    alt: "Gelato mantecato a freddo",
    c1: "#FFC53D",
    c2: "#FF8A3D",
  },
  {
    slug: "frutta",
    tag: "Materia prima",
    titleTop: "Frutta",
    titleBottomLead: "di ",
    titleBottomAccent: "stagione",
    lead: "Solo frutta fresca scelta ogni mattina e materie prime selezionate. Quello che cambia fuori, lo senti dentro.",
    chips: ["100% naturale", "Filiera corta", "Km zero"],
    photo: "/img/gusti/frutta-di-stagione.webp",
    alt: "Frutta di stagione",
    c1: "#FF4D6D",
    c2: "#FF8A3D",
  },
  {
    slug: "zero-conservanti",
    tag: "Purezza",
    titleTop: "Zero",
    titleBottomLead: "",
    titleBottomAccent: "conservanti",
    lead: "Niente coloranti, niente additivi artificiali. Solo ingredienti che sai pronunciare. Gusto vero, lista corta.",
    chips: ["0 additivi", "Senza coloranti", "Opzioni vegane"],
    photo: "/img/gusti/zero-conservanti.webp",
    alt: "Zero conservanti",
    c1: "#7FE0A8",
    c2: "#3FC9C0",
  },
  {
    slug: "ricette",
    tag: "Eredità",
    titleTop: "Ricette",
    titleBottomLead: "di ",
    titleBottomAccent: "famiglia",
    lead: "Tramandate dal 1998 e perfezionate ogni giorno dalle stesse mani. La tecnica cambia, la passione no.",
    chips: ["Dal 1998", "Fatto a mano", "3 generazioni"],
    photo: "/img/gusti/ricette-di-famiglia.webp",
    alt: "Ricette di famiglia",
    c1: "#C9A26A",
    c2: "#8A5A2B",
  },
];

/* ------------------------------------------------------------------
   Carta dei gusti completa (/gusti)
   `photo` è opzionale: senza foto la card disegna una pallina in CSS
   con i colori del gusto.
   ------------------------------------------------------------------ */
export type FlavorCategory = "crema" | "frutta" | "cioccolato" | "caffe" | "frutta-secca";

export type Flavor = {
  name: string;
  category: FlavorCategory;
  badge?: string;
  description: string;
  ingredients: string;
  photo?: string;
  c1: string;
  c2: string;
};

export const FLAVORS: Flavor[] = [
  {
    name: "Pistacchio di Bronte",
    category: "frutta-secca",
    badge: "Bestseller",
    description: "Pasta pura di pistacchio verde, mantecata senza coloranti.",
    ingredients: "Pistacchio di Bronte DOP, latte fresco, zucchero.",
    photo: "/img/gusti/pistacchio.webp",
    c1: "#9bbf3f",
    c2: "#6f9e2e",
  },
  {
    name: "Cioccolato Fondente 70%",
    category: "cioccolato",
    description: "Cacao monorigine fuso lentamente per una crema intensa.",
    ingredients: "Cacao 70%, latte, zucchero di canna.",
    photo: "/img/gusti/cioccolato.webp",
    c1: "#8a4a2a",
    c2: "#4a2412",
  },
  {
    name: "Vaniglia del Madagascar",
    category: "crema",
    description: "Bacche di vaniglia bourbon in infusione nel latte intero.",
    ingredients: "Vaniglia bourbon, panna, tuorlo.",
    c1: "#f0e0b8",
    c2: "#d8bf82",
  },
  {
    name: "Nocciola Piemonte IGP",
    category: "frutta-secca",
    badge: "Bio",
    description: "Nocciole tostate a bassa temperatura, gusto rotondo.",
    ingredients: "Nocciola Piemonte IGP, latte, zucchero.",
    photo: "/img/gusti/nocciola.webp",
    c1: "#c79a5b",
    c2: "#9c6e34",
  },
  {
    name: "Fragola di Sicilia",
    category: "frutta",
    badge: "Vegano",
    description: "Solo frutta matura, senza latte e senza conservanti.",
    ingredients: "Fragole fresche, acqua, zucchero, limone.",
    c1: "#f2607a",
    c2: "#c93d5c",
  },
  {
    name: "Stracciatella",
    category: "crema",
    description: "Fior di latte con cascata di cioccolato fondente croccante.",
    ingredients: "Latte fresco, panna, cioccolato fondente.",
    photo: "/img/gusti/fior-di-latte.webp",
    c1: "#f4efe4",
    c2: "#b9a98c",
  },
  {
    name: "Caffè Espresso",
    category: "caffe",
    description: "Estratto di arabica per una nota intensa e avvolgente.",
    ingredients: "Caffè arabica, latte, zucchero.",
    c1: "#a9784f",
    c2: "#5b3a21",
  },
  {
    name: "Limone di Amalfi",
    category: "frutta",
    badge: "Vegano",
    description: "Sorbetto agrumato e brillante dalla costiera amalfitana.",
    ingredients: "Limoni di Amalfi IGP, acqua, zucchero.",
    c1: "#f4dc6a",
    c2: "#d9b426",
  },
  {
    name: "Mango e Passion Fruit",
    category: "frutta",
    badge: "Novità",
    description: "Sorbetto tropicale, dolce e leggermente acidulo.",
    ingredients: "Mango, passion fruit, acqua, zucchero.",
    photo: "/img/gusti/mango.webp",
    c1: "#ffb13d",
    c2: "#ef8a12",
  },
  {
    name: "Cocco",
    category: "frutta",
    badge: "Vegano",
    description: "Polpa di cocco frullata, cremosità naturale e vellutata.",
    ingredients: "Cocco, acqua, zucchero.",
    c1: "#f7f2ea",
    c2: "#d9cfc0",
  },
  {
    name: "Tiramisù",
    category: "crema",
    badge: "Bestseller",
    description: "Mascarpone, savoiardi e caffè nella ricetta della tradizione.",
    ingredients: "Mascarpone, caffè, savoiardi, cacao.",
    c1: "#c8a077",
    c2: "#8b6039",
  },
  {
    name: "Caramello Salato",
    category: "crema",
    description: "Caramello cotto a fuoco lento con un tocco di sale marino.",
    ingredients: "Zucchero caramellato, panna, sale marino.",
    c1: "#e0a55c",
    c2: "#b8752c",
  },
  {
    name: "Lampone",
    category: "frutta",
    badge: "Vegano",
    description: "Sorbetto vivace dal colore intenso e dal gusto pieno.",
    ingredients: "Lamponi, acqua, zucchero.",
    photo: "/img/gusti/lampone.webp",
    c1: "#e23d6d",
    c2: "#a51d44",
  },
  {
    name: "Menta e Cioccolato",
    category: "cioccolato",
    description: "Menta fresca in infusione con scaglie di fondente.",
    ingredients: "Menta fresca, latte, cioccolato fondente.",
    c1: "#7fe0a8",
    c2: "#3fc9c0",
  },
  {
    name: "Puffo",
    category: "crema",
    badge: "Per i più piccoli",
    description: "Crema di latte alla vaniglia con il colore che fa sorridere.",
    ingredients: "Latte fresco, panna, vaniglia.",
    photo: "/img/gusti/puffo-cono.webp",
    c1: "#6fc9f2",
    c2: "#2f7fd1",
  },
  {
    name: "Yogurt e Mirtilli",
    category: "crema",
    badge: "Bio",
    description: "Yogurt intero con variegatura di mirtilli selvatici.",
    ingredients: "Yogurt, mirtilli, zucchero.",
    c1: "#b9a6e0",
    c2: "#6b4fa0",
  },
  {
    name: "Zuppa Inglese",
    category: "crema",
    description: "Crema e cacao con alchermes secondo la ricetta classica.",
    ingredients: "Crema pasticcera, cacao, alchermes.",
    c1: "#e8b56a",
    c2: "#a83a4a",
  },
  {
    name: "Torroncino",
    category: "frutta-secca",
    description: "Croccante di mandorle e miele dentro una crema delicata.",
    ingredients: "Mandorle, miele, latte, zucchero.",
    c1: "#edd9ae",
    c2: "#c2a06a",
  },
  {
    name: "Cassata Siciliana",
    category: "crema",
    description: "Ricotta, canditi e cioccolato come in pasticceria.",
    ingredients: "Ricotta, canditi, pistacchio, cioccolato.",
    c1: "#f2d9a8",
    c2: "#cf6f8f",
  },
  {
    name: "Bacio Gianduia",
    category: "frutta-secca",
    badge: "Bestseller",
    description: "Gianduia di nocciole e cacao con cuore fondente.",
    ingredients: "Nocciole, cacao, latte, zucchero.",
    c1: "#a9754c",
    c2: "#5d3520",
  },
];

export const MARQUEE_HERO = [
  "Mantecato ogni mattina",
  "Frutta di stagione",
  "Zero conservanti",
  "Ricette di famiglia",
];

export const MARQUEE_CONTACTS = [
  "Vieni a trovarci",
  "Ti aspettiamo",
  "Gelato artigianale",
  "Dal 1998",
];
