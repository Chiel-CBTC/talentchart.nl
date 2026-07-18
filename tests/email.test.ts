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
