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
