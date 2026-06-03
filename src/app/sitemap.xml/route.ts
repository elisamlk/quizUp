import { getAllQuizzes, getAllCategories } from "@/lib/quizzes";
import { getAllGames } from "@/lib/games";
import { getAllPersonalityTests } from "@/lib/personalite";

export function GET() {
  const base = "https://quizup.fr";

  const urls = [
    `${base}/`,
    `${base}/quiz`,
    `${base}/jeux`,
    `${base}/personalite`,

    `${base}/a-propos`,
    `${base}/contact`,
    `${base}/conditions`,
    `${base}/cookies`,
    `${base}/mentions-legales`,
    `${base}/politique-confidentialite`,

    ...getAllCategories().map((c) => `${base}/categorie/${c.slug}`),
    ...getAllQuizzes().map((q) => `${base}/quiz/${q.slug}`),
    ...getAllGames().map((game) => `${base}/jeux/${game.slug}`),
    ...getAllPersonalityTests().map(
      (test) => `${base}/personalite/${test.slug}`,
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
