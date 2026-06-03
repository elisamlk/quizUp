import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site [Nom du site]. Informations sur l’éditeur, l’hébergement et l’utilisation du site.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="legalPage">
      <h1>Mentions légales</h1>

      <p>Dernière mise à jour : 12 mars 2026</p>

      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>Quiz Up</strong>, accessible à l’adresse
        <strong> https://www.quizup.fr</strong>, est édité par un particulier
      </p>

      <p>
        {/* <strong>[Nom ou société]</strong>
        <br />
        Statut : [Micro-entreprise / Société / Particulier]
        <br />
        Adresse : [Adresse]
        <br /> */}
        Email : <a href="mailto:contact@quizup.fr">contact@quizup.fr</a>
      </p>

      {/* <h2>Directeur de la publication</h2>
      <p>E. Malek</p> */}

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par :
        <br />
        <strong>Vercel Inc.</strong>
        <br />
        Adresse : 440 N Barranca Avenue #4133 Covina, CA 91723 États-Unis
      </p>

      <h2>Activité du site</h2>
      <p>
        QuizUp est un site proposant des quiz accessibles librement en ligne.
        Les utilisateurs peuvent naviguer et consulter les contenus sans
        création de compte.
      </p>

      <h2>Crédits photos</h2>

      <p>
        Certaines images utilisées sur ce site proviennent de la plateforme{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pexels
        </a>
        .
      </p>

      <p>
        Les photographies sont mises à disposition gratuitement par leurs
        auteurs conformément à la licence Pexels.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les contenus présents sur ce site, incluant notamment les textes, quiz,
        graphismes, logo et structure du site, sont protégés par les lois
        relatives à la propriété intellectuelle.
      </p>

      <p>
        Toute reproduction, représentation, modification, publication ou
        adaptation de tout ou partie du site, quel que soit le moyen ou le
        procédé utilisé, est interdite sans autorisation écrite préalable.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations proposées sur le site sont fournies à titre informatif
        et ludique. Malgré le soin apporté à leur rédaction, des erreurs ou
        omissions peuvent survenir.
      </p>

      <p>
        L’éditeur ne saurait être tenu responsable de l’utilisation faite des
        informations présentes sur le site.
      </p>

      <h2>Publicité</h2>
      <p>
        Le site peut afficher des contenus publicitaires afin de financer son
        fonctionnement et son développement.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Pour en savoir plus sur la collecte et le traitement des données,
        consultez notre page :
        <br />
        <a href="/politique-confidentialite">Politique de confidentialité</a>
      </p>

      <h2>Cookies</h2>
      <p>
        Pour plus d’informations sur l’utilisation des cookies et la gestion de
        vos préférences :
        <br />
        <a href="/cookies">Politique de cookies</a>
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question, vous pouvez nous contacter à l’adresse suivante :
        <br />
        <a href="mailto:contact@quizup.fr">contact@quizup.fr</a>
      </p>
    </main>
  );
}
