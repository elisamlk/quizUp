export function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://www.quizup.fr/sitemap.xml

Host: https://www.quizup.fr
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}