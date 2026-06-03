import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez Quiz Up, un site de quiz en ligne simple, accessible et pensé pour une expérience fluide.",
};

export default function AProposPage() {
  return (
    <main className="legalPage">
      <h1>À propos</h1>

      <p>
        Bienvenue sur QuizUp, un site dédié aux quiz en ligne, conçu pour
        proposer une expérience simple, rapide et agréable.
      </p>

      <p>
        Notre objectif est de mettre à disposition des quiz accessibles à tous,
        sur des thèmes variés, dans un format clair et facile à utiliser.
      </p>

      <h2>Notre concept</h2>

      <p>
        Quiz Up a été pensé pour permettre à chacun de parcourir librement
        différents quiz sans création de compte ni procédure complexe.
      </p>

      <p>
        Le site mise sur une navigation fluide, un accès direct aux contenus et
        une présentation simple pour rendre l&apos;expérience la plus agréable
        possible.
      </p>

      <h2>Ce que vous trouverez sur le site</h2>

      <ul>
        <li>des quiz sur des thèmes variés</li>
        <li>une navigation simple et rapide</li>
        <li>un accès libre sans inscription</li>
        <li>une expérience pensée pour être claire et accessible</li>
      </ul>

      <h2>Notre engagement</h2>

      <p>
        Nous faisons de notre mieux pour proposer des contenus de qualité,
        régulièrement relus et mis à jour lorsque cela est nécessaire.
      </p>

      <p>
        Malgré le soin apporté à la préparation des contenus, certaines
        imprécisions peuvent exister. Si vous repérez une erreur, vous pouvez
        nous la signaler via notre page de contact.
      </p>

      <h2>Publicité et financement</h2>

      <p>
        Afin d&apos;assurer le fonctionnement, l&apos;hébergement et le
        développement du site, certaines pages peuvent contenir de la publicité.
      </p>

      <p>
        Cette publicité permet de maintenir le site accessible et de continuer à
        proposer gratuitement les contenus.
      </p>

      <h2>Contact</h2>

      <p>
        Pour toute question, remarque ou signalement, vous pouvez consulter
        notre <Link href="/contact">page de contact</Link>.
      </p>

      <h2>Liens utiles</h2>

      <ul>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/mentions-legales">Mentions légales</Link>
        </li>
        <li>
          <Link href="/politique-confidentialite">
            Politique de confidentialité
          </Link>
        </li>
        <li>
          <Link href="/cookies">Politique de cookies</Link>
        </li>
      </ul>
    </main>
  );
}
