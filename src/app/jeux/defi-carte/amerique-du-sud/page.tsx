import Link from "next/link";
import type { Metadata } from "next";

import { SouthAmericaMapGame } from "@/components/games/defi-carte/SouthAmericaMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL =
  "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte/amerique-du-sud`;

const TITLE =
  "Défi Carte Amérique du Sud - Retrouve les 12 pays";

const DESCRIPTION =
  "Peux-tu retrouver les 12 pays d'Amérique du Sud en seulement 4 minutes ? Écris leurs noms, complète la carte à chaque bonne réponse et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788439882/south-america_aywknj.jpg";

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
      "/jeux/defi-carte/amerique-du-sud",
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
          "Défi Carte Amérique du Sud - Retrouve les 12 pays",
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

export default function DefiCarteAmeriqueDuSudPage() {
  const relatedChallenges =
    getRelatedMapChallenges(
      "amerique-du-sud"
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
          "Amérique du Sud",

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
            Défi Carte Amérique du Sud -
            Retrouve les 12 pays
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
              12 pays
            </span>

            <span className="quizMetaChip">
              4 minutes
            </span>
          </div>

          <p className="quizIntro">
            Peux-tu retrouver les 12 pays
            d&apos;Amérique du Sud en seulement
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
            Amérique du Sud
          </span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section
          id="jouer"
          className="quizPlay"
        >
          <SouthAmericaMapGame />
        </section>

        {/* ====================================================
            SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Peux-tu retrouver les 12 pays
            d&apos;Amérique du Sud ?
          </h2>

          <p className="seoP">
            Le Défi Carte Amérique du Sud est un
            jeu de géographie dans lequel tu dois
            retrouver les 12 pays du continent
            avant la fin des 4 minutes. Aucun
            choix de réponse ne vient
            t&apos;aider : tu dois faire appel à
            ta mémoire et écrire toi-même les
            noms auxquels tu penses.
          </p>

          <p className="seoP">
            Chaque bonne réponse est
            automatiquement reconnue et le pays
            correspondant apparaît directement
            sur la carte. L&apos;objectif est
            simple : continuer jusqu&apos;à avoir
            retrouvé les 12 réponses et tenter
            de terminer la carte avant la fin du
            chronomètre.
          </p>

          <ul className="seoList">
            <li>
              12 pays d&apos;Amérique du Sud à
              retrouver
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
            carte de l&apos;Amérique du Sud ?
          </h2>

          <p className="seoP">
            Avec 12 réponses à trouver, ce Défi
            Carte peut sembler plus accessible
            que ceux consacrés à de plus grands
            ensembles géographiques. Pourtant,
            réussir un sans-faute demande de ne
            laisser aucun pays de côté avant la
            fin du chrono.
          </p>

          <p className="seoP">
            Les premières réponses peuvent venir
            rapidement, mais les dernières sont
            souvent celles qui font la différence.
            Lorsque la carte est presque
            complète, il faut réussir à identifier
            ce qui manque tout en gardant un œil
            sur les secondes restantes.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">
            Comment jouer au Défi Carte
            Amérique du Sud ?
          </h2>

          <p className="seoP">
            Lance le défi puis écris les noms
            des pays d&apos;Amérique du Sud que
            tu connais. Lorsqu&apos;une réponse
            est reconnue, elle est validée
            automatiquement et la carte se
            complète au fur et à mesure de ta
            progression.
          </p>

          <p className="seoP">
            Tu disposes de 4 minutes pour
            retrouver les 12 réponses. Si le
            chronomètre arrive à zéro avant que
            la carte soit terminée, les réponses
            manquées sont révélées. Tu peux
            ensuite relancer une partie et tenter
            de battre ton précédent score.
          </p>

          {/* ==================================================
              PÉRIMÈTRE
          ================================================== */}

          <h2 className="sectionTitle">
            Pourquoi le Défi Carte compte-t-il
            12 pays ?
          </h2>

          <p className="seoP">
            Ce Défi Carte demande de retrouver
            les 12 États souverains retenus pour
            l&apos;Amérique du Sud. Les
            territoires dépendants présents sur
            le continent ne font pas partie des
            réponses nécessaires pour compléter
            le jeu.
          </p>

          <p className="seoP">
            Le nombre de réponses reste identique
            à chaque partie. Tu peux ainsi
            comparer tes performances, repérer
            les réponses que tu oublies le plus
            souvent et mesurer tes progrès au
            fil de tes tentatives.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Amérique
            du Sud avec une carte interactive
          </h2>

          <p className="seoP">
            Le Défi Carte Amérique du Sud permet
            aussi de réviser la géographie de
            manière active. Contrairement à un
            quiz à choix multiples, aucune
            réponse n&apos;est affichée à
            l&apos;avance : tu dois réellement
            retrouver les noms grâce à tes
            connaissances.
          </p>

          <p className="seoP">
            Rejouer permet progressivement de
            mieux mémoriser les réponses oubliées
            et de renforcer tes repères
            géographiques. La carte interactive
            permet également de visualiser ta
            progression à mesure que tu trouves
            les bonnes réponses.
          </p>

          <p className="seoP">
            Lorsque tu réussis le sans-faute,
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