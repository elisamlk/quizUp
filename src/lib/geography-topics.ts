export type GeographyTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
   image: string;
};

export const geographyTopics: GeographyTopic[] = [
  {
    slug: "pays-capitales",
    name: "Pays & Capitales",
    shortDescription: "Pays, capitales et grandes nations du monde.",
    seoTitle: "Quiz Pays et Capitales gratuits en ligne",
    seoDescription:
      "Découvre nos quiz sur les pays et capitales du monde : Europe, Afrique, Asie, Amériques et Océanie, avec réponses et explications.",
    intro:
      "Explore les pays et capitales du monde à travers des quiz consacrés aux capitales célèbres, anciennes capitales, pays difficiles à reconnaître et grandes régions du globe.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "drapeaux-symboles",
    name: "Drapeaux & Symboles",
    shortDescription: "Drapeaux, emblèmes et symboles des pays.",
    seoTitle: "Quiz Drapeaux du Monde et Symboles",
    seoDescription:
      "Teste tes connaissances sur les drapeaux du monde, leurs couleurs, symboles et pays avec nos quiz de géographie gratuits.",
    intro:
      "Reconnais les drapeaux du monde, compare les emblèmes qui se ressemblent et découvre les symboles associés aux différents pays.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "villes-monuments",
    name: "Villes & Monuments",
    shortDescription: "Grandes villes, monuments et patrimoine.",
    seoTitle: "Quiz Villes et Monuments du Monde",
    seoDescription:
      "Découvre nos quiz sur les grandes villes, monuments, sites UNESCO et lieux emblématiques du monde.",
    intro:
      "Pars à la découverte des grandes villes, monuments célèbres, sites historiques et lieux emblématiques qui façonnent la géographie mondiale.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "fleuves-lacs-oceans",
    name: "Fleuves, Lacs & Océans",
    shortDescription: "Fleuves, lacs, mers, océans et détroits.",
    seoTitle: "Quiz Fleuves, Lacs et Océans",
    seoDescription:
      "Teste tes connaissances sur les fleuves, lacs, mers, océans et détroits du monde avec nos quiz de géographie.",
    intro:
      "Explore les grands fleuves, rivières, lacs, mers, océans et passages maritimes qui structurent la géographie de notre planète.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "reliefs-climats-nature",
    name: "Reliefs, Climats & Nature",
    shortDescription: "Montagnes, volcans, déserts et climats.",
    seoTitle: "Quiz Reliefs, Climats et Nature",
    seoDescription:
      "Découvre nos quiz sur les montagnes, volcans, déserts, glaciers, climats et grands reliefs du monde.",
    intro:
      "Montagnes, volcans, glaciers, déserts et climats : découvre les grands reliefs et phénomènes naturels qui façonnent notre planète.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "territoires-frontieres",
    name: "Territoires & Frontières",
    shortDescription: "Frontières, régions, États et territoires.",
    seoTitle: "Quiz Frontières, Régions et Territoires",
    seoDescription:
      "Teste tes connaissances sur les frontières, régions, États, provinces et territoires du monde.",
    intro:
      "Explore les frontières, régions, provinces, États et territoires qui composent les différentes organisations géographiques et politiques du monde.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },

  {
    slug: "monde-pays",
    name: "Monde & Pays",
    shortDescription: "Langues, monnaies, populations et particularités.",
    seoTitle: "Quiz Pays du Monde : langues, monnaies et géographie",
    seoDescription:
      "Découvre nos quiz sur les pays du monde, leurs langues, monnaies, populations, transports et nombreuses particularités géographiques.",
    intro:
      "Découvre les pays du monde sous tous leurs aspects : langues, monnaies, populations, transports, économie et nombreuses particularités géographiques.",
         image: "/images/geography-topics/pays-capitales.jpg",
  },
];

export function getGeographyTopic(slug: string) {
  return geographyTopics.find((topic) => topic.slug === slug);
}