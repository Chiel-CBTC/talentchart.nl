# Social-proof Testimonial Sectie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Voeg een testimonial-sectie toe aan de talentchart.nl homepage met een citaat van Joris van Aalst (eigenaar Matching Consultants), geplaatst tussen de Privacy-sectie en het aanmeldformulier.

**Architecture:** Eén nieuw, puur presentational React-component (`Testimonial.tsx`, geen state, geen logica) plus één statisch logo-asset, ingevoegd op een vaste plek in de bestaande `app/page.tsx` sectievolgorde. Geen nieuwe dependencies, geen server-side logica.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS (utility classes, geen nieuwe design tokens), `next/image`, Playwright (e2e test), pngjs (alleen als eenmalig build-hulpmiddel buiten de repo, niet als projectdependency).

## Global Constraints

- Design-systeem: `DESIGN.md` — navy (`#0F1F3D`) en teal zijn de enige twee kleuren; geen derde accentkleur, geen shadows, geen glow.
- Kaartstijl: witte achtergrond, 1px `slate-200`-rand, `rounded-lg`, geen shadow (zie `DESIGN.md` §4 Elevation) — dit is de enige toegestane "verhoogde" vorm in het systeem.
- Geen prijsvermelding in de testimonial-tekst (pricing nog niet bepaald).
- Exacte citaat-tekst (al akkoord met chiel als concept, definitieve versie volgt na goedkeuring van Joris van Aalst — buiten scope van deze implementatie):
  > "Ik was altijd veel tijd kwijt aan het handmatig scannen van CV's bij nieuwe aanvragen. Ik wilde gewoon een simpele manier om dit proces te versnellen. Met TalentChart lukt dit fantastisch: ik stuur mijn aanvraag gewoon door en binnen no time heb ik inzicht in wie van mijn kandidaten het meest geschikt is, mét een goede motivatie!"
- Toeschrijving: "Joris van Aalst" (naam) — "eigenaar Matching Consultants" (functie/bedrijf).
- Nooit committen/pushen zonder chiel's expliciete bevestiging per actie (staande afspraak). Altijd via een feature branch + PR, nooit direct naar `main` (staande afspraak). Branch `feature/social-proof-testimonial` bestaat al en heeft de design-spec-commit erop — werk hierop door, maak geen nieuwe branch.
- Voor elke commit: `npm run build`, `npx tsc --noEmit`, `npm test`, `npm run lint` en `npm run test:e2e` moeten allemaal slagen (dit zijn ook de checks die de CI-workflow `.github/workflows/ci.yml` draait).

---

## File Structure

- Create: `public/logos/matching-consultants-icon.png` — het uitgesneden "MC"-icoon (zonder wordmark-tekst), gebruikt door `Testimonial.tsx`.
- Create: `components/Testimonial.tsx` — het nieuwe, presentational testimonial-component.
- Modify: `app/page.tsx` — import en plaatsing van `<Testimonial />` tussen `<PrivacyNote />` en `<SignupForm />`.
- Modify: `e2e/homepage.spec.ts` — nieuw testblok dat de sectie, het citaat, de naam en de DOM-volgorde controleert.

---

### Task 1: Logo-asset voorbereiden

**Files:**
- Create: `public/logos/matching-consultants-icon.png`

**Interfaces:**
- Produces: een PNG-bestand op `public/logos/matching-consultants-icon.png`, bevat alleen het oranje "MC"-icoon (geen wordmark-tekst), transparante achtergrond, ~105×81px. Task 3 gebruikt dit pad als `src` van een `next/image` `<Image>`.

Dit is geen logica-taak (puur een static asset), dus geen test-cyclus — wel expliciete verificatie-stappen.

- [ ] **Stap 1: Bronbestand ophalen (indien nog niet aanwezig op `/tmp/matching-consultants-logo.png`)**

Het brondomein `matchingconsultants.nl` geeft zelf 403 Forbidden (bot-blokkade). Het logo is wel op te halen via de sponsorpagina van NAC Zaken, waar Matching Consultants als sponsor genoemd wordt:

```bash
node -e '
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto("https://www.nac-zaken.nl/bedrijvengids/matching-consultants", { waitUntil: "networkidle", timeout: 30000 });
  const b64 = await page.evaluate(async () => {
    const res = await fetch("https://www.nac-zaken.nl/cache/3935899eb23dea6c45cf17a3f760d388/matching.png");
    const buf = await res.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  });
  fs.writeFileSync("/tmp/matching-consultants-logo.png", Buffer.from(b64, "base64"));
  console.log("saved", Buffer.from(b64, "base64").length, "bytes");
  await browser.close();
})();
'
```

Run dit vanuit `/home/chiel/git/talentchart.nl` (playwright staat daar al als dependency; als `/usr/bin/chromium` niet bestaat op het systeem, installeer met `apk add --no-cache chromium` — vereist root).

Expected: `saved 6063 bytes` (of vergelijkbaar, een paar KB), en `file /tmp/matching-consultants-logo.png` toont `PNG image data, 248 x 81`.

- [ ] **Stap 2: Crop-tool los van de repo opzetten**

Niet `npm install pngjs` in `talentchart.nl` zelf draaien — dit systeem heeft `NODE_ENV=production` staan, wat `npm install` van een los pakket kan laten conflicteren met de bestaande devDependencies-boom. Gebruik een scratch-directory:

```bash
mkdir -p /tmp/imgtools && cd /tmp/imgtools && npm init -y >/dev/null 2>&1 && npm install pngjs
```

Expected: `added 1 package` (geen fouten).

- [ ] **Stap 3: Icoon uitsnijden**

Het bronbestand (248×81px) bevat het "MC"-icoon in kolommen 0–99 en de wordmark-tekst "matching consultants" vanaf kolom ~110. Snijd bij kolom 105 (laat een kleine marge, geen tekst-pixels):

```bash
cd /tmp/imgtools && node -e '
const { PNG } = require("pngjs");
const fs = require("fs");
const src = PNG.sync.read(fs.readFileSync("/tmp/matching-consultants-logo.png"));
const cropW = 105, cropH = src.height;
const out = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = (src.width * y + x) << 2;
    const dstIdx = (cropW * y + x) << 2;
    out.data[dstIdx] = src.data[srcIdx];
    out.data[dstIdx + 1] = src.data[srcIdx + 1];
    out.data[dstIdx + 2] = src.data[srcIdx + 2];
    out.data[dstIdx + 3] = src.data[srcIdx + 3];
  }
}
fs.writeFileSync("/tmp/matching-consultants-icon-crop.png", PNG.sync.write(out));
console.log("done", cropW, cropH);
'
```

Expected: `done 105 81`.

- [ ] **Stap 4: Visueel verifiëren**

```bash
cd /home/chiel/git/talentchart.nl && node -e '
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 400, height: 200 } });
  const b64 = fs.readFileSync("/tmp/matching-consultants-icon-crop.png").toString("base64");
  await page.setContent(`<html><body style="margin:0;background:#fff;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="data:image/png;base64,${b64}" style="width:150px;"/></body></html>`);
  await page.screenshot({ path: "/tmp/icon-crop-verify.png" });
  await browser.close();
})();
'
```

Bekijk `/tmp/icon-crop-verify.png` (bijv. met de Read-tool). Expected: alleen het oranje "MC"-vierkant, geen tekst, geen afgesneden randen.

- [ ] **Stap 5: Naar de repo kopiëren**

```bash
mkdir -p /home/chiel/git/talentchart.nl/public/logos
cp /tmp/matching-consultants-icon-crop.png /home/chiel/git/talentchart.nl/public/logos/matching-consultants-icon.png
file /home/chiel/git/talentchart.nl/public/logos/matching-consultants-icon.png
```

Expected: `PNG image data, 105 x 81, 8-bit/color RGBA` (of vergelijkbaar colormap-type — moet in elk geval 105×81 zijn).

- [ ] **Stap 6: Committen**

```bash
cd /home/chiel/git/talentchart.nl
git add public/logos/matching-consultants-icon.png
git commit -m "feat: voeg uitgesneden Matching Consultants icoon toe

