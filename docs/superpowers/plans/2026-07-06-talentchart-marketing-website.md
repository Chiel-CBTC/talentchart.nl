# TalentChart Marketing Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js marketing website for TalentChart (B2B SaaS AI-matching tool for recruiters) with a mailto-based signup form, deployable to Vercel with zero configuration.

**Architecture:** Next.js App Router site with one route (`/`) composed of five presentational sections plus one client-side form component. All business logic (building the `mailto:` link) lives in a single pure function so it can be unit tested; everything else is static JSX styled with Tailwind. No backend, no database, no auth.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3, `next/font/google` (Inter), Vitest (unit tests), Playwright (e2e tests).

## Global Constraints

- Nederlandse copy overal; geen Engelse marketingtermen waar Nederlands ook werkt.
- Kleuren exact: navy `#0F1F3D`, teal `#0D9488`, offwhite `#F8F9FA` — als Tailwind theme-kleuren (`navy`, `teal`, `offwhite`).
- Typografie: Inter via `next/font/google`.
- Mobile-first, volledig responsive.
- Geen database, geen auth, geen runtime dependencies buiten Next.js/React.
- Geen `/api`-route voor het formulier — submit gaat via een `mailto:info@talentchart.nl`-link.
- TDD verplicht voor `buildMailtoLink` (de enige pure logica in dit project). Geen unit tests voor pure JSX/Tailwind-secties.
- Playwright e2e-tests klikken nooit daadwerkelijk op de mailto-link (opent een externe mail-client/protocol-handler) — een `href`-attribute-assertion volstaat.
- App moet zonder extra configuratie deploybaar zijn op Vercel.

---

### Task 1: Project scaffold (Next.js + TypeScript + Tailwind)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.eslintrc.json`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (placeholder, replaced in Task 5)
- Modify: `.gitignore` (add Next.js build artifacts)

**Interfaces:**
- Produces: Tailwind theme colors `navy` (`#0F1F3D`), `teal` (`#0D9488`), `offwhite` (`#F8F9FA`), available to every later task via `className="bg-navy"` etc.
- Produces: `RootLayout` in `app/layout.tsx` applying Inter font and `bg-offwhite text-navy` globally.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "talentchart-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.46.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 4: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 5: Create `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F3D",
        teal: "#0D9488",
        offwhite: "#F8F9FA",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 8: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 9: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentChart — AI-matching voor recruiters",
  description:
    "TalentChart matcht jouw vacatures razendsnel tegen je CV-pool en levert een gemotiveerde top-3 ranking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-offwhite text-navy`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main>
      <p className="p-6">TalentChart</p>
    </main>
  );
}
```

- [ ] **Step 11: Add Next.js build artifacts to `.gitignore`**

Append to the existing `.gitignore` (keep the earlier entries intact):

```
.vercel
```

- [ ] **Step 12: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json`.

- [ ] **Step 13: Verify the scaffold builds**

Run: `npm run build`
Expected: `✓ Compiled successfully` and a `.next` directory is created.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts next.config.mjs tailwind.config.ts postcss.config.js .eslintrc.json app/globals.css app/layout.tsx app/page.tsx .gitignore
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind project"
```

---

### Task 2: `buildMailtoLink` pure function (TDD) + Vitest setup

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/mailto.ts`
- Create: `tests/mailto.test.ts`
- Modify: `package.json` (already has `vitest` devDependency and `test` script from Task 1 — no change needed here)

