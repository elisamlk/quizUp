import Link from "next/link";
import type { Metadata } from "next";

import {
  getAllPersonalityCategories,
  getAllPersonalityTests,
} from "@/lib/personalite";

/* =========================
   Helpers
   ========================= */

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);

  return Number.isFinite(n) && n > 0
    ? n
    : fallback;
}

/* =========================
   Metadata SEO
   ========================= */

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    cat?: string;
    q?: string;
    p?: string;
  }>;
}): Promise<Metadata> {
  const sp = await searchParams;

  const selectedCat =
    (sp.cat ?? "").trim();

  const qRaw =
    (sp.q ?? "").trim();

  const q =
    qRaw.toLowerCase();

  const p =
    toInt(sp.p, 1);

  const hasFilters =
    Boolean(selectedCat || qRaw);

  const canonical =
    p > 1
      ? `/personalite?p=${p}`
      : "/personalite";

  let resultsCount: number | null = null;

  if (hasFilters) {
    const tests =
      getAllPersonalityTests();

    resultsCount =
      tests.filter((test) => {
        const okCat =
          !selectedCat ||
          test.category.slug === selectedCat;

        const okQ =
          !q ||
          test.title
            .toLowerCase()
            .includes(q) ||
          (test.description ?? "")
            .toLowerCase()
            .includes(q);

        return okCat && okQ;
      }).length;
  }

  const isEmptyFilteredPage =
    hasFilters &&
    (resultsCount ?? 0) === 0;

  const robots =
    hasFilters || isEmptyFilteredPage
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        };

  const title =
    p > 1
      ? `Tests de personnalité gratuits – Page ${p}`
      : "Tests de personnalité gratuits en ligne";

  const description =
    p > 1
      ? `Explore la page ${p} de nos tests de personnalité gratuits : cinéma, culture, goûts, styles de vie, profils et résultats à partager.`
      : "Découvre tous les tests de personnalité gratuits de QuizUp : cinéma, culture, goûts, styles de vie et profils originaux. Réponds aux questions, découvre ton résultat dominant et partage ton profil.";

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots,

    openGraph: {
      title,
      description,
      url: `https://www.quizup.fr${canonical}`,
      siteName: "QuizUp",
      type: "website",
      locale: "fr_FR",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* =========================
   Pagination
   ========================= */

const PAGE_SIZE = 10;

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

  const sorted =
    Array.from(pages).sort(
      (a, b) => a - b,
    );

  const result:
    Array<number | "…"> = [];

  for (
    let i = 0;
    i < sorted.length;
    i++
  ) {
    const p = sorted[i];
    const prev = sorted[i - 1];

    if (
      i > 0 &&
      p - prev > 1
    ) {
      result.push("…");
    }

    result.push(p);
  }

  return result;
}

/* =========================
   URL builder
   ========================= */

function buildPersonalityUrl({
  cat,
  q,
  p,
}: {
  cat?: string;
  q?: string;
  p?: number;
}) {
  const params =
    new URLSearchParams();

  if (cat) {
    params.set("cat", cat);
  }

  if (q) {
    params.set("q", q);
  }

  if (p && p > 1) {
    params.set(
      "p",
      String(p),
    );
  }

  const qs =
    params.toString();

  return qs
    ? `/personalite?${qs}`
    : "/personalite";
}

/* =========================
   Alternance catégories
   ========================= */

function alternateByCategory<
  T extends {
    category: {
      slug: string;
    };
  },
>(items: T[]): T[] {
  const groups =
    new Map<string, T[]>();

  for (const item of items) {
    const slug =
      item.category.slug;

    if (!groups.has(slug)) {
      groups.set(
        slug,
        [],
      );
    }

    groups
      .get(slug)!
      .push(item);
  }

  const categoryGroups =
    Array.from(
      groups.values(),
    );

  const result: T[] = [];

  let hasItems = true;

  while (hasItems) {
    hasItems = false;

    for (
      const group
      of categoryGroups
    ) {
      const item =
        group.shift();

      if (item) {
        result.push(item);
        hasItems = true;
      }
    }
  }

  return result;
}

