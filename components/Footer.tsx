import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm">
        <span className="flex items-center gap-2">
          <Image
            src="/logo-icon-white.png"
            alt=""
            aria-hidden="true"
            width={26}
            height={28}
            className="h-7 w-auto"
          />
          <span className="font-semibold text-white">TalentChart</span>
        </span>
        <span>&copy; {year} TalentChart. Alle rechten voorbehouden.</span>
        <a
          href="mailto:info@talentchart.nl"
          className="text-teal-light hover:underline"
        >
          info@talentchart.nl
        </a>
      </div>
    </footer>
  );
}
