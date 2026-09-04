import Link from "next/link";
import { getAllCategories, getAllQuizzes } from "@/lib/quizzes";
import type { Metadata } from "next";
// import { AdSlot } from "@/components/AdSlot";

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; p?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;

  const selectedCat = (sp.cat ?? "").trim();
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const p = toInt(sp.p, 1);

  const hasFilters = Boolean(selectedCat || qRaw);

  const canonical = p > 1 ? `/quiz?p=${p}` : "/quiz";

  let resultsCount: number | null = null;

  if (hasFilters) {
    const quizzes = getAllQuizzes();

    resultsCount = quizzes.filter((quiz) => {
      const okCat = !selectedCat || quiz.category.slug === selectedCat;

      const okQ =
        !q ||
        quiz.title.toLowerCase().includes(q) ||
        (quiz.description ?? "").toLowerCase().includes(q);

      return okCat && okQ;
    }).length;
  }

  const isEmptyFilteredPage =
    hasFilters && (resultsCount ?? 0) === 0;

  const robots =
    hasFilters || isEmptyFilteredPage
      ? { index: false, follow: true }
      : { index: true, follow: true };

  const title =
    p > 1
      ? `Tous les quiz gratuits en ligne – Page ${p}`
      : "Tous les quiz gratuits en ligne | Culture générale, histoire, géographie";

  const description =
    p > 1
      ? `Explore la page ${p} des quiz gratuits QuizUp : culture générale, histoire, géographie, sciences, sport, cinéma, musique, nature et séries TV.`
      : "Explore tous les quiz gratuits de QuizUp : culture générale, histoire, géographie, sciences, sport, cinéma, musique, nature et séries TV. Réponds à des quiz de 20 questions avec score immédiat et explications.";

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
      url: canonical,
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

const PAGE_SIZE = 10;

function getPageItems(current: number, total: number): Array<number | "…"> {
  const windowSize = 1;
  const pages = new Set<number>();

  pages.add(1);
  pages.add(total);

  for (let p = current - windowSize; p <= current + windowSize; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | "…"> = [];

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];

    if (i > 0 && p - prev > 1) result.push("…");
    result.push(p);
  }

  return result;
}

function buildQuizUrl({ cat, q, p }: { cat?: string; q?: string; p?: number }) {
  const params = new URLSearchParams();
  if (cat) params.set("cat", cat);
  if (q) params.set("q", q);
  if (p && p > 1) params.set("p", String(p));
  const qs = params.toString();
  return qs ? `/quiz?${qs}` : "/quiz";
}

function mixByCategory<T extends { category: { slug: string } }>(
  items: T[],
  categoryOrder: string[]
) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const slug = item.category.slug;

    if (!groups.has(slug)) {
      groups.set(slug, []);
    }

    groups.get(slug)!.push(item);
  }

  const orderedSlugs = [
    ...categoryOrder.filter((slug) => groups.has(slug)),
    ...Array.from(groups.keys()).filter((slug) => !categoryOrder.includes(slug)),
  ];

  const result: T[] = [];
  let added = true;

  while (added) {
    added = false;

    for (const slug of orderedSlugs) {
      const group = groups.get(slug);
      const item = group?.shift();

      if (item) {
        result.push(item);
        added = true;
      }
    }
  }

  return result;
}