/* =========================
   Page
   ========================= */

export default async function PersonalityIndexPage({
  searchParams,
}: {
  searchParams: Promise<{
    cat?: string;
    q?: string;
    p?: string;
  }>;
}) {
  const sp =
    await searchParams;

  const tests =
    getAllPersonalityTests();

  const categories =
    getAllPersonalityCategories();

  const selectedCat =
    (sp.cat ?? "").trim();

  const qRaw =
    (sp.q ?? "").trim();

  const q =
    qRaw.toLowerCase();

  /* =========================
     Filtrage
     ========================= */

  const filtered =
    tests.filter((test) => {
      const okCat =
        !selectedCat ||
        test.category.slug ===
          selectedCat;

      const okQ =
        !q ||
        test.title
          .toLowerCase()
          .includes(q) ||
        (test.description ?? "")
          .toLowerCase()
          .includes(q);

      return okCat && okQ;
    });

  /* =========================
     Ordre des tests

     Sur la page générale :
     on alterne les catégories.

     Avec filtre ou recherche :
     on garde l'ordre normal.
     ========================= */

  const orderedTests =
    !selectedCat && !qRaw
      ? alternateByCategory(
          filtered,
        )
      : filtered;

  /* =========================
     Pagination
     ========================= */

  const total =
    orderedTests.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / PAGE_SIZE,
      ),
    );

  let currentPage =
    Number.parseInt(
      sp.p ?? "1",
      10,
    );

  if (
    !Number.isFinite(
      currentPage,
    ) ||
    currentPage < 1
  ) {
    currentPage = 1;
  }

  if (
    currentPage >
    totalPages
  ) {
    currentPage =
      totalPages;
  }

  const start =
    (currentPage - 1) *
    PAGE_SIZE;

  const end =
    start +
    PAGE_SIZE;

  const pageItems =
    orderedTests.slice(
      start,
      end,
    );

  return (
    <main className="page">
      {/* =========================
          HERO
          ========================= */}

      <section className="heroLandingSection personalityHeroSection">
        <div className="heroLandingContent">
          <h1 className="heroLandingTitle">
            Tous les tests
            <br />
            de personnalité
          </h1>

          <p className="heroLandingSub">
            Découvre des tests de
            personnalité autour du cinéma,
            de la culture, des goûts et des
            styles de vie. Réponds aux
            questions, découvre ton profil
            dominant et partage ton
            résultat.
          </p>

          <p className="pageSubtitle">
            {total} test
            {total > 1 ? "s" : ""} •
            Page {currentPage} /{" "}
            {totalPages}
          </p>
        </div>
      </section>

      {/* =========================
          LISTE / FILTRES
          ========================= */}

      <div className="quizListSection">
        <section className="filters">
          {/* =========================
              Recherche
              ========================= */}

          <form
            className="searchBar"
            action="/personalite"
          >
            {selectedCat ? (
              <input
                type="hidden"
                name="cat"
                value={selectedCat}
              />
            ) : null}

            <input
              type="hidden"
              name="p"
              value="1"
            />

            <input
              className="searchInput"
              type="search"
              name="q"
              placeholder="Rechercher un test…"
              defaultValue={qRaw}
            />

            <button
              className="searchBtn"
              type="submit"
            >
              <span className="btnText">
                Rechercher
              </span>

              <span
                className="btnIcon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <line
                    x1="16.65"
                    y1="16.65"
                    x2="21"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            {selectedCat ||
            qRaw ? (
              <Link
                className="clearBtn"
                href="/personalite"
                aria-label="Réinitialiser"
              >
                <span className="btnText">
                  Réinitialiser
                </span>

                <span
                  className="btnIcon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                  >
                    <path
                      d="M3 12a9 9 0 1 0 3-6.7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <polyline
                      points="3 4 3 10 9 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ) : null}
          </form>

          {/* =========================
              Catégories
              ========================= */}

          <div className="row">
            <div className="rowTrack rowTrack--categories">
              <Link
                href={buildPersonalityUrl({
                  q: qRaw,
                  p: 1,
                })}
                className={`catChip ${
                  !selectedCat
                    ? "catChip--active"
                    : ""
                }`}
              >
                Toutes
              </Link>

              {categories.map(
                (cat) => {
                  const active =
                    selectedCat ===
                    cat.slug;

                  return (
                    <Link
                      key={cat.slug}
                      href={buildPersonalityUrl({
                        cat: cat.slug,
                        q: qRaw,
                        p: 1,
                      })}
                      className={`catChip ${
                        active
                          ? "catChip--active"
                          : ""
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {/* =========================
            Tests
            ========================= */}

        <section className="quizList">
          {pageItems.map(
            (test, idx) => {
              const img =
                test.images
                  ?.thumbnail ||
                test.images
                  ?.cover ||
                "/images/placeholder-cover.jpg";

              return (
                <div
                  key={test.slug}
                >
                  <Link
                    href={`/personalite/${test.slug}`}
                    className="quizRow"
                    aria-label={`Ouvrir le test ${test.title}`}
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
                          {
                            test
                              .category
                              .name
                          }
                        </span>

                        <span className="quizRowMeta">
                          {
                            test
                              .questions
                              .length
                          }{" "}
                          questions
                        </span>
                      </div>

                      <h2 className="quizRowTitle">
                        {
                          test.title
                        }
                      </h2>

                      {test.description ? (
                        <p className="quizRowDesc">
                          {
                            test.description
                          }
                        </p>
                      ) : null}
                    </div>
                  </Link>

                  {idx === 2 ? (
                    <div
                      style={{
                        marginTop: 14,
                        marginBottom: 14,
                      }}
                    >
                      {/* <AdSlot slot="5555555555" /> */}
                    </div>
                  ) : null}
                </div>
              );
            },
          )}

          {total === 0 ? (
            <p className="emptyState">
              Aucun test de personnalité
              ne correspond à ta
              recherche.
            </p>
          ) : null}
        </section>

        {/* =========================
            Pagination
            ========================= */}

        {totalPages > 1 ? (
          <nav
            className="pager"
            aria-label="Pagination"
          >
            {/* Précédent */}

            <Link
              className={`pagerBtn ${
                currentPage === 1
                  ? "isDisabled"
                  : ""
              }`}
              href={buildPersonalityUrl({
                cat:
                  selectedCat ||
                  undefined,

                q:
                  qRaw ||
                  undefined,

                p:
                  Math.max(
                    1,
                    currentPage - 1,
                  ),
              })}
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

            {/* Pages */}

            <div
              className="pagerNums"
              aria-label="Pages"
            >
              {getPageItems(
                currentPage,
                totalPages,
              ).map(
                (
                  item,
                  idx,
                ) => {
                  if (
                    item === "…"
                  ) {
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

                  const page =
                    item;

                  const href =
                    buildPersonalityUrl({
                      cat:
                        selectedCat ||
                        undefined,

                      q:
                        qRaw ||
                        undefined,

                      p: page,
                    });

                  return (
                    <Link
                      key={page}
                      href={href}
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

            {/* Suivant */}

            <Link
              className={`pagerBtn ${
                currentPage ===
                totalPages
                  ? "isDisabled"
                  : ""
              }`}
              href={buildPersonalityUrl({
                cat:
                  selectedCat ||
                  undefined,

                q:
                  qRaw ||
                  undefined,

                p:
                  Math.min(
                    totalPages,
                    currentPage + 1,
                  ),
              })}
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

        {/* =========================
            SEO
            ========================= */}

        {!selectedCat &&
        !qRaw ? (
          <section className="pageSeo">
            <h2 className="pageSeoTitle">
              Tous nos tests de
              personnalité
            </h2>

            <p className="pageSeoText">
              Explore nos tests de
              personnalité gratuits par
              catégories : amour, amitié,
              famille, argent, bien-être,
              carrière, psychologie,
              lifestyle et fun. Chaque test
              propose plusieurs questions
              simples pour analyser tes
              réponses, révéler ton profil
              dominant et obtenir un
              résultat immédiat à partager.
              Choisis un thème, réponds
              naturellement et découvre
              quel profil te correspond le
              mieux.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}