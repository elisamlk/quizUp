import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPersonalityCategories,
  getAllPersonalityTests,
} from "@/lib/personalite";

/* =========================
   Config
   ========================= */

const SITE_URL = "https://quizup.fr";
const PAGE_SIZE = 10;

function url(path: string) {
  return `${SITE_URL}${path}`;
}

function toInt(v: string | undefined, fallback = 1) {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function buildCategoryUrl(slug: string, p?: number) {
  if (!p || p <= 1) return `/personalite/categorie/${slug}`;
  const params = new URLSearchParams();
  params.set("p", String(p));
  return `/personalite/categorie/${slug}?${params.toString()}`;
}

/* =========================
   Static generation
   ========================= */

export function generateStaticParams() {
  return getAllPersonalityCategories().map((c) => ({ slug: c.slug }));
}

/* =========================
   Metadata SEO
   ========================= */

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;

  const category = getAllPersonalityCategories().find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Catégorie introuvable",
      robots: { index: false, follow: false },
    };
  }

  const testsCount = getAllPersonalityTests().filter(
    (t) => t.category.slug === slug,
  ).length;

  const totalPages = Math.max(1, Math.ceil(testsCount / PAGE_SIZE));

  const p = toInt(sp.p, 1);
  const pageTooHigh = p > totalPages;

  const titleBase = `Tests de personnalité ${category.name}`;
  const title = p > 1 ? `${titleBase} – Page ${p}` : titleBase;

  const description = `Découvre tous nos tests de personnalité sur ${category.name}.`;

  const canonical = buildCategoryUrl(slug, p);

  return {
    title,
    description,
    alternates: { canonical },
    robots: pageTooHigh
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

/* =========================
   Page
   ========================= */

export default async function PersonalityCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = getAllPersonalityCategories().find((c) => c.slug === slug);
  if (!category) return notFound();

  const allTests = getAllPersonalityTests().filter(
    (t) => t.category.slug === category.slug,
  );

  const total = allTests.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  let currentPage = toInt(sp.p, 1);
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const tests = allTests.slice(start, end);

  const prevHref =
    currentPage > 1 ? buildCategoryUrl(category.slug, currentPage - 1) : null;
  const nextHref =
    currentPage < totalPages
      ? buildCategoryUrl(category.slug, currentPage + 1)
      : null;

  /* =========================
     JSON-LD
     ========================= */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: url("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tests de personnalité",
        item: url("/personalite"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: url(`/personalite/categorie/${category.slug}`),
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Tests de personnalité ${category.name} – Page ${currentPage}`,
    itemListElement: tests.map((t, i) => ({
      "@type": "ListItem",
      position: start + i + 1,
      url: url(`/personalite/${t.slug}`),
      name: t.title,
    })),
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <header className="categorySeoHero">
        <div
          className="categorySeoHeroImg"
          style={{
            backgroundImage: `url("/images/placeholder-cover.jpg")`,
          }}
        />
        <div className="categorySeoHeroOverlay" />

        <div className="categorySeoHeroContent">
          <h1>Tests de personnalité {category.name}</h1>
          <p>{allTests.length} tests disponibles</p>

          <p>
            Découvre nos tests de personnalité autour de {category.name} et
            trouve ton profil dominant.
          </p>
        </div>
      </header>

      <div className="categoryPageLayout">
        <nav className="breadcrumbs">
          <Link href="/">Accueil</Link> ›{" "}
          <Link href="/personalite">Tests de personnalité</Link> ›{" "}
          <span>{category.name}</span>
        </nav>

        <section className="quizList">
          {tests.map((test) => {
            const img =
              test.images?.thumbnail ||
              test.images?.cover ||
              "/images/placeholder-thumb.jpg";

            return (
              <Link
                key={test.slug}
                href={`/personalite/${test.slug}`}
                className="quizRow"
              >
                <div
                  className="quizRowImg"
                  style={{ backgroundImage: `url("${img}")` }}
                />

                <div className="quizRowContent">
                  <div className="quizRowTop">
                    <span>{test.questions.length} questions</span>
                  </div>

                  <h2 className="quizRowTitle">{test.title}</h2>

                  {test.description && (
                    <p className="quizRowDesc">{test.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </section>

        {totalPages > 1 ? (
          <nav
            className="pager"
            aria-label="Pagination catégorie"
            style={{ marginTop: 16 }}
          >
            {prevHref ? (
              <Link className="pagerLink" href={prevHref}>
                ←
              </Link>
            ) : (
              <span className="pagerLink isDisabled">←</span>
            )}

            <span className="pagerInfo">
              Page {currentPage} / {totalPages}
            </span>

            {nextHref ? (
              <Link className="pagerLink" href={nextHref}>
                →
              </Link>
            ) : (
              <span className="pagerLink isDisabled">→</span>
            )}
          </nav>
        ) : null}
      </div>
    </main>
  );
}