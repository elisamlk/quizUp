import Link from "next/link";
import type { Metadata } from "next";

import { AfricaMapGame } from "@/components/games/defi-carte/AfricaMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL =
  "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte/afrique`;

const TITLE =
  "Défi Carte Afrique - Retrouve les 54 pays d'Afrique";

const DESCRIPTION =
  "Peux-tu retrouver les 54 pays d'Afrique en seulement 6 minutes ? Écris leurs noms, complète la carte à chaque bonne réponse et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442617/africa_xod2dr.jpg";

/* ==========================================================
   METADATA
========================================================== */

export const metadata: Metadata = {
  title:
    `${TITLE}`,

  description:
    DESCRIPTION,

  alternates: {
    canonical:
      "/jeux/defi-carte/afrique",
  },

  openGraph: {
    title:
      `${TITLE}`,

    description:
      DESCRIPTION,

    url:
      PAGE_URL,

    type:
      "website",

    images: [
      {
        url:
          COVER_IMAGE,

        alt:
          "Défi Carte Afrique - Retrouve les 54 pays d'Afrique",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      `${TITLE}`,

    description:
      DESCRIPTION,

    images: [
      COVER_IMAGE,
    ],
  },
};

/* ==========================================================
   PAGE
========================================================== */

export default function AfricaChallengePage() {
  const relatedChallenges =
    getRelatedMapChallenges(
      "afrique"
    );

  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Accueil",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Jeux",

        item:
          `${SITE_URL}/jeux`,
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          "Défi Carte",

        item:
          `${SITE_URL}/jeux/defi-carte`,
      },

      {
        "@type":
          "ListItem",

        position:
          4,

        name:
          "Afrique",

        item:
          PAGE_URL,
      },
    ],
  };

  return (
    <main className="page">
      {/* ====================================================
          JSON-LD
      ==================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd
            ).replace(
              /</g,
              "\\u003c"
            ),
        }}
      />

      {/* ====================================================
          HERO
      ==================================================== */}

      <header className="quizHero">
        <div
          className="quizHeroImg"
          style={{
            backgroundImage:
              `url("${COVER_IMAGE}")`,
          }}
          aria-hidden="true"
        />

        <div
          className="quizHeroOverlay"
          aria-hidden="true"
        />

        <div className="quizHeroContent">
          <h1 className="quizTitle">
            Défi Carte Afrique - Retrouve les 54
            pays d&apos;Afrique
          </h1>

          <div className="quizMetaRow">
            <Link
              className="quizMetaChip"
              href="/jeux"
            >
              Jeux
            </Link>

            <Link
              className="quizMetaChip"
              href="/jeux/defi-carte"
            >
              Défi Carte
            </Link>

            <span className="quizMetaChip">
              Géographie
            </span>

            <span className="quizMetaChip">
              54 pays
            </span>

            <span className="quizMetaChip">
              6 minutes
            </span>
          </div>

          <p className="quizIntro">
            Combien de pays d&apos;Afrique
            peux-tu retrouver en 6 minutes ?
            Écris leurs noms et regarde la carte
            se compléter à chaque bonne réponse.
          </p>

          <div className="quizCtas">
            <a
              href="#jouer"
              className="quizStartBtn"
            >
              Lancer le défi
            </a>

            <Link
              href="/jeux/defi-carte"
              className="quizAltBtn"
            >
              Tous les Défis Carte
            </Link>
          </div>
        </div>
      </header>

      <div className="quizPageLayout">
        {/* ====================================================
            BREADCRUMBS
        ==================================================== */}

        <nav
          className="breadcrumbs"
          aria-label="Fil d’Ariane"
        >
          <Link href="/">
            Accueil
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <Link href="/jeux">
            Jeux
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <Link href="/jeux/defi-carte">
            Défi Carte
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <span className="crumbCurrent">
            Afrique
          </span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section
          id="jouer"
          className="quizPlay"
        >
          <AfricaMapGame />
        </section>

        {/* ====================================================
            SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Peux-tu retrouver les 54 pays
            d&apos;Afrique ?
          </h2>

          <p className="seoP">
            Le Défi Carte Afrique est un jeu de
            géographie dans lequel ton objectif
            est de retrouver les 54 pays proposés
            sur la carte avant la fin des
            6 minutes. Aucun choix de réponse ne
            vient t&apos;aider : tu dois écrire
            toi-même les noms auxquels tu penses.
          </p>

          <p className="seoP">
            À chaque bonne réponse, le pays
            correspondant est immédiatement
            validé et apparaît sur la carte. Plus
            tu avances, plus il devient difficile
            de trouver les dernières réponses
            avant la fin du chronomètre.
          </p>

          <ul className="seoList">
            <li>
              54 pays d&apos;Afrique à retrouver
            </li>

            <li>
              6 minutes pour compléter la carte
            </li>

            <li>
              Aucun QCM ni liste de réponses
            </li>

            <li>
              Chaque bonne réponse apparaît
              directement sur la carte
            </li>

            <li>
              Les réponses manquées sont révélées
              à la fin de la partie
            </li>

            <li>
              Jeu de géographie gratuit en ligne
            </li>
          </ul>

          {/* ==================================================
              DIFFICULTÉ
          ================================================== */}

          <h2 className="sectionTitle">
            Réussiras-tu à compléter toute la
            carte de l&apos;Afrique ?
          </h2>

          <p className="seoP">
            Retrouver quelques pays est simple,
            mais compléter les 54 réponses est
            beaucoup plus difficile. Le continent
            compte de nombreux États et il suffit
            d&apos;en oublier quelques-uns pour
            manquer le sans-faute.
          </p>

          <p className="seoP">
            Pour réussir, il faut penser à toutes
            les zones du continent et ne pas se
            concentrer uniquement sur les pays
            qui viennent immédiatement à
            l&apos;esprit. Le chrono ajoute une
            difficulté supplémentaire : plus la
            liste se remplit, plus les dernières
            réponses demandent de mémoire.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">
            Comment jouer au Défi Carte Afrique ?
          </h2>

          <p className="seoP">
            Lance le défi puis écris les noms des
            pays d&apos;Afrique que tu connais.
            Lorsqu&apos;une réponse est reconnue,
            le pays correspondant est validé
            automatiquement sur la carte.
            Continue jusqu&apos;à avoir retrouvé
            les 54 pays ou jusqu&apos;à la fin des
            6 minutes.
          </p>

          <p className="seoP">
            Si tu ne réussis pas à terminer la
            carte, les réponses manquées sont
            affichées à la fin de la partie. Tu
            peux ainsi repérer ce que tu as
            oublié, relancer le jeu et essayer
            d&apos;améliorer ton score lors de la
            partie suivante.
          </p>

          {/* ==================================================
              PÉRIMÈTRE DU JEU
          ================================================== */}

          <h2 className="sectionTitle">
            Quels territoires sont pris en compte
            dans le Défi Carte Afrique ?
          </h2>

          <p className="seoP">
            Le jeu demande 54 réponses et se
            concentre sur les États africains
            retenus dans ce Défi Carte. Les
            territoires qui ne font pas partie
            de cette sélection ne sont pas
            comptabilisés dans le score final.
          </p>

          <p className="seoP">
            Cette règle permet de conserver une
            liste claire et identique à chaque
            partie. Ton objectif reste donc le
            même : retrouver les 54 réponses
            attendues avant la fin du
            chronomètre.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Afrique
            avec une carte interactive
          </h2>

          <p className="seoP">
            Le Défi Carte Afrique permet aussi de
            réviser la géographie de manière
            active. Comme aucune réponse
            prédéfinie n&apos;est affichée, tu
            dois réellement faire appel à ta
            mémoire plutôt que reconnaître la
            bonne réponse parmi plusieurs choix.
          </p>

          <p className="seoP">
            En rejouant, les pays oubliés lors
            des premières parties deviennent
            progressivement plus faciles à
            retenir. La carte permet également
            de mieux visualiser leur emplacement
            sur le continent et de renforcer tes
            repères géographiques.
          </p>

          <p className="seoP">
            Lorsque tu maîtrises l&apos;Afrique,
            découvre les autres{" "}
            <Link href="/jeux/defi-carte">
              Défis Carte
            </Link>{" "}
            pour tester tes connaissances sur
            l&apos;Europe, l&apos;Asie, les
            Amériques et l&apos;Océanie.
          </p>
        </section>

        {/* ====================================================
            AUTRES DÉFIS CARTE
        ==================================================== */}

        {relatedChallenges.length > 0 ? (
          <section className="relatedPopular">
            <h2 className="sectionTitle">
              Continue avec un autre Défi Carte
            </h2>

            <div className="quizList">
              {relatedChallenges.map(
                (challenge) => (
                  <Link
                    key={challenge.slug}
                    href={`/jeux/defi-carte/${challenge.slug}`}
                    className="quizRow"
                  >
                    <div
                      className="quizRowImg"
                      style={{
                        backgroundImage:
                          `url("${challenge.image}")`,
                      }}
                      aria-hidden="true"
                    />

                    <div className="quizRowContent">
                      <div className="quizRowTop">
                        <span className="quizRowCategory">
                          Défi Carte
                        </span>

                        <span className="quizRowMeta">
                          {challenge.totalCountries > 0
                            ? `${challenge.totalCountries} pays`
                            : challenge.name}
                          {" · "}
                          {formatChallengeDuration(
                            challenge.duration
                          )}
                        </span>
                      </div>

                      <h3 className="quizRowTitle">
                        {challenge.title}
                      </h3>

                      <p className="quizRowDesc">
                        {challenge.description}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>

            <p className="relatedMore">
              <Link href="/jeux/defi-carte">
                Voir tous les Défis Carte →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}