**Interfaces:**
- Produces: `interface SignupFormData { name: string; company: string; email: string; message?: string }` in `lib/mailto.ts`.
- Produces: `buildMailtoLink(data: SignupFormData): string` in `lib/mailto.ts`, returns a full `mailto:info@talentchart.nl?subject=...&body=...` URL with `encodeURIComponent`-encoded subject/body. Consumed by `components/SignupForm.tsx` in Task 4.

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Write the failing tests in `tests/mailto.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { buildMailtoLink } from "../lib/mailto";

describe("buildMailtoLink", () => {
  it("bouwt een mailto-link met subject en body zonder toelichting", () => {
    const link = buildMailtoLink({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(link).toContain("mailto:info@talentchart.nl?");
    expect(link).toContain(
      "subject=" + encodeURIComponent("Aanmelding TalentChart — Acme BV")
    );
    expect(link).toContain(encodeURIComponent("Naam: Jan Jansen"));
    expect(link).toContain(encodeURIComponent("Bedrijf: Acme BV"));
    expect(link).toContain(encodeURIComponent("E-mail: jan@acme.nl"));
    expect(link).not.toContain(encodeURIComponent("Toelichting:"));
  });

  it("voegt toelichting toe aan de body wanneer ingevuld", () => {
    const link = buildMailtoLink({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "We zoeken een senior developer.",
    });

    expect(link).toContain(encodeURIComponent("Toelichting:"));
    expect(link).toContain(
      encodeURIComponent("We zoeken een senior developer.")
    );
  });

  it("negeert een lege of whitespace-only toelichting", () => {
    const link = buildMailtoLink({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "   ",
    });

    expect(link).not.toContain(encodeURIComponent("Toelichting:"));
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/mailto.test.ts`
Expected: FAIL — `Cannot find module '../lib/mailto'` (file does not exist yet).

- [ ] **Step 4: Implement `lib/mailto.ts`**

```ts
export interface SignupFormData {
  name: string;
  company: string;
  email: string;
  message?: string;
}

const RECIPIENT = "info@talentchart.nl";

export function buildMailtoLink(data: SignupFormData): string {
  const subject = `Aanmelding TalentChart — ${data.company}`;
  const bodyLines = [
    `Naam: ${data.name}`,
    `Bedrijf: ${data.company}`,
    `E-mail: ${data.email}`,
  ];

  if (data.message && data.message.trim().length > 0) {
    bodyLines.push("", "Toelichting:", data.message);
  }

  const body = bodyLines.join("\n");
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

  return `mailto:${RECIPIENT}?${query}`;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/mailto.test.ts`
Expected: `3 passed`

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts lib/mailto.ts tests/mailto.test.ts
git commit -m "feat: add buildMailtoLink with unit tests"
```

---

### Task 3: Static content sections (Hero, HowItWorks, Benefits, Footer)

**Files:**
- Create: `components/Hero.tsx`
- Create: `components/HowItWorks.tsx`
- Create: `components/Benefits.tsx`
- Create: `components/Footer.tsx`

**Interfaces:**
- Produces: `export default function Hero(): JSX.Element` — contains an `<a href="#aanmelden">Meld je aan</a>` CTA.
- Produces: `export default function HowItWorks(): JSX.Element`.
- Produces: `export default function Benefits(): JSX.Element`.
- Produces: `export default function Footer(): JSX.Element`.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
export default function Hero() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          Te veel CV&apos;s. Te weinig tijd. Wij lossen dat op.
        </h1>
        <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
          TalentChart matcht jouw vacature razendsnel tegen je eigen CV-pool
          met AI en levert je een gemotiveerde top-3 kandidaten. Geen
          eindeloos scrollen door stapels CV&apos;s meer.
        </p>
        <a
          href="#aanmelden"
          className="rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Meld je aan
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/HowItWorks.tsx`**

```tsx
function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3z" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  );
}

function RankingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <path d="M8 21V13a4 4 0 018 0v8" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const steps = [
  {
    title: "Stuur je vacature in",
    description:
      "Via e-mail of straks direct via het portal — jij bepaalt wat je invult.",
    Icon: EnvelopeIcon,
  },
  {
    title: "AI matcht tegen je CV-pool",
    description:
      "TalentChart vergelijkt de vacature met alle CV's in jouw eigen pool.",
    Icon: MatchIcon,
  },
  {
    title: "Ontvang je top-3",
    description:
      "Een gemotiveerde ranking van de drie beste kandidaten, direct bruikbaar.",
    Icon: RankingIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Hoe het werkt
        </h2>
        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-1 flex-col items-center gap-10 text-center sm:flex-row sm:text-left"
            >
              <div className="flex flex-1 flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <step.Icon />
                </div>
                <h3 className="font-semibold text-navy">{step.title}</h3>
                <p className="max-w-xs text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="h-10 w-px bg-teal/30 sm:h-px sm:w-16 sm:self-center"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/Benefits.tsx`**

