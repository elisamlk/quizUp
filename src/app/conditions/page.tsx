import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site [Nom du site]. Règles d'accès et d'utilisation du service.",
};

export default function CGUPage() {
  return (
    <main className="legalPage">
      <h1>Conditions générales d&apos;utilisation</h1>

      <p>Dernière mise à jour : 12 mars 2026</p>

      <p>
        Les présentes conditions générales d&apos;utilisation (CGU) ont pour
        objet de définir les modalités d&apos;accès et d&apos;utilisation du
        site <strong>Quiz Up</strong>.
      </p>

      <h2>1. Objet du site</h2>

      <p>
        Le site propose des quiz accessibles librement en ligne. Les contenus
        sont proposés à titre informatif et ludique.
      </p>

      <p>
        L&apos;utilisation du site implique l&apos;acceptation pleine et entière
        des présentes conditions générales d&apos;utilisation.
      </p>

      <h2>2. Accès au site</h2>

      <p>
        Le site est accessible gratuitement à tout utilisateur disposant
        d&apos;un accès à Internet.
      </p>

      <p>
        L&apos;éditeur s&apos;efforce d&apos;assurer un accès continu au site,
        mais ne peut garantir une disponibilité permanente.
      </p>

      <p>
        Le site peut être temporairement interrompu pour des raisons de
        maintenance, de mise à jour ou pour toute autre raison technique.
      </p>

      <h2>3. Utilisation du site</h2>

      <p>L&apos;utilisateur s&apos;engage notamment à :</p>

      <ul>
        <li>utiliser le site conformément aux lois en vigueur</li>
        <li>ne pas perturber le bon fonctionnement du site</li>
        <li>
          ne pas tenter d&apos;accéder de manière frauduleuse aux systèmes
        </li>
        <li>
          ne pas reproduire ou exploiter les contenus du site sans autorisation
        </li>
      </ul>

      <h2>4. Propriété intellectuelle</h2>

      <p>
        Les contenus présents sur le site (quiz, textes, éléments graphiques,
        logo, structure du site) sont protégés par le droit de la propriété
        intellectuelle.
      </p>

      <p>
        Toute reproduction, modification ou diffusion des contenus sans
        autorisation préalable est interdite.
      </p>

      <h2>5. Responsabilité</h2>

      <p>
        Les informations proposées sur le site sont fournies à titre informatif
        et ludique.
      </p>

      <p>
        Malgré le soin apporté à leur rédaction, des erreurs ou omissions
        peuvent exister.
      </p>

      <p>
        L&apos;éditeur ne saurait être tenu responsable de l&apos;utilisation
        faite des informations présentes sur le site.
      </p>

      <h2>6. Publicité</h2>

      <p>
        Le site peut afficher des annonces publicitaires afin de financer son
        fonctionnement et son développement.
      </p>

      <p>
        Ces annonces peuvent être diffusées par des partenaires publicitaires
        tels que Google AdSense.
      </p>

      <h2>7. Liens externes</h2>

      <p>Le site peut contenir des liens vers des sites externes.</p>

      <p>
        L&apos;éditeur ne peut être tenu responsable du contenu ou des pratiques
        de ces sites tiers.
      </p>

      <h2>8. Données personnelles</h2>

      <p>
        Pour plus d&apos;informations concernant la collecte et le traitement
        des données personnelles, consultez notre page :
      </p>

      <p>
        <Link href="/politique-confidentialite">
          Politique de confidentialité
        </Link>
      </p>

      <h2>9. Cookies</h2>

      <p>
        Le site peut utiliser des cookies pour assurer son fonctionnement,
        mesurer l&apos;audience et afficher des publicités.
      </p>

      <p>
        Consultez notre <Link href="/cookies">Politique de cookies</Link>.
      </p>

      <h2>10. Modification des CGU</h2>

      <p>
        L&apos;éditeur se réserve le droit de modifier les présentes conditions
        générales d&apos;utilisation à tout moment.
      </p>

      <p>Les utilisateurs sont invités à consulter régulièrement cette page.</p>

      <h2>11. Contact</h2>

      <p>Pour toute question concernant les présentes conditions :</p>

      <p>
        <Link href="/contact">Page de contact</Link>
      </p>

      <h2>12. Droit applicable</h2>

      <p>
        Les présentes conditions générales d&apos;utilisation sont soumises au
        droit français.
      </p>
    </main>
  );
}