Alleen het MC-icoon (zonder wordmark-tekst) uit het brondocument,
zodat het niet dubbelop is met de tekstuele toeschrijving in de
testimonial-sectie."
```

(Vraag chiel om bevestiging vóór deze commit — staande afspraak.)

---

### Task 2: Falende e2e-test schrijven (Red)

**Files:**
- Modify: `e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: niets van Task 1 direct (de test controleert het gerenderde resultaat, niet het bestandspad).
- Produces: een test die pas slaagt zodra Task 3 `Testimonial.tsx` heeft geïmplementeerd en in `app/page.tsx` heeft geplaatst.

- [ ] **Stap 1: Test toevoegen**

Voeg dit nieuwe testblok toe aan het einde van `e2e/homepage.spec.ts` (na de laatste bestaande `test(...)`, vóór het einde van het bestand):

```typescript
test("testimonial-sectie toont citaat van Matching Consultants tussen privacy-note en aanmeldformulier", async ({
  page,
}) => {
  await page.goto("/");

  const quote = page.getByText(/handmatig scannen van cv's/i);
  await expect(quote).toBeVisible();
  await expect(page.getByText("Joris van Aalst")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Matching Consultants" })
  ).toBeVisible();

  const privacyBox = await page
    .getByRole("heading", { name: "Privacy & data" })
    .boundingBox();
  const quoteBox = await quote.boundingBox();
  const signupBox = await page
    .getByRole("heading", { name: "Meld je aan" })
    .boundingBox();

  expect(privacyBox?.y).toBeLessThan(quoteBox?.y ?? Infinity);
  expect(quoteBox?.y).toBeLessThan(signupBox?.y ?? Infinity);
});
```

- [ ] **Stap 2: Verifiëren dat de test faalt**

Run: `cd /home/chiel/git/talentchart.nl && npm run test:e2e -- -g "testimonial-sectie"`

Expected: FAIL — `getByText(/handmatig scannen van cv's/i)` vindt niets (`Timed out ... waiting for locator ... to be visible`), want het component bestaat nog niet.

- [ ] **Stap 3: Committen**

```bash
git add e2e/homepage.spec.ts
git commit -m "test: falende e2e-test voor testimonial-sectie (TDD red)"
```

(Vraag chiel om bevestiging vóór deze commit.)

---

### Task 3: Testimonial-component implementeren (Green)

**Files:**
- Create: `components/Testimonial.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `public/logos/matching-consultants-icon.png` (Task 1) als `<Image src="/logos/matching-consultants-icon.png" .../>`.
- Produces: default export `Testimonial` (React-componentfunctie, geen props), geïmporteerd in `app/page.tsx` als `Testimonial`.

- [ ] **Stap 1: Component maken**

Maak `components/Testimonial.tsx` met exact deze inhoud:

```tsx
import Image from "next/image";

export default function Testimonial() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-lg text-navy sm:text-xl">
            &quot;Ik was altijd veel tijd kwijt aan het handmatig scannen van
            CV&apos;s bij nieuwe aanvragen. Ik wilde gewoon een simpele
            manier om dit proces te versnellen. Met TalentChart lukt dit
            fantastisch: ik stuur mijn aanvraag gewoon door en binnen no time
            heb ik inzicht in wie van mijn kandidaten het meest geschikt is,
            mét een goede motivatie!&quot;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Image
              src="/logos/matching-consultants-icon.png"
              alt="Matching Consultants"
              width={53}
              height={41}
              className="h-8 w-auto"
            />
            <span className="text-left text-sm text-slate-600">
              <span className="block font-semibold text-navy">
                Joris van Aalst
              </span>
              eigenaar Matching Consultants
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Stap 2: In de pagina plaatsen**

In `app/page.tsx`, voeg de import toe direct na de `PrivacyNote`-import:

