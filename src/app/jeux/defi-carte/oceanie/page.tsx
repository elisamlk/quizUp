import Link from "next/link";
import type { Metadata } from "next";

import { OceaniaMapGame } from "@/components/games/defi-carte/OceaniaMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL =
  "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte/oceanie`;

const TITLE =
  "Défi Carte Océanie - Retrouve les 14 pays d'Océanie";

const DESCRIPTION =
  "Peux-tu retrouver les 14 pays d'Océanie en seulement 4 minutes ? Écris leurs noms, complète la carte à chaque bonne réponse et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442484/oceanie_rnjkf2.jpg";

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
      "/jeux/defi-carte/oceanie",
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
          "Défi Carte Océanie - Retrouve les 14 pays d'Océanie",
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

export default function DefiCarteOceaniePage() {
  const relatedChallenges =
    getRelatedMapChallenges(
      "oceanie"
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
          "Océanie",

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
            Défi Carte Océanie - Retrouve les 14
            pays d&apos;Océanie
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
              14 pays
            </span>

            <span className="quizMetaChip">
              4 minutes
            </span>
          </div>

          <p className="quizIntro">
            Peux-tu retrouver les 14 pays
            d&apos;Océanie en seulement
            4 minutes ? Écris leurs noms et
            regarde la carte se compléter à
            chaque bonne réponse.
          </p>

          <div className="quizCtas">
            <a
              className="quizStartBtn"
              href="#jouer"
            >
              Commencer le défi
            </a>

            <Link
              className="quizAltBtn"
              href="/jeux/defi-carte"
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
            Océanie
          </span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section
          id="jouer"
          className="quizPlay"
        >
          <OceaniaMapGame />
        </section>

        {/* ====================================================
            SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Peux-tu retrouver les 14 pays
            d&apos;Océanie ?
          </h2>

          <p className="seoP">
            Le Défi Carte Océanie est un jeu de
            géographie dans lequel tu dois
            retrouver les 14 pays proposés avant
            la fin des 4 minutes. Aucun choix de
            réponse ne vient t&apos;aider : tu
            dois faire appel à ta mémoire et
            saisir toi-même les noms auxquels tu
            penses.
          </p>

          <p className="seoP">
            Chaque bonne réponse est reconnue
            automatiquement et apparaît
            directement sur la carte. Le but est
            de continuer jusqu&apos;à avoir
            retrouvé les 14 réponses et, si
            possible, compléter toute la carte
            avant la fin du chronomètre.
          </p>

          <ul className="seoList">
            <li>
              14 pays d&apos;Océanie à retrouver
            </li>

            <li>
              4 minutes pour compléter la carte
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
            carte de l&apos;Océanie ?
          </h2>

          <p className="seoP">
            Avec 14 réponses à retrouver, ce
            Défi Carte peut sembler rapide à
            terminer. Pourtant, la difficulté
            vient du fait que l&apos;Océanie est
            constituée de nombreux États séparés
            par de vastes étendues maritimes et
            qu&apos;il est facile d&apos;en
            oublier quelques-uns.
          </p>

          <p className="seoP">
            Les premières réponses peuvent venir
            rapidement, mais terminer la carte
            demande davantage de concentration.
            Lorsque seules quelques réponses
            manquent, il faut réussir à retrouver
            ce qui a été oublié avant que les
            dernières secondes ne s&apos;écoulent.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">
            Comment jouer au Défi Carte Océanie ?
          </h2>

          <p className="seoP">
            Lance le défi puis écris les noms des
            pays d&apos;Océanie que tu connais.
            Lorsqu&apos;une réponse est reconnue,
            elle est automatiquement validée et
            la carte se complète au fur et à
            mesure de ta progression.
          </p>

          <p className="seoP">
            Tu disposes de 4 minutes pour
            retrouver les 14 réponses. Si le
            chronomètre arrive à zéro avant que
            la carte soit terminée, les réponses
            manquées sont révélées. Tu peux
            ensuite relancer une partie et tenter
            d&apos;améliorer ton score.
          </p>

          {/* ==================================================
              PÉRIMÈTRE
          ================================================== */}

          <h2 className="sectionTitle">
            Pourquoi le Défi Carte Océanie
            compte-t-il 14 pays ?
          </h2>

          <p className="seoP">
            Le jeu utilise une sélection de
            14 États souverains pour constituer
            le Défi Carte Océanie. Les
            territoires dépendants présents dans
            la région ne font pas partie des
            réponses nécessaires pour terminer
            la partie.
          </p>

          <p className="seoP">
            La liste reste identique à chaque
            tentative, ce qui permet de comparer
            facilement tes scores et de suivre
            ta progression. L&apos;objectif est
            toujours le même : retrouver les
            14 réponses avant la fin du chrono.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Océanie
            avec une carte interactive
          </h2>

          <p className="seoP">
            Le Défi Carte Océanie permet aussi de
            réviser la géographie de manière
            active. Comme aucune liste de
            réponses n&apos;est affichée à
            l&apos;avance, tu dois réellement
            mobiliser tes connaissances plutôt
            que reconnaître la bonne réponse
            parmi plusieurs propositions.
          </p>

          <p className="seoP">
            En rejouant, tu peux progressivement
            mémoriser les réponses oubliées et
            renforcer tes repères géographiques.
            La carte interactive permet aussi de
            visualiser ta progression pendant la
            partie et de mieux retenir
            l&apos;organisation de cette région
            du monde.
          </p>

          <p className="seoP">
            Une fois les 14 réponses maîtrisées,
            découvre les autres{" "}
            <Link href="/jeux/defi-carte">
              Défis Carte
            </Link>{" "}
            et tente de compléter les cartes des
            autres continents.
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