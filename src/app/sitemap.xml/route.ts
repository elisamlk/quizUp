import { getAllQuizzes, getAllCategories } from "@/lib/quizzes";
import { getAllGames } from "@/lib/games";
import { getAllPersonalityTests } from "@/lib/personalite";
import { geographyTopics } from "@/lib/geography-topics";

export function GET() {
  const BASE_URL = "https://www.quizup.fr";

  // Format recommandé : YYYY-MM-DD
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

    ...getAllCategories().map((category) => ({
      loc: `${BASE_URL}/categorie/${category.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today,
    })),

    // Sous-catégories SEO Géographie
    ...geographyTopics.map((topic) => ({
      loc: `${BASE_URL}/categorie/geographie/${topic.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today,
    })),

    ...getAllQuizzes().map((quiz) => ({
      loc: `${BASE_URL}/quiz/${quiz.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),

    ...getAllGames().map((game) => ({
      loc: `${BASE_URL}/jeux/${game.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    })),

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
  </url>`
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
