# TalentChart Portal — Project Context

## Wat is TalentChart?

TalentChart is een B2B SaaS recruitment matching tool voor recruiters. De kern:
recruiters sturen vacatures in via e-mail, TalentChart matcht deze tegen een CV-pool
met behulp van de Claude API, en stuurt een gemotiveerde top-3 ranking terug.

De bestaande backend draait op n8n (self-hosted, Docker). Dit portal-project is de
klantgerichte frontend: recruiters moeten kunnen inloggen, CV's uploaden en
vacatures indienen zonder tussenkomst via e-mail.

## Stack

- **Frontend**: Next.js (App Router)
- **Auth + Database + Storage**: Supabase (cloud)
- **Deployment**: Vercel
- **Taal**: TypeScript

## Doelgebruiker

Recruiters (niet-technisch). De UI moet eenvoudig en helder zijn.
Taal van de interface: Nederlands.

## Functionaliteit — fasering

### Fase 1 (nu bouwen)
- Login / signup met e-mail + wachtwoord via Supabase Auth
- Eenvoudige dashboard-pagina na inloggen
- Uitloggen

### Fase 2 (later)
- CV's uploaden (opslag in Supabase Storage)
- Vacature indienen via formulier
- Overzicht van matchingresultaten per vacature

### Fase 3 (later)
- Koppeling met n8n backend via webhook
- Clientbeheer (meerdere recruiters per organisatie)
- Facturatie-integratie

## Conventies

- App Router (niet Pages Router)
- Server Components waar mogelijk, Client Components alleen waar nodig
- Tailwind CSS voor styling
- Geen onnodige dependencies — houd het simpel
- Formulieren zonder `<form>` submit waar mogelijk; gebruik event handlers
- Foutmeldingen in het Nederlands tonen aan de gebruiker

## Omgeving

- Ontwikkeling: lokaal op Ubuntu 24.04
- `.env.local` bevat Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Wat je NIET moet doen

- Geen Pages Router gebruiken
- Geen onnodige UI-libraries toevoegen (geen shadcn, geen MUI, tenzij gevraagd)
- Geen backend logica bouwen die al in n8n zit
- Geen Engelstalige teksten in de UI
