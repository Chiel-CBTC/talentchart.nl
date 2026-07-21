"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-teal/20 bg-navy px-6 py-3 transition-transform duration-200 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <span className="flex items-center gap-2">
        <Image
          src="/logo-icon-white.png"
          alt=""
          aria-hidden="true"
          width={18}
          height={20}
          className="h-5 w-auto"
        />
        <span className="font-semibold text-white">TalentChart</span>
      </span>
      <a
        href="#aanmelden"
        tabIndex={visible ? 0 : -1}
        className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Meld je aan
      </a>
    </div>
  );
}
