export interface SignupFormData {
  name: string;
  company: string;
  email: string;
  message?: string;
}

const RECIPIENT = "info@talentchart.nl";

function composeEmail(data: SignupFormData): { subject: string; body: string } {
  const subject = `Aanmelding TalentChart — ${data.company}`;
  const bodyLines = [
    `Naam: ${data.name}`,
    `Bedrijf: ${data.company}`,
    `E-mail: ${data.email}`,
  ];

  if (data.message && data.message.trim().length > 0) {
    bodyLines.push("", "Toelichting:", data.message);
  }

  return { subject, body: bodyLines.join("\n") };
}

export function buildMailtoLink(data: SignupFormData): string {
  const { subject, body } = composeEmail(data);
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

  return `mailto:${RECIPIENT}?${query}`;
}

export function buildClipboardText(data: SignupFormData): string {
  const { subject, body } = composeEmail(data);
  return `Aan: ${RECIPIENT}\nOnderwerp: ${subject}\n\n${body}`;
}
