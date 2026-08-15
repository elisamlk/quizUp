import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllQuizzes, getQuizBySlug } from "@/lib/quizzes";
import { geographyTopics } from "@/lib/geography-topics";

import { QuizDisplay } from "@/components/QuizDisplay";
import { QuizPlayer } from "@/components/QuizPlayer";
// import { AdSlot } from "@/components/AdSlot";

const SITE_URL = "https://www.quizup.fr";

const siteUrl = (path: string) => `${SITE_URL}${path}`;

function absoluteUrl(url: string) {
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${SITE_URL}${url}`;
}

/* -------------------------------------------------------
   STATIC PARAMS
------------------------------------------------------- */

export function generateStaticParams() {
  return getAllQuizzes().map((q) => ({
    slug: q.slug,
  }));
}

/* -------------------------------------------------------
   METADATA
------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    return {
      title: "Quiz introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${quiz.title} | Quiz gratuit en ligne`;

  const description =
    quiz.description ??
    `Fais ce quiz ${quiz.category.name} gratuit en ligne en ${quiz.questions.length} questions. Découvre ton score immédiatement et progresse grâce aux explications.`;

  return {
    title,
    description,

    alternates: {
      canonical: `/quiz/${quiz.slug}`,
    },

    openGraph: {
      title,
      description,
      url: siteUrl(`/quiz/${quiz.slug}`),
      type: "website",

      images: quiz.images?.cover
        ? [
            {
              url: absoluteUrl(quiz.images.cover),
              alt: quiz.images.alt ?? quiz.title,
            },
          ]
        : undefined,
    },
  };
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    return notFound();
  }

  const all = getAllQuizzes();

  /* -----------------------------------------------------
     QUIZ DE LA MÊME CATÉGORIE

     Base commune pour toutes les catégories.
  ----------------------------------------------------- */

  const sameCategory = all.filter(
    (q) =>
      q.slug !== quiz.slug &&
      q.category.slug === quiz.category.slug,
  );

  /* -----------------------------------------------------
     TOPICS PRINCIPAUX GÉOGRAPHIE

     geographyTopics contient uniquement les
     7 vrais sous-thèmes :

     - pays-capitales
     - drapeaux-symboles
     - villes-monuments
     - fleuves-lacs-oceans
     - reliefs-climats-nature
     - territoires-frontieres
     - monde-pays

     Les tags comme "afrique", "europe",
     "asie", "monde", etc. ne servent pas
     ici à sélectionner les quiz similaires.
  ----------------------------------------------------- */

  const geographyMainTopicSlugs =
    geographyTopics.map((topic) => topic.slug);

  const quizMainTopics =
    quiz.category.slug === "geographie"
      ? quiz.topics?.filter((topic) =>
          geographyMainTopicSlugs.includes(topic),
        ) ?? []
      : [];

  /* -----------------------------------------------------
     QUIZ GÉOGRAPHIE DU MÊME THÈME

     Cette logique ne s'applique qu'à
     la catégorie Géographie.
  ----------------------------------------------------- */

  const sameTopic =
    quiz.category.slug === "geographie" &&
    quizMainTopics.length > 0
      ? sameCategory.filter((q) =>
          q.topics?.some((topic) =>
            quizMainTopics.includes(topic),
          ),
        )
      : [];

  /* -----------------------------------------------------
     QUIZ SIMILAIRES

     GÉOGRAPHIE :
     on privilégie les quiz partageant
     un même topic principal.

     AUTRES CATÉGORIES :
     comportement historique conservé,
     donc mêmes quiz de catégorie.
  ----------------------------------------------------- */

  const related =
    quiz.category.slug === "geographie" &&
    sameTopic.length > 0
      ? sameTopic.slice(0, 8)
      : sameCategory.slice(0, 8);

  /* -----------------------------------------------------
     NEXT QUIZ
  ----------------------------------------------------- */

  const nextQuiz = related[0]
    ? {
        slug: related[0].slug,
        title: related[0].title,
      }
    : null;

  /* -----------------------------------------------------
     POPULAIRES CROSS-CATEGORY
  ----------------------------------------------------- */

  const popularCross = all
    .filter(
      (q) =>
        q.slug !== quiz.slug &&
        q.isPopular,
    )
    .slice(0, 8);

  /* -----------------------------------------------------
     JSON-LD : BREADCRUMBS
  ----------------------------------------------------- */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: siteUrl("/"),
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "Quiz",
        item: siteUrl("/quiz"),
      },

      {
        "@type": "ListItem",
        position: 3,
        name: quiz.category.name,
        item: siteUrl(
          `/categorie/${quiz.category.slug}`,
        ),
      },

      {
        "@type": "ListItem",
        position: 4,
        name: quiz.title,
        item: siteUrl(`/quiz/${quiz.slug}`),
      },
    ],
  };

  /* -----------------------------------------------------
     JSON-LD : QUIZ
  ----------------------------------------------------- */

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",

    name: quiz.title,

    description: quiz.description,

    url: siteUrl(`/quiz/${quiz.slug}`),

    educationalLevel: "beginner",

    learningResourceType: "quiz",

    about: quiz.category.name,

    image: quiz.images?.cover
      ? [absoluteUrl(quiz.images.cover)]
      : undefined,

    hasPart: quiz.questions.map((qq) => ({
      "@type": "Question",

      name: qq.question,

      text: qq.question,

      eduQuestionType: "Multiple choice",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          qq.answers[qq.correctIndex] ?? "",
      },

      suggestedAnswer: qq.answers.map((a) => ({
        "@type": "Answer",
        text: a,
      })),
    })),
  };

  /* -----------------------------------------------------
     TEXTE SEO
  ----------------------------------------------------- */

  const seoIntro =
    quiz.descriptionSeo ??
    `Quiz ${quiz.category.name} : ${quiz.questions.length} questions pour tester tes connaissances, avec correction et explications.`;

  const estMinutes = Math.max(
    3,
    Math.round(
      quiz.questions.length * 0.35,
    ),
  );

  return (
    <main className="page">

      {/* JSON-LD */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd,
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            quizJsonLd,
          ),
        }}
      />

      {/* HERO */}

      <header className="quizHero">

        {quiz.images?.cover ? (
          <div
            className="quizHeroImg"
            style={{
              backgroundImage:
                `url("${quiz.images.cover}")`,
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
            {quiz.title}
          </h1>

          <div className="quizMetaRow">

            <Link
              className="quizMetaChip"
              href={`/categorie/${quiz.category.slug}`}
            >
              {quiz.category.name}
            </Link>

            <span className="quizMetaChip">
              {quiz.questions.length} questions
            </span>

            <span className="quizMetaChip">
              ~{estMinutes} min
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
              Commencer le quiz
            </a>

            <Link
              className="quizAltBtn"
              href={`/categorie/${quiz.category.slug}`}
            >
              Voir la catégorie
            </Link>

          </div>

        </div>
      </header>

      <div className="quizPageLayout">

        {/* BREADCRUMBS VISIBLES */}

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

          <Link href="/quiz">
            Quiz
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <Link
            href={`/categorie/${quiz.category.slug}`}
          >
            {quiz.category.name}
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <span className="crumbCurrent">
            {quiz.title}
          </span>
        </nav>

        {/* PLAYER */}

        <section
          id="jouer"
          className="quizPlay"
        >
          {/* <AdSlot slot="2222222222" /> */}

          <QuizDisplay
            related={related}
            categorySlug={
              quiz.category.slug
            }
            categoryName={
              quiz.category.name
            }
          >
            <QuizPlayer
              quiz={quiz}
              nextQuiz={nextQuiz}
            />
          </QuizDisplay>

        </section>

        {/* TEXTE SEO SUPPLÉMENTAIRE */}

        <section className="quizSeoText">

          <h2 className="sectionTitle">
            Ce que tu vas trouver dans ce quiz
          </h2>

          <ul className="seoList">

            <li>
              {quiz.questions.length} questions au format QCM
            </li>

            <li>
              Correction immédiate et score final
            </li>

            <li>
              Explications pour progresser
              (quand elles sont disponibles)
            </li>

          </ul>

          <p className="seoP">
            Astuce : refais le quiz pour battre
            ton record et compare ton score avec
            tes amis en partageant ta carte de
            résultat.
          </p>

        </section>

        {/* POPULAIRES CROSS-CATEGORY */}

        {popularCross.length > 0 ? (
          <section className="relatedPopular">

            <h2 className="sectionTitle">
              Les plus populaires
            </h2>

            <div className="quizList">

              {popularCross.map((q) => {

                const img =
                  q.images?.thumbnail ||
                  q.images?.cover ||
                  "/images/placeholder-thumb.jpg";

                return (
                  <Link
                    key={q.slug}
                    href={`/quiz/${q.slug}`}
                    className="quizRow"
                  >

                    <div
                      className="quizRowImg"
                      style={{
                        backgroundImage:
                          `url("${img}")`,
                      }}
                      aria-hidden="true"
                    />

                    <div className="quizRowContent">

                      <div className="quizRowTop">

                        <span className="quizRowCategory">
                          {q.category.name}
                        </span>

                        <span className="quizRowMeta">
                          {q.questions.length} questions
                        </span>

                      </div>

                      <h3 className="quizRowTitle">
                        {q.title}
                      </h3>

                      {q.description ? (
                        <p className="quizRowDesc">
                          {q.description}
                        </p>
                      ) : null}

                    </div>

                  </Link>
                );
              })}

            </div>

            <p className="relatedMore">
              <Link href="/quiz">
                Voir tous les quiz →
              </Link>
            </p>

          </section>
        ) : null}

      </div>

    </main>
  );
}
