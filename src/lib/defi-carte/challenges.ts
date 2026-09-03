export type MapChallenge = {
  slug: string;
  name: string;
  title: string;
  description: string;
  totalCountries: number;
  duration: number;
  image: string;
  available: boolean;
};

/* ==========================================================
   DÉFIS CARTE
========================================================== */

export const MAP_CHALLENGES: MapChallenge[] = [
  {
    slug: "europe",

    name: "Europe",

    title:
      "Défi Carte Europe - Nomme tous les pays d'Europe",

    description:
      "Retrouve les 46 pays d'Europe avant la fin du chrono.",

    totalCountries: 46,

    duration: 5 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442380/europe_qbcupt.jpg",

    available: true,
  },

  {
    slug: "afrique",

    name: "Afrique",

    title:
      "Défi Carte Afrique - Nomme les 54 pays",

    description:
      "Retrouve les 54 pays du continent africain avant la fin du chrono.",

    totalCountries: 54,

    duration: 6 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442617/africa_xod2dr.jpg",

    available: true,
  },

  {
    slug: "asie",

    name: "Asie",

    title:
      "Défi Carte Asie - Retrouve les pays d'Asie",

    description:
      "Teste tes connaissances et tente de retrouver les pays d'Asie avant la fin du chrono.",

    totalCountries: 48,

    duration: 7 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442160/asia_momlje.jpg",

    available: true,
  },

  {
    slug: "amerique-du-nord",

    name: "Amérique du Nord",

    title:
      "Défi Carte Amérique du Nord - Nomme les 23 pays",

    description:
      "Retrouve les 23 pays d'Amérique du Nord, d'Amérique centrale et des Caraïbes.",

    totalCountries: 23,

    duration: 5 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788441712/north-america_l5zjtn.jpg",

    available: true,
  },

  {
    slug: "amerique-du-sud",

    name: "Amérique du Sud",

    title:
      "Défi Carte Amérique du Sud - Nomme les 12 pays",

    description:
      "Retrouve les 12 pays d'Amérique du Sud avant la fin du chrono.",

    totalCountries: 12,

    duration: 4 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788439882/south-america_aywknj.jpg",

    available: true,
  },

  {
    slug: "oceanie",

    name: "Océanie",

    title:
      "Défi Carte Océanie - Nomme les 14 pays",

    description:
      "Retrouve les 14 pays d'Océanie avant la fin du chrono.",

    totalCountries: 14,

    duration: 4 * 60,

    image:
      "https://res.cloudinary.com/dsv7oziap/image/upload/v1788442484/oceanie_rnjkf2.jpg",

    available: true,
  },

  /* ========================================================
     PROCHAINS DÉFIS
  ======================================================== */

  // {
  //   slug: "etats-unis",

  //   name: "États-Unis",

  //   title:
  //     "Défi Carte États-Unis - Retrouve les 50 États",

  //   description:
  //     "De la Californie au Maine, retrouve les 50 États américains.",

  //   totalCountries: 50,

  //   duration: 6 * 60,

  //   image:
  //     "/images/defi-carte-usa.jpg",

  //   available: false,
  // },

  // {
  //   slug: "departements-france",

  //   name: "Départements français",

  //   title:
  //     "Défi Carte - Les départements français",

  //   description:
  //     "Teste ta connaissance de la France et retrouve ses départements.",

  //   totalCountries: 0,

  //   duration: 0,

  //   image:
  //     "/images/defi-carte-departements.jpg",

  //   available: false,
  // },

  // {
  //   slug: "regions-france",

  //   name: "Régions françaises",

  //   title:
  //     "Défi Carte - Les régions françaises",

  //   description:
  //     "Sauras-tu retrouver toutes les régions françaises sur la carte ?",

  //   totalCountries: 0,

  //   duration: 0,

  //   image:
  //     "/images/defi-carte-regions.jpg",

  //   available: false,
  // },
];

/* ==========================================================
   HELPERS
========================================================== */

export function getMapChallenge(
  slug: string
): MapChallenge | undefined {
  return MAP_CHALLENGES.find(
    (challenge) => challenge.slug === slug
  );
}

export function getAvailableMapChallenges(): MapChallenge[] {
  return MAP_CHALLENGES.filter(
    (challenge) => challenge.available
  );
}

export function getRelatedMapChallenges(
  currentSlug: string
): MapChallenge[] {
  return MAP_CHALLENGES.filter(
    (challenge) =>
      challenge.available &&
      challenge.slug !== currentSlug
  );
}

/* ==========================================================
   FORMATAGE DU TEMPS
========================================================== */

export function formatChallengeDuration(
  duration: number
): string {
  if (duration <= 0) {
    return "À venir";
  }

  const minutes = Math.floor(
    duration / 60
  );

  return `${minutes} min`;
}