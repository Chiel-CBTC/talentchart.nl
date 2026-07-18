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
