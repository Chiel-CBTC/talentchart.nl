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
      <rect x="3" y="4" width="12" height="15" rx="1.5" />
      <rect x="9" y="8" width="12" height="15" rx="1.5" />
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
      <path d="M8 21V13a4 4 0 018 0v8" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const steps = [
  {
    title: "Stuur je vacature in",
    description:
      "Via e-mail of straks direct via het portal — jij bepaalt wat je invult.",
    Icon: EnvelopeIcon,
  },
  {
    title: "AI matcht tegen je CV-pool",
    description:
      "TalentChart vergelijkt de vacature met alle CV's in jouw eigen pool.",
    Icon: MatchIcon,
  },
  {
    title: "Ontvang je top-3",
    description:
      "Een gemotiveerde ranking van de drie beste kandidaten, direct bruikbaar.",
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
        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-1 flex-col items-center gap-10 text-center sm:flex-row sm:text-left"
            >
              <div className="flex flex-1 flex-col items-center gap-4">
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
                  className="h-10 w-px bg-teal/30 sm:h-px sm:w-16 sm:self-center"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
