const benefits = [
  {
    title: "Tijdsbesparing",
    description:
      "Geen onnodige tijd meer kwijt aan het handmatig doorspitten van CV's - de eerste selectie is in minuten klaar.",
  },
  {
    title: "Betrouwbare matching",
    description:
      "Elke kandidaat wordt objectief en op exact dezelfde criteria beoordeeld, zonder ruis van een lange werkdag of onderbuikgevoelens.",
  },
  {
    title: "Branche-onafhankelijk",
    description:
      "Of je nu in ICT, zorg, finance of waar dan ook werft - TalentChart matcht gewoon op basis van de vacaturetekst die jij aanlevert.",
  },
  {
    title: "Past in jouw werkproces",
    description:
      "Je kunt je vacatures gewoon via e-mail insturen. Geen nieuw systeem waar je aan moet wennen of waar je omheen moet werken.",
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
