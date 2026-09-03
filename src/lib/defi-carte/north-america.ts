export type NorthAmericaCountry = {
  code: string;
  name: string;
  aliases: string[];
};

export const NORTH_AMERICA_COUNTRIES: NorthAmericaCountry[] = [
  {
    code: "CA",
    name: "Canada",
    aliases: [
      "Canada",
    ],
  },

  {
    code: "US",
    name: "États-Unis",
    aliases: [
      "États-Unis",
      "Etats-Unis",
      "États Unis",
      "Etats Unis",
      "USA",
      "United States",
      "United States of America",
      "Amérique",
      "Amerique",
    ],
  },

  {
    code: "MX",
    name: "Mexique",
    aliases: [
      "Mexique",
      "Mexico",
    ],
  },

  {
    code: "BZ",
    name: "Belize",
    aliases: [
      "Belize",
    ],
  },

  {
    code: "CR",
    name: "Costa Rica",
    aliases: [
      "Costa Rica",
      "Costa-Rica",
    ],
  },

  {
    code: "SV",
    name: "Salvador",
    aliases: [
      "Salvador",
      "El Salvador",
    ],
  },

  {
    code: "GT",
    name: "Guatemala",
    aliases: [
      "Guatemala",
    ],
  },

  {
    code: "HN",
    name: "Honduras",
    aliases: [
      "Honduras",
    ],
  },

  {
    code: "NI",
    name: "Nicaragua",
    aliases: [
      "Nicaragua",
    ],
  },

  {
    code: "PA",
    name: "Panama",
    aliases: [
      "Panama",
      "Panamá",
    ],
  },

  {
    code: "AG",
    name: "Antigua-et-Barbuda",
    aliases: [
      "Antigua-et-Barbuda",
      "Antigua et Barbuda",
      "Antigua & Barbuda",
      "Antigua and Barbuda",
    ],
  },

  {
    code: "BS",
    name: "Bahamas",
    aliases: [
      "Bahamas",
      "Les Bahamas",
    ],
  },

  {
    code: "BB",
    name: "Barbade",
    aliases: [
      "Barbade",
      "Barbados",
    ],
  },

  {
    code: "CU",
    name: "Cuba",
    aliases: [
      "Cuba",
    ],
  },

  {
    code: "DM",
    name: "Dominique",
    aliases: [
      "Dominique",
      "Dominica",
      "Commonwealth de Dominique",
    ],
  },

  {
    code: "DO",
    name: "République dominicaine",
    aliases: [
      "République dominicaine",
      "Republique dominicaine",
      "Dominican Republic",
    ],
  },

  {
    code: "GD",
    name: "Grenade",
    aliases: [
      "Grenade",
      "Grenada",
    ],
  },

  {
    code: "HT",
    name: "Haïti",
    aliases: [
      "Haïti",
      "Haiti",
    ],
  },

  {
    code: "JM",
    name: "Jamaïque",
    aliases: [
      "Jamaïque",
      "Jamaique",
      "Jamaica",
    ],
  },

  {
    code: "KN",
    name: "Saint-Christophe-et-Niévès",
    aliases: [
      "Saint-Christophe-et-Niévès",
      "Saint Christophe et Niévès",
      "Saint Christophe et Nieves",
      "Saint-Kitts-et-Nevis",
      "Saint Kitts et Nevis",
      "Saint Kitts and Nevis",
      "Saint Kitts",
    ],
  },

  {
    code: "LC",
    name: "Sainte-Lucie",
    aliases: [
      "Sainte-Lucie",
      "Sainte Lucie",
      "Saint Lucia",
    ],
  },

  {
    code: "VC",
    name: "Saint-Vincent-et-les-Grenadines",
    aliases: [
      "Saint-Vincent-et-les-Grenadines",
      "Saint Vincent et les Grenadines",
      "Saint-Vincent et les Grenadines",
      "Saint Vincent and the Grenadines",
      "Saint Vincent",
    ],
  },

  {
    code: "TT",
    name: "Trinité-et-Tobago",
    aliases: [
      "Trinité-et-Tobago",
      "Trinite-et-Tobago",
      "Trinité et Tobago",
      "Trinite et Tobago",
      "Trinidad-et-Tobago",
      "Trinidad et Tobago",
      "Trinidad and Tobago",
    ],
  },
];

export const NORTH_AMERICA_COUNTRY_CODES =
  NORTH_AMERICA_COUNTRIES.map(
    (country) => country.code
  );

export const NORTH_AMERICA_TOTAL_COUNTRIES =
  NORTH_AMERICA_COUNTRIES.length;