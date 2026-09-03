export type SouthAmericaCountry = {
  code: string;
  name: string;
  aliases: string[];
};

export const SOUTH_AMERICA_COUNTRIES: SouthAmericaCountry[] = [
  {
    code: "AR",
    name: "Argentine",
    aliases: [
      "Argentine",
      "Argentina",
    ],
  },

  {
    code: "BO",
    name: "Bolivie",
    aliases: [
      "Bolivie",
      "Bolivia",
    ],
  },

  {
    code: "BR",
    name: "Brésil",
    aliases: [
      "Brésil",
      "Bresil",
      "Brazil",
      "Brasil",
    ],
  },

  {
    code: "CL",
    name: "Chili",
    aliases: [
      "Chili",
      "Chile",
    ],
  },

  {
    code: "CO",
    name: "Colombie",
    aliases: [
      "Colombie",
      "Colombia",
    ],
  },

  {
    code: "EC",
    name: "Équateur",
    aliases: [
      "Équateur",
      "Equateur",
      "Ecuador",
    ],
  },

  {
    code: "GY",
    name: "Guyana",
    aliases: [
      "Guyana",
    ],
  },

  {
    code: "PY",
    name: "Paraguay",
    aliases: [
      "Paraguay",
    ],
  },

  {
    code: "PE",
    name: "Pérou",
    aliases: [
      "Pérou",
      "Perou",
      "Peru",
      "Perú",
    ],
  },

  {
    code: "SR",
    name: "Suriname",
    aliases: [
      "Suriname",
    ],
  },

  {
    code: "UY",
    name: "Uruguay",
    aliases: [
      "Uruguay",
    ],
  },

  {
    code: "VE",
    name: "Venezuela",
    aliases: [
      "Venezuela",
    ],
  },
];

export const SOUTH_AMERICA_COUNTRY_CODES =
  SOUTH_AMERICA_COUNTRIES.map(
    (country) => country.code
  );

export const SOUTH_AMERICA_TOTAL_COUNTRIES =
  SOUTH_AMERICA_COUNTRIES.length;