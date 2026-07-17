import { Fragment } from "react";

function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M21 21l-5.2-5.2" />
    </svg>
  );
}

function RankingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-10 w-10"
      aria-hidden="true"
    >
      <rect x="2" y="11" width="6" height="10" rx="1" />
      <rect x="9" y="6" width="6" height="15" rx="1" />
      <rect x="16" y="14" width="6" height="7" rx="1" />
    </svg>
  );
}

const steps = [
  {
    title: "Stuur je vacature in",
    description: "Dit kan gewoon via e-mail.",
    Icon: EnvelopeIcon,
  },
  {
    title: "TalentChart matcht",
    description:
      "TalentChart vergelijkt de vacature met alle CV's in jouw eigen pool.",
    Icon: MatchIcon,
  },
  {
    title: "Ontvang jouw Top 3",
    description:
      "Je ontvangt per mail een gemotiveerde ranking van jouw 3 beste kandidaten.",
    Icon: RankingIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Hoe het werkt
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <step.Icon />
                </div>
                <h3 className="font-semibold text-navy">{step.title}</h3>
                <p className="max-w-xs text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="mx-auto h-10 w-px bg-teal/30 sm:mt-8 sm:h-px sm:w-16"
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
