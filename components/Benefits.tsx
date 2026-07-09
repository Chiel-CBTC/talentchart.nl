const benefits = [
  {
    title: "Tijdsbesparing",
    description:
      "Geen dagen meer kwijt aan het handmatig doorspitten van CV's — de eerste selectie is in minuten klaar.",
  },
  {
    title: "Consistente scoring",
    description:
      "Elke kandidaat wordt op dezelfde criteria beoordeeld, zonder ruis van een lange werkdag of onderbuikgevoel.",
  },
  {
    title: "Branche-onafhankelijk",
    description:
      "Of je nu techniek, zorg of finance werft — TalentChart matcht op basis van de vacaturetekst die jij aanlevert.",
  },
  {
    title: "Past in jouw werkproces",
    description:
      "Je blijft vacatures insturen zoals je gewend bent. Geen nieuw systeem waar je omheen moet werken.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Waarom recruiters TalentChart gebruiken
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
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
