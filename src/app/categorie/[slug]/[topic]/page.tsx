import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getAllCategories,
  getAllQuizzes,
} from "@/lib/quizzes";

import {
  categoryTopics,
  getCategoryTopic,
} from "@/lib/category-topics";

const SITE_URL = "https://www.quizup.fr";
const PAGE_SIZE = 10;

function url(path: string) {
  return `${SITE_URL}${path}`;
}

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildTopicUrl(
  categorySlug: string,
  topicSlug: string,
  p?: number,
) {
  const base =
    `/categorie/${categorySlug}/${topicSlug}`;

  if (!p || p <= 1) {
    return base;
  }

  return `${base}?p=${p}`;
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
    const page = sorted[i];
    const previousPage = sorted[i - 1];

    if (
      i > 0 &&
      page - previousPage > 1
    ) {
      result.push("…");
    }

    result.push(page);
  }

  return result;
}

/* -------------------------------------------------------
   STATIC PARAMS
------------------------------------------------------- */

export function generateStaticParams() {
  return Object.entries(categoryTopics)
    .flatMap(
      ([categorySlug, topics]) =>
        topics.map((topic) => ({
          slug: categorySlug,
          topic: topic.slug,
        })),
    );
}

/* -------------------------------------------------------
   METADATA
------------------------------------------------------- */

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string;
    topic: string;
  }>;
  searchParams: Promise<{
    p?: string;
  }>;
}): Promise<Metadata> {
  const {
    slug: categorySlug,
    topic: topicSlug,
  } = await params;

  const sp = await searchParams;

  const category =
    getAllCategories().find(
      (c) => c.slug === categorySlug,
    );

  const topic = getCategoryTopic(
    categorySlug,
    topicSlug,
  );

  if (!category || !topic) {
    return {
      title: "Sous-catégorie introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const allQuizzes =
    getAllQuizzes().filter(
      (quiz) =>
        quiz.category.slug ===
          categorySlug &&
        quiz.topics?.includes(
          topic.slug,
        ),
    );

  if (allQuizzes.length === 0) {
    return {
      title: "Sous-catégorie introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const totalPages = Math.max(
    1,
    Math.ceil(
      allQuizzes.length / PAGE_SIZE,
    ),
  );

  const p = toInt(sp.p, 1);

  const pageTooHigh =
    p > totalPages;

  const safePage =
    pageTooHigh
      ? totalPages
      : p;

  const title =
    p > 1
      ? `${topic.seoTitle} – Page ${p}`
      : topic.seoTitle;

  const canonicalPath =
    buildTopicUrl(
      categorySlug,
      topic.slug,
      safePage,
    );

  const canonical =
    url(canonicalPath);

  const heroImage =
    `/images/category-hero/${categorySlug}.jpg`;

  return {
    title,

    description:
      topic.seoDescription,

    alternates: {
      canonical,
    },

    robots: pageTooHigh
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
      description:
        topic.seoDescription,
      url: canonical,
      type: "website",
      images: [
        {
          url: url(heroImage),
        },
      ],
    },
  };
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default async function CategoryTopicPage({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string;
    topic: string;
  }>;

  searchParams: Promise<{
    p?: string;
  }>;
}) {
  const {
    slug: categorySlug,
    topic: topicSlug,
  } = await params;

  const sp =
    await searchParams;

  const category =
    getAllCategories().find(
      (c) => c.slug === categorySlug,
    );

  const topic =
    getCategoryTopic(
      categorySlug,
      topicSlug,
    );

  if (!category || !topic) {
    return notFound();
  }

  const allQuizzes =
    getAllQuizzes().filter(
      (quiz) =>
        quiz.category.slug ===
          categorySlug &&
        quiz.topics?.includes(
          topic.slug,
        ),
    );

  if (
    allQuizzes.length === 0
  ) {
    return notFound();
  }

  const total =
    allQuizzes.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / PAGE_SIZE,
      ),
    );

  let currentPage =
    toInt(sp.p, 1);

  if (currentPage < 1) {
    currentPage = 1;
  }

  if (
    currentPage > totalPages
  ) {
    currentPage = totalPages;
  }

  const start =
    (currentPage - 1) *
    PAGE_SIZE;

  const end =
    start + PAGE_SIZE;

  const quizzes =
    allQuizzes.slice(
      start,
      end,
    );

  const heroImage =
    `/images/category-hero/${categorySlug}.jpg`;

  /* -----------------------------------------------------
     BREADCRUMB JSON-LD
  ----------------------------------------------------- */

  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Accueil",

        item:
          url("/"),
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Quiz",

        item:
          url("/quiz"),
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          category.name,

        item:
          url(
            `/categorie/${category.slug}`,
          ),
      },

      {
        "@type":
          "ListItem",

        position: 4,

        name:
          topic.name,

        item:
          url(
            `/categorie/${category.slug}/${topic.slug}`,
          ),
      },
    ],
  };

  /* -----------------------------------------------------
     ITEMLIST JSON-LD
  ----------------------------------------------------- */

  const itemListJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      `Quiz ${topic.name} – Page ${currentPage}`,

    itemListElement:
      quizzes.map(
        (quiz, index) => ({
          "@type":
            "ListItem",

          position:
            start +
            index +
            1,

          url:
            url(
              `/quiz/${quiz.slug}`,
            ),

          name:
            quiz.title,
        }),
      ),
  };

  return (
    <main className="page">

      {/* JSON-LD */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd,
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              itemListJsonLd,
            ),
        }}
      />

      {/* HERO */}

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
            Quiz {topic.name}
          </h1>

          <p className="heroLandingSub">
            {topic.intro}
          </p>

          <p className="pageSubtitle">
            {total}{" "}
            {total > 1
              ? "quiz disponibles"
              : "quiz disponible"}
          </p>

        </div>

      </section>

      {/* CONTENT */}

      <div className="categoryPageLayout">

        {/* BREADCRUMB */}

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

          <Link
            href={`/categorie/${category.slug}`}
          >
            {category.name}
          </Link>

          {" › "}

          <span>
            {topic.name}
          </span>

        </nav>

        {/* LISTE */}

        <section
          className="quizList"
          aria-label={`Quiz ${topic.name}`}
        >

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
                      {category.name}
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

        {/* PAGINATION */}

        {totalPages > 1 ? (

          <nav
            className="pager"
            aria-label={`Pagination ${topic.name}`}
          >

            <Link
              className={`pagerBtn ${
                currentPage === 1
                  ? "isDisabled"
                  : ""
              }`}
              href={buildTopicUrl(
                category.slug,
                topic.slug,
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

            <div
              className="pagerNums"
              aria-label="Pages"
            >

              {getPageItems(
                currentPage,
                totalPages,
              ).map(
                (item, index) => {

                  if (
                    item === "…"
                  ) {
                    return (

                      <span
                        key={`dots-${index}`}
                        className="pagerDots"
                        aria-hidden="true"
                      >
                        …
                      </span>

                    );
                  }

                  const page =
                    item;

                  return (

                    <Link
                      key={page}
                      href={buildTopicUrl(
                        category.slug,
                        topic.slug,
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

            <Link
              className={`pagerBtn ${
                currentPage ===
                totalPages
                  ? "isDisabled"
                  : ""
              }`}
              href={buildTopicUrl(
                category.slug,
                topic.slug,
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

        {/* RETOUR CATÉGORIE */}

        <div
          style={{
            marginTop: "32px",
            marginBottom: "32px",
          }}
        >

          <Link
            href={`/categorie/${category.slug}`}
            style={{
              fontWeight: 600,
            }}
          >
            ← Voir tous les quiz{" "}
            {category.name}
          </Link>

        </div>

      </div>

    </main>
  );
}