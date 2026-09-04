import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPersonalityTests,
  getPersonalityTestBySlug,
} from "@/lib/personalite";
import { QuizDisplay } from "@/components/QuizDisplay";
import { PersonalityPlayer } from "@/components/PersonalityPlayer";
import { AdSlot } from "@/components/AdSlot";

const SITE_URL = "https://www.quizup.fr";

const siteUrl = (path: string) => `${SITE_URL}${path}`;

/* =========================
   Static generation
   ========================= */

export function generateStaticParams() {
  return getAllPersonalityTests().map((t) => ({
    slug: t.slug,
  }));
}

/* =========================
   Metadata SEO
   ========================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = getPersonalityTestBySlug(slug);

  if (!test) {
    return {
      title: "Test introuvable",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${test.title} | Test de personnalité gratuit`;

  const description =
    test.description ??
    `Fais ce test de personnalité ${test.category.name} gratuit en ligne et découvre ton profil dominant grâce à un résultat immédiat.`;

  return {
    title,
    description,

    alternates: {
      canonical: `/personalite/${test.slug}`,
    },

    openGraph: {
      title,
      description,
      url: siteUrl(`/personalite/${test.slug}`),
      type: "website",

      images: test.images?.cover
        ? [
            {
              url: siteUrl(test.images.cover),
              alt: test.images.alt ?? test.title,
            },
          ]
        : undefined,
    },
  };
}

/* =========================
   Page
   ========================= */