export default async function QuizIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; p?: string }>;
}) {
  const sp = await searchParams;

  const quizzes = getAllQuizzes();
  const categories = getAllCategories();

  const selectedCat = (sp.cat ?? "").trim();
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();

  const filtered = quizzes.filter((quiz) => {
    const okCat = !selectedCat || quiz.category.slug === selectedCat;

    const okQ =
      !q ||
      quiz.title.toLowerCase().includes(q) ||
      (quiz.description ?? "").toLowerCase().includes(q);

    return okCat && okQ;
  });

  const mixedFiltered = mixByCategory(
    filtered,
    categories.map((cat) => cat.slug)
  );

  const total = mixedFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  let currentPage = Number.parseInt(sp.p ?? "1", 10);
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = mixedFiltered.slice(start, end);

  return (
    <main className="page">
      <section className="heroLandingSection quizPageHero">
        <div className="heroLandingContent">
          <h1 className="heroLandingTitle">
            Tous les quiz gratuits
          </h1>

          <p className="heroLandingSub">
            Découvrez des centaines de quiz gratuits en culture générale,
            histoire, géographie, sciences, sport, cinéma, musique,
            nature, séries TV et bien plus encore.
          </p>

          <p className="pageSubtitle">
            {total} quiz • Page {currentPage} / {totalPages}
          </p>

          <div className="heroCtas">
            {categories[0] ? (
              <Link
                className="homeBtnSecondary"
                href={`/categorie/${categories[0].slug}`}
              >
                Explorer une catégorie
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <div className="quizListSection">
        <section className="filters">
          <form className="searchBar" action="/quiz">
            {selectedCat ? (
              <input type="hidden" name="cat" value={selectedCat} />
            ) : null}

            <input type="hidden" name="p" value="1" />

            <input
              className="searchInput"
              type="search"
              name="q"
              placeholder="Rechercher un quiz…"
              defaultValue={qRaw}
            />

            <button className="searchBtn" type="submit">
              <span className="btnText">Rechercher</span>
              <span className="btnIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
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

            {selectedCat || qRaw ? (
              <Link className="clearBtn" href="/quiz" aria-label="Réinitialiser">
                <span className="btnText">Réinitialiser</span>
                <span className="btnIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
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

          <div className="row">
            <div className="rowTrack rowTrack--categories">
              <Link
                href={buildQuizUrl({ q: qRaw, p: 1 })}
                className={`catChip ${!selectedCat ? "catChip--active" : ""}`}
              >
                Toutes
              </Link>

              {categories.map((cat) => {
                const active = selectedCat === cat.slug;

                return (
                  <Link
                    key={cat.slug}
                    href={buildQuizUrl({ cat: cat.slug, q: qRaw, p: 1 })}
                    className={`catChip ${active ? "catChip--active" : ""}`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* <AdSlot slot="1111111111" /> */}

        <section className="quizList">
          {pageItems.map((quiz, idx) => {
            const img =
              quiz.images?.thumbnail || "/images/placeholder-cover.jpg";

            return (
              <div key={quiz.slug}>
                <Link
                  href={`/quiz/${quiz.slug}`}
                  className="quizRow"
                  aria-label={`Ouvrir le quiz ${quiz.title}`}
                >
                  <div
                    className="quizRowImg"
                    style={{ backgroundImage: `url("${img}")` }}
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

                    <h2 className="quizRowTitle">{quiz.title}</h2>

                    {quiz.description ? (
                      <p className="quizRowDesc">{quiz.description}</p>
                    ) : null}
                  </div>
                </Link>

                {idx === 2 ? (
                  <div style={{ marginTop: 14, marginBottom: 14 }}>
                    {/* <AdSlot slot="5555555555" /> */}
                  </div>
                ) : null}
              </div>
            );
          })}

          {total === 0 ? (
            <p className="emptyState">
              Aucun quiz ne correspond à ta recherche.
            </p>
          ) : null}
        </section>

        {totalPages > 1 ? (
          <nav className="pager" aria-label="Pagination">
            <Link
              className={`pagerBtn ${currentPage === 1 ? "isDisabled" : ""}`}
              href={buildQuizUrl({
                cat: selectedCat || undefined,
                q: qRaw || undefined,
                p: Math.max(1, currentPage - 1),
              })}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
              title="Page précédente"
            >
              ‹
            </Link>

            <div className="pagerNums" aria-label="Pages">
              {getPageItems(currentPage, totalPages).map((item, idx) => {
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

                const href = buildQuizUrl({
                  cat: selectedCat || undefined,
                  q: qRaw || undefined,
                  p: page,
                });

                return (
                  <Link
                    key={page}
                    href={href}
                    className={`pagerNum ${page === currentPage ? "isActive" : ""}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    title={`Page ${page}`}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>

            <Link
              className={`pagerBtn ${
                currentPage === totalPages ? "isDisabled" : ""
              }`}
              href={buildQuizUrl({
                cat: selectedCat || undefined,
                q: qRaw || undefined,
                p: Math.min(totalPages, currentPage + 1),
              })}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
              title="Page suivante"
            >
              ›
            </Link>
          </nav>
        ) : null}

        {!selectedCat && !qRaw ? (
          <section className="pageSeo">
            <h2 className="pageSeoTitle">Tous nos quiz</h2>

            <p className="pageSeoText">
              Découvrez des centaines de quiz gratuits pour tester vos
              connaissances et apprendre tout en vous amusant. Culture générale,
              histoire, géographie, sciences, sport, cinéma, musique, nature ou
              encore séries TV : explorez de nombreux thèmes adaptés à tous les
              niveaux. Chaque quiz comprend 20 questions variées avec un score
              immédiat à la fin de la partie et, selon les quiz, des explications
              pour approfondir vos connaissances. Que vous souhaitiez relever un
              défi rapide, réviser un sujet précis ou simplement vous divertir,
              parcourez nos catégories, découvrez les quiz les plus populaires et
              trouvez votre prochain challenge.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
