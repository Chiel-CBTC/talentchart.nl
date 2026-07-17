import { describe, it, expect } from "vitest";
import { buildMailtoLink, buildClipboardText } from "../lib/mailto";

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

describe("buildClipboardText", () => {
  it("bouwt leesbare platte tekst met ontvanger, onderwerp en gegevens", () => {
    const text = buildClipboardText({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(text).toContain("Aan: info@talentchart.nl");
    expect(text).toContain("Onderwerp: Aanmelding TalentChart — Acme BV");
    expect(text).toContain("Naam: Jan Jansen");
    expect(text).toContain("Bedrijf: Acme BV");
    expect(text).toContain("E-mail: jan@acme.nl");
    expect(text).not.toContain("Toelichting:");
    expect(text).not.toContain("%20");
  });

  it("voegt toelichting toe aan de platte tekst wanneer ingevuld", () => {
    const text = buildClipboardText({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "We zoeken een senior developer.",
    });

    expect(text).toContain("Toelichting:");
    expect(text).toContain("We zoeken een senior developer.");
  });

  it("negeert een lege of whitespace-only toelichting", () => {
    const text = buildClipboardText({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
      message: "   ",
    });

    expect(text).not.toContain("Toelichting:");
  });
});
