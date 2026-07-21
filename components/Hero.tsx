import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <Image
        src="/images/hero-banner.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy/85" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
        <span className="flex items-center gap-2">
          <Image
            src="/logo-icon-white.png"
            alt=""
            aria-hidden="true"
            width={33}
            height={36}
            className="h-9 w-auto"
          />
          <span className="text-xl font-semibold text-white">
            TalentChart
          </span>
        </span>
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          Stop met eindeloos CV&apos;s scannen
        </h1>
        <p className="max-w-3xl text-lg text-slate-200 sm:text-xl">
          Als recruiter laat je dit voortaan over aan TalentChart! Wij
          matchen jouw vacatures razendsnel tegen jouw CV-pool en leveren je
          binnen 10 minuten een top 3 van best matchende kandidaten.
        </p>
        <div className="flex flex-col items-start gap-2">
          <a
            href="#aanmelden"
            className="rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Meld je aan
          </a>
          <span className="text-sm text-slate-300">
            Wij helpen je graag op weg — neem contact met ons op
          </span>
        </div>
      </div>
    </section>
  );
}
