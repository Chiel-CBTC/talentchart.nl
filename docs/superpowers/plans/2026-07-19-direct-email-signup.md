# Direct Email Signup (Gmail SMTP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `mailto:`-redirect signup flow with a server-side Server Action that sends the aanmelding e-mail directly via Gmail SMTP (Nodemailer), so submission no longer depends on the visitor having a configured mail client.

**Architecture:** A pure function (`lib/email.ts`) composes the e-mail payload from form data. A Next.js Server Action (`app/actions/sendSignupEmail.ts`, `"use server"`) sends that payload via Nodemailer over Gmail SMTP, using `GMAIL_USER`/`GMAIL_APP_PASSWORD` from the environment, and returns `{ ok: true }` or `{ ok: false, error }` — never throwing to the caller. `components/SignupForm.tsx` calls the action directly from its existing `onSubmit` handler (no `<form action>`, no separate API route) and renders success/error state. The old `mailto:`/clipboard fallback (`lib/mailto.ts`) is removed entirely.

**Tech Stack:** Next.js 14 (App Router, Server Actions), Nodemailer, Vitest (unit, with `vi.mock("nodemailer")`), Playwright (e2e, with an `EMAIL_TEST_MODE` env bypass so no real mail is ever sent during test runs).

## Global Constraints

- App Router only, no Pages Router (CLAUDE.md).
- Server Components where possible, Client Components only where needed (CLAUDE.md) — `SignupForm.tsx` stays a Client Component (it already is, for state/handlers); the new Server Action file has no client-side footprint.
- Tailwind CSS for styling (CLAUDE.md) — reuse existing utility classes, no new styling system.
- No unnecessary dependencies (CLAUDE.md) — only `nodemailer` + `@types/nodemailer` are added.
- Error messages shown to the user must be in Dutch (CLAUDE.md).
- No English UI text (CLAUDE.md).
- Do not build backend logic that already lives in n8n (CLAUDE.md) — not applicable here; this is a new capability (contact-form delivery), not a duplicate of n8n functionality.
- Per the approved spec (`docs/superpowers/specs/2026-07-19-direct-email-signup-design.md`): no clipboard-copy fallback on send failure — show an error message only, form values are preserved for retry.
- TDD: write the failing test before the implementation for every behavioral change (project convention, `chiel-skills:tdd-workflow`).

---

### Task 1: E-mail payload builder (`lib/email.ts`)

**Files:**
- Create: `lib/email.ts`
- Test: `tests/email.test.ts`

**Interfaces:**
- Produces: `SignupFormData` (`{ name: string; company: string; email: string; message?: string }`), `SignupEmailPayload` (`{ to: string; replyTo: string; subject: string; text: string }`), and `buildSignupEmail(data: SignupFormData): SignupEmailPayload`. Task 2's server action imports both types and this function from `@/lib/email`.

- [ ] **Step 1: Write the failing test**

Create `tests/email.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildSignupEmail } from "../lib/email";

describe("buildSignupEmail", () => {
  it("bouwt een payload met ontvanger, reply-to, onderwerp en body zonder toelichting", () => {
    const payload = buildSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(payload.to).toBe("info@talentchart.nl");
    expect(payload.replyTo).toBe("jan@acme.nl");
    expect(payload.subject).toBe("Aanmelding TalentChart — Acme BV");
    expect(payload.text).toContain("Naam: Jan Jansen");
    expect(payload.text).toContain("Bedrijf: Acme BV");
    expect(payload.text).toContain("E-mail: jan@acme.nl");
    expect(payload.text).not.toContain("Toelichting:");
  });

  it("voegt toelichting toe aan de body wanneer ingevuld", () => {
    const payload = buildSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "We zoeken een senior developer.",
    });

    expect(payload.text).toContain("Toelichting:");
    expect(payload.text).toContain("We zoeken een senior developer.");
  });

  it("negeert een lege of whitespace-only toelichting", () => {
    const payload = buildSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "   ",
    });

    expect(payload.text).not.toContain("Toelichting:");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/email.test.ts`
Expected: FAIL — `Cannot find module '../lib/email'` (file doesn't exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `lib/email.ts`:

```ts
export interface SignupFormData {
  name: string;
  company: string;
  email: string;
  message?: string;
}

export interface SignupEmailPayload {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

const RECIPIENT = "info@talentchart.nl";

export function buildSignupEmail(data: SignupFormData): SignupEmailPayload {
  const subject = `Aanmelding TalentChart — ${data.company}`;
  const bodyLines = [
    `Naam: ${data.name}`,
    `Bedrijf: ${data.company}`,
    `E-mail: ${data.email}`,
  ];

  if (data.message && data.message.trim().length > 0) {
    bodyLines.push("", "Toelichting:", data.message);
  }

  return {
    to: RECIPIENT,
    replyTo: data.email,
    subject,
    text: bodyLines.join("\n"),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/email.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts tests/email.test.ts
git commit -m "feat: add buildSignupEmail payload builder"
```

---

### Task 2: Server Action `sendSignupEmail` (Nodemailer over Gmail SMTP)

**Files:**
- Create: `app/actions/sendSignupEmail.ts`
- Test: `tests/sendSignupEmail.test.ts`
- Modify: `package.json` (add `nodemailer`, `@types/nodemailer`)
- Modify: `vitest.config.ts` (add `@` path alias so the action's `@/lib/email` import resolves under Vitest)

**Interfaces:**
- Consumes: `SignupFormData`, `buildSignupEmail` from `@/lib/email` (Task 1).
- Produces: `SendSignupEmailResult` (`{ ok: true } | { ok: false; error: string }`) and `sendSignupEmail(data: SignupFormData): Promise<SendSignupEmailResult>`. Task 3's `SignupForm.tsx` imports this function from `@/app/actions/sendSignupEmail`.
- Reads env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EMAIL_TEST_MODE` (when `"true"`, skips the real Nodemailer send and returns `{ ok: true }` immediately — used by Playwright so e2e runs never send real mail).

- [ ] **Step 1: Add dependencies**

Edit `package.json` — add to `"dependencies"`:

```json
    "nodemailer": "^6.9.14",
```

and to `"devDependencies"`:

```json
    "@types/nodemailer": "^6.4.16",
```

Run: `npm install`
Expected: `package-lock.json` updates, no errors.

- [ ] **Step 2: Add Vitest path alias**

Edit `vitest.config.ts` to match:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Write the failing test**

Create `tests/sendSignupEmail.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

import { sendSignupEmail } from "../app/actions/sendSignupEmail";

describe("sendSignupEmail", () => {
  beforeEach(() => {
    sendMailMock.mockReset();
    createTransportMock.mockClear();
    delete process.env.EMAIL_TEST_MODE;
    process.env.GMAIL_USER = "info@talentchart.nl";
    process.env.GMAIL_APP_PASSWORD = "test-app-password";
  });

  it("verstuurt de mail via Gmail SMTP en geeft ok:true terug bij succes", async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: "abc" });

    const result = await sendSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(result).toEqual({ ok: true });
    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      auth: { user: "info@talentchart.nl", pass: "test-app-password" },
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      to: "info@talentchart.nl",
      replyTo: "jan@acme.nl",
      subject: "Aanmelding TalentChart — Acme BV",
      text: expect.stringContaining("Naam: Jan Jansen"),
    });
  });

  it("geeft ok:false met een Nederlandse foutmelding terug wanneer sendMail faalt", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("SMTP timeout"));

    const result = await sendSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(result).toEqual({
      ok: false,
      error: "Versturen is niet gelukt. Probeer het later opnieuw.",
    });
  });

  it("slaat de echte verzending over wanneer EMAIL_TEST_MODE=true is", async () => {
    process.env.EMAIL_TEST_MODE = "true";

    const result = await sendSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(result).toEqual({ ok: true });
    expect(createTransportMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run tests/sendSignupEmail.test.ts`
Expected: FAIL — `Cannot find module '../app/actions/sendSignupEmail'` (file doesn't exist yet).

- [ ] **Step 5: Write minimal implementation**

Create `app/actions/sendSignupEmail.ts`:

```ts
"use server";

import nodemailer from "nodemailer";
import { buildSignupEmail, SignupFormData } from "@/lib/email";

export interface SendSignupEmailResult {
  ok: boolean;
  error?: string;
}

export async function sendSignupEmail(
  data: SignupFormData
): Promise<SendSignupEmailResult> {
  const payload = buildSignupEmail(data);

  if (process.env.EMAIL_TEST_MODE === "true") {
    return { ok: true };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Versturen is niet gelukt. Probeer het later opnieuw.",
    };
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/sendSignupEmail.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Run the full unit suite**

Run: `npm test`
Expected: All tests pass (Task 1's `email.test.ts`, this task's `sendSignupEmail.test.ts`, plus the still-present `mailto.test.ts` — untouched until Task 4).

- [ ] **Step 8: Commit**

```bash
git add app/actions/sendSignupEmail.ts tests/sendSignupEmail.test.ts package.json package-lock.json vitest.config.ts
git commit -m "feat: send signup email via Gmail SMTP server action"
```

---

### Task 3: Wire `SignupForm.tsx` to the server action

**Files:**
- Modify: `components/SignupForm.tsx`
- Modify: `playwright.config.ts` (set `EMAIL_TEST_MODE=true` on the dev server Playwright launches)
- Modify: `e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `sendSignupEmail` from `@/app/actions/sendSignupEmail` (Task 2), `SignupFormData` from `@/lib/email` (Task 1).

- [ ] **Step 1: Set `EMAIL_TEST_MODE` for the Playwright dev server**

Without this, Playwright's `npm run dev` would pick up real `GMAIL_USER`/`GMAIL_APP_PASSWORD` from `.env` and attempt to send real mail on every e2e run. Edit `playwright.config.ts` to match:

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
    env: {
      EMAIL_TEST_MODE: "true",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Update the e2e spec to the new expected behavior (failing test first)**

Replace the full contents of `e2e/homepage.spec.ts`:

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

test("succesvolle aanmelding toont bevestiging zonder mailto-link", async ({
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
  await expect(page.getByTestId("mailto-link")).toHaveCount(0);
});

test("foutmelding verdwijnt direct nadat het veld is gecorrigeerd", async ({
  page,
}) => {
  await page.goto("/#aanmelden");

  await page.getByRole("button", { name: "Versturen" }).click();
  await expect(page.getByText("Vul je naam in.")).toBeVisible();

  await page.getByLabel("Naam").fill("Jan Jansen");
  await expect(page.getByText("Vul je naam in.")).not.toBeVisible();
});
```

This removes the obsolete `"kopieer-knop zet aanmeldgegevens op het klembord"` test entirely (that UI is being deleted, so there's no future state where it should pass — this is cleanup, not a red/green pair) and adds an explicit `mailto-link` absence check to the success test, which is the part that gives us a genuine failing test against the current implementation.

- [ ] **Step 3: Run e2e to verify the new assertion fails**

Run: `npm run test:e2e`
Expected: FAIL on `"succesvolle aanmelding toont bevestiging zonder mailto-link"` — the `mailto-link` element is still present (`expect(locator).toHaveCount(0)` fails because count is 1). Other tests pass unchanged.

- [ ] **Step 4: Rewrite `SignupForm.tsx`**

Replace the full contents of `components/SignupForm.tsx`:

```tsx
"use client";

import { useState, FormEvent } from "react";
import { sendSignupEmail } from "@/app/actions/sendSignupEmail";
import { SignupFormData } from "@/lib/email";

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
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const data: SignupFormData = {
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    setSending(true);
    setSubmitError(null);

    const result = await sendSignupEmail(data);

    setSending(false);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(
        result.error ?? "Versturen is niet gelukt. Probeer het later opnieuw."
      );
    }
  }

  if (submitted) {
    return (
      <section id="aanmelden" className="bg-navy">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Bedankt voor je aanmelding!
          </h2>
          <p className="mt-4 text-slate-200">
            We hebben je aanmelding ontvangen en nemen zo snel mogelijk
            contact met je op.
          </p>
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
              onChange={(e) => updateField("name", e.target.value)}
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
              onChange={(e) => updateField("company", e.target.value)}
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
              onChange={(e) => updateField("email", e.target.value)}
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
              onChange={(e) => updateField("message", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
          </div>
          {submitError && (
            <p className="text-sm text-red-300">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Versturen..." : "Versturen"}
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run e2e to verify it passes**

Run: `npm run test:e2e`
Expected: All 3 tests pass.

- [ ] **Step 6: Run the full unit suite too**

Run: `npm test`
Expected: All tests still pass (nothing in this task touches `lib/email.ts` or `sendSignupEmail.ts`).

- [ ] **Step 7: Commit**

```bash
git add components/SignupForm.tsx playwright.config.ts e2e/homepage.spec.ts
git commit -m "feat: submit signup form via server action instead of mailto"
```

---

### Task 4: Remove the obsolete `mailto:` fallback

**Files:**
- Delete: `lib/mailto.ts`
- Delete: `tests/mailto.test.ts`

**Interfaces:**
- None — nothing after Task 3 references `lib/mailto.ts` (`components/Footer.tsx`'s unrelated `mailto:info@talentchart.nl` link stays untouched; it never imported this module).

- [ ] **Step 1: Delete the files**

```bash
git rm lib/mailto.ts tests/mailto.test.ts
```

- [ ] **Step 2: Verify nothing else references them**

Run: `grep -rn "lib/mailto\|buildMailtoLink\|buildClipboardText" --include="*.ts" --include="*.tsx" app components lib tests e2e`
Expected: no output.

- [ ] **Step 3: Run the full unit and type checks**

Run: `npm test && npx tsc --noEmit`
Expected: All Vitest tests pass, no TypeScript errors.

- [ ] **Step 4: Run e2e once more for a final sanity check**

Run: `npm run test:e2e`
Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove obsolete mailto fallback"
```
