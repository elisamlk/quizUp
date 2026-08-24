import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getAllPersonalityCategories,
  getPersonalityTestsByCategory,
} from "@/lib/personalite";

/* -------------------------------------------------------
   CONFIG
------------------------------------------------------- */

const SITE_URL = "https://www.quizup.fr";
const PAGE_SIZE = 10;

function url(path: string) {
  return `${SITE_URL}${path}`;
}

function toInt(
  v: string | undefined,
  fallback = 1,
) {
  const n = Number.parseInt(v ?? "", 10);

  return Number.isFinite(n) && n > 0
    ? n
    : fallback;
}

function buildCategoryUrl(
  slug: string,
  p?: number,
) {
  if (!p || p <= 1) {
    return `/personalite/categorie/${slug}`;
  }

  return `/personalite/categorie/${slug}?p=${p}`;
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
  return getAllPersonalityCategories().map(
    (category) => ({
      slug: category.slug,
    }),
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
  }>;

  searchParams: Promise<{
    p?: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;

  const category =
    getAllPersonalityCategories().find(
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

  const tests =
    getPersonalityTestsByCategory(
      category.slug,
    );

  const totalPages = Math.max(
    1,
    Math.ceil(
      tests.length / PAGE_SIZE,
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
      ? `${category.seoTitle} – Page ${p}`
      : category.seoTitle;

  const canonicalPath =
    buildCategoryUrl(
      category.slug,
      safePage,
    );

  const canonical =
    url(canonicalPath);

  return {
    title,

    description:
      category.seoDescription,

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

      description:
        category.seoDescription,

      url: canonical,

      siteName: "QuizUp",
      locale: "fr_FR",
      type: "website",

      images: [
        {
          url: url(category.image),
        },
      ],
    },
  };
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default async function PersonalityCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    p?: string;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category =
    getAllPersonalityCategories().find(
      (c) => c.slug === slug,
    );

  if (!category) {
    return notFound();
  }

  /* -----------------------------------------------------
     TESTS DE LA CATÉGORIE
  ----------------------------------------------------- */

  const allTests =
    getPersonalityTestsByCategory(
      category.slug,
    );

  const total =
    allTests.length;

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

  const tests =
    allTests.slice(
      start,
      end,
    );

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
          "Tests de personnalité",

        item:
          url("/personalite"),
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          category.name,

        item:
          url(
            `/personalite/categorie/${category.slug}`,
          ),
      },
    ],
  };

  /* -----------------------------------------------------
     ITEM LIST JSON-LD
  ----------------------------------------------------- */

  const itemListJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      `Tests de personnalité ${category.name} – Page ${currentPage}`,

    itemListElement:
      tests.map(
        (test, index) => ({
          "@type":
            "ListItem",

          position:
            start +
            index +
            1,

          url:
            url(
              `/personalite/${test.slug}`,
            ),

          name:
            test.title,
        }),
      ),
  };

  return (
    <main className="page">

      {/* -----------------------------------------------
          JSON-LD : BREADCRUMB
      ------------------------------------------------ */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
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
          __html:
            JSON.stringify(
              itemListJsonLd,
            ),
        }}
      />

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
            url("${category.image}")
          `,
        }}
      >

        <div className="heroLandingContent">

          <h1 className="heroLandingTitle">
            Tests de personnalité {category.name}
          </h1>

          <p className="heroLandingSub">
            {category.intro}
          </p>

          <p className="pageSubtitle">
            {total}{" "}
            {total > 1
              ? "tests disponibles"
              : "test disponible"}
          </p>

        </div>

      </section>

      {/* -----------------------------------------------
          CONTENU
      ------------------------------------------------ */}

      <div className="categoryPageLayout">

        {/* ---------------------------------------------
            BREADCRUMB
        ---------------------------------------------- */}

        <nav
          className="breadcrumbs"
          aria-label="Fil d'Ariane"
        >

          <Link href="/">
            Accueil
          </Link>

          {" › "}

          <Link href="/personalite">
            Tests de personnalité
          </Link>

          {" › "}

          <span>
            {category.name}
          </span>

        </nav>

        {/* ---------------------------------------------
            LISTE DES TESTS
        ---------------------------------------------- */}

        <section className="quizList">

          <div className="sectionHead">

            <h2 className="sectionTitle">
              Tous les tests {category.name}
            </h2>

          </div>

          {tests.map(
            (test) => {

              const img =
                test.images?.thumbnail ||
                test.images?.cover ||
                "/images/placeholder-thumb.jpg";

              return (

                <Link
                  key={
                    test.slug
                  }
                  href={
                    `/personalite/${test.slug}`
                  }
                  className="quizRow"
                  aria-label={
                    `Ouvrir le test ${test.title}`
                  }
                >

                  <div
                    className="quizRowImg"
                    style={{
                      backgroundImage:
                        `url("${img}")`,
                    }}
                    aria-hidden="true"
                  />

                  <div
                    className="quizRowContent"
                  >

                    <div
                      className="quizRowTop"
                    >

                      <span
                        className="quizRowCategory"
                      >
                        {category.name}
                      </span>

                      <span
                        className="quizRowMeta"
                      >
                        {test.questions.length} questions
                      </span>

                    </div>

                    <h2
                      className="quizRowTitle"
                    >
                      {test.title}
                    </h2>

                    {test.description ? (

                      <p
                        className="quizRowDesc"
                      >
                        {test.description}
                      </p>

                    ) : null}

                  </div>

                </Link>

              );
            },
          )}

        </section>

        {/* ---------------------------------------------
            PAGINATION
        ---------------------------------------------- */}

        {totalPages > 1 ? (

          <nav
            className="pager"
            aria-label={`Pagination ${category.name}`}
          >

            {/* PRÉCÉDENT */}

            <Link
              className={`pagerBtn ${
                currentPage === 1
                  ? "isDisabled"
                  : ""
              }`}
              href={
                buildCategoryUrl(
                  category.slug,
                  Math.max(
                    1,
                    currentPage - 1,
                  ),
                )
              }
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
                      href={
                        buildCategoryUrl(
                          category.slug,
                          page,
                        )
                      }
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
              href={
                buildCategoryUrl(
                  category.slug,
                  Math.min(
                    totalPages,
                    currentPage + 1,
                  ),
                )
              }
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
            RETOUR
        ---------------------------------------------- */}

        <div
          style={{
            marginTop: "32px",
            marginBottom: "32px",
          }}
        >

          <Link
            href="/personalite"
            style={{
              fontWeight: 600,
            }}
          >
            ← Voir tous les tests de personnalité
          </Link>

        </div>

      </div>

    </main>
  );
}