"use client";

import { useState, FormEvent } from "react";
import { sendSignupEmail } from "@/app/actions/sendSignupEmail";
import { SignupFormData } from "@/lib/email";

interface FormValues {
  name: string;
  company: string;
  email: string;
  message: string;
}

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (values.name.trim().length === 0) {
      nextErrors.name = "Vul je naam in.";
    }
    if (values.company.trim().length === 0) {
      nextErrors.company = "Vul je bedrijfsnaam in.";
    }
    if (values.email.trim().length === 0) {
      nextErrors.email = "Vul je e-mailadres in.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = "Vul een geldig e-mailadres in.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const data: SignupFormData = {
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    setSending(true);
    setSubmitError(null);

    const result = await sendSignupEmail(data);

    setSending(false);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(
        result.error ?? "Versturen is niet gelukt. Probeer het later opnieuw."
      );
    }
  }

  if (submitted) {
    return (
      <section id="aanmelden" className="bg-navy">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Bedankt voor je aanmelding!
          </h2>
          <p className="mt-4 text-slate-200">
            We hebben je aanmelding ontvangen en nemen zo snel mogelijk
            contact met je op.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="aanmelden" className="bg-navy">
      <div className="mx-auto max-w-2xl px-6 py-20 text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Meld je aan</h2>
        <p className="mt-2 text-slate-200">
          Laat je gegevens achter, dan nemen we contact met je op.
        </p>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Naam
            </label>
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-300">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Bedrijf
            </label>
            <input
              id="company"
              type="text"
              value={values.company}
              onChange={(e) => updateField("company", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-300">{errors.company}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Toelichting (optioneel)
            </label>
            <textarea
              id="message"
              rows={4}
              value={values.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
          </div>
          {submitError && (
            <p className="text-sm text-red-300">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Versturen..." : "Versturen"}
          </button>
        </form>
      </div>
    </section>
  );
}
