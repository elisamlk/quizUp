import Link from "next/link";
import type { Metadata } from "next";

import { NorthAmericaMapGame } from "@/components/games/defi-carte/NorthAmericaMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL =
  "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte/amerique-du-nord`;

const TITLE =
  "Défi Carte Amérique du Nord - Retrouve les 23 pays";

const DESCRIPTION =
  "Peux-tu retrouver les 23 pays d'Amérique du Nord, d'Amérique centrale et des Caraïbes en seulement 5 minutes ? Complète la carte et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788441712/north-america_l5zjtn.jpg";

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
      "/jeux/defi-carte/amerique-du-nord",
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
          "Défi Carte Amérique du Nord - Retrouve les 23 pays",
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

export default function DefiCarteAmeriqueDuNordPage() {
  const relatedChallenges =
    getRelatedMapChallenges(
      "amerique-du-nord"
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
          "Amérique du Nord",

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
            Défi Carte Amérique du Nord -
            Retrouve les 23 pays
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
              23 pays
            </span>

            <span className="quizMetaChip">
              5 minutes
            </span>
          </div>

          <p className="quizIntro">
            Peux-tu retrouver les 23 pays
            d&apos;Amérique du Nord,
            d&apos;Amérique centrale et des
            Caraïbes en seulement 5 minutes ?
            Écris leurs noms et regarde la carte
            se compléter à chaque bonne réponse.
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
            Amérique du Nord
          </span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section
          id="jouer"
          className="quizPlay"
        >
          <NorthAmericaMapGame />
        </section>

        {/* ====================================================
            SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Peux-tu retrouver les 23 pays
            d&apos;Amérique du Nord ?
          </h2>

          <p className="seoP">
            Le Défi Carte Amérique du Nord est
            un jeu de géographie dans lequel tu
            dois retrouver 23 pays avant la fin
            des 5 minutes. Le défi couvre
            l&apos;Amérique du Nord,
            l&apos;Amérique centrale et les
            Caraïbes, avec une seule mission :
            compléter la carte sans oublier
            aucune réponse.
          </p>

          <p className="seoP">
            Aucun QCM ni liste de pays ne vient
            t&apos;aider pendant la partie. Tu
            dois retrouver les réponses
            uniquement grâce à ta mémoire. À
            chaque nom correctement saisi, le
            pays correspondant est validé et
            apparaît directement sur la carte.
          </p>

          <ul className="seoList">
            <li>
              23 pays à retrouver sur la carte
            </li>

            <li>
              5 minutes pour compléter le défi
            </li>

            <li>
              Amérique du Nord, Amérique centrale
              et Caraïbes
            </li>

            <li>
              Aucun QCM ni liste de réponses
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
            carte ?
          </h2>

          <p className="seoP">
            Retrouver les premières réponses peut
            sembler facile, mais terminer les
            23 pays avant la fin du chrono est
            une autre histoire. La difficulté
            augmente au fur et à mesure que la
            carte se remplit et que les réponses
            les plus évidentes ont déjà été
            trouvées.
          </p>

          <p className="seoP">
            Pour réussir le sans-faute, il faut
            penser à l&apos;ensemble de la zone
            couverte par le jeu. Les différentes
            parties du continent et les nombreux
            États insulaires rendent ce Défi
            Carte particulièrement intéressant
            pour tester réellement ta mémoire
            géographique.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">
            Comment jouer au Défi Carte
            Amérique du Nord ?
          </h2>

          <p className="seoP">
            Lance le défi puis écris les noms
            des pays auxquels tu penses. Chaque
            réponse reconnue est automatiquement
            validée et apparaît sur la carte.
            Continue jusqu&apos;à avoir retrouvé
            les 23 réponses ou jusqu&apos;à la
            fin des 5 minutes.
          </p>

          <p className="seoP">
            Si le chronomètre arrive à zéro avant
            que tu aies terminé, les réponses
            manquées sont révélées. Tu peux alors
            identifier celles que tu avais
            oubliées, relancer immédiatement une
            partie et tenter d&apos;améliorer ton
            score.
          </p>

          {/* ==================================================
              PÉRIMÈTRE
          ================================================== */}

          <h2 className="sectionTitle">
            Pourquoi le Défi Carte compte-t-il
            23 pays ?
          </h2>

          <p className="seoP">
            Dans ce jeu, le Défi Carte Amérique
            du Nord regroupe 23 pays répartis
            entre l&apos;Amérique du Nord,
            l&apos;Amérique centrale et les
            Caraïbes. Les territoires dépendants
            ne font pas partie des réponses
            demandées.
          </p>

          <p className="seoP">
            Cette sélection reste identique à
            chaque partie afin que tu puisses
            comparer tes performances et
            progresser d&apos;une tentative à
            l&apos;autre. L&apos;objectif est
            toujours le même : retrouver les
            23 réponses avant la fin du chrono.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Amérique
            du Nord avec une carte interactive
          </h2>

          <p className="seoP">
            Ce Défi Carte peut également servir
            à réviser la géographie de manière
            active. Comme les réponses ne sont
            pas affichées à l&apos;avance, tu
            dois réellement mobiliser ta mémoire
            plutôt que simplement reconnaître
            une réponse parmi plusieurs
            propositions.
          </p>

          <p className="seoP">
            En rejouant plusieurs fois, les
            réponses oubliées deviennent
            progressivement plus faciles à
            retenir. La carte interactive aide
            aussi à mieux visualiser la
            répartition des pays et à renforcer
            tes repères géographiques.
          </p>

          <p className="seoP">
            Une fois ce défi maîtrisé, découvre
            les autres{" "}
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