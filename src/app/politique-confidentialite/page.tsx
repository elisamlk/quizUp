import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site [Nom du site]. Informations sur les données techniques, la navigation, les cookies et la publicité.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="legalPage">
      <h1>Politique de confidentialité</h1>

      <p>Dernière mise à jour : 12 mars 2026</p>

      <p>
        La présente politique de confidentialité explique comment le site{" "}
        <strong>[Nom du site]</strong> traite certaines données dans le cadre de
        la navigation sur le site.
      </p>

      <h2>1. Responsable du traitement</h2>

      <p>
        Le responsable du traitement des données est :
        <br />
        <strong>[Nom ou société]</strong>
        <br />
        Adresse : [Adresse]
        <br />
        Email : <a href="mailto:contact@quizup.fr">contact@quizup.fr</a>
      </p>

      <h2>2. Nature du site</h2>

      <p>
        QuizUp est un site de quiz accessible librement. Le site ne
        propose pas de création de compte, d&apos;espace membre ou de service
        nécessitant une inscription.
      </p>

      <h2>3. Données pouvant être traitées</h2>

      <p>
        Lors de votre navigation sur le site, certaines données techniques ou de
        navigation peuvent être traitées, notamment :
      </p>

      <ul>
        <li>l&apos;adresse IP</li>
        <li>le type de navigateur</li>
        <li>le type d&apos;appareil utilisé</li>
        <li>le système d&apos;exploitation</li>
        <li>les pages consultées</li>
        <li>la durée approximative de navigation</li>
        <li>les préférences liées aux cookies</li>
        <li>des données statistiques de fréquentation</li>
      </ul>

      <h2>4. Données non collectées</h2>

      <p>
        Le site ne propose pas de compte utilisateur. En conséquence, nous ne
        collectons pas de données de profil, de mot de passe ou de données liées
        à un espace personnel.
      </p>

      <h2>5. Finalités du traitement</h2>

      <p>Les données éventuellement traitées servent notamment à :</p>

      <ul>
        <li>assurer le bon fonctionnement technique du site</li>
        <li>améliorer l&apos;expérience utilisateur</li>
        <li>mesurer l&apos;audience et la fréquentation</li>
        <li>assurer la sécurité du site</li>
        <li>afficher des publicités</li>
        <li>respecter les obligations légales</li>
      </ul>

      <h2>6. Base légale</h2>

      <p>Selon les cas, les traitements peuvent reposer sur :</p>

      <ul>
        <li>votre consentement, lorsqu&apos;il est requis</li>
        <li>
          notre intérêt légitime pour la sécurité, la maintenance et
          l&apos;amélioration du site
        </li>
        <li>nos obligations légales</li>
      </ul>

      <h2>7. Publicité</h2>

      <p>
        Le site peut afficher des annonces publicitaires afin de financer son
        fonctionnement et son développement.
      </p>

      <p>
        Des partenaires publicitaires comme Google AdSense peuvent utiliser des
        cookies ou technologies similaires pour afficher, mesurer ou
        personnaliser les annonces selon vos choix et la réglementation
        applicable.
      </p>

      <h2>8. Destinataires des données</h2>

      <p>
        Les données peuvent être accessibles, dans la limite nécessaire, à :
      </p>

      <ul>
        <li>l&apos;éditeur du site</li>
        <li>l&apos;hébergeur du site</li>
        <li>les prestataires techniques</li>
        <li>les outils de mesure d&apos;audience</li>
        <li>les partenaires publicitaires</li>
      </ul>

      <h2>9. Durée de conservation</h2>

      <p>
        Les données sont conservées pendant une durée limitée et proportionnée à
        leur finalité.
      </p>

      <ul>
        <li>données techniques et journaux : 6 à 12 mois</li>
        <li>choix de consentement cookies : environ 6 mois</li>
        <li>données de mesure d&apos;audience : selon l&apos;outil utilisé</li>
      </ul>

      <h2>10. Vos droits</h2>

      <p>Vous pouvez demander lorsque cela est applicable :</p>

      <ul>
        <li>l&apos;accès à vos données</li>
        <li>leur rectification</li>
        <li>leur suppression</li>
        <li>la limitation du traitement</li>
        <li>vous opposer à certains traitements</li>
        <li>retirer votre consentement à tout moment</li>
      </ul>

      <p>
        Pour exercer vos droits :
        <br />
        <a href="mailto:contact@quizup.fr">email@tonsite.fr</a>
      </p>

      <h2>11. Cookies</h2>

      <p>
        Le site peut utiliser des cookies ou technologies similaires pour le
        fonctionnement du site, la mesure d&apos;audience et la publicité.
      </p>

      <p>
        Consultez notre{" "}
        <Link href="/cookies">Politique de cookies</Link>.
      </p>

      <h2>12. Sécurité</h2>

      <p>
        Des mesures techniques et organisationnelles raisonnables sont mises en
        place pour protéger les données contre tout accès non autorisé.
      </p>

      <h2>13. Réclamation</h2>

      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        adresser une réclamation à l&apos;autorité compétente de protection des
        données.
      </p>

      <h2>14. Modification de la politique</h2>

      <p>
        Cette politique de confidentialité peut être modifiée à tout moment. La
        version applicable est celle publiée sur cette page.
      </p>

      <h2>Liens utiles</h2>

      <ul>
        <li>
          <Link href="/mentions-legales">Mentions légales</Link>
        </li>
        <li>
          <Link href="/cookies">Politique de cookies</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </main>
  );
}
