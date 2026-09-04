import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllGames, getGameBySlug, getGameTypes } from "@/lib/games";

import { GameDisplay } from "@/components/GameDisplay";

import { EmojiQuizPlayer } from "@/components/EmojiQuizPlayer";
import { MotMysterePlayer } from "@/components/MotMysterePlayer";
import { PenduPlayer } from "@/components/PenduPlayer";
import { AssociationPlayer } from "@/components/AssociationPlayer";
import { ChronoQuizPlayer } from "@/components/ChronoQuizPlayer";
import { MemoryPlayer } from "@/components/MemoryPlayer";
import { QuiSuisJePlayer } from "@/components/QuiSuisJePlayer";
import { PlusOuMoinsPlayer } from "@/components/PlusOuMoinsPlayer";
import { ImageMysterePlayer } from "@/components/ImageMysterePlayer";
import { ClassementPlayer } from "@/components/ClassementPlayer";

const SITE_URL = "https://www.quizup.fr";

export function generateStaticParams() {
  return getAllGames().map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Jeu introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = game.title;

  const description =
    game.descriptionSeo ??
    game.description ??
    "Joue gratuitement à ce mini-jeu en ligne.";

  const cover = game.images?.cover;

  const imageUrl = cover
    ? cover.startsWith("http://") || cover.startsWith("https://")
      ? cover
      : `${SITE_URL}${cover.startsWith("/") ? cover : `/${cover}`}`
    : undefined;

  return {
    title,
    description,

    alternates: {
      canonical: `/jeux/${game.slug}`,
    },

    openGraph: {
      title: `${game.title} | QuizUp`,
      description,
      url: `${SITE_URL}/jeux/${game.slug}`,
      siteName: "QuizUp",
      type: "website",

      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: game.images?.alt ?? game.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${game.title} | QuizUp`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = getGameBySlug(slug);

  if (!game) {
    return notFound();
  }

  const allGames = getAllGames();

  const gameTypes = getGameTypes();

  // Jeux similaires
  const sameTypeGames = allGames
    .filter((g) => g.slug !== game.slug && g.type === game.type)
    .slice(0, 8);

  // Jeux populaires
  const popularGames = allGames
    .filter((g) => g.slug !== game.slug && g.isPopular)
    .slice(0, 8);

  const relatedGames =
    sameTypeGames.length > 0
      ? sameTypeGames
      : popularGames;

  // Jeu suivant
  const nextGame = relatedGames[0]
    ? {
        slug: relatedGames[0].slug,
        title: relatedGames[0].title,
      }
    : null;

  const seoIntro =
    game.descriptionSeo ??
    game.description ??
    "Lance ce mini-jeu gratuit et tente de faire le meilleur score.";

  return (
    <main className="page">
      {/* HERO */}
      <header className="quizHero">
        {game.images?.cover ? (
          <div
            className="quizHeroImg"
            style={{
              backgroundImage: `url("${game.images.cover}")`,
            }}
            aria-hidden="true"
          />
        ) : null}

        <div
          className="quizHeroOverlay"
          aria-hidden="true"
        />

        <div className="quizHeroContent">
          <h1 className="quizTitle">
            {game.title}
          </h1>

          <div className="quizMetaRow">
            <Link
              className="quizMetaChip"
              href="/jeux"
            >
              Jeux
            </Link>

            <span className="quizMetaChip">
              {game.category.name}
            </span>

            <span className="quizMetaChip">
              Jeu gratuit
            </span>
          </div>

          <p className="quizIntro">
            {seoIntro}
          </p>

          <div className="quizCtas">
            <a
              className="quizStartBtn"
              href="#jouer"
            >
              Commencer le jeu
            </a>

            <Link
              className="quizAltBtn"
              href="/jeux"
            >
              Voir tous les jeux
            </Link>
          </div>
        </div>
      </header>

      <div className="quizPageLayout">
        {/* BREADCRUMBS */}
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
            {game.title}
          </span>
        </nav>

        {/* GAME */}
        <section
          id="jouer"
          className="quizPlay"
        >
          <GameDisplay
            gameTypes={gameTypes}
          >
            {game.type ===
            "emoji-quiz" ? (
              <EmojiQuizPlayer
                game={game}
              />
            ) : null}

            {game.type === "pendu" ? (
              <PenduPlayer
                game={game}
              />
            ) : null}

            {game.type === "wordle" ? (
              <MotMysterePlayer
                game={game}
              />
            ) : null}

            {game.type ===
            "association" ? (
              <AssociationPlayer
                game={game}
              />
            ) : null}

            {game.type ===
            "chrono-quiz" ? (
              <ChronoQuizPlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type === "memory" ? (
              <MemoryPlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type ===
            "qui-suis-je" ? (
              <QuiSuisJePlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type ===
            "plus-ou-moins" ? (
              <PlusOuMoinsPlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type ===
            "image-mystere" ? (
              <ImageMysterePlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type ===
            "classement" ? (
              <ClassementPlayer
                game={game}
                nextGame={nextGame}
              />
            ) : null}

            {game.type ===
            "drapeaux" ? (
              <div className="quizPanel">
                <p>
                  Jeu des drapeaux
                  bientôt connecté ici.
                </p>
              </div>
            ) : null}

            {game.type ===
            "mots-croises" ? (
              <div className="quizPanel">
                <p>
                  Mots croisés bientôt
                  connecté ici.
                </p>
              </div>
            ) : null}
          </GameDisplay>
        </section>

        {/* SEO */}
        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Pourquoi jouer à ce
            mini-jeu ?
          </h2>

          <ul className="seoList">
            <li>
              Jeu gratuit et rapide à
              lancer
            </li>

            <li>
              Parfait pour tester tes
              réflexes et tes
              connaissances
            </li>

            <li>
              Format court, idéal sur
              mobile comme sur ordinateur
            </li>
          </ul>

          <p className="seoP">
            Astuce : rejoue plusieurs
            fois pour améliorer ton score
            et découvrir d’autres
            mini-jeux du même style.
          </p>
        </section>

        {/* POPULAIRES */}
        {popularGames.length > 0 ? (
          <section className="relatedPopular">
            <h2 className="sectionTitle">
              Les jeux populaires
            </h2>

            <div className="quizList">
              {popularGames.map(
                (g) => {
                  const img =
                    g.images
                      ?.thumbnail ||
                    g.images?.cover ||
                    "/images/placeholder-thumb.jpg";

                  return (
                    <Link
                      key={g.slug}
                      href={`/jeux/${g.slug}`}
                      className="quizRow"
                    >
                      <div
                        className="quizRowImg"
                        style={{
                          backgroundImage: `url("${img}")`,
                        }}
                        aria-hidden="true"
                      />

                      <div className="quizRowContent">
                        <div className="quizRowTop">
                          <span className="quizRowCategory">
                            {g.type}
                          </span>

                          <span className="quizRowMeta">
                            Jeu gratuit
                          </span>
                        </div>

                        <h3 className="quizRowTitle">
                          {g.title}
                        </h3>

                        {g.description ? (
                          <p className="quizRowDesc">
                            {
                              g.description
                            }
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  );
                },
              )}
            </div>

            <p className="relatedMore">
              <Link href="/jeux">
                Voir tous les jeux →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