export default async function PersonalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const test = getPersonalityTestBySlug(slug);

  if (!test) {
    return notFound();
  }

  const all = getAllPersonalityTests();

  /* =========================
     Tests de la même catégorie
     ========================= */

  const sameCategory = all.filter(
    (t) =>
      t.slug !== test.slug &&
      t.category.slug === test.category.slug,
  );

  const related = sameCategory.slice(0, 8);

  const nextTest = related[0]
    ? {
        slug: related[0].slug,
        title: related[0].title,
      }
    : null;

  /* =========================
     Tests populaires diversifiés

     Priorité :
     1 test populaire par catégorie différente.
     Puis on complète avec d'autres tests populaires
     si moins de 8 catégories sont disponibles.
     ========================= */

  const popularCandidates = all.filter(
    (t) => t.slug !== test.slug && t.isPopular,
  );

  /*
   * On commence par les catégories différentes
   * de celle du test actuellement affiché.
   */
  const otherCategories = popularCandidates.filter(
    (t) => t.category.slug !== test.category.slug,
  );

  /*
   * Les tests populaires de la catégorie actuelle
   * ne serviront qu'en dernier recours.
   */
  const sameCategoryPopular = popularCandidates.filter(
    (t) => t.category.slug === test.category.slug,
  );

  /*
   * Un seul test populaire par catégorie.
   */
  const popularByCategory = new Map<
    string,
    (typeof popularCandidates)[number]
  >();

  for (const candidate of otherCategories) {
    if (!popularByCategory.has(candidate.category.slug)) {
      popularByCategory.set(
        candidate.category.slug,
        candidate,
      );
    }
  }

  const diversifiedPopular = Array.from(
    popularByCategory.values(),
  );

  /*
   * On mémorise les tests déjà sélectionnés
   * pour éviter les doublons.
   */
  const usedSlugs = new Set(
    diversifiedPopular.map((t) => t.slug),
  );

  /*
   * S'il n'y a pas assez de catégories différentes,
   * on complète avec les autres tests populaires.
   *
   * La catégorie actuelle arrive en dernier.
   */
  const remainingPopular = [
    ...otherCategories.filter(
      (t) => !usedSlugs.has(t.slug),
    ),
    ...sameCategoryPopular,
  ];

  const popularCross = [
    ...diversifiedPopular,
    ...remainingPopular,
  ].slice(0, 8);

  /* =========================
     JSON-LD Breadcrumb
     ========================= */

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
        name: "Tests de personnalité",
        item: siteUrl("/personalite"),
      },

      {
        "@type": "ListItem",
        position: 3,
        name: test.category.name,
        item: siteUrl(
          `/personalite/categorie/${test.category.slug}`,
        ),
      },

      {
        "@type": "ListItem",
        position: 4,
        name: test.title,
        item: siteUrl(`/personalite/${test.slug}`),
      },
    ],
  };

  /* =========================
     JSON-LD Article
     ========================= */

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",

    headline: test.title,

    description: test.description,

    url: siteUrl(`/personalite/${test.slug}`),

    about: test.category.name,

    image: test.images?.cover
      ? [siteUrl(test.images.cover)]
      : undefined,
  };

  /* =========================
     SEO intro
     ========================= */

  const seoIntro =
    test.descriptionSeo ??
    `Test de personnalité ${test.category.name} pour découvrir ton profil dominant.`;

  const estMinutes = Math.max(
    2,
    Math.round(test.questions.length * 0.3),
  );

  return (
    <main className="page">
      {/* =========================
          JSON-LD
          ========================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      {/* =========================
          HERO
          ========================= */}

      <header className="quizHero">
        {test.images?.cover ? (
          <div
            className="quizHeroImg"
            style={{
              backgroundImage: `url("${test.images.cover}")`,
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
            {test.title}
          </h1>

          <div className="quizMetaRow">
            <Link
              className="quizMetaChip"
              href={`/personalite/categorie/${test.category.slug}`}
            >
              {test.category.name}
            </Link>

            <span className="quizMetaChip">
              {test.questions.length} questions
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
              Commencer le test
            </a>

            <Link
              className="quizAltBtn"
              href={`/personalite/categorie/${test.category.slug}`}
            >
              Voir la catégorie
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          CONTENU
          ========================= */}

      <div className="quizPageLayout">
        {/* =========================
            Breadcrumb
            ========================= */}

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

          <Link href="/personalite">
            Tests
          </Link>

          <span aria-hidden="true">
            ›
          </span>

          <span className="crumbCurrent">
            {test.title}
          </span>
        </nav>

        {/* =========================
            TEST
            ========================= */}

        <section
          id="jouer"
          className="quizPlay"
        >
          {/* <AdSlot slot="2222222222" /> */}

          <QuizDisplay
            related={related}
            categorySlug={test.category.slug}
            categoryName={test.category.name}
            type="personality"
          >
            <PersonalityPlayer
              key={test.slug}
              quiz={test}
              nextQuiz={nextTest}
            />
          </QuizDisplay>
        </section>

        {/* =========================
            TEXTE SEO
            ========================= */}

        <section className="quizSeoText">
          <h2 className="sectionTitle">
            Ce que tu vas découvrir
          </h2>

          <ul className="seoList">
            <li>
              {test.questions.length} questions
              pour analyser ton profil
            </li>

            <li>
              Un résultat immédiat personnalisé
            </li>

            <li>
              Une répartition de tes traits dominants
            </li>
          </ul>

          <p className="seoP">
            Réponds instinctivement pour obtenir le
            résultat le plus fiable, puis partage ton
            profil final.
          </p>
        </section>

        {/* =========================
            TESTS POPULAIRES
            ========================= */}

        {popularCross.length > 0 ? (
          <section className="relatedPopular">
            <h2 className="sectionTitle">
              Les plus populaires
            </h2>

            <div className="quizList">
              {popularCross.map((t) => {
                const img =
                  t.images?.thumbnail ||
                  t.images?.cover ||
                  "/images/placeholder-thumb.jpg";

                return (
                  <Link
                    key={t.slug}
                    href={`/personalite/${t.slug}`}
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
                          {t.category.name}
                        </span>

                        <span className="quizRowMeta">
                          {t.questions.length} questions
                        </span>
                      </div>

                      <h3 className="quizRowTitle">
                        {t.title}
                      </h3>

                      {t.description ? (
                        <p className="quizRowDesc">
                          {t.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>

            <p className="relatedMore">
              <Link href="/personalite">
                Voir tous les tests →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}