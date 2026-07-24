const benefits = [
  {
    title: "Tijdsbesparing",
    description:
      "Geen onnodige tijd meer kwijt aan het handmatig schrijven van AI-prompts.",
  },
  {
    title: "Betrouwbare matching",
    description:
      "Dezelfde vacature levert altijd dezelfde top 3 op, dus zonder de wisselende resultaten die AI vaak geeft bij dezelfde vraag.",
  },
  {
    title: "Branche-onafhankelijk",
    description:
      "Of je nu in ICT, zorg, finance of waar dan ook werft - TalentChart matcht gewoon op basis van de vacaturetekst die jij aanlevert.",
  },
  {
    title: "Past in jouw werkproces",
    description:
      "Je kunt je vacatures gewoon via e-mail insturen. Geen aparte tool nodig, geen nieuw systeem om aan te wennen - het kan gewoon niet makkelijker.",
  },
  {
    title: "AVG-conform",
    description:
      "Je cv's blijven binnen een veilige, AVG-conforme omgeving - in plaats van in een algemene AI-chat waar je niet weet wat ermee gebeurt.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Waarom TalentChart?
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-navy">{benefit.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
