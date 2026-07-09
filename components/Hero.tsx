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
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          Te veel CV&apos;s. Te weinig tijd. Wij lossen dat op.
        </h1>
        <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
          TalentChart matcht jouw vacature razendsnel tegen je eigen CV-pool
          met AI en levert je een gemotiveerde top-3 kandidaten. Geen
          eindeloos scrollen door stapels CV&apos;s meer.
        </p>
        <a
          href="#aanmelden"
          className="rounded-md bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Meld je aan
        </a>
      </div>
    </section>
  );
}
