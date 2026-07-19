import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentChart — AI-matching voor recruiters",
  description:
    "TalentChart matcht jouw vacatures razendsnel tegen je CV-pool en levert een gemotiveerde top 3 ranking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-offwhite text-navy`}>
        {children}
      </body>
    </html>
  );
}
