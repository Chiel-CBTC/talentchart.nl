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
