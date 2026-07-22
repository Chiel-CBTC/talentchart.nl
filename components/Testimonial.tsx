import Image from "next/image";

export default function Testimonial() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Wat klanten zeggen
        </h2>
        <div className="mt-12 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-sm text-navy">
            &quot;Ik was altijd veel tijd kwijt aan het handmatig scannen van
            CV&apos;s bij nieuwe aanvragen. Ik wilde gewoon een simpele
            manier om dit proces te versnellen. Met TalentChart lukt dit
            fantastisch: ik stuur mijn aanvraag gewoon door en binnen no time
            heb ik inzicht in wie van mijn kandidaten het meest geschikt is,
            mét een goede motivatie!&quot;
          </p>
          <a
            href="https://www.matchingconsultants.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-3 transition hover:opacity-80"
          >
            <Image
              src="/logos/matching-consultants-icon.png"
              alt="Matching Consultants"
              width={60}
              height={41}
              className="h-8 w-auto"
            />
            <span className="text-left text-sm text-slate-600">
              <span className="block font-semibold text-navy">
                Joris van Aalst
              </span>
              eigenaar Matching Consultants
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
