// export const categoriesMeta = {
//   "culture-generale": {
//     image: "/images/categories/culture-generale.jpg",
//   },
//   "geographie": {
//     image: "/images/categories/geographie.jpg",
//   },
//   "histoire": {
//     image: "/images/categories/histoire.jpg",
//   },
// };

export type CategoriesMeta = {
  image: string;
  seoTitle?: string;
  seoDescription?: string;
  intro?: string; // texte visible sur la page
  faqs?: Array<{ q: string; a: string }>;
};

export const categoriesMeta: Record<string, CategoriesMeta> = {
  "culture-generale": {
    image: "/images/categories/culture-generale.jpg",
    seoTitle:
      "Quiz Culture Générale Gratuit : Testez vos connaissances avec plus de 200 questions",

    seoDescription:
      "Découvrez nos quiz de culture générale gratuits en 20 questions. Testez vos connaissances en histoire, géographie, sciences, sport, cinéma et plus.",

    intro:
      "Découvrez nos quiz de culture générale gratuits et testez vos connaissances sur l'histoire, la géographie, les sciences, le cinéma, le sport et bien d'autres thèmes. Chaque quiz comprend 20 questions variées pour apprendre, progresser et relever de nouveaux défis tout en vous amusant.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz de culture générale ?",
        a: "Un quiz de culture générale permet de tester ses connaissances sur de nombreux sujets comme l'histoire, la géographie, les sciences, la littérature, le cinéma, le sport ou encore les grandes découvertes.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz de culture générale contient 20 questions variées afin d'offrir un défi accessible, ludique et instructif pour tous les niveaux.",
      },
      {
        q: "Les quiz de culture générale sont-ils gratuits ?",
        a: "Oui, tous les quiz de culture générale proposés sur notre site sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Comment améliorer sa culture générale ?",
        a: "Pratiquer régulièrement des quiz, découvrir de nouveaux sujets et lire les explications après chaque réponse sont d'excellents moyens d'enrichir ses connaissances et de progresser rapidement.",
      },
    ],
  },
  geographie: {
    image: "/images/categories/geographie.jpg",

    seoTitle:
      "Quiz Géographie Gratuit : Testez vos connaissances sur les pays, capitales et continents",

    seoDescription:
      "Découvrez nos quiz de géographie gratuits en 20 questions. Testez vos connaissances sur les pays, capitales, continents et monuments.",

    intro:
      "Explorez le monde avec nos quiz de géographie gratuits. Testez vos connaissances sur les pays, les capitales, les continents, les océans, les drapeaux, les montagnes et les monuments célèbres. Chaque quiz comprend 20 questions variées pour apprendre de nouvelles informations tout en vous amusant et découvrir les merveilles de notre planète.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz de géographie ?",
        a: "Un quiz de géographie permet de tester ses connaissances sur les pays, les capitales, les continents, les océans, les frontières, les reliefs et les lieux célèbres du monde.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz de géographie contient 20 questions variées afin de proposer un défi accessible et enrichissant pour tous les niveaux.",
      },
      {
        q: "Les quiz de géographie sont-ils gratuits ?",
        a: "Oui, tous nos quiz de géographie sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Comment progresser en géographie ?",
        a: "Pratiquer régulièrement des quiz, mémoriser les capitales, repérer les pays sur une carte et découvrir de nouvelles régions du monde permet d'améliorer rapidement ses connaissances.",
      },
    ],
  },

  histoire: {
    image: "/images/categories/histoire.jpg",

    seoTitle:
      "Quiz Histoire Gratuit : Testez vos connaissances sur les civilisations et grands événements",

    seoDescription:
      "Découvrez nos quiz d'histoire gratuits en 20 questions. Testez vos connaissances sur les civilisations, personnages et événements historiques.",

    intro:
      "Plongez dans le passé avec nos quiz d'histoire gratuits. Explorez les grandes civilisations, les personnages célèbres, les empires, les découvertes, les révolutions et les événements qui ont marqué l'histoire du monde. Chaque quiz comprend 20 questions variées pour apprendre, réviser ses connaissances et relever de nouveaux défis à travers les différentes époques.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz d'histoire ?",
        a: "Un quiz d'histoire permet de tester ses connaissances sur les grandes périodes historiques, les civilisations, les personnages célèbres et les événements marquants du passé.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz d'histoire contient 20 questions variées afin de proposer un défi accessible et enrichissant pour tous les niveaux.",
      },
      {
        q: "Les quiz d'histoire sont-ils gratuits ?",
        a: "Oui, tous nos quiz d'histoire sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz d'histoire ?",
        a: "Nos quiz peuvent porter sur l'Antiquité, le Moyen Âge, les grandes civilisations, les guerres, les empires, les personnages historiques ou encore les événements qui ont marqué le monde.",
      },
    ],
  },

  sport: {
    image: "/images/categories/sport.jpg",

    seoTitle:
      "Quiz Sport Gratuit : Testez vos connaissances sur le football, les JO et les champions",

    seoDescription:
      "Découvrez nos quiz sport gratuits en 20 questions. Testez vos connaissances sur le football, les JO, les records et les champions.",

    intro:
      "Testez vos connaissances avec nos quiz sport gratuits. Football, tennis, basketball, Jeux olympiques, records, compétitions et grands champions : explorez l'univers du sport à travers des quiz variés de 20 questions. Que vous soyez passionné ou simple amateur, relevez le défi et découvrez de nombreuses anecdotes sur les événements et sportifs qui ont marqué l'histoire.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz sport ?",
        a: "Un quiz sport permet de tester ses connaissances sur les disciplines sportives, les compétitions, les records, les équipes et les grands champions.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz sport contient 20 questions variées afin de proposer un défi amusant et accessible à tous les passionnés de sport.",
      },
      {
        q: "Les quiz sport sont-ils gratuits ?",
        a: "Oui, tous nos quiz sport sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sports sont abordés dans les quiz ?",
        a: "Nos quiz peuvent porter sur le football, le tennis, le basketball, les Jeux olympiques, la Formule 1, le cyclisme et de nombreux autres sports populaires.",
      },
    ],
  },
  nature: {
    image: "/images/categories/nature.jpg",

    seoTitle:
      "Quiz Nature Gratuit : Testez vos connaissances sur les animaux, plantes et écosystèmes",

    seoDescription:
      "Découvrez nos quiz nature gratuits en 20 questions. Testez vos connaissances sur les animaux, plantes et merveilles du monde.",

    intro:
      "Explorez le monde vivant avec nos quiz nature gratuits. Découvrez des questions sur les animaux, les plantes, les océans, les forêts, les montagnes et les écosystèmes qui composent notre planète. Chaque quiz comprend 20 questions variées pour apprendre de nouvelles choses sur la biodiversité et les merveilles de la nature tout en vous amusant.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz nature ?",
        a: "Un quiz nature permet de tester ses connaissances sur les animaux, les plantes, les habitats naturels, les écosystèmes et les phénomènes du monde vivant.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz nature contient 20 questions variées afin d'offrir un défi ludique et éducatif pour tous les amoureux de la nature.",
      },
      {
        q: "Les quiz nature sont-ils gratuits ?",
        a: "Oui, tous nos quiz nature sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz nature ?",
        a: "Nos quiz peuvent porter sur les animaux sauvages, les plantes, les océans, les forêts, les montagnes, la biodiversité et les merveilles naturelles du monde.",
      },
    ],
  },

  sciences: {
    image: "/images/categories/sciences.jpg",

    seoTitle:
      "Quiz Sciences Gratuit : Testez vos connaissances en physique, chimie et biologie",

    seoDescription:
      "Découvrez nos quiz sciences gratuits en 20 questions. Testez vos connaissances en physique, chimie, biologie et astronomie.",

    intro:
      "Explorez le monde fascinant des sciences avec nos quiz gratuits. Physique, chimie, biologie, astronomie, inventions et découvertes scientifiques : mettez vos connaissances à l'épreuve à travers des quiz de 20 questions variées. Une façon ludique d'apprendre, de réviser et de découvrir les phénomènes qui expliquent le fonctionnement de notre univers.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz sciences ?",
        a: "Un quiz sciences permet de tester ses connaissances sur la physique, la chimie, la biologie, l'astronomie et les grandes découvertes scientifiques.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz sciences contient 20 questions variées afin de proposer un défi enrichissant et accessible à tous les niveaux.",
      },
      {
        q: "Les quiz sciences sont-ils gratuits ?",
        a: "Oui, tous nos quiz sciences sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz sciences ?",
        a: "Nos quiz peuvent porter sur les lois de la physique, les réactions chimiques, le corps humain, l'espace, les inventions et les découvertes qui ont marqué l'histoire des sciences.",
      },
    ],
  },

  cinema: {
    image: "/images/categories/cinema.jpg",

    seoTitle:
      "Quiz Cinéma Gratuit : Testez vos connaissances sur les films, acteurs et réalisateurs",

    seoDescription:
      "Découvrez nos quiz cinéma gratuits en 20 questions. Testez vos connaissances sur les films, acteurs, réalisateurs et scènes cultes.",

    intro:
      "Plongez dans l'univers du septième art avec nos quiz cinéma gratuits. Films cultes, acteurs célèbres, réalisateurs, personnages emblématiques, récompenses et anecdotes de tournage : mettez vos connaissances à l'épreuve à travers des quiz de 20 questions variées. Que vous soyez cinéphile ou amateur de grands classiques, relevez le défi et découvrez de nombreuses références du monde du cinéma.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz cinéma ?",
        a: "Un quiz cinéma permet de tester ses connaissances sur les films, les acteurs, les réalisateurs, les personnages célèbres et les grands moments de l'histoire du cinéma.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz cinéma contient 20 questions variées afin de proposer un défi amusant et accessible à tous les passionnés de films.",
      },
      {
        q: "Les quiz cinéma sont-ils gratuits ?",
        a: "Oui, tous nos quiz cinéma sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz cinéma ?",
        a: "Nos quiz peuvent porter sur les films cultes, les acteurs, les réalisateurs, les récompenses, les sagas célèbres et les scènes qui ont marqué l'histoire du cinéma.",
      },
    ],
  },

  musique: {
    image: "/images/categories/musique.jpg",

    seoTitle:
      "Quiz Musique Gratuit : Testez vos connaissances sur les chansons, artistes et albums",

    seoDescription:
      "Découvrez nos quiz musique gratuits en 20 questions. Testez vos connaissances sur les chansons, artistes, albums et genres musicaux.",

    intro:
      "Plongez dans l'univers de la musique avec nos quiz gratuits. Chansons cultes, artistes célèbres, albums incontournables, groupes légendaires et genres musicaux variés : mettez vos connaissances à l'épreuve à travers des quiz de 20 questions. Que vous soyez passionné de pop, rock, rap, jazz ou musique classique, relevez le défi et découvrez de nombreuses anecdotes musicales.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz musique ?",
        a: "Un quiz musique permet de tester ses connaissances sur les chansons, les artistes, les albums, les groupes et les différents genres musicaux.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz musique contient 20 questions variées afin de proposer un défi divertissant et accessible à tous les amateurs de musique.",
      },
      {
        q: "Les quiz musique sont-ils gratuits ?",
        a: "Oui, tous nos quiz musique sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz musique ?",
        a: "Nos quiz peuvent porter sur les chansons célèbres, les artistes, les groupes, les albums mythiques, les genres musicaux et les grands moments de l'histoire de la musique.",
      },
    ],
  },

  "serie-tv": {
    image: "/images/categories/serie.jpg",

    seoTitle:
      "Quiz Séries TV Gratuit : Testez vos connaissances sur les séries et personnages cultes",

    seoDescription:
      "Découvrez nos quiz séries TV gratuits en 20 questions. Testez vos connaissances sur les séries, personnages et épisodes cultes.",

    intro:
      "Testez vos connaissances sur les séries TV avec nos quiz gratuits. Séries cultes, personnages emblématiques, épisodes marquants, intrigues mémorables et anecdotes de tournage : relevez le défi à travers des quiz de 20 questions variées. Des grands classiques aux séries les plus récentes, découvrez de nombreux défis pour les passionnés du petit écran.",

    faqs: [
      {
        q: "Qu'est-ce qu'un quiz séries TV ?",
        a: "Un quiz séries TV permet de tester ses connaissances sur les séries populaires, les personnages, les épisodes, les acteurs et les univers qui ont marqué les téléspectateurs.",
      },
      {
        q: "Combien de questions contient chaque quiz ?",
        a: "Chaque quiz séries TV contient 20 questions variées afin de proposer un défi amusant et accessible à tous les fans de séries.",
      },
      {
        q: "Les quiz séries TV sont-ils gratuits ?",
        a: "Oui, tous nos quiz séries TV sont entièrement gratuits et accessibles en ligne sans inscription.",
      },
      {
        q: "Quels sujets sont abordés dans les quiz séries TV ?",
        a: "Nos quiz peuvent porter sur les séries cultes, les personnages emblématiques, les épisodes marquants, les acteurs et les univers les plus populaires du petit écran.",
      },
    ],
  },
};
