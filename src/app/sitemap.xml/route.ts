import { getAllQuizzes, getAllCategories } from "@/lib/quizzes";
import { getAllGames } from "@/lib/games";
import {
  getAllPersonalityTests,
  getAllPersonalityCategories,
} from "@/lib/personalite";
import { categoryTopics } from "@/lib/category-topics";

export function GET() {
  const BASE_URL = "https://www.quizup.fr";

  // Format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    {
      loc: `${BASE_URL}/`,
      priority: "1.0",
      changefreq: "daily",
      lastmod: today,
    },

    {
      loc: `${BASE_URL}/quiz`,
      priority: "0.9",
      changefreq: "daily",
      lastmod: today,
    },

    {
      loc: `${BASE_URL}/jeux`,
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
    },

    {
      loc: `${BASE_URL}/personalite`,
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
    },

    /* ---------------------------------------------------
       CATÉGORIES PRINCIPALES QUIZ
    --------------------------------------------------- */

    ...getAllCategories().map((category) => ({
      loc: `${BASE_URL}/categorie/${category.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today,
    })),

    /* ---------------------------------------------------
       CLUSTERS / SOUS-CATÉGORIES SEO QUIZ
    --------------------------------------------------- */

    ...Object.entries(categoryTopics).flatMap(
      ([categorySlug, topics]) =>
        topics.map((topic) => ({
          loc: `${BASE_URL}/categorie/${categorySlug}/${topic.slug}`,
          priority: "0.8",
          changefreq: "weekly",
          lastmod: today,
        })),
    ),

    /* ---------------------------------------------------
       CATÉGORIES TESTS DE PERSONNALITÉ
    --------------------------------------------------- */

    ...getAllPersonalityCategories().map((category) => ({
      loc: `${BASE_URL}/personalite/categorie/${category.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today,
    })),

    /* ---------------------------------------------------
       QUIZ
    --------------------------------------------------- */

    ...getAllQuizzes().map((quiz) => ({
      loc: `${BASE_URL}/quiz/${quiz.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),

    /* ---------------------------------------------------
       JEUX
    --------------------------------------------------- */

    ...getAllGames().map((game) => ({
      loc: `${BASE_URL}/jeux/${game.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),

    /* ---------------------------------------------------
       TESTS DE PERSONNALITÉ
    --------------------------------------------------- */

    ...getAllPersonalityTests().map((test) => ({
      loc: `${BASE_URL}/personalite/${test.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