```tsx
const benefits = [
  {
    title: "Tijdsbesparing",
    description:
      "Geen dagen meer kwijt aan het handmatig doorspitten van CV's — de eerste selectie is in minuten klaar.",
  },
  {
    title: "Consistente scoring",
    description:
      "Elke kandidaat wordt op dezelfde criteria beoordeeld, zonder ruis van een lange werkdag of onderbuikgevoel.",
  },
  {
    title: "Branche-onafhankelijk",
    description:
      "Of je nu techniek, zorg of finance werft — TalentChart matcht op basis van de vacaturetekst die jij aanlevert.",
  },
  {
    title: "Past in jouw werkproces",
    description:
      "Je blijft vacatures insturen zoals je gewend bent. Geen nieuw systeem waar je omheen moet werken.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Waarom recruiters TalentChart gebruiken
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-navy">{benefit.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/Footer.tsx`**

```tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm">
        <span className="font-semibold text-white">TalentChart</span>
        <span>&copy; {year} TalentChart. Alle rechten voorbehouden.</span>
        <a
          href="mailto:info@talentchart.nl"
          className="text-teal hover:underline"
        >
          info@talentchart.nl
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/Hero.tsx components/HowItWorks.tsx components/Benefits.tsx components/Footer.tsx
git commit -m "feat: add Hero, HowItWorks, Benefits and Footer sections"
```

---

### Task 4: SignupForm component

**Files:**
- Create: `components/SignupForm.tsx`

**Interfaces:**
- Consumes: `buildMailtoLink(data: SignupFormData): string` and `SignupFormData` from `@/lib/mailto` (Task 2).
- Produces: `export default function SignupForm(): JSX.Element` — client component with `id="aanmelden"` on its root `<section>`, a submit button with accessible name `"Versturen"`, and (after successful submit) a confirmation heading `"Bedankt voor je aanmelding!"` plus an `<a data-testid="mailto-link">` whose `href` is the value returned by `buildMailtoLink`. Consumed by `app/page.tsx` in Task 5 and by the e2e tests in Task 6.

- [ ] **Step 1: Create `components/SignupForm.tsx`**

```tsx
"use client";

import { useState, FormEvent } from "react";
import { buildMailtoLink } from "@/lib/mailto";

interface FormValues {
  name: string;
  company: string;
  email: string;
  message: string;
}

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (values.name.trim().length === 0) {
      nextErrors.name = "Vul je naam in.";
    }
    if (values.company.trim().length === 0) {
      nextErrors.company = "Vul je bedrijfsnaam in.";
    }
    if (values.email.trim().length === 0) {
      nextErrors.email = "Vul je e-mailadres in.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = "Vul een geldig e-mailadres in.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    const href = buildMailtoLink({
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setMailtoHref(href);
    setSubmitted(true);
    window.location.href = href;
  }

  if (submitted) {
    return (
      <section id="aanmelden" className="bg-navy">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Bedankt voor je aanmelding!
          </h2>
          <p className="mt-4 text-slate-200">
            Je e-mailprogramma opent met een vooraf ingevuld bericht naar
            info@talentchart.nl. Verstuur je mail en we nemen snel contact met
            je op.
          </p>
          {mailtoHref && (
            <a
              href={mailtoHref}
              data-testid="mailto-link"
              className="mt-6 inline-block text-teal underline"
            >
              Klik hier als je e-mailprogramma niet vanzelf opende
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="aanmelden" className="bg-navy">
      <div className="mx-auto max-w-2xl px-6 py-20 text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Meld je aan</h2>
        <p className="mt-2 text-slate-200">
          Laat je gegevens achter, dan nemen we contact met je op.
        </p>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Naam
            </label>
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-300">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Bedrijf
            </label>
            <input
              id="company"
              type="text"
              value={values.company}
              onChange={(e) =>
                setValues({ ...values, company: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-300">{errors.company}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Toelichting (optioneel)
            </label>
            <textarea
              id="message"
              rows={4}
              value={values.message}
              onChange={(e) =>
                setValues({ ...values, message: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Versturen
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/SignupForm.tsx
git commit -m "feat: add SignupForm with client-side validation and mailto submit"
```

