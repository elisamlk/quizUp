export type SportTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
};

export const sportTopics: SportTopic[] = [
  {
    slug: "football",
    name: "Football",
    shortDescription:
      "Clubs, joueurs, sélections, compétitions et légendes du football.",
    seoTitle:
      "Quiz Football gratuits : clubs, joueurs et compétitions",
    seoDescription:
      "Découvre nos quiz football gratuits sur les grands clubs, joueurs célèbres, sélections nationales, compétitions européennes, entraîneurs et légendes du ballon rond.",
    intro:
      "Explore l'univers du football à travers des quiz consacrés aux grands clubs, joueurs mythiques, équipes nationales, entraîneurs, compétitions européennes et moments qui ont marqué l'histoire du ballon rond.",
    image:
      "/images/sport-topics/football.jpg",
  },

  {
    slug: "coupe-du-monde",
    name: "Coupe du Monde",
    shortDescription:
      "Éditions mythiques, champions, équipes, buteurs et records du Mondial.",
    seoTitle:
      "Quiz Coupe du Monde de Football gratuits",
    seoDescription:
      "Teste tes connaissances sur la Coupe du Monde de football : éditions historiques, équipes championnes, meilleurs buteurs, pays organisateurs, records et moments mythiques.",
    intro:
      "De la première Coupe du Monde en 1930 aux éditions les plus récentes, retrouve les champions, équipes, joueurs, buteurs, pays organisateurs et moments légendaires qui ont construit l'histoire du Mondial.",
    image:
      "/images/sport-topics/coupe-du-monde.jpg",
  },

  {
    slug: "jeux-olympiques",
    name: "Jeux Olympiques",
    shortDescription:
      "Champions, médailles, disciplines, villes hôtes et records olympiques.",
    seoTitle:
      "Quiz Jeux Olympiques gratuits : champions et records",
    seoDescription:
      "Découvre nos quiz sur les Jeux Olympiques : champions, médailles, records, disciplines, pays participants, villes hôtes et grandes performances olympiques.",
    intro:
      "Explore l'histoire des Jeux Olympiques à travers les champions, records, médailles, disciplines emblématiques, villes hôtes et performances qui ont marqué les Jeux d'été et d'hiver.",
    image:
      "/images/sport-topics/jeux-olympiques.jpg",
  },

  {
    slug: "tennis",
    name: "Tennis",
    shortDescription:
      "Grand Chelem, champions, matchs mythiques et grands records.",
    seoTitle:
      "Quiz Tennis gratuits : Grand Chelem et champions",
    seoDescription:
      "Teste tes connaissances sur le tennis avec nos quiz consacrés à Roland-Garros, Wimbledon, l'Open d'Australie, aux champions, records et matchs historiques.",
    intro:
      "Entre Roland-Garros, Wimbledon, Open d'Australie, champions légendaires et records historiques, découvre les grands tournois et les figures qui ont marqué l'histoire du tennis.",
    image:
      "/images/sport-topics/tennis.jpg",
  },

  {
    slug: "cyclisme",
    name: "Cyclisme",
    shortDescription:
      "Tour de France, Giro, Vuelta, champions et grandes courses.",
    seoTitle:
      "Quiz Cyclisme gratuits : Tour de France, Giro et Vuelta",
    seoDescription:
      "Découvre nos quiz cyclisme sur le Tour de France, le Giro d'Italia, la Vuelta, leurs vainqueurs, champions, grandes étapes et records historiques.",
    intro:
      "Parcours les grandes routes du cyclisme avec des quiz sur le Tour de France, le Giro d'Italia, la Vuelta, leurs vainqueurs, champions et moments marquants.",
    image:
      "/images/sport-topics/cyclisme.jpg",
  },

  {
    slug: "formule-1",
    name: "Formule 1",
    shortDescription:
      "Pilotes, écuries, champions, victoires et moments marquants.",
    seoTitle:
      "Quiz Formule 1 gratuits : pilotes, écuries et champions",
    seoDescription:
      "Teste tes connaissances sur la Formule 1 : pilotes légendaires, écuries, champions du monde, victoires, records et événements marquants de l'histoire de la F1.",
    intro:
      "Des premiers champions aux stars modernes, retrouve les pilotes, écuries, titres mondiaux, victoires, records et événements qui ont façonné l'histoire de la Formule 1.",
    image:
      "/images/sport-topics/formule-1.jpg",
  },

  {
    slug: "rugby",
    name: "Rugby",
    shortDescription:
      "Coupe du Monde, Six Nations, sélections, joueurs et records.",
    seoTitle:
      "Quiz Rugby gratuits : Coupe du Monde et Six Nations",
    seoDescription:
      "Découvre nos quiz rugby sur la Coupe du Monde, le Tournoi des Six Nations, les grandes sélections, joueurs emblématiques, records et champions.",
    intro:
      "Teste tes connaissances sur le rugby à travers la Coupe du Monde, le Tournoi des Six Nations, les grandes équipes nationales, joueurs emblématiques et records internationaux.",
    image:
      "/images/sport-topics/rugby.jpg",
  },

  {
    slug: "basketball",
    name: "Basketball",
    shortDescription:
      "NBA, champions, grandes équipes, joueurs et records du basket.",
    seoTitle:
      "Quiz Basketball et NBA gratuits",
    seoDescription:
      "Découvre nos quiz basketball sur la NBA, ses champions, joueurs légendaires, équipes historiques, finales et grands records du basket.",
    intro:
      "Entre NBA, finales mythiques, équipes historiques et joueurs légendaires, découvre les grands moments et champions qui ont façonné l'histoire du basketball.",
    image:
      "/images/sport-topics/basketball.jpg",
  },

  {
    slug: "champions-records",
    name: "Champions & Records",
    shortDescription:
      "Grands sportifs, exploits, records et carrières légendaires.",
    seoTitle:
      "Quiz Champions et Records sportifs",
    seoDescription:
      "Découvre nos quiz sur les plus grands champions, records sportifs, exploits historiques, carrières légendaires et performances exceptionnelles.",
    intro:
      "Retrouve les plus grands champions et performances de l'histoire du sport : records incroyables, carrières légendaires, exploits historiques et athlètes qui ont repoussé les limites.",
    image:
      "/images/sport-topics/champions-records.jpg",
  },
];

export function getSportTopic(slug: string) {
  return sportTopics.find(
    (topic) => topic.slug === slug,
  );
}