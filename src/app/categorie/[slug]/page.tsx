import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllCategories, getAllQuizzes } from "@/lib/quizzes";
import { geographyTopics } from "@/lib/geography-topics";

const SITE_URL = "https://www.quizup.fr";
const PAGE_SIZE = 10;

function url(path: string) {
  return `${SITE_URL}${path}`;
}

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildCategoryUrl(slug: string, p?: number) {
  if (!p || p <= 1) return `/categorie/${slug}`;

  return `/categorie/${slug}?p=${p}`;
}

function getPageItems(
  current: number,
  total: number,
): Array<number | "…"> {
  const windowSize = 1;
  const pages = new Set<number>();

  pages.add(1);
  pages.add(total);

  for (
    let p = current - windowSize;
    p <= current + windowSize;
    p++
  ) {
    if (p >= 1 && p <= total) {
      pages.add(p);
    }
  }

  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1,
    );
  }

  const sorted = Array.from(pages).sort(
    (a, b) => a - b,
  );

  const result: Array<number | "…"> = [];

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];

    if (i > 0 && p - prev > 1) {
      result.push("…");
    }

    result.push(p);
  }

  return result;
}

/* -------------------------------------------------------
   STATIC PARAMS
------------------------------------------------------- */

export function generateStaticParams() {
  return getAllCategories().map((c) => ({
    slug: c.slug,
  }));
}

