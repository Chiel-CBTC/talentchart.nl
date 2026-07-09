---
name: TalentChart
description: Zakelijke B2B-marketingpagina voor AI-matching tussen vacatures en CV-pool
colors:
  navy: "#0F1F3D"
  teal: "#0D9488"
  teal-wash: "#0D94881A"
  teal-line: "#0D94884D"
  offwhite: "#F8F9FA"
  white: "#FFFFFF"
  slate-200: "#E2E8F0"
  slate-300: "#CBD5E1"
  slate-600: "#475569"
  error-300: "#FCA5A5"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  container-x: "1.5rem"
  container-max: "64rem"
  form-max: "42rem"
  section-y: "5rem"
  hero-y-mobile: "6rem"
  hero-y-desktop: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  icon-badge:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.teal}"
    rounded: "{rounded.full}"
    size: "64px"
---

# Design System: TalentChart

## 1. Overview

**Creative North Star: "The Recruiter's Desk"**

TalentChart's marketing pagina moet aanvoelen als een tool die een recruiter zelf zou bouwen voor een andere recruiter — niet als een marketingbureau-productie. Elke vorm heeft een functie: navy geeft gewicht en vertrouwen aan het verhaal (het probleem, de belofte), teal wijst zonder omhaal naar de ene actie die telt. Geen versiering die niet ook werkt.

Dit systeem wijst expliciet af wat het niet is: geen speelse consumer-SaaS look — geen felle kleuren, geen ronde illustratieve vormen, geen playful iconography. Dit is een zakelijk instrument, geen consumentenproduct.

**Key Characteristics:**
- Eén primaire kleur (navy) draagt gewicht, één accentkleur (teal) draagt actie — geen derde concurrerende kleur.
- Vlak: geen shadows, geen glow, geen glassmorphism. Diepte komt van kleurblokken en een dunne rand, niet van elevatie.
- Eén lettertype-familie (Inter) in twee gewichten (400/600/700) — geen decoratieve tweede stem.
- Eén call-to-action-vorm herhaald door de hele pagina — de bezoeker leert 'm één keer, herkent 'm overal.

## 2. Colors

Twee dragende kleuren en een neutrale schaal eromheen — geen derde accent, geen verzachtende pastels.

### Primary
- **Ink Navy** (#0F1F3D): draagt het zware werk — hero-achtergrond, footer-achtergrond, aanmeldsectie-achtergrond, en als tekstkleur voor koppen op lichte secties. Dit is de kleur van vertrouwen en gewicht, niet van vrolijkheid.

### Secondary
- **Signal Teal** (#0D9488): het enige signaal voor actie. Uitsluitend op CTA-knoppen, iconen, links en de dunne verbindingslijn tussen de "Hoe het werkt"-stappen. Verschijnt nooit als decoratie, alleen als wegwijzer.
  - **Signal Teal Wash** (#0D94881A, 10% dekking): achtergrond van de ronde icoon-badges in "Hoe het werkt" — teal als sfeer, niet als vlak.
  - **Signal Teal Line** (#0D94884D, 30% dekking): de dunne verbindingslijn tussen processtappen.

### Neutral
- **Offwhite** (#F8F9FA): achtergrond van de "Hoe het werkt"-sectie — de rustigste ondergrond in het systeem.
- **White** (#FFFFFF): achtergrond van de "Voordelen"-sectie en van form-velden.
- **Slate 200** (#E2E8F0): randkleur van voordeel-kaarten op witte achtergrond.
- **Slate 300** (#CBD5E1): gedempte footer-tekst op navy.
- **Slate 600** (#475569): body-tekst van kaartbeschrijvingen op lichte achtergronden.
- **Error 300** (#FCA5A5): foutmeldingen in het formulier, op navy-achtergrond.

### Named Rules
**The Two-Color Rule.** Navy draagt gewicht, teal draagt actie. Geen enkel ander kleuraccent komt erbij — geen derde "vrolijke" kleur, geen gradient tussen de twee.

## 3. Typography

**Display/Body Font:** Inter (met `system-ui, sans-serif` als fallback)

**Character:** Eén stem, geen tweede lettertype voor sfeer. Gewicht (400/500/600/700) doet al het werk dat een tweede font zou moeten doen — dat is genoeg voor een pagina die vertrouwen wil wekken zonder op te vallen.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 5vw, 3rem)`, line-height 1.1): de hero-headline — het enige element dat de kernboodschap in één oogopslag mag dragen.
- **Headline** (700, `clamp(1.5rem, 3vw, 1.875rem)`, line-height 1.25): sectietitels ("Hoe het werkt", "Waarom recruiters TalentChart gebruiken", "Meld je aan").
- **Title** (600, 1rem, line-height 1.4): kaarttitels en stap-titels binnen een sectie.
- **Body** (400, 1rem, line-height 1.6): hero-subline (iets groter, tot 1.25rem op desktop) en formulier-omschrijvingen. Regellengte blijft binnen 65–75ch door de `max-w-2xl`/`max-w-5xl`-containers.
- **Label** (500, 0.875rem, line-height 1.4): formulierlabels en kaartbeschrijvingen.

### Named Rules
**The One Voice Rule.** Eén font-familie, gedragen door gewicht — geen tweede typeface, ook niet voor labels of monospace-achtige elementen.

## 4. Elevation

Dit systeem gebruikt geen shadows. Diepte ontstaat uit kleurblok-wisseling (navy → offwhite → white → navy) en, bij de enige kaartvorm in het systeem, een dunne rand (1px, slate-200) in plaats van een schaduw. Niets "zweeft" boven de pagina.

### Named Rules
**The Flat-By-Default Rule.** Geen `box-shadow` waar dan ook. Scheiding tussen secties komt van achtergrondkleur, niet van drop-shadow of laag-suggestie.

## 5. Components

Zelfverzekerd en onopgesmukt: elke component doet precies één ding, zonder decoratieve laag eromheen.

### Buttons
- **Shape:** afgeronde hoeken, 6px (`rounded-md`).
- **Primary (enige variant in het systeem):** achtergrond Signal Teal, tekst wit, `font-semibold`, padding 12px 24px (`px-6 py-3`). Dezelfde knop-vorm wordt hergebruikt voor zowel de hero-CTA (`<a>`) als de formulier-submit (`<button>`) — één herkenbare actievorm door de hele pagina.
- **Hover / Focus:** `opacity: 0.9` bij hover, met `transition` op alle eigenschappen. Geen kleurverandering, geen transform, geen schaduw-toename.
- **Secondary / Ghost:** bestaat niet in dit systeem — er is precies één call-to-action-vorm.

### Cards
- **Corner Style:** 8px (`rounded-lg`).
- **Background:** wit, op de witte sectie-achtergrond (Voordelen).
- **Shadow Strategy:** geen — zie Elevation. Scheiding komt van de rand.
- **Border:** 1px, Slate 200 (#E2E8F0).
- **Internal Padding:** 24px (`p-6`).

### Inputs / Fields
- **Style:** witte achtergrond, 1px rand Slate 300, 6px hoeken (`rounded-md`), tekst in Ink Navy, padding 8px 12px.
- **Focus:** standaard browser-focusring (geen custom focus-treatment toegevoegd — een aandachtspunt voor een volgende `/impeccable polish`-pas).
- **Error:** foutmelding verschijnt als Error 300-tekst direct onder het veld (`mt-1 text-sm`), niet als randkleur-verandering op het veld zelf.

### Icon Badges (signature component)
Rond, 64px (`h-16 w-16 rounded-full`), achtergrond Signal Teal Wash (10% dekking), icoon in Signal Teal. Gebruikt in "Hoe het werkt" om de drie stappen te markeren zonder een zware kleurvlak te introduceren — teal als sfeer, niet als blok.

### Navigation
Geen navigatiebalk. Dit is een single-page scroll-pagina; de enige "navigatie" is de hero-CTA die met `scroll-behavior: smooth` naar `#aanmelden` springt.

## 6. Do's and Don'ts

### Do:
- **Do** navy (#0F1F3D) gebruiken voor gewicht (achtergronden, koppen) en teal (#0D9488) uitsluitend voor actie (knoppen, iconen, links).
- **Do** dezelfde knopvorm (teal, wit, `rounded-md`, `px-6 py-3`) hergebruiken voor elke call-to-action op de pagina — nooit een tweede knopstijl introduceren.
- **Do** vlakke kaarten met een dunne rand (1px, slate-200) gebruiken voor gegroepeerde content, nooit een schaduw.
- **Do** Nederlandse copy schrijven, direct en zonder marketingjargon — consistent met PRODUCT.md's "gebouwd door een recruiter, voor een recruiter".

### Don't:
- **Don't** een speelse consumer-SaaS look toevoegen: geen felle kleuren, geen ronde illustratieve iconen, geen playful iconography (PRODUCT.md anti-referentie).
- **Don't** een derde accentkleur introduceren naast navy en teal.
- **Don't** `box-shadow` gebruiken — dit systeem is bewust vlak (zie Elevation).
- **Don't** gradient-text of gradient-achtergronden gebruiken op koppen of knoppen.
- **Don't** een tweede lettertype-familie toevoegen voor "sfeer" — gewicht binnen Inter is genoeg.
