import Link from "next/link";
import type { Metadata } from "next";

import { CountryMapGame } from "@/components/games/defi-carte/CountryMapGame";

import {
  getRelatedMapChallenges,
  formatChallengeDuration,
} from "@/lib/defi-carte/challenges";

const SITE_URL = "https://www.quizup.fr";

const PAGE_URL = `${SITE_URL}/jeux/defi-carte/europe`;

const TITLE = "Défi Carte Europe - Retrouve les 46 pays d'Europe";

const DESCRIPTION =
  "Peux-tu retrouver les 46 pays d'Europe en seulement 5 minutes ? Écris le nom des pays, complète la carte à chaque bonne réponse et tente le sans-faute avec ce jeu de géographie gratuit sur QuizUp.";

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442380/europe_qbcupt.jpg";

/* ==========================================================
   METADATA
========================================================== */

export const metadata: Metadata = {
  title: `${TITLE}`,

  description: DESCRIPTION,

  alternates: {
    canonical: "/jeux/defi-carte/europe",
  },

  openGraph: {
    title: `${TITLE}`,

    description: DESCRIPTION,

    url: PAGE_URL,

    type: "website",

    images: [
      {
        url: COVER_IMAGE,

        alt: "Défi Carte Europe - Retrouve les 46 pays d'Europe",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: `${TITLE}`,

    description: DESCRIPTION,

    images: [COVER_IMAGE],
  },
};

/* ==========================================================
   PAGE
========================================================== */

export default function DefiCarteEuropePage() {
  const relatedChallenges = getRelatedMapChallenges("europe");

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

        item: `${SITE_URL}/jeux/defi-carte`,
      },

      {
        "@type": "ListItem",

        position: 4,

        name: "Europe",

        item: PAGE_URL,
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
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ====================================================
          HERO
      ==================================================== */}

      <header className="quizHero">
        <div
          className="quizHeroImg"
          style={{
            backgroundImage: `url("${COVER_IMAGE}")`,
          }}
          aria-hidden="true"
        />

        <div className="quizHeroOverlay" aria-hidden="true" />

        <div className="quizHeroContent">
          <h1 className="quizTitle">
            Défi Carte Europe - Retrouve les 46 pays d&apos;Europe
          </h1>

          <div className="quizMetaRow">
            <Link className="quizMetaChip" href="/jeux">
              Jeux
            </Link>

            <span className="quizMetaChip">Géographie</span>

            <span className="quizMetaChip">46 pays</span>

            <span className="quizMetaChip">5 minutes</span>
          </div>

          <p className="quizIntro">
            Peux-tu retrouver les 46 pays d&apos;Europe en seulement 5 minutes ?
            Écris leurs noms et regarde la carte se compléter à chaque bonne
            réponse.
          </p>

          <div className="quizCtas">
            <a className="quizStartBtn" href="#jouer">
              Commencer le défi
            </a>

            <Link className="quizAltBtn" href="/jeux/defi-carte">
              Tous les Défis Carte
            </Link>
          </div>
        </div>
      </header>

      <div className="quizPageLayout">
        {/* ====================================================
            BREADCRUMBS
        ==================================================== */}

        <nav className="breadcrumbs" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>

          <span aria-hidden="true">›</span>

          <Link href="/jeux">Jeux</Link>

          <span aria-hidden="true">›</span>

          <Link href="/jeux/defi-carte">Défi Carte</Link>

          <span aria-hidden="true">›</span>

          <span className="crumbCurrent">Europe</span>
        </nav>

        {/* ====================================================
            JEU
        ==================================================== */}

        <section id="jouer" className="quizPlay">
          <CountryMapGame />
        </section>

        {/* ====================================================
            TEXTE SEO - INTRO
        ==================================================== */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Connais-tu les 46 pays d&apos;Europe ?
          </h2>

          <p className="seoP">
            Le Défi Carte Europe est un jeu de géographie dans lequel tu dois
            retrouver les 46 pays proposés sur la carte avant la fin du
            chronomètre. Aucun choix de réponse ne vient t&apos;aider : tu dois
            écrire toi-même le nom des pays européens auxquels tu penses.
          </p>

          <p className="seoP">
            Chaque bonne réponse complète immédiatement la carte. Les grands
            pays d&apos;Europe viennent souvent rapidement à l&apos;esprit, mais
            les petits États et certains pays d&apos;Europe centrale, orientale
            ou balkanique peuvent facilement être oubliés lorsque les secondes
            s&apos;écoulent.
          </p>

          <ul className="seoList">
            <li>46 pays d&apos;Europe à retrouver</li>

            <li>5 minutes pour compléter la carte</li>

            <li>Aucun QCM ni liste de réponses</li>

            <li>Chaque pays trouvé apparaît sur la carte</li>

            <li>Les réponses manquées sont révélées à la fin</li>

            <li>Jeu de géographie gratuit en ligne</li>
          </ul>

          {/* ==================================================
              DIFFICULTÉ
          ================================================== */}
          <h2 className="sectionTitle">
            Réussiras-tu à retrouver les 46 pays d&apos;Europe ?
          </h2>

          <p className="seoP">
            Certains pays viennent immédiatement à l&apos;esprit, mais compléter
            toute la carte est une autre histoire. Au fil du chrono, les
            réponses deviennent plus difficiles à trouver et quelques pays
            peuvent facilement passer sous le radar.
          </p>

          <p className="seoP">
            Pour réussir le sans-faute, il faudra penser à toutes les régions du
            continent et ne pas oublier les plus petits États. Aucun indice ne
            viendra révéler les réponses pendant la partie : à toi de faire
            appel à ta mémoire avant la fin des 5 minutes.
          </p>

          {/* ==================================================
              COMMENT JOUER
          ================================================== */}

          <h2 className="sectionTitle">Comment jouer au Défi Carte Europe ?</h2>

          <p className="seoP">
            Lance la partie puis écris les noms des pays européens que tu
            connais. Lorsqu&apos;une réponse est reconnue, le pays correspondant
            est validé et apparaît directement sur la carte. Continue
            jusqu&apos;à avoir retrouvé les 46 pays ou jusqu&apos;à la fin des 5
            minutes.
          </p>

          <p className="seoP">
            Si tu ne réussis pas à compléter la carte, les pays manqués sont
            affichés à la fin de la partie. Tu peux alors mémoriser les réponses
            oubliées, relancer immédiatement le défi et essayer d&apos;améliorer
            ton score.
          </p>

          {/* ==================================================
              APPRENTISSAGE
          ================================================== */}

          <h2 className="sectionTitle">
            Apprendre les pays d&apos;Europe avec une carte interactive
          </h2>

          <p className="seoP">
            Le Défi Carte Europe permet aussi de réviser la géographie
            européenne de manière plus active qu&apos;un simple quiz à choix
            multiples. Comme aucun indice ne te donne la réponse, tu dois
            réellement faire appel à ta mémoire pour retrouver les noms des
            pays.
          </p>

          <p className="seoP">
            En rejouant plusieurs fois, les pays oubliés deviennent
            progressivement plus faciles à retenir. La carte aide également à
            mieux visualiser leur position et à renforcer tes repères sur le
            continent européen.
          </p>

          <p className="seoP">
            Lorsque tu maîtrises l&apos;Europe, poursuis avec les autres{" "}
            <Link href="/jeux/defi-carte">Défis Carte</Link> pour tester tes
            connaissances sur les pays d&apos;Afrique, d&apos;Asie, des
            Amériques et d&apos;Océanie.
          </p>
        </section>

        {/* ====================================================
            AUTRES DÉFIS CARTE
        ==================================================== */}

        {relatedChallenges.length > 0 ? (
          <section className="relatedPopular">
            <h2 className="sectionTitle">Continue avec un autre Défi Carte</h2>

            <div className="quizList">
              {relatedChallenges.map((challenge) => (
                <Link
                  key={challenge.slug}
                  href={`/jeux/defi-carte/${challenge.slug}`}
                  className="quizRow"
                >
                  <div
                    className="quizRowImg"
                    style={{
                      backgroundImage: `url("${challenge.image}")`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="quizRowContent">
                    <div className="quizRowTop">
                      <span className="quizRowCategory">Défi Carte</span>

                      <span className="quizRowMeta">
                        {challenge.totalCountries > 0
                          ? `${challenge.totalCountries} pays`
                          : challenge.name}
                        {" · "}
                        {formatChallengeDuration(challenge.duration)}
                      </span>
                    </div>

                    <h3 className="quizRowTitle">{challenge.title}</h3>

                    <p className="quizRowDesc">{challenge.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <p className="relatedMore">
              <Link href="/jeux/defi-carte">Voir tous les Défis Carte →</Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
