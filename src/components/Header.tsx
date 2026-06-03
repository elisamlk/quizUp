"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="siteHeader">
        <div className="siteHeaderInner">
          {/* Logo */}
          <Link href="/" className="siteBrand">
            <Image
              src="/images/logo/logo.svg"
              alt="QuizUp"
              width={100}
              height={50}
              priority
            />
          </Link>

          {/* Desktop menu */}
          <div className="siteNavWrap">
            <nav className="siteNav">
              <Link href="/quiz">Tous les quiz</Link>
              <Link href="/categorie/culture-generale">Culture générale</Link>
              <Link href="/personalite">Personnalité</Link>
              <Link href="/jeux">Jeux</Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="siteHeaderActions">
     <Link href="/quiz" className="sitePlayBtn">
  Jouer
</Link>

            <button
              className="siteBurger"
              aria-label="Ouvrir le menu"
              onClick={() => setOpen(true)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`siteMenuOverlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu */}
      <aside className={`siteMobileMenu ${open ? "visible" : ""}`}>
        <div className="siteMobileTop">
          <strong>Menu</strong>

          <button
            className="siteClose"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          />
        </div>

        <nav className="siteMobileNav">
          <Link href="/quiz" onClick={() => setOpen(false)}>
            Tous les quiz
          </Link>

          <Link
            href="/categorie/culture-generale"
            onClick={() => setOpen(false)}
          >
            Culture générale
          </Link>

          <Link href="/personalite" onClick={() => setOpen(false)}>
            Personnalité
          </Link>

          <Link href="/jeux" onClick={() => setOpen(false)}>
            Jeux
          </Link>

          <Link href="/quiz" className="siteMobilePlay">
            Jouer
          </Link>
        </nav>
      </aside>
    </>
  );
}
