# Gelateria Veneta

Sito della gelateria ricostruito con **Next.js 16 (App Router)**, **React 19**,
**TypeScript** e **Tailwind CSS 4**, a partire dalle sezioni HTML/CSS/JS
originali pensate per Elementor.

## Avvio

```bash
npm install
npm run dev
```

Il sito gira su http://localhost:3000.

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Serve la build di produzione |

## Struttura

```
app/
  layout.tsx        font (next/font), metadata, <html lang="it">
  page.tsx          homepage: hero → gusti → storia → spot → contatti
  gusti/page.tsx    carta dei gusti completa, con filtri per categoria
  actions.ts        Server Action del modulo contatti
  globals.css       token di design (@theme), utility, coreografie
components/
  SiteHeader.tsx    nav fissa, trasparente sulla hero
  Hero.tsx          video, titolo a righe mascherate, riflettore al mouse
  FlavorShowcase.tsx  scorrimento orizzontale guidato dallo scroll
  Pillars.tsx       "Quattro regole": card sticky che si impilano
  GelatoLive.tsx    gli ingredienti si assemblano con lo scroll
  CinematicSpot.tsx spot: maschera SVG, barre cinema, tipografia cinetica
  Contacts.tsx      contatti, modulo, mappa, footer
  FlavorGrid.tsx    griglia gusti con filtri
  SplitText.tsx     spezza il testo in caratteri (render lato server)
lib/
  content.ts        tutti i testi e i dati dei gusti — fonte unica
  hooks.ts          useScrollProgress, useInView, useMagnetic, …
public/
  video/            hero.mp4, spot.mp4 + poster WebP
  img/gusti/        foto dei gusti in WebP
```

### Dove si cambiano i contenuti

Tutto in [`lib/content.ts`](lib/content.ts): indirizzo, telefono, email, orari,
voci di menu, i sei gusti in vetrina, le quattro regole e la carta dei gusti
completa. I componenti non contengono testo scritto a mano.

## Come sono fatte le animazioni

Le sezioni "pinnate" non passano mai il progresso dello scroll dallo state di
React: `useScrollProgress` consegna un valore `0 → 1` dentro un loop
`requestAnimationFrame` con smoothing, e i componenti scrivono direttamente
sullo stile degli elementi. Così restano a 60fps senza ri-renderizzare l'albero
a ogni frame.

Le coreografie che dipendono da un attributo su un antenato
(`[data-ready] .line-rise`) stanno in `@layer components` dentro `globals.css`,
non in `@utility`. Tutto il resto — layout, spaziature, colori, tipografia,
stati hover — è Tailwind.

Ogni sezione rispetta `prefers-reduced-motion`: lo scorrimento orizzontale
diventa un carosello con snap, le sezioni ad assemblaggio mostrano lo stato
finale, e nessun elemento resta invisibile.

## Modulo contatti

Funziona senza configurazione: risponde al visitatore indicando l'indirizzo
email diretto. Per farlo inviare davvero, imposta queste variabili d'ambiente
(su Vercel: Settings → Environment Variables):

| Variabile | Descrizione |
| --- | --- |
| `RESEND_API_KEY` | Chiave API di [Resend](https://resend.com) |
| `CONTACT_FROM_EMAIL` | Mittente verificato su Resend |
| `CONTACT_TO_EMAIL` | Destinatario (default: l'email in `lib/content.ts`) |

Senza `RESEND_API_KEY` e `CONTACT_FROM_EMAIL` il modulo non finge di aver
inviato: lo dice chiaramente e offre l'indirizzo a cui scrivere.

## Asset

I file originali (PNG da ~2 MB, video fino a 54 MB) sono stati ricompressi per
il web: immagini in WebP a 900px, video H.264 a 1280px/30fps con poster WebP.
Da ~120 MB a ~8 MB complessivi. Le sorgenti restano nelle cartelle
`immagini/` e `Video/` del progetto, fuori da `web/`.

Lo spot (3,3 MB) non viene scaricato al caricamento della pagina: parte solo
quando la sezione si avvicina al viewport.
