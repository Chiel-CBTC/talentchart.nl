# TalentChart Marketingwebsite — Design

## Doel

Single-page marketingsite voor TalentChart (B2B SaaS, AI-matching van CV's tegen vacatures voor recruiters). Doel: recruiters overtuigen en laten aanmelden via een formulier. Geen product-functionaliteit (login, upload, matching) — dat is fase 2/3 van het portal, niet van deze site.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- `next/font` voor Inter
- Geen database, geen auth, geen externe runtime dependencies
- Dev-dependencies voor tests: Vitest (unit) + Playwright (e2e)
- Deploybaar op Vercel zonder extra configuratie

## Paginastructuur (`app/page.tsx`, componenten in `components/`)

1. **Hero** — Headline over kernprobleem (te veel CV's, te weinig tijd), subline over AI-matching, CTA-knop "Meld je aan" die smooth-scrollt naar `#aanmelden`.
2. **HowItWorks** — 3 stappen horizontaal (niet genummerde lijst): vacature insturen → AI-matching tegen CV-pool → gemotiveerde top-3 ranking ontvangen. Eigen inline SVG-iconen (envelope, match/sterretjes, ranking/medaille) verbonden met een lijn/pijl tussen de stappen. Op mobiel: stapelt verticaal.
3. **Benefits** — 3-4 kaarten: tijdsbesparing, consistente scoring, branche-onafhankelijk, past in eigen werkproces.
4. **SignupForm** (`id="aanmelden"`, client component) — Velden: naam, bedrijf, e-mail (alle verplicht), toelichting (optioneel, textarea). Client-side validatie op verplichte velden + e-mailformaat. Submit bouwt een `mailto:info@talentchart.nl` link via pure functie `buildMailtoLink(formData)` (in `lib/mailto.ts`) en navigeert daarheen (`window.location.href`). Na submit: bevestigingsmelding tonen (lokale state), formulier blijft ingevuld zichtbaar of wordt verborgen ten gunste van de melding.
5. **Footer** — Naam/logo (tekstueel, geen los logo-bestand), copyright met huidig jaar, e-mailadres.

## Design tokens

- Navy `#0F1F3D` — primair (achtergrond hero/footer, tekst-accenten)
- Teal `#0D9488` — accent (CTA's, highlights, iconen)
- Offwhite `#F8F9FA` — achtergrond secties
- Font: Inter, via `next/font/google`
- Tailwind `theme.extend.colors` voor de drie kleuren; mobile-first, volledig responsive

## Copy

Nederlandse copy, directe toon, geschreven alsof een recruiter het voor recruiters bouwde. Geen marketingjargon, geen onnodige Engelse termen.

## Bestandsstructuur

```
app/
  layout.tsx        — font, metadata, lang="nl"
  page.tsx           — rendert alle secties
components/
  Hero.tsx
  HowItWorks.tsx
  Benefits.tsx
  SignupForm.tsx     — client component
  Footer.tsx
lib/
  mailto.ts          — buildMailtoLink(formData): string (pure functie)
tests/
  mailto.test.ts      — Vitest, unit test buildMailtoLink
e2e/
  homepage.spec.ts    — Playwright
```

## Testing

- **Unit (Vitest)**: `buildMailtoLink()` — correcte subject/body-opbouw, correcte `encodeURIComponent`-toepassing op alle velden, optioneel veld (toelichting) leeg vs. ingevuld.
- **E2E (Playwright)**:
  - Pagina laadt, hero/secties zichtbaar.
  - Klik op hero-CTA scrollt naar formulier (`#aanmelden` in viewport of URL-hash).
  - Submit met lege verplichte velden toont validatiefouten, geen navigatie.
  - Submit met geldige data toont bevestigingsmelding; het element met de mailto-link heeft de verwachte `href` (assertion op attribuut, niet daadwerkelijk klikken — voorkomt dat de browser een externe mail-client/protocol-handler probeert te openen tijdens de test).
- Geen tests voor pure styling/layout (JSX/Tailwind) — niet testbaar gedrag.

## Out of scope

- Backend/API-route voor formulier (bewust gekozen voor `mailto:` i.p.v. `/api/signup`)
- Login, CV-upload, matchingresultaten (fase 2/3 van het portal, ander project-onderdeel)
- CMS of dynamische content