---

### Task 5: Assemble the homepage

**Files:**
- Modify: `app/page.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `Hero`, `HowItWorks`, `Benefits` from Task 3; `SignupForm` from Task 4; `Footer` from Task 3.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import SignupForm from "@/components/SignupForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Benefits />
      <SignupForm />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: Hero, "Hoe het werkt" (3 steps with icons), "Waarom recruiters TalentChart gebruiken" (4 cards), signup form, footer all render; clicking "Meld je aan" scrolls to the form. Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage from all sections"
```

---

### Task 6: Playwright e2e tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/homepage.spec.ts`
- Modify: `.gitignore` (add Playwright artifacts)

**Interfaces:**
- Consumes: the running app at `http://localhost:3000` (started automatically by Playwright's `webServer` config via `npm run dev`), the DOM structure and copy produced by Tasks 3–5, and `data-testid="mailto-link"` produced by `components/SignupForm.tsx` (Task 4).

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Install Playwright browsers**

Run: `npx playwright install chromium`
Expected: downloads the Chromium browser used by the config above.

- [ ] **Step 3: Add Playwright artifacts to `.gitignore`**

Append:

```
/test-results
/playwright-report
/playwright/.cache
```

- [ ] **Step 4: Write `e2e/homepage.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("hero, CTA scroll en formulier-validatie", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /te veel cv's/i })
  ).toBeVisible();

  await page.getByRole("link", { name: "Meld je aan" }).click();
  await expect(page).toHaveURL(/#aanmelden$/);

  await page.getByRole("button", { name: "Versturen" }).click();
  await expect(page.getByText("Vul je naam in.")).toBeVisible();
  await expect(page.getByText("Vul je bedrijfsnaam in.")).toBeVisible();
  await expect(page.getByText("Vul je e-mailadres in.")).toBeVisible();
});

test("succesvolle aanmelding toont bevestiging met correcte mailto-link", async ({
  page,
}) => {
  await page.goto("/#aanmelden");

  await page.getByLabel("Naam").fill("Jan Jansen");
  await page.getByLabel("Bedrijf").fill("Acme BV");
  await page.getByLabel("E-mailadres").fill("jan@acme.nl");
  await page
    .getByLabel("Toelichting (optioneel)")
    .fill("We zoeken een developer.");

  await page.getByRole("button", { name: "Versturen" }).click();

  await expect(
    page.getByRole("heading", { name: "Bedankt voor je aanmelding!" })
  ).toBeVisible();

  const link = page.getByTestId("mailto-link");
  await expect(link).toHaveAttribute(
    "href",
    /^mailto:info@talentchart\.nl\?subject=.*body=.*/
  );
});
```

- [ ] **Step 5: Run the e2e tests**

Run: `npm run test:e2e`
Expected: `2 passed`

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts e2e/homepage.spec.ts .gitignore
git commit -m "test: add Playwright e2e coverage for homepage and signup flow"
```

---

### Task 7: Final verification

**Files:**
- None created or modified — this task only runs checks.

- [ ] **Step 1: Run the full unit test suite**

Run: `npm run test`
Expected: `3 passed` (from Task 2)

- [ ] **Step 2: Run the full e2e suite**

Run: `npm run test:e2e`
Expected: `2 passed` (from Task 6)

- [ ] **Step 3: Run the linter**

Run: `npm run lint`
Expected: `✔ No ESLint warnings or errors`

- [ ] **Step 4: Run a production build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, confirming the app is ready to deploy to Vercel with zero extra configuration.

- [ ] **Step 5: Commit (only if any of the above required fixes)**

```bash
git add -A
git commit -m "fix: address lint/build issues found during final verification"
```

If no fixes were needed, skip this step — there is nothing to commit.
