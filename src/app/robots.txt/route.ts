export function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://quizup.fr/sitemap.xml

Host: https://quizup.fr
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}