export type CinemaTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
};

export const cinemaTopics: CinemaTopic[] = [
  {
    slug: "films-cultes",
    name: "Films cultes",
    shortDescription:
      "Les grands classiques et films incontournables qui ont marqué l'histoire du cinéma.",
    seoTitle:
      "Quiz Films Cultes : classiques et grands films du cinéma",
    seoDescription:
      "Découvre nos quiz sur les films cultes et les grands classiques du cinéma : œuvres incontournables, scènes mémorables, répliques célèbres et films devenus légendaires.",
    intro:
      "Titanic, Forrest Gump, Gladiator, Inception, Shining, La La Land et bien d'autres : retrouve les films qui ont marqué des générations de spectateurs. Teste tes connaissances sur les grands classiques, les scènes mémorables, les personnages emblématiques et les œuvres devenues incontournables.",
    image: "/images/cinema-topics/films-cultes.jpg",
  },

  {
    slug: "sagas-cultes",
    name: "Sagas cultes",
    shortDescription:
      "Harry Potter, Jurassic Park, Indiana Jones et les grandes franchises du cinéma.",
    seoTitle:
      "Quiz Sagas Cultes : grandes franchises et séries de films",
    seoDescription:
      "Teste tes connaissances sur les plus grandes sagas du cinéma : Harry Potter, Jurassic Park, Indiana Jones, Rocky, Spider-Man, Pirates des Caraïbes et bien d'autres.",
    intro:
      "Suites, trilogies, univers étendus et franchises devenues mythiques : explore les grandes sagas du cinéma à travers leurs personnages, leurs histoires et leurs moments cultes. De Harry Potter à Jurassic Park en passant par Indiana Jones, retrouve les séries de films qui ont passionné des millions de spectateurs.",
    image: "/images/cinema-topics/sagas-cultes.jpg",
  },

  {
    slug: "cinema-par-decennies",
    name: "Cinéma par décennies",
    shortDescription:
      "Années 70, 80, 90, 2000 et 2010 : les films qui ont marqué chaque époque.",
    seoTitle:
      "Quiz Cinéma par Décennies : années 70, 80, 90, 2000 et 2010",
    seoDescription:
      "Parcours l'histoire récente du cinéma avec nos quiz sur les films des années 70, 80, 90, 2000 et 2010 et retrouve les grands succès de chaque décennie.",
    intro:
      "Chaque décennie possède ses films emblématiques, ses stars et ses tendances. Des années 70 aux années 2010, redécouvre les œuvres qui ont marqué leur époque et teste ta mémoire sur plusieurs générations de cinéma.",
    image: "/images/cinema-topics/cinema-par-decennies.jpg",
  },

  {
    slug: "cinema-francais",
    name: "Cinéma français",
    shortDescription:
      "Comédies, classiques, acteurs et films incontournables du cinéma français.",
    seoTitle:
      "Quiz Cinéma Français : films, acteurs et grands classiques",
    seoDescription:
      "Découvre nos quiz sur le cinéma français : comédies cultes, grands films, acteurs et actrices célèbres, répliques mythiques et œuvres incontournables.",
    intro:
      "De La Grande Vadrouille à Amélie Poulain, le cinéma français a produit de nombreuses œuvres devenues cultes. Explore ses comédies, ses acteurs, ses actrices, ses grands succès et les films qui ont marqué plusieurs générations.",
    image: "/images/cinema-topics/cinema-francais.jpg",
  },

  {
    slug: "acteurs-actrices",
    name: "Acteurs & Actrices",
    shortDescription:
      "Stars du cinéma, castings, transformations et carrières d'acteurs célèbres.",
    seoTitle:
      "Quiz Acteurs et Actrices de Cinéma : stars, rôles et castings",
    seoDescription:
      "Teste tes connaissances sur les acteurs et actrices de cinéma : stars internationales, rôles célèbres, castings, transformations physiques et carrières marquantes.",
    intro:
      "Acteurs français, britanniques, canadiens ou américains, rôles refusés, transformations spectaculaires et personnages emblématiques : découvre les carrières et anecdotes des stars qui ont marqué le grand écran.",
    image: "/images/cinema-topics/acteurs-actrices.jpg",
  },

  {
    slug: "acteurs-personnages",
    name: "Personnages de cinéma",
    shortDescription:
      "Héros, méchants et personnages emblématiques du grand écran.",
    seoTitle:
      "Quiz Personnages de Cinéma : héros, méchants et personnages cultes",
    seoDescription:
      "Retrouve nos quiz sur les personnages de cinéma : héros célèbres, grands méchants, personnages Marvel et figures emblématiques des films cultes.",
    intro:
      "Héros, anti-héros, méchants, tueurs, personnages Marvel et figures inoubliables : teste tes connaissances sur celles et ceux qui ont donné leur identité aux plus grands films du cinéma.",
    image: "/images/cinema-topics/acteurs-personnages.jpg",
  },

  {
    slug: "science-fiction-fantastique",
    name: "Science-fiction & Fantastique",
    shortDescription:
      "Science-fiction, fantasy, mondes imaginaires et univers futuristes.",
    seoTitle:
      "Quiz Science-fiction et Fantastique : films et univers cultes",
    seoDescription:
      "Découvre nos quiz sur les films de science-fiction et fantastiques : Star Wars, Dune, Alien, Terminator, Avatar, Retour vers le futur et grands univers imaginaires.",
    intro:
      "Voyages dans le temps, mondes extraterrestres, futurs dystopiques, créatures fantastiques et grandes sagas : explore les univers de science-fiction et de fantasy qui ont repoussé les limites de l'imagination au cinéma.",
    image: "/images/cinema-topics/science-fiction-fantastique.jpg",
  },

  {
    slug: "realisateurs-cinema",
    name: "Réalisateurs cultes",
    shortDescription:
      "Nolan, Tarantino et les grands réalisateurs qui ont façonné le cinéma.",
    seoTitle:
      "Quiz Réalisateurs de Cinéma : Nolan, Tarantino et grands cinéastes",
    seoDescription:
      "Teste tes connaissances sur les grands réalisateurs de cinéma, leurs films, leurs styles et leurs carrières, de Christopher Nolan à Quentin Tarantino.",
    intro:
      "Christopher Nolan, Quentin Tarantino et d'autres grands cinéastes ont imposé leur style et marqué l'histoire du cinéma. Retrouve leurs films, leurs thèmes, leurs signatures visuelles et les œuvres qui ont construit leur réputation.",
    image: "/images/cinema-topics/realisateurs-cinema.jpg",
  },

  {
    slug: "oscars-recompenses",
    name: "Oscars & Récompenses",
    shortDescription:
      "Oscars, Cannes, films récompensés et grandes cérémonies du cinéma.",
    seoTitle:
      "Quiz Oscars et Récompenses Cinéma : Cannes et films primés",
    seoDescription:
      "Teste tes connaissances sur les Oscars, le Festival de Cannes et les grandes récompenses du cinéma : films primés, cérémonies, scandales et palmarès célèbres.",
    intro:
      "Oscars, Festival de Cannes, films primés, cérémonies mémorables et scandales : retrouve les récompenses qui consacrent chaque année les grands films, acteurs, actrices et réalisateurs du cinéma mondial.",
    image: "/images/cinema-topics/oscars-recompenses.jpg",
  },

  {
    slug: "animation-disney",
    name: "Animation & Disney",
    shortDescription:
      "Disney, Pixar et les grands classiques du cinéma d'animation.",
    seoTitle:
      "Quiz Disney et Films d'Animation : Pixar et grands classiques",
    seoDescription:
      "Découvre nos quiz sur Disney, Pixar et les grands films d'animation : classiques, personnages emblématiques et univers qui ont marqué plusieurs générations.",
    intro:
      "Disney, Pixar et les grands films d'animation occupent une place unique dans l'histoire du cinéma. Retrouve les classiques, personnages, studios et univers animés qui ont fait rêver plusieurs générations.",
    image: "/images/cinema-topics/animation-disney.jpg",
  },
];

export function getCinemaTopic(
  slug: string,
): CinemaTopic | undefined {
  return cinemaTopics.find(
    (topic) => topic.slug === slug,
  );
}