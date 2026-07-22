# Design: Social-proof testimonial sectie

## Context

Notion-spec ("Social proof sectie toevoegen met logo's van bestaande klanten") vroeg om
een sectie die laat zien welke organisaties TalentChart al gebruiken. De spec waarschuwt
zelf expliciet: eerst checken welke pilotklanten toestemming hebben gegeven voordat hun
naam/logo getoond wordt, en overwegen of een alternatieve framing nodig is zolang de
klantenlijst nog kort is.

Status: chiel heeft bevestigd dat klant **Matching Consultants** toestemming heeft
gegeven. Dit is op dit moment de enige bevestigde naam.

## Beslissing: testimonial in plaats van logo-rij

Met precies 1 bevestigde klant is een klassieke "vertrouwd door"-logo-rij af te raden:
die vorm heeft juist meerdere logo's nodig om overtuigend te ogen — met 1 logo oogt hij
leeg en kan hij averechts werken ("als er maar 1 klant is, hoe bewezen is dit dan
echt?"). Chiel gaf aan zelf ook een review te mogen schrijven namens Joris van Aalst
(eigenaar Matching Consultants, met zijn goedkeuring achteraf) — een persoonlijk citaat
werkt wél overtuigend met N=1, in tegenstelling tot een logo-wall.

**Gekozen vorm:** een testimonial-kaart (citaat + naam/functie + bedrijfslogo), geen
kale logo-rij en geen aparte "X vacatures gematcht"-sectie.

## Content

Citaat (concept, nog niet formeel akkoord van Joris — chiel vraagt dat apart na):

> "Ik was altijd veel tijd kwijt aan het handmatig scannen van CV's bij nieuwe
> aanvragen. Ik wilde gewoon een simpele manier om dit proces te versnellen. Met
> TalentChart lukt dit fantastisch: ik stuur mijn aanvraag gewoon door en binnen no
> time heb ik inzicht in wie van mijn kandidaten het meest geschikt is, mét een goede
> motivatie!"

Toeschrijving: **Joris van Aalst** — eigenaar Matching Consultants

Geen prijs-vermelding (pricing nog niet bepaald). Geen vergelijking met andere
recruitment-pakketten (Joris was niet aan het pakket-shoppen, hij had een concreet
tijdsprobleem: handmatig CV's scannen).

**Openstaand, buiten deze implementatie:** chiel legt de definitieve tekst nog voor aan
Joris ter goedkeuring voordat dit echt live/permanent zo blijft staan. De hier
geïmplementeerde tekst is de conceptversie waarmee gebouwd wordt.

## Plaatsing in de pagina

Huidige volgorde: `Hero → HowItWorks → Benefits → PrivacyNote → SignupForm → Footer`.

Nieuwe volgorde: `Hero → HowItWorks → Benefits → PrivacyNote → Testimonial → SignupForm → Footer`.

Redenering: een testimonial werkt als laatste, persoonlijke duw vlak vóór de CTA, nadat
de bezoeker al begrijpt wat het product doet (Hero/HowItWorks/Benefits) en eventuele
praktische zorgen al zijn weggenomen (PrivacyNote). Vroeg in de pagina (bv. direct na
Hero) zou de context missen en zou de "brede-acceptatie"-werking van social proof
missen die toch pas ontstaat met meerdere klanten.

## Component & styling

Nieuw bestand: `components/Testimonial.tsx`, geïmporteerd en geplaatst in `app/page.tsx`
tussen `<PrivacyNote />` en `<SignupForm />`.

- Sectie-achtergrond: wit (`bg-white`), zelfde als Benefits — past in het bestaande
  kleurritme en is de meest praktische ondergrond voor het logo-bestand (zie hieronder).
- Binnenin: gecentreerde kaart, `max-w-2xl`, witte achtergrond, dunne `slate-200`-rand,
  `rounded-lg`, geen shadow — de bestaande kaartstijl uit `DESIGN.md` (§4 Elevation),
  niet een nieuwe vorm.
- Geen aparte sectiekop (`<h2>`) zoals bij Benefits/HowItWorks. Met precies 1 citaat zou
  een kop als "Wat klanten zeggen" een meervoud suggereren dat er niet is. Het citaat is
  zelf de blikvanger.
- Onder het citaat: logo + toeschrijving naast elkaar (`flex items-center gap-3`), naam
  in `font-semibold text-navy`, functie/bedrijf in `text-slate-600 text-sm` — zelfde
  tekstbehandeling als bestaande secundaire tekst elders op de pagina.

## Logo-asset

Bronbestand (`/tmp/matching-consultants-logo.png`, 248×81px, opgehaald van de
sponsorpagina van NAC Zaken omdat matchingconsultants.nl zelf 403 Forbidden gaf) bevat
zowel het oranje "MC"-icoon als de tekst "matching consultants" ingebakken in dezelfde
afbeelding.

Omdat de toeschrijvingstekst er al "eigenaar Matching Consultants" bij zet, wordt alleen
het "MC"-icoon-gedeelte uitgesneden en gebruikt (voorkomt dubbele bedrijfsnaam-vermelding,
consistent met hoe TalentChart's eigen logo ook los als icoon wordt gebruikt in de
navigatie). Opgeslagen als `public/logos/matching-consultants-icon.png`.

Het icoon is ontworpen voor een lichte achtergrond (het is leesbaar op wit/lichtgrijs,
niet op navy zonder aanpassing) — vandaar ook de keuze voor een witte sectie-achtergrond
hierboven, in plaats van het logo zelf te moeten bewerken.

## Testen

Bestaande vergelijkbare statische secties (Benefits, HowItWorks, PrivacyNote) hebben geen
eigen tests. Chiel heeft echter gevraagd om hier TDD toe te passen. Aanpak: een gerichte
Playwright e2e-test, toegevoegd als nieuw test-blok in het bestaande
`e2e/homepage.spec.ts` (geen nieuw testbestand — er is nu al maar één e2e-spec-bestand,
dat patroon blijft zo), geschreven vóór de implementatie zodat hij eerst faalt. De test
controleert dat op de homepage:

- het citaat zichtbaar is,
- de naam "Joris van Aalst" zichtbaar is,
- het Matching Consultants-logo (`img` met bijpassende `alt`-tekst) zichtbaar is,
- de sectie in de DOM ná PrivacyNote en vóór het aanmeldformulier staat.

Geen unit-tests nodig (geen logica, puur statische content/markup) — de e2e-test dekt het
testbare gedrag (rendering + volgorde) dat relevant is voor dit component.

## Buiten scope

- Prijsvermelding in de testimonial (prijzen nog niet bepaald).
- Ondersteuning voor meerdere testimonials/logo's (dit ontwerp is bewust single-item;
  een layout voor meerdere klanten is toekomstig werk zodra er meer namen zijn).
- Formele goedkeuring van Joris van Aalst op de exacte tekst (proces buiten deze
  implementatie om, bij chiel).
