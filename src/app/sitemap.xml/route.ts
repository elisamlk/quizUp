import { getAllQuizzes, getAllCategories } from "@/lib/quizzes";
import { getAllGames } from "@/lib/games";
import { getAllPersonalityTests } from "@/lib/personalite";

export function GET() {
  const base = "https://www.quizup.fr";

  const urls = [
    {
      url: `${base}/`,
      priority: "1.0",
      changefreq: "daily",
    },
    {
      url: `${base}/quiz`,
      priority: "0.9",
      changefreq: "daily",
    },
    {
      url: `${base}/jeux`,
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: `${base}/personalite`,
      priority: "0.9",
      changefreq: "weekly",
    },

    ...getAllCategories().map((c) => ({
      url: `${base}/categorie/${c.slug}`,
      priority: "0.8",
      changefreq: "weekly",
    })),

    ...getAllQuizzes().map((q) => ({
      url: `${base}/quiz/${q.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    })),

    ...getAllGames().map((game) => ({
      url: `${base}/jeux/${game.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    })),

    ...getAllPersonalityTests().map((test) => ({
      url: `${base}/personalite/${test.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    })),
  ];

  const today = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
