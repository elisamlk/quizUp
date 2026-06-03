import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description:
    "Informations sur l'utilisation des cookies sur le site [Nom du site].",
};

export default function PolitiqueCookiesPage() {
  return (
    <main className="legalPage">
      <h1>Politique de cookies</h1>

      <p>Dernière mise à jour : 12 mars 2026</p>

      <p>
        Cette page explique comment le site <strong>Quiz Up </strong>
        utilise des cookies et technologies similaires lors de la navigation
        sur le site.
      </p>

      <h2>1. Qu’est-ce qu’un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte enregistré sur votre appareil
        (ordinateur, smartphone ou tablette) lorsque vous visitez un site web.
        Les cookies permettent notamment de reconnaître un utilisateur,
        mémoriser certaines préférences ou analyser la navigation.
      </p>

      <h2>2. Pourquoi utilisons-nous des cookies ?</h2>

      <p>Les cookies peuvent être utilisés pour :</p>

      <ul>
        <li>assurer le bon fonctionnement du site ;</li>
        <li>améliorer l&apos;expérience de navigation ;</li>
        <li>mesurer l’audience et les performances du site ;</li>
        <li>afficher des publicités ;</li>
        <li>limiter la répétition des annonces publicitaires.</li>
      </ul>

      <h2>3. Cookies nécessaires</h2>

      <p>
        Certains cookies sont indispensables au fonctionnement du site.
        Ils permettent par exemple d&apos;assurer la sécurité ou la stabilité
        du service.
      </p>

      <p>
        Ces cookies ne nécessitent généralement pas de consentement
        lorsqu&apos;ils sont strictement nécessaires au fonctionnement du site.
      </p>

      <h2>4. Cookies de mesure d’audience</h2>

      <p>
        Nous pouvons utiliser des outils de mesure d’audience afin de mieux
        comprendre comment les visiteurs utilisent le site et améliorer les
        contenus proposés.
      </p>

      <p>
        Ces outils peuvent collecter des informations anonymisées telles que :
      </p>

      <ul>
        <li>les pages consultées ;</li>
        <li>la durée de navigation ;</li>
        <li>le type d&apos;appareil utilisé ;</li>
        <li>le navigateur utilisé.</li>
      </ul>

      <h2>5. Cookies publicitaires</h2>

      <p>
        Le site peut afficher des annonces publicitaires via des partenaires,
        notamment Google AdSense ou d&apos;autres régies publicitaires.
      </p>

      <p>
        Ces partenaires peuvent utiliser des cookies ou technologies
        similaires pour :
      </p>

      <ul>
        <li>afficher des annonces pertinentes ;</li>
        <li>mesurer les performances publicitaires ;</li>
        <li>limiter la répétition d’une même publicité ;</li>
        <li>prévenir la fraude publicitaire.</li>
      </ul>

      <p>
        Selon votre localisation et la réglementation applicable,
        votre consentement peut être requis avant l’utilisation de
        certains cookies publicitaires.
      </p>

      <h2>6. Gestion des cookies</h2>

      <p>
        Lors de votre première visite sur le site, un bandeau de gestion
        des cookies peut vous permettre d&apos;accepter, refuser ou personnaliser
        l&apos;utilisation des cookies.
      </p>

      <p>
        Vous pouvez également configurer votre navigateur afin de bloquer
        ou supprimer certains cookies.
      </p>

      <h2>7. Durée de conservation</h2>

      <p>
        Les cookies sont conservés pendant une durée limitée conformément
        aux réglementations applicables.
      </p>

      <h2>8. Plus d’informations</h2>

      <p>
        Pour en savoir plus sur la manière dont nous traitons les données
        personnelles, consultez :
      </p>

      <ul>
        <li>
          <a href="/politique-confidentialite">Politique de confidentialité</a>
        </li>
        <li>
          <a href="/mentions-legales">Mentions légales</a>
        </li>
      </ul>

      <h2>9. Contact</h2>

      <p>
        Pour toute question relative à l’utilisation des cookies :
      </p>

      <p>
        <a href="mailto:contact@quizup.fr">contact@quizup.fr</a>
      </p>
    </main>
  );
}