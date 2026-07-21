import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockSendMail, mockCreateTransport } = vi.hoisted(() => {
  const mockSendMail = vi.fn();
  const mockCreateTransport = vi.fn(() => ({ sendMail: mockSendMail }));
  return { mockSendMail, mockCreateTransport };
});

vi.mock("nodemailer", () => ({
  default: { createTransport: mockCreateTransport },
}));

import { sendSignupEmail } from "../app/actions/sendSignupEmail";

describe("sendSignupEmail", () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    mockCreateTransport.mockClear();
    delete process.env.EMAIL_TEST_MODE;
    process.env.GMAIL_USER = "info@talentchart.nl";
    process.env.GMAIL_APP_PASSWORD = "test-app-password";
    // sendSignupEmail's EMAIL_TEST_MODE guard is gated on NODE_ENV !== "production"
    // (to stop test-mode ever leaking into a real prod deploy). Tests need a
    // deterministic, non-"production" NODE_ENV regardless of what the host shell
    // happens to have set (e.g. a prod server container), so pin it here via
    // vitest's stubEnv (NODE_ENV is typed read-only, so a plain assignment
    // doesn't type-check) — vi.unstubAllEnvs() restores the original after each test.
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("verstuurt de mail via Gmail SMTP en geeft ok:true terug bij succes", async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: "abc" });

    const result = await sendSignupEmail({
      name: "Jan Jansen",
      company: "Acme BV",
      email: "jan@acme.nl",
    });

    expect(result).toEqual({ ok: true });
    expect(mockCreateTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: { user: "info@talentchart.nl", pass: "test-app-password" },
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      to: "info@talentchart.nl",
      replyTo: "jan@acme.nl",
      subject: "Aanmelding TalentChart — Acme BV",
      text: expect.stringContaining("Naam: Jan Jansen"),
    });
  });

  it("geeft ok:false met een Nederlandse foutmelding terug wanneer sendMail faalt", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP timeout"));

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
    expect(mockCreateTransport).not.toHaveBeenCalled();
  });
});
