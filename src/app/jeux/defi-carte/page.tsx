import Link from "next/link";
import type { Metadata } from "next";

import {
  MAP_CHALLENGES,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL = "https://www.quizup.fr";

const PAGE_URL =
  `${SITE_URL}/jeux/defi-carte`;

const COVER_IMAGE =
  `${SITE_URL}/images/defi-carte.jpg`;

export const metadata: Metadata = {
  title:
    "Défi Carte - Jeux de géographie sur les pays du monde",

  description:
    "Joue gratuitement aux Défis Carte de QuizUp et retrouve les pays du monde sur des cartes interactives. Europe, Afrique, Asie, Amériques et Océanie : choisis un continent et complète la carte avant la fin du chrono.",

  alternates: {
    canonical: "/jeux/defi-carte",
  },

  openGraph: {
    title:
      "Défi Carte - Jeux de géographie sur les pays du monde",

    description:
      "Retrouve les pays du monde avec les Défis Carte de QuizUp. Choisis un continent, lance le chrono et tente de compléter la carte.",

    url: PAGE_URL,

    type: "website",

    images: [
      {
        url: COVER_IMAGE,
        alt:
          "Défi Carte - Jeux de géographie sur les pays du monde",
      },
    ],
  },
};

/* ==========================================================
   HELPERS SEO
========================================================== */

function getChallengeSeoLabel(
  slug: string,
  fallback: string
) {
  switch (slug) {
    case "europe":
      return "Défi Carte Europe - Retrouve les 46 pays d'Europe";

    case "afrique":
      return "Défi Carte Afrique - Retrouve les 54 pays d'Afrique";

    case "asie":
      return "Défi Carte Asie - Retrouve les 48 pays d'Asie";

    case "amerique-du-nord":
      return "Défi Carte Amérique du Nord - Retrouve les 23 pays";

    case "amerique-du-sud":
      return "Défi Carte Amérique du Sud - Retrouve les 12 pays";

    case "oceanie":
      return "Défi Carte Océanie - Retrouve les 14 pays";

    default:
      return fallback;
  }
}

/* ==========================================================
   PAGE
========================================================== */

export default function DefiCartePage() {
  const availableChallenges =
    MAP_CHALLENGES.filter(
      (challenge) =>
        challenge.available
    );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "Jeux",
        item: `${SITE_URL}/jeux`,
      },

      {
        "@type": "ListItem",
        position: 3,
        name: "Défi Carte",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd
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
              'url("/images/defi-carte.jpg")',
          }}
          aria-hidden="true"
        />

        <div
          className="quizHeroOverlay"
          aria-hidden="true"
        />

        <div className="quizHeroContent">
          <h1 className="quizTitle">
            Défi Carte - Retrouve les pays du monde
          </h1>

          <div className="quizMetaRow">
            <Link
              className="quizMetaChip"
              href="/jeux"
            >
              Jeux
            </Link>

            <span className="quizMetaChip">
              Géographie
            </span>

            <span className="quizMetaChip">
              Cartes interactives
            </span>

            <span className="quizMetaChip">
              Gratuit
            </span>
          </div>

          <p className="quizIntro">
            Teste ta géographie avec les Défis
            Carte de QuizUp. Choisis un continent
            et retrouve un maximum de pays
            directement sur la carte avant la
            fin du chrono.
          </p>

          <div className="quizCtas">
            <a
              href="#defis"
              className="quizStartBtn"
            >
              Voir les défis
            </a>

            <Link
              href="/jeux"
              className="quizAltBtn"
            >
              Tous les jeux
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================
          CONTENU
      ==================================================== */}

      <div className="quizPageLayout">
        {/* ==================================================
            BREADCRUMBS
        ================================================== */}

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

          <span className="crumbCurrent">
            Défi Carte
          </span>
        </nav>

        {/* ==================================================
            LISTE DES DÉFIS
        ================================================== */}

        <section
          id="defis"
          className="mapChallenges"
          aria-label="Défis Carte par continent"
        >
          <div className="mapChallenges__grid">
            {MAP_CHALLENGES.map(
              (challenge) => {
                if (
                  challenge.available
                ) {
                  return (
                    <Link
                      key={
                        challenge.slug
                      }
                      href={`/jeux/defi-carte/${challenge.slug}`}
                      className="mapChallengeCard"
                    >
                      <div
                        className="mapChallengeCard__image"
                        style={{
                          backgroundImage: `url("${challenge.image}")`,
                        }}
                        aria-hidden="true"
                      />

                      <div
                        className="mapChallengeCard__overlay"
                        aria-hidden="true"
                      />

                      <div className="mapChallengeCard__top">
                        <span className="mapChallengeCard__status">
                          Jouer
                        </span>
                      </div>

                      <div className="mapChallengeCard__content">
                        <div className="mapChallengeCard__meta">
                          <span>
                            {challenge.totalCountries > 0
                              ? `${challenge.totalCountries} pays`
                              : challenge.name}
                          </span>

                          <span>
                            {formatChallengeDuration(
                              challenge.duration
                            )}
                          </span>
                        </div>

                        <h3>
                          {challenge.title}
                        </h3>

                        <p>
                          {
                            challenge.description
                          }
                        </p>

                        <span className="mapChallengeCard__cta">
                          Lancer le défi

                          <span
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                }

                return (
                  <article
                    key={
                      challenge.slug
                    }
                    className="mapChallengeCard mapChallengeCard--soon"
                  >
                    <div
                      className="mapChallengeCard__image"
                      style={{
                        backgroundImage: `url("${challenge.image}")`,
                      }}
                      aria-hidden="true"
                    />

                    <div
                      className="mapChallengeCard__overlay"
                      aria-hidden="true"
                    />

                    <div className="mapChallengeCard__top">
                      <span className="mapChallengeCard__status mapChallengeCard__status--soon">
                        Bientôt
                      </span>
                    </div>

                    <div className="mapChallengeCard__content">
                      <div className="mapChallengeCard__meta">
                        <span>
                          {challenge.totalCountries > 0
                            ? `${challenge.totalCountries} pays`
                            : challenge.name}
                        </span>

                        <span>
                          {formatChallengeDuration(
                            challenge.duration
                          )}
                        </span>
                      </div>

                      <h3>
                        {challenge.title}
                      </h3>

                      <p>
                        {
                          challenge.description
                        }
                      </p>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>

        {/* ==================================================
            SEO - PRÉSENTATION
        ================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Défi Carte : des jeux de géographie
            pour retrouver les pays
          </h2>

          <p className="seoP">
            Tu connais les pays du monde,
            mais serais-tu capable de tous les
            retrouver sous la pression du
            chronomètre ? Les Défis Carte de
            QuizUp sont des jeux de géographie
            interactifs dans lesquels tu dois
            retrouver un maximum de pays avant
            la fin du temps imparti.
          </p>

          <p className="seoP">
            Ici, aucun QCM ne vient te donner
            la réponse. À toi de retrouver les
            noms des pays uniquement grâce à
            tes connaissances. À chaque bonne
            réponse, le pays correspondant
            apparaît directement sur la carte
            et te rapproche progressivement du
            sans-faute.
          </p>

          {/* ================================================
              SEO - CONTINENTS
          ================================================ */}

          <h2 className="sectionTitle">
            Quel Défi Carte vas-tu choisir ?
          </h2>

          <p className="seoP">
            Les Défis Carte permettent
            actuellement de tester tes
            connaissances sur l&apos;Europe,
            l&apos;Afrique, l&apos;Asie,
            l&apos;Amérique du Nord,
            l&apos;Amérique du Sud et
            l&apos;Océanie. Chaque continent
            possède sa propre carte, son
            chronomètre et une liste de pays à
            retrouver.
          </p>

          <ul className="seoList">
            {availableChallenges.map(
              (challenge) => (
                <li
                  key={
                    challenge.slug
                  }
                >
                  <Link
                    href={`/jeux/defi-carte/${challenge.slug}`}
                  >
                    {getChallengeSeoLabel(
                      challenge.slug,
                      challenge.title
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* ================================================
              SEO - NOMBRE DE PAYS
          ================================================ */}

          <h2 className="sectionTitle">
            Combien de pays faut-il retrouver
            dans chaque Défi Carte ?
          </h2>

          <p className="seoP">
            Chaque Défi Carte propose une
            difficulté différente. Le défi
            consacré à l&apos;Afrique demande
            de retrouver 54 pays, celui sur
            l&apos;Asie en propose 48 et le
            Défi Carte Europe compte 46 pays.
            Ces grandes cartes mettent autant
            ta mémoire que ta rapidité à
            l&apos;épreuve.
          </p>

          <p className="seoP">
            Le Défi Carte Amérique du Nord
            réunit 23 pays d&apos;Amérique du
            Nord, d&apos;Amérique centrale et
            des Caraïbes. Le Défi Carte
            Amérique du Sud comporte 12 pays à
            retrouver, tandis que celui consacré
            à l&apos;Océanie en compte 14.
          </p>

          <p className="seoP">
            Les grands pays comme la France,
            le Brésil, la Chine, les États-Unis
            ou l&apos;Australie viennent souvent
            rapidement à l&apos;esprit. Pour
            compléter entièrement une carte, il
            faut cependant aussi penser aux
            petits États, aux îles et aux pays
            que l&apos;on oublie plus facilement.
          </p>

          {/* ================================================
              SEO - APPRENTISSAGE
          ================================================ */}

          <h2 className="sectionTitle">
            Apprendre les pays et les continents
            avec les Défis Carte
          </h2>

          <p className="seoP">
            Les Défis Carte peuvent aussi servir
            à apprendre ou à réviser la
            géographie en jouant. Comme aucune
            liste de réponses ne vient
            t&apos;aider, tu dois faire appel à
            ta mémoire pour retrouver les pays
            et progresser à chaque nouvelle
            partie.
          </p>

          <p className="seoP">
            À la fin du chrono, les pays que tu
            n&apos;as pas trouvés sont révélés
            directement sur la carte. Tu peux
            ainsi identifier les réponses
            oubliées, mémoriser leur emplacement
            et relancer le même Défi Carte pour
            essayer d&apos;améliorer ton score.
          </p>

          <p className="seoP">
            Tous les Défis Carte sont gratuits
            et jouables directement en ligne sur
            QuizUp, sans téléchargement. Choisis
            un continent, lance le chronomètre
            et découvre combien de pays du monde
            tu es réellement capable de
            retrouver.
          </p>
        </section>
      </div>
    </main>
  );
}