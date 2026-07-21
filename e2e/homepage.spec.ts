import { test, expect } from "@playwright/test";

test("hero, CTA scroll en formulier-validatie", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /stop met eindeloos cv's scannen/i })
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
