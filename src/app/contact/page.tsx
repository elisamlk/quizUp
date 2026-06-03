import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe de QuizUp pour toute question ou remarque.",
};

export default function ContactPage() {
  return (
    <main className="legalPage">
      <h1>Contact</h1>

      <p>
        Vous avez une question, une remarque ou vous souhaitez signaler une
        erreur sur un quiz ? Nous sommes toujours heureux de recevoir vos
        messages.
      </p>

      <h2>Nous contacter</h2>

      <p>Vous pouvez nous écrire à l&apos;adresse suivante :</p>

      <p>
        <strong>Email :</strong>{" "}
        <a href="mailto:contact@quizup.fr">contact@quizup.fr</a>
      </p>

      <p>
        Nous faisons de notre mieux pour répondre dans les meilleurs délais.
      </p>

      <h2>Signaler une erreur</h2>

      <p>
        Si vous repérez une erreur dans un quiz ou une information incorrecte,
        n&apos;hésitez pas à nous le signaler afin que nous puissions corriger
        le contenu.
      </p>

      <h2>Questions fréquentes</h2>

      <p>
        Avant de nous contacter, vous pouvez également consulter les pages
        suivantes :
      </p>

      <ul>
        <li>
          <Link href="/a-propos">À propos</Link>
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

      <h2>Informations sur le site</h2>

      <p>
        <strong>QuizUp</strong> est un site de quiz accessible librement en
        ligne. Le site ne nécessite pas de création de compte pour accéder aux
        contenus.
      </p>

      <p>
        Certaines pages peuvent contenir de la publicité afin de financer
        l&apos;hébergement et le développement du site.
      </p>
    </main>
  );
}