```tsx
import PrivacyNote from "@/components/PrivacyNote";
import Testimonial from "@/components/Testimonial";
import SignupForm from "@/components/SignupForm";
```

En plaats het component tussen `<PrivacyNote />` en `<SignupForm />`:

```tsx
      <PrivacyNote />
      <Testimonial />
      <SignupForm />
```

Het volledige bestand moet er na deze wijziging zo uitzien:

```tsx
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import PrivacyNote from "@/components/PrivacyNote";
import Testimonial from "@/components/Testimonial";
import SignupForm from "@/components/SignupForm";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <main>
      <StickyBar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <PrivacyNote />
      <Testimonial />
      <SignupForm />
      <Footer />
    </main>
  );
}
```

- [ ] **Stap 3: Verifiëren dat de e2e-test slaagt**

Run: `npm run test:e2e -- -g "testimonial-sectie"`

Expected: PASS (1 test passed).

- [ ] **Stap 4: Volledige verificatie-suite draaien**

```bash
npm run build
npx tsc --noEmit
npm test -- --run
npm run lint
npm run test:e2e
```

Expected: alle vijf commando's slagen zonder fouten (build compileert, tsc geen output, alle unit tests groen, lint geen problemen, alle e2e-tests inclusief de nieuwe groen).

- [ ] **Stap 5: Committen**

```bash
git add components/Testimonial.tsx app/page.tsx
git commit -m "feat: voeg testimonial-sectie toe met citaat van Matching Consultants

Sectie tussen PrivacyNote en SignupForm, conform het ontwerp in
docs/superpowers/specs/2026-07-21-social-proof-testimonial-design.md.
Concept-citaat, definitieve tekst volgt na akkoord van Joris van Aalst."
```

(Vraag chiel om bevestiging vóór deze commit.)

---

### Task 4: Branch pushen en PR aanmaken

**Files:** geen (git/GitHub-acties)

- [ ] **Stap 1: Pushen**

```bash
git push -u origin feature/social-proof-testimonial
```

(Vraag chiel om bevestiging vóór deze push — staande afspraak.)

- [ ] **Stap 2: PR aanmaken**

Gebruik de GitHub API (zoals eerder in deze sessie gedaan voor PR #5/#6 — `gh` CLI is niet beschikbaar op deze server) met `base: "main"`, `head: "feature/social-proof-testimonial"`, titel bijv. "Voeg testimonial-sectie toe (Matching Consultants)", en een body die vermeldt dat de citaat-tekst nog concept is tot Joris van Aalst akkoord geeft.

- [ ] **Stap 3: Wachten op CI en rapporteren**

Poll de check-run "Lint, unit & e2e tests" op de laatste commit-sha totdat die `completed`/`success` is (zie eerdere sessie voor het exacte pollingpatroon via de GitHub API), en meld de PR-URL aan chiel. Niet zelf mergen zonder expliciete instructie.

---

## Self-Review

**Spec coverage:** testimonial i.p.v. logo-rij (Task 3), plaatsing na PrivacyNote/voor SignupForm (Task 2 test + Task 3 wiring), witte kaart conform DESIGN.md (Task 3 styling), alleen MC-icoon zonder wordmark-tekst (Task 1), geen sectiekop (Task 3 heeft geen `<h2>`), geen prijsvermelding (Global Constraints + citaattekst), TDD via e2e-test in bestaand `homepage.spec.ts` (Task 2), branch+PR-workflow met bevestiging per actie (Task 4 + Global Constraints). Alle spec-punten gedekt.

**Placeholder scan:** geen TBD/TODO; alle codeblokken zijn compleet en direct toepasbaar.

**Type/naam-consistentie:** component-naam `Testimonial` consistent tussen Task 3's bestandsnaam, default export en `app/page.tsx`-import. Asset-pad `/logos/matching-consultants-icon.png` consistent tussen Task 1 (waar het bestand terechtkomt) en Task 3 (waar het als `src` wordt gebruikt).
