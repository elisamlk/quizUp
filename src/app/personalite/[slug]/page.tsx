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

const SITE_URL = "https://quizup.fr";
const siteUrl = (path: string) => `${SITE_URL}${path}`;

export function generateStaticParams() {
  return getAllPersonalityTests().map((t) => ({ slug: t.slug }));
}

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
      robots: { index: false, follow: false },
    };
  }

  const title = `${test.title} | Test de personnalité gratuit | QuizUp`;
  const description =
    test.description ??
      `Fais ce test de personnalité ${test.category.name} gratuit en ligne et découvre ton profil dominant grâce à un résultat immédiat.`;

  return {
    title,
    description,
    alternates: { canonical: `/personalite/${test.slug}` },
    openGraph: {
      title,
      description,
      url: siteUrl(`/personalite/${test.slug}`),
      type: "website",
  images: test.images?.cover
  ? [{ url: siteUrl(test.images.cover), alt: test.images.alt ?? test.title }]
  : undefined,
    },
  };
}

export default async function PersonalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getPersonalityTestBySlug(slug);
  if (!test) return notFound();

  const all = getAllPersonalityTests();

  const sameCategory = all.filter(
    (t) => t.slug !== test.slug && t.category.slug === test.category.slug,
  );

  const related = sameCategory.slice(0, 8);

  const nextTest = related[0]
    ? { slug: related[0].slug, title: related[0].title }
    : null;

  const popularCross = all
    .filter((t) => t.slug !== test.slug && t.isPopular)
    .slice(0, 8);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl("/") },
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
        item: siteUrl(`/personalite/categorie/${test.category.slug}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: test.title,
        item: siteUrl(`/personalite/${test.slug}`),
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: test.title,
    description: test.description,
    url: siteUrl(`/personalite/${test.slug}`),
    about: test.category.name,
    image: test.images?.cover ? [siteUrl(test.images.cover)] : undefined,
  };

  const seoIntro =
    test.descriptionSeo ??
    `Test de personnalité ${test.category.name} pour découvrir ton profil dominant.`;

  const estMinutes = Math.max(2, Math.round(test.questions.length * 0.3));

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="quizHero">
        {test.images?.cover ? (
          <div
            className="quizHeroImg"
            style={{ backgroundImage: `url("${test.images.cover}")` }}
            aria-hidden="true"
          />
        ) : null}
        <div className="quizHeroOverlay" aria-hidden="true" />

        <div className="quizHeroContent">
          <h1 className="quizTitle">{test.title}</h1>

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
            <span className="quizMetaChip">~{estMinutes} min</span>
          </div>

          <p className="quizIntro">{seoIntro}</p>

          <div className="quizCtas">
            <a className="quizStartBtn" href="#jouer">
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

      <div className="quizPageLayout">
        <nav className="breadcrumbs" aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <Link href="/personalite">Tests</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/personalite/categorie/${test.category.slug}`}>
            {test.category.name}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="crumbCurrent">{test.title}</span>
        </nav>

        <section id="jouer" className="quizPlay">
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

        <section className="quizSeoText">
          <h2 className="sectionTitle">Ce que tu vas découvrir</h2>
          <ul className="seoList">
            <li>{test.questions.length} questions pour analyser ton profil</li>
            <li>Un résultat immédiat personnalisé</li>
            <li>Une répartition de tes traits dominants</li>
          </ul>

          <p className="seoP">
            Réponds instinctivement pour obtenir le résultat le plus fiable,
            puis partage ton profil final.
          </p>
        </section>

        {popularCross.length > 0 ? (
          <section className="relatedPopular">
            <h2 className="sectionTitle">Les plus populaires</h2>

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
                      style={{ backgroundImage: `url("${img}")` }}
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
                      <h3 className="quizRowTitle">{t.title}</h3>
                      {t.description ? (
                        <p className="quizRowDesc">{t.description}</p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>

            <p className="relatedMore">
              <Link href="/personalite">Voir tous les tests →</Link>
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}