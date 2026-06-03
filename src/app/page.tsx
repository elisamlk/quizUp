import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getAllQuizzes } from "@/lib/quizzes";
import { getAllPersonalityTests } from "@/lib/personalite";
import { getGameTypes } from "@/lib/games";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "QuizUp | Quiz gratuits en ligne pour tester tes connaissances",
  description:
    "Joue à des quiz gratuits en ligne sur QuizUp : culture générale, histoire, géographie, sciences, sport, cinéma, musique, séries TV, nature et mini-jeux ludiques.",
  keywords: [
    "quiz gratuit",
    "quiz en ligne",
    "culture générale",
    "jeux de quiz",
    "QuizUp",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QuizUp | Quiz gratuits en ligne",
    description:
      "Teste tes connaissances avec des quiz gratuits en culture générale, histoire, géographie, sciences, sport, cinéma, musique et plus encore.",
    url: "https://quizup.fr",
    siteName: "QuizUp",
    type: "website",
    locale: "fr_FR",
  },
};

export const dynamic = "force-dynamic";

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

function getComputedIsNew(item: { isNew?: boolean; createdAt?: string }) {
  if (!item.isNew) return false;
  if (!item.createdAt) return false;

  const createdAtTime = new Date(item.createdAt).getTime();

  if (Number.isNaN(createdAtTime)) return false;

  return Date.now() - createdAtTime < ONE_MONTH_MS;
}

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickBalancedByCategory<T extends { category: { slug: string } }>(
  items: T[],
  limit = 16,
): T[] {
  const byCategory = new Map<string, T[]>();

  for (const item of shuffleArray(items)) {
    const slug = item.category.slug;

    if (!byCategory.has(slug)) {
      byCategory.set(slug, []);
    }

    byCategory.get(slug)!.push(item);
  }

  const categorySlugs = shuffleArray(Array.from(byCategory.keys()));

  const result: T[] = [];

  let index = 0;

  while (result.length < limit) {
    let added = false;

    for (const slug of categorySlugs) {
      const item = byCategory.get(slug)?.[index];

      if (item) {
        result.push(item);
        added = true;

        if (result.length >= limit) break;
      }
    }

    if (!added) break;

    index++;
  }

  return result;
}

export default function HomePage() {
  const quizzes = getAllQuizzes();
  const categories = getAllCategories();
  const personalityTests = getAllPersonalityTests();
  const gameTypes = getGameTypes();

  const homeCategories = shuffleArray(categories);

  // NOUVEAUX QUIZ
  const newQuizzesRaw = quizzes.filter((q) => getComputedIsNew(q));

  const newQuizzes = pickBalancedByCategory(
    newQuizzesRaw.length ? newQuizzesRaw : quizzes,
    16,
  );

  // QUIZ POPULAIRES
  const popularQuizzesRaw = quizzes.filter((q) => q.isPopular);

  const popularQuizzes = pickBalancedByCategory(
    popularQuizzesRaw.length ? popularQuizzesRaw : quizzes,
    16,
  );

  // À LA UNE = CULTURE GÉNÉRALE
  const featuredCategory =
    categories.find((c) => c.slug === "culture-generale") ?? categories[0];

  const featuredQuizzes = featuredCategory
    ? shuffleArray(
        quizzes.filter((q) => q.category.slug === featuredCategory.slug),
      ).slice(0, 16)
    : [];

  // TESTS DE PERSONNALITÉ
  const personalityTestsHome = pickBalancedByCategory(personalityTests, 16);

  return (
    <main className="home">
      {/* HERO SEO */}
      <section className="heroLandingSection">
        <div className="heroLandingContent">
          <h1 className="heroLandingTitle">
            Quiz gratuits :
            <br />
            teste tes connaissances
          </h1>

          <p className="heroLandingSub">
            Des centaines de quiz gratuits en culture générale, histoire,
            géographie, sciences, sport, cinéma, musique et bien plus encore.
          </p>

          <div className="heroCtas">
            <Link className="homeBtnPrimary" href="/quiz">
              Voir tous les quiz
            </Link>

            {homeCategories[0] ? (
              <Link
                className="homeBtnSecondary"
                href={`/categorie/${homeCategories[0].slug}`}
              >
                Explorer une catégorie
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* NOUVEAUX QUIZ */}
      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">Nouveaux quiz</h2>

          <Link className="sectionLink" href="/quiz">
            Voir la liste
          </Link>
        </div>

        {newQuizzes.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {newQuizzes.map((q) => (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${q.images?.cover ?? ""}")`,
                  }}
                  aria-label={`Lancer le quiz ${q.title}`}
                >
                  {getComputedIsNew(q) && (
                    <span className="quizBadge">Nouveau</span>
                  )}

                  <span className="quizCategory">{q.category.name}</span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">{q.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">Pas de nouveaux quiz pour le moment.</p>
        )}
      </section>

      {/* QUIZ POPULAIRES */}
      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">Quiz populaires</h2>

          <Link className="sectionLink" href="/quiz?sort=popular">
            Top
          </Link>
        </div>

        {popularQuizzes.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {popularQuizzes.map((q) => (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${q.images?.cover ?? ""}")`,
                  }}
                  aria-label={`Lancer le quiz ${q.title}`}
                >
                  <span className="quizCategory">{q.category.name}</span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">{q.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">
            Ajoute <code>isPopular: true</code> à quelques quiz pour les
            afficher ici.
          </p>
        )}
      </section>

      {/* CATÉGORIES */}
      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">Catégories</h2>

          <Link className="sectionLink" href="/quiz">
            Voir tous les quiz
          </Link>
        </div>

        <div className="row">
          <div className="rowTrack rowTrack--categories">
            {homeCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className="catCard"
                style={{
                  backgroundImage: `url("${cat.image ?? ""}")`,
                }}
                aria-label={`Voir la catégorie ${cat.name}`}
              >
                <span className="catCardOverlay" />

                <span className="catCardName">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* À LA UNE */}
      {featuredCategory && featuredQuizzes.length > 0 ? (
        <section className="homeSection homePart">
          <div className="sectionHead">
            <h2 className="sectionTitle">À la une : {featuredCategory.name}</h2>

            <Link
              className="sectionLink"
              href={`/categorie/${featuredCategory.slug}`}
            >
              Voir la catégorie
            </Link>
          </div>

          <div className="row">
            <div className="rowTrack">
              {featuredQuizzes.map((q) => (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${q.images?.cover ?? ""}")`,
                  }}
                  aria-label={`Lancer le quiz ${q.title}`}
                >
                  <span className="quizCategory">{q.category.name}</span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">{q.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* TEXTE SEO */}
      <section className="homeSection homePart homeSeo">
        <h2 className="homeSeoTitle">Des quiz rapides, fun et éducatifs</h2>

        <p className="homeSeoText">
          QuizUp est un site de quiz gratuits conçu pour apprendre, s'amuser et
          tester ses connaissances sur des centaines de sujets passionnants.
          Culture générale, géographie, histoire, sciences, cinéma, musique,
          sport, nature ou séries TV : découvrez des quiz de 20 questions
          accessibles à tous les niveaux. Relevez de nouveaux défis, comparez
          vos scores et enrichissez vos connaissances tout en vous divertissant.
        </p>
      </section>

      {/* TESTS DE PERSONNALITÉ */}
      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">Tests de personnalité</h2>

          <Link className="sectionLink" href="/personalite">
            Voir tous les tests
          </Link>
        </div>

        {personalityTestsHome.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {personalityTestsHome.map((test) => (
                <Link
                  key={test.slug}
                  href={`/personalite/${test.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${
                      test.images?.cover ?? test.images?.thumbnail ?? ""
                    }")`,
                  }}
                  aria-label={`Faire le test ${test.title}`}
                >
                  {getComputedIsNew(test) && (
                    <span className="quizBadge">Nouveau</span>
                  )}

                  <span className="quizCategory">{test.category.name}</span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">{test.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">
            Pas de tests de personnalité pour le moment.
          </p>
        )}
      </section>

      {/* PUB HOME */}
      <section className="homeSection homePart" aria-label="Publicité">
        {/* <AdSlot slot="4444444444" /> */}
      </section>

      {/* TOUS NOS JEUX */}
      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">Tous nos jeux</h2>

          <Link className="sectionLink" href="/jeux">
            Voir tous les jeux
          </Link>
        </div>

        {gameTypes.length > 0 ? (
          <div className="row">
            <div className="rowTrack rowTrack--categories">
              {gameTypes.map((game) => (
                <Link
                  key={game.slug}
                  href={game.href}
                  className="catCard"
                  style={{
                    backgroundImage: `url("${game.image ?? ""}")`,
                  }}
                  aria-label={`Voir le jeu ${game.title}`}
                >
                  <span className="catCardOverlay" />

                  <span className="catCardName">{game.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">Aucun jeu disponible pour le moment.</p>
        )}
      </section>
    </main>
  );
}
