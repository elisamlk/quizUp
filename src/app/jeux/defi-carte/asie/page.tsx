import Link from "next/link";
import type { Metadata } from "next";

import { AsiaMapGame } from "@/components/games/defi-carte/AsiaMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL =
  "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte/asie`;

const TITLE =
  "Défi Carte Asie - Retrouve les 48 pays d'Asie";

const DESCRIPTION =
  "Peux-tu retrouver les 48 pays d'Asie en seulement 7 minutes ? Écris leurs noms, complète la carte à chaque bonne réponse et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442160/asia_momlje.jpg";

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
      "/jeux/defi-carte/asie",
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
          "Défi Carte Asie - Retrouve les 48 pays d'Asie",
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

export default function AsiaChallengePage() {
  const relatedChallenges =
    getRelatedMapChallenges(
      "asie"
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
          "Asie",

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
            Défi Carte Asie - Retrouve les 48
            pays d&apos;Asie
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
              48 pays
            </span>

            <span className="quizMetaChip">
              7 minutes
            </span>
          </div>

          <p className="quizIntro">
            Combien de pays d&apos;Asie
            peux-tu retrouver en 7 minutes ?
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
            Asie
          </span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section
          id="jouer"
          className="quizPlay"
        >
          <AsiaMapGame />
        </section>

        {/* ====================================================
            SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Peux-tu retrouver les 48 pays
            d&apos;Asie ?
          </h2>

          <p className="seoP">
            Le Défi Carte Asie est un jeu de
            géographie dans lequel tu dois
            retrouver les 48 pays proposés sur
            la carte avant la fin des 7 minutes.
            Aucun choix de réponse ne vient
            t&apos;aider : tu dois faire appel à
            ta mémoire et saisir toi-même les
            noms auxquels tu penses.
          </p>

          <p className="seoP">
            Chaque bonne réponse est reconnue
            automatiquement et le pays
            correspondant apparaît directement
            sur la carte. Ton objectif est de
            continuer jusqu&apos;à avoir retrouvé
            les 48 réponses et, si possible,
            compléter toute la carte avant la
            fin du chronomètre.
          </p>

          <ul className="seoList">
            <li>
              48 pays d&apos;Asie à retrouver
            </li>

            <li>
              7 minutes pour compléter la carte
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
            carte de l&apos;Asie ?
          </h2>

          <p className="seoP">
            Avec 48 réponses à retrouver, le
            Défi Carte Asie fait appel à une
            connaissance étendue du continent.
            Les premières réponses peuvent venir
            rapidement, mais terminer toute la
            carte avant la fin des 7 minutes
            demande davantage de concentration
            et de mémoire.
          </p>

          <p className="seoP">
            Pour réussir le sans-faute, il faut
            penser à toutes les régions du
            continent et ne pas se limiter aux
            réponses qui viennent spontanément
            à l&apos;esprit. Plus la carte se
            complète, plus retrouver les
            dernières réponses peut devenir
            difficile.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">
            Comment jouer au Défi Carte Asie ?
          </h2>

          <p className="seoP">
            Lance le défi puis écris les noms
            des pays d&apos;Asie que tu connais.
            Lorsqu&apos;une réponse est reconnue,
            elle est automatiquement validée et
            la carte se complète au fur et à
            mesure de ta progression.
          </p>

          <p className="seoP">
            Tu disposes de 7 minutes pour
            retrouver les 48 réponses. Si le
            chronomètre arrive à zéro avant que
            la carte soit terminée, les réponses
            manquées sont révélées. Tu peux
            ensuite rejouer pour améliorer ton
            score et tenter le sans-faute.
          </p>

          {/* ==================================================
              PÉRIMÈTRE DU JEU
          ================================================== */}

          <h2 className="sectionTitle">
            Pourquoi le Défi Carte Asie
            compte-t-il 48 pays ?
          </h2>

          <p className="seoP">
            La délimitation géographique de
            l&apos;Asie peut varier selon les
            conventions utilisées, notamment
            pour certains territoires et États
            situés entre plusieurs régions du
            monde. Pour ce Défi Carte, une liste
            précise de 48 réponses a donc été
            définie et reste identique à chaque
            partie.
          </p>

          <p className="seoP">
            Cette règle permet de conserver un
            objectif clair et un score comparable
            d&apos;une tentative à l&apos;autre.
            Pour terminer le jeu, tu dois
            simplement retrouver les 48 réponses
            reconnues par cette carte avant la
            fin du chrono.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Asie avec
            une carte interactive
          </h2>

          <p className="seoP">
            Le Défi Carte Asie permet également
            de réviser la géographie de manière
            active. Contrairement à un quiz à
            choix multiples, aucune liste de
            réponses n&apos;est affichée à
            l&apos;avance : tu dois réellement
            mobiliser tes connaissances pour
            retrouver les noms.
          </p>

          <p className="seoP">
            En rejouant plusieurs fois, tu peux
            identifier les réponses que tu
            oublies régulièrement et les
            mémoriser progressivement. La carte
            interactive aide aussi à renforcer
            tes repères géographiques en
            visualisant ta progression pendant
            la partie.
          </p>

          <p className="seoP">
            Une fois les 48 réponses maîtrisées,
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