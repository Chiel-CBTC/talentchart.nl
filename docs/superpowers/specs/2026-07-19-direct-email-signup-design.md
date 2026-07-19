# Design: aanmeldformulier verstuurt direct e-mail (Gmail SMTP)

**Datum:** 2026-07-19
**Status:** goedgekeurd, klaar voor implementatieplan

## Probleem

Het aanmeldformulier (`components/SignupForm.tsx`) bouwt op dit moment een
`mailto:`-link en redirect de browser daarnaartoe (`lib/mailto.ts`,
`buildMailtoLink`). Dit faalt stil op apparaten zonder geconfigureerde
mailclient — de gebruiker ziet geen foutmelding, alleen een lege actie. Er is
een client-side fallback (`buildClipboardText` + kopieerknop), maar die lost
het onderliggende probleem niet op: de aanmelding wordt niet betrouwbaar
verzonden.

## Oplossing

Het formulier verstuurt de e-mail server-side, via een Next.js **Server
Action** die **Nodemailer** gebruikt over **Gmail SMTP**, ingelogd met het
bestaande Google Workspace-account `info@talentchart.nl` en een App Password.
Geen mailclient-afhankelijkheid meer, geen kopieer-fallback nodig.

### Waarom Server Action i.p.v. API Route

Next.js App Router ondersteunt zowel Server Actions als API routes voor dit
soort server-side werk. Server Action is gekozen omdat:
- geen aparte route/fetch/JSON-parsing-boilerplate nodig is — de bestaande
  `onSubmit`-handler in `SignupForm.tsx` roept de action direct aan;
- het aansluit bij de projectconventie "formulieren zonder `<form>`-submit,
  gebruik event handlers" (CLAUDE.md).

### Waarom Gmail SMTP i.p.v. een transactionele e-mail-API (Resend, etc.)

De gebruiker heeft al een Google Workspace-mailbox (`info@talentchart.nl`) en
wil geen nieuwe externe dienst/account toevoegen. Gmail's verzendlimiet
(~500/dag) is ruim voldoende voor een contactformulier met laag volume.
`GMAIL_USER` en `GMAIL_APP_PASSWORD` staan al in `.env.local`.

## Architectuur

### 1. E-mail-opbouw (vervangt `lib/mailto.ts`)

Nieuwe module (bv. `lib/email.ts`) met een pure functie die van
`SignupFormData` een `{ subject, text }` (of vergelijkbaar Nodemailer
`Mail.Options`-fragment) maakt. Herbruikt de bestaande onderwerp/body-opbouw
uit `composeEmail()` in `lib/mailto.ts`, maar zonder URL-encoding — dit is nu
input voor Nodemailer, niet voor een `mailto:`-URL.

`buildMailtoLink` en `buildClipboardText` worden verwijderd; ze zijn niet meer
nodig zodra verzending server-side gebeurt.

### 2. Server Action (bv. `app/actions/sendSignupEmail.ts`, `"use server"`)

- Input: `SignupFormData` (name, company, email, message).
- Bouwt de mail met de e-mail-opbouwfunctie uit `lib/email.ts`.
- Verstuurt via Nodemailer (`nodemailer.createTransport({ service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD
  } })`):
  - `to: "info@talentchart.nl"`
  - `replyTo: <aanmelder-email>` — zodat "Beantwoorden" in Gmail direct naar
    de aanmelder gaat.
  - `subject`, `text` uit de e-mail-opbouwfunctie.
- Retourneert een resultaat-object (bv. `{ ok: true }` of `{ ok: false, error:
  string }`) — geen exceptions naar de client laten lekken; de action vangt
  Nodemailer-fouten zelf af en geeft een nette foutindicatie terug.

### 3. Client-flow (`SignupForm.tsx`)

`handleSubmit` wordt asynchroon:
1. `event.preventDefault()`, client-side `validate()` zoals nu.
2. Bij geldige data: state `sending = true`, roep de server action aan.
3. Bij `{ ok: true }`: state `submitted = true`. Bedanktekst wordt aangepast
   — geen taal meer over "je e-mailprogramma zou moeten openen"; simpelweg
   bevestigen dat de aanmelding is verzonden. Geen mailto-link, geen
   kopieerknop meer (die UI en de bijbehorende `mailtoHref`/`copied`/
   `handleCopy`-state worden verwijderd).
4. Bij `{ ok: false }`: state `error = string` (Nederlandse foutmelding),
   `sending = false`. Formulierwaarden blijven behouden zodat de gebruiker
   opnieuw kan versturen. Geen fallback-UI (bewuste keuze — geen
   kopieer-fallback bij mislukte send).
5. Foutmelding wordt getoond in dezelfde stijl als de bestaande veldfouten
   (`text-red-300` o.i.d.), boven de submit-knop. Knoptekst blijft
   "Versturen".

## Wat wordt verwijderd

- `lib/mailto.ts` (`buildMailtoLink`, `buildClipboardText`) en de
  bijbehorende tests in `lib/mailto.test.ts` — vervangen door
  `lib/email.ts` + nieuwe tests.
- In `SignupForm.tsx`: `mailtoHref`, `submittedData`, `copied` state, de
  `handleCopy`-functie, en de mailto-link/kopieerknop-JSX in de
  bedankt-sectie.
- De `window.location.href = href`-redirect.

## Testen (TDD)

- **Vitest (unit)**: nieuwe tests voor de e-mail-opbouwfunctie in `lib/
  email.ts` (data-in/data-out, geen SMTP). Tests voor de server action met
  `vi.mock("nodemailer")` — controleren dat `createTransport`/`sendMail` met
  de juiste argumenten wordt aangeroepen, en dat een gegooide/afgewezen
  `sendMail`-call resulteert in `{ ok: false, error }` i.p.v. een
  ongevangen exception. Geen echte SMTP-call, geen echte credentials nodig
  in CI.
- **Playwright (e2e)**: bestaande signup-flow-test (die nu op de
  `mailto-link`-test-id checkt) wordt aangepast — verwacht geen
  `mailto:`-redirect meer, maar dat na submit de (aangepaste) bedanktekst
  verschijnt. De server action wordt in e2e-context gemockt/omzeild zodat er
  nooit een echte mail verstuurd wordt tijdens een test-run.
- **CI**: de bestaande GitHub Actions-workflow (lint/unit/e2e) moet zonder
  een echte `GMAIL_APP_PASSWORD` kunnen draaien — de Nodemailer-mock in de
  unit-tests en de gemockte server action in e2e dekken dat af.

## Buiten scope

- Geen kopieer-naar-klembord-fallback bij een mislukte send (bewuste keuze).
- Geen alternatieve e-mail-provider (Resend, SMTP via een ander account) —
  vastgezet op Gmail SMTP met het bestaande Workspace-account.
- Geen wijziging aan de client-side veldvalidatie (`validate()`) — die blijft
  ongewijzigd.
