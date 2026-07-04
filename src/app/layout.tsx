import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import { SiteFooter } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quizup.fr"),

  title: {
    default: "QuizUp | Quiz gratuits en ligne et jeux de culture générale",
    template: "%s | QuizUp",
  },

  description:
    "Joue à des quiz gratuits en ligne sur QuizUp : culture générale, histoire, géographie, sciences, sport, cinéma, musique, séries TV, nature et mini-jeux.",

  applicationName: "QuizUp",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "QuizUp | Quiz gratuits en ligne",
    description:
      "Teste tes connaissances avec des quiz gratuits en culture générale, histoire, géographie, sciences, sport, cinéma, musique, nature et plus encore.",
    url: "https://www.quizup.fr",
    siteName: "QuizUp",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "QuizUp | Quiz gratuits en ligne",
    description:
      "Découvre des quiz gratuits, tests de personnalité et mini-jeux pour apprendre, progresser et t'amuser.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="fr">
      <body className={`${inter.variable} ${interTight.variable}`}>
        <Header />
        <Script
  id="funding-choices"
  async
  strategy="beforeInteractive"
  src="https://fundingchoicesmessages.google.com/i/pub-3338476341292980?ers=1"
/>

        {adsClient ? (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
          />
        ) : null}

        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9LZ8NWQBGG"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9LZ8NWQBGG');
  `}
        </Script>

        <SiteFooter />
      </body>
    </html>
  );
}
