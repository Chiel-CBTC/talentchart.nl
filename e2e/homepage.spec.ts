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

test("foutmelding verdwijnt direct nadat het veld is gecorrigeerd", async ({
  page,
}) => {
  await page.goto("/#aanmelden");

  await page.getByRole("button", { name: "Versturen" }).click();
  await expect(page.getByText("Vul je naam in.")).toBeVisible();

  await page.getByLabel("Naam").fill("Jan Jansen");
  await expect(page.getByText("Vul je naam in.")).not.toBeVisible();
});

test("kopieer-knop zet aanmeldgegevens op het klembord", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#aanmelden");

  await page.getByLabel("Naam").fill("Jan Jansen");
  await page.getByLabel("Bedrijf").fill("Acme BV");
  await page.getByLabel("E-mailadres").fill("jan@acme.nl");
  await page.getByRole("button", { name: "Versturen" }).click();

  await page
    .getByRole("button", { name: "Kopieer gegevens naar klembord" })
    .click();
  await expect(page.getByText("Gekopieerd!")).toBeVisible();

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  expect(clipboardText).toContain("Aan: info@talentchart.nl");
  expect(clipboardText).toContain("Naam: Jan Jansen");
  expect(clipboardText).toContain("Bedrijf: Acme BV");
});
