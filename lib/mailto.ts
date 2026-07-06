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
