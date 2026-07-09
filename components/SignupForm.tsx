"use client";

import { useState, FormEvent } from "react";
import { buildMailtoLink } from "@/lib/mailto";

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
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    const href = buildMailtoLink({
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setMailtoHref(href);
    setSubmitted(true);
    window.location.href = href;
  }

  if (submitted) {
    return (
      <section id="aanmelden" className="bg-navy">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Bedankt voor je aanmelding!
          </h2>
          <p className="mt-4 text-slate-200">
            Je e-mailprogramma opent met een vooraf ingevuld bericht naar
            info@talentchart.nl. Verstuur je mail en we nemen snel contact met
            je op.
          </p>
          {mailtoHref && (
            <a
              href={mailtoHref}
              data-testid="mailto-link"
              className="mt-6 inline-block text-teal underline"
            >
              Klik hier als je e-mailprogramma niet vanzelf opende
            </a>
          )}
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
              onChange={(e) => setValues({ ...values, name: e.target.value })}
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
              onChange={(e) =>
                setValues({ ...values, company: e.target.value })
              }
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
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
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
              onChange={(e) =>
                setValues({ ...values, message: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-navy"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Versturen
          </button>
        </form>
      </div>
    </section>
  );
}