/* -------------------------------------------------------
   METADATA
------------------------------------------------------- */

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;

  const category = getAllCategories().find(
    (c) => c.slug === slug,
  );

  if (!category) {
    return {
      title: "Catégorie introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const quizzesCount = getAllQuizzes().filter(
    (q) => q.category.slug === slug,
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(quizzesCount / PAGE_SIZE),
  );

  const p = toInt(sp.p, 1);

  const pageTooHigh = p > totalPages;

  const safePage = pageTooHigh
    ? totalPages
    : p;

  const titleBase =
    category.seoTitle ??
    `Quiz ${category.name} gratuits en ligne | QuizUp`;

  const title =
    p > 1
      ? `${titleBase} – Page ${p}`
      : titleBase;

  const description =
    category.seoDescription ??
    `Découvre tous nos quiz de ${category.name} en 20 questions.`;

  const canonical = buildCategoryUrl(
    slug,
    safePage,
  );

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots:
      pageTooHigh || p > 1
        ? {
            index: false,
            follow: true,
          }
        : {
            index: true,
            follow: true,
          },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",

      images: category.image
        ? [
            {
              url: `${SITE_URL}${category.image}`,
            },
          ]
        : undefined,
    },
  };
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = getAllCategories().find(
    (c) => c.slug === slug,
  );

  if (!category) {
    return notFound();
  }

  const heroImage =
    `/images/category-hero/${category.slug}.jpg`;

  const allQuizzes = getAllQuizzes().filter(
    (q) =>
      q.category.slug === category.slug,
  );

  /* -----------------------------------------------------
     QUIZ POPULAIRES DE LA CATÉGORIE
  ----------------------------------------------------- */

  const popularQuizzes = allQuizzes
    .filter((q) => q.isPopular)
    .slice(0, 8);

  const total = allQuizzes.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  let currentPage = toInt(sp.p, 1);

  if (currentPage < 1) {
    currentPage = 1;
  }

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start =
    (currentPage - 1) * PAGE_SIZE;

  const end =
    start + PAGE_SIZE;

  const quizzes =
    allQuizzes.slice(start, end);

  /* -----------------------------------------------------
     BREADCRUMB JSON-LD
  ----------------------------------------------------- */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: url("/"),
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "Quiz",
        item: url("/quiz"),
      },

      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: url(
          `/categorie/${category.slug}`,
        ),
      },
    ],
  };

  /* -----------------------------------------------------
     ITEM LIST JSON-LD
  ----------------------------------------------------- */

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",

    name:
      `Quiz ${category.name} – Page ${currentPage}`,

    itemListElement: quizzes.map(
      (q, i) => ({
        "@type": "ListItem",

        position:
          start + i + 1,

        url: url(
          `/quiz/${q.slug}`,
        ),

        name: q.title,
      }),
    ),
  };

  /* -----------------------------------------------------
     FAQ JSON-LD
  ----------------------------------------------------- */

  const faqJsonLd =
    category.faqs &&
    category.faqs.length > 0
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "FAQPage",

          mainEntity:
            category.faqs.map((f) => ({
              "@type":
                "Question",

              name:
                f.q,

              acceptedAnswer: {
                "@type":
                  "Answer",

                text:
                  f.a,
              },
            })),
        }
      : null;

  return (
    <main className="page">

      {/* -----------------------------------------------
          JSON-LD : BREADCRUMB
      ------------------------------------------------ */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd,
          ),
        }}
      />

      {/* -----------------------------------------------
          JSON-LD : ITEM LIST
      ------------------------------------------------ */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListJsonLd,
          ),
        }}
      />

      {/* -----------------------------------------------
          JSON-LD : FAQ
      ------------------------------------------------ */}

      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              faqJsonLd,
            ),
          }}
        />
      ) : null}

      {/* -----------------------------------------------
          HERO
      ------------------------------------------------ */}

      <section
        className="heroLandingSection"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,0,0,.45),
              rgba(0,0,0,.55)
            ),
            url("${heroImage}")
          `,
        }}
      >

        <div className="heroLandingContent">

          <h1 className="heroLandingTitle">
            Quiz {category.name}
          </h1>

          <p className="heroLandingSub">
            {category.intro ??
              `Découvre nos quiz de ${category.name} en 20 questions.`}
          </p>

          <p className="pageSubtitle">
            {allQuizzes.length} quiz disponibles
          </p>

        </div>

      </section>

      {/* -----------------------------------------------
          CONTENU
      ------------------------------------------------ */}

      <div className="categoryPageLayout">

        {/* ---------------------------------------------
            BREADCRUMB VISIBLE
        ---------------------------------------------- */}

        <nav
          className="breadcrumbs"
          aria-label="Fil d'Ariane"
        >

          <Link href="/">
            Accueil
          </Link>

          {" › "}

          <Link href="/quiz">
            Quiz
          </Link>

          {" › "}

          <span>
            {category.name}
          </span>

        </nav>

        {/* ---------------------------------------------
            EXPLORER LA GÉOGRAPHIE

            Même structure que les cartes
            "Catégories" de la page d'accueil.

            Scroll horizontal + cartes verticales.
        ---------------------------------------------- */}

        {category.slug === "geographie" ? (

          <section className="homeSection homePart geographyTopicsSection">

            <div className="sectionHead">

              <h2 className="sectionTitle">
                Explorez la Géographie
              </h2>

            </div>

            <div className="row">

              <div className="rowTrack rowTrack--categories">

                {geographyTopics.map(
                  (topic) => (

                    <Link
                      key={topic.slug}
                      href={`/categorie/geographie/${topic.slug}`}
                      className="catCard"
                      style={{
                        backgroundImage:
                          `url("${topic.image ?? ""}")`,
                      }}
                      aria-label={`Explorer ${topic.name}`}
                    >

                      <span
                        className="catCardOverlay"
                      />

                      <span
                        className="catCardName"
                      >
                        {topic.name}
                      </span>

                    </Link>

                  ),
                )}

              </div>

            </div>

          </section>

        ) : null}

        {/* ---------------------------------------------
            QUIZ POPULAIRES

            Pour l'instant uniquement Géographie.
        ---------------------------------------------- */}

        {category.slug === "geographie" &&
        popularQuizzes.length > 0 ? (

          <section className="homeSection homePart geographyTopicsSection">

            <div className="sectionHead">

              <h2 className="sectionTitle">
                Quiz populaires de la catégorie{" "}
                {category.name}
              </h2>

            </div>

            <div className="row">

              <div className="rowTrack">

                {popularQuizzes.map((q) => (

                  <Link
                    key={q.slug}
                    href={`/quiz/${q.slug}`}
                    className="quizCard quizCard--categoryPopular"
                    style={{
                      backgroundImage:
                        `url("${q.images?.cover ?? ""}")`,
                    }}
                    aria-label={`Lancer le quiz ${q.title}`}
                  >

                    <span className="quizCategory">
                      {q.category.name}
                    </span>

                    <span
                      className="quizCardOverlay"
                    />

                    <span
                      className="quizCardTitle"
                    >
                      {q.title}
                    </span>

                  </Link>

                ))}

              </div>

            </div>

          </section>

        ) : null}

        {/* ---------------------------------------------
            TOUS LES QUIZ
        ---------------------------------------------- */}

        <section className="quizList">

          <div className="sectionHead">

            <h2 className="sectionTitle">
              Tous les quiz {category.name}
            </h2>

          </div>

          {quizzes.map((quiz) => {

            const img =
              quiz.images?.thumbnail ||
              quiz.images?.cover ||
              "/images/placeholder-thumb.jpg";

            return (

              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="quizRow"
                aria-label={`Ouvrir le quiz ${quiz.title}`}
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
                      {quiz.category.name}
                    </span>

                    <span className="quizRowMeta">
                      {quiz.questions.length} questions
                    </span>

                  </div>

                  <h2 className="quizRowTitle">
                    {quiz.title}
                  </h2>

                  {quiz.description ? (

                    <p className="quizRowDesc">
                      {quiz.description}
                    </p>

                  ) : null}

                </div>

              </Link>

            );
          })}

        </section>

        {/* ---------------------------------------------
            PAGINATION
        ---------------------------------------------- */}

        {totalPages > 1 ? (

          <nav
            className="pager"
            aria-label="Pagination catégorie"
          >

            {/* PRÉCÉDENT */}

            <Link
              className={`pagerBtn ${
                currentPage === 1
                  ? "isDisabled"
                  : ""
              }`}
              href={buildCategoryUrl(
                category.slug,
                Math.max(
                  1,
                  currentPage - 1,
                ),
              )}
              aria-disabled={
                currentPage === 1
              }
              tabIndex={
                currentPage === 1
                  ? -1
                  : 0
              }
              title="Page précédente"
            >
              ‹
            </Link>

            {/* NUMÉROS */}

            <div
              className="pagerNums"
              aria-label="Pages"
            >

              {getPageItems(
                currentPage,
                totalPages,
              ).map(
                (item, idx) => {

                  if (item === "…") {

                    return (

                      <span
                        key={`dots-${idx}`}
                        className="pagerDots"
                        aria-hidden="true"
                      >
                        …
                      </span>

                    );
                  }

                  const page = item;

                  return (

                    <Link
                      key={page}
                      href={buildCategoryUrl(
                        category.slug,
                        page,
                      )}
                      className={`pagerNum ${
                        page ===
                        currentPage
                          ? "isActive"
                          : ""
                      }`}
                      aria-current={
                        page ===
                        currentPage
                          ? "page"
                          : undefined
                      }
                      title={`Page ${page}`}
                    >
                      {page}
                    </Link>

                  );
                },
              )}

            </div>

            {/* SUIVANT */}

            <Link
              className={`pagerBtn ${
                currentPage ===
                totalPages
                  ? "isDisabled"
                  : ""
              }`}
              href={buildCategoryUrl(
                category.slug,
                Math.min(
                  totalPages,
                  currentPage + 1,
                ),
              )}
              aria-disabled={
                currentPage ===
                totalPages
              }
              tabIndex={
                currentPage ===
                totalPages
                  ? -1
                  : 0
              }
              title="Page suivante"
            >
              ›
            </Link>

          </nav>

        ) : null}

        {/* ---------------------------------------------
            FAQ
        ---------------------------------------------- */}

        {category.faqs &&
        category.faqs.length > 0 ? (

          <section className="faq">

            <h2>
              Questions fréquentes
            </h2>

            {category.faqs.map(
              (f, i) => (

                <details key={i}>

                  <summary>
                    {f.q}
                  </summary>

                  <p>
                    {f.a}
                  </p>

                </details>

              ),
            )}

          </section>

        ) : null}

      </div>

    </main>
  );
}