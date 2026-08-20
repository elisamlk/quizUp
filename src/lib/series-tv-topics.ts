export type SeriesTvTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
};

export const seriesTvTopics: SeriesTvTopic[] = [
  {
    slug: "series-cultes",
    name: "Séries cultes",
    shortDescription:
      "Les séries incontournables et les grands classiques de la télévision.",
    seoTitle: "Quiz Séries Cultes gratuits en ligne",
    seoDescription:
      "Découvre nos quiz sur les séries cultes et incontournables de la télévision : grands classiques, séries populaires, personnages emblématiques et moments mémorables.",
    intro:
      "Retrouve les séries qui ont marqué l’histoire de la télévision. Friends, Breaking Bad, The Walking Dead, Dexter, Game of Thrones et bien d’autres univers cultes sont au programme de ces quiz.",
    image:
      "/images/series-tv-topics/series-cultes.jpg",
  },

  {
    slug: "series-par-epoque",
    name: "Séries par époque",
    shortDescription:
      "Des années 80 aux années 2010, retrouve les séries de chaque génération.",
    seoTitle:
      "Quiz Séries TV par Époque : années 80, 90, 2000 et 2010",
    seoDescription:
      "Teste tes connaissances sur les séries TV des années 80, 90, 2000 et 2010 avec nos quiz consacrés aux programmes qui ont marqué chaque génération.",
    intro:
      "Voyage à travers plusieurs décennies de télévision avec les séries emblématiques des années 80, 90, 2000 et 2010. Génériques, personnages, intrigues et grands succès : retrouve les programmes qui ont marqué chaque époque.",
    image:
      "/images/series-tv-topics/series-par-epoque.jpg",
  },

  {
    slug: "series-policieres-thrillers",
    name: "Policier & Thriller",
    shortDescription:
      "Enquêtes, crimes, mystères, thrillers et séries judiciaires.",
    seoTitle:
      "Quiz Séries Policières et Thrillers gratuits",
    seoDescription:
      "Découvre nos quiz sur les séries policières, thrillers, enquêtes criminelles et séries judiciaires : détectives, crimes, mystères et grandes affaires télévisées.",
    intro:
      "Enquêtes criminelles, tueurs en série, détectives, procès et mystères : retrouve les séries policières et les thrillers qui ont tenu des millions de spectateurs en haleine.",
    image:
      "/images/series-tv-topics/series-policieres-thrillers.jpg",
  },

  {
    slug: "fantasy-science-fiction",
    name: "Fantasy & Science-fiction",
    shortDescription:
      "Fantasy, science-fiction, super-héros et univers fantastiques.",
    seoTitle:
      "Quiz Séries Fantasy et Science-fiction gratuits",
    seoDescription:
      "Explore nos quiz sur les séries de fantasy, science-fiction, super-héros et univers fantastiques, des grandes sagas aux productions devenues cultes.",
    intro:
      "Mondes fantastiques, voyages dans le temps, super-héros, dystopies et science-fiction : explore les univers les plus spectaculaires et imaginatifs des séries télévisées.",
    image:
      "/images/series-tv-topics/fantasy-science-fiction.jpg",
  },

  {
    slug: "comedies-sitcoms",
    name: "Comédies & Sitcoms",
    shortDescription:
      "Sitcoms, séries humoristiques, familles cultes et comédies.",
    seoTitle:
      "Quiz Sitcoms et Séries Comiques gratuits",
    seoDescription:
      "Retrouve nos quiz sur les sitcoms et séries comiques : Friends, The Office, Modern Family et de nombreuses comédies qui ont marqué la télévision.",
    intro:
      "Répliques cultes, situations absurdes, familles mémorables et personnages hilarants : retrouve les sitcoms et séries comiques qui ont fait rire plusieurs générations.",
    image:
      "/images/series-tv-topics/comedies-sitcoms.jpg",
  },

  {
    slug: "series-par-pays",
    name: "Séries du monde",
    shortDescription:
      "Séries françaises, britanniques, belges, québécoises et internationales.",
    seoTitle:
      "Quiz Séries Françaises, Britanniques et du Monde",
    seoDescription:
      "Découvre nos quiz consacrés aux séries françaises, britanniques, belges, québécoises et aux productions télévisées venues du monde entier.",
    intro:
      "La télévision ne se résume pas aux séries américaines. Pars à la découverte des séries françaises, britanniques, belges, québécoises et des productions internationales qui ont marqué leur public.",
    image:
      "/images/series-tv-topics/series-par-pays.jpg",
  },

  {
    slug: "personnages-acteurs",
    name: "Personnages & Acteurs",
    shortDescription:
      "Personnages emblématiques, acteurs, couples et familles des séries TV.",
    seoTitle:
      "Quiz Personnages et Acteurs de Séries TV",
    seoDescription:
      "Teste tes connaissances sur les personnages et acteurs de séries TV : héros cultes, familles, couples, personnages détestés et interprètes incontournables.",
    intro:
      "Héros, méchants, couples, familles et acteurs emblématiques : découvre les personnages qui ont marqué les séries TV et les interprètes qui leur ont donné vie.",
    image:
      "/images/series-tv-topics/personnages-acteurs.jpg",
  },
];

export function getSeriesTvTopic(slug: string) {
  return seriesTvTopics.find(
    (topic) => topic.slug === slug,
  );
}