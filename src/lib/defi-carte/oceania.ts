export type OceaniaCountry = {
  code: string;
  name: string;
  aliases: string[];
};

export const OCEANIA_COUNTRIES: OceaniaCountry[] = [
  {
    code: "AU",
    name: "Australie",
    aliases: [
      "Australie",
      "Australia",
    ],
  },
  {
    code: "FJ",
    name: "Fidji",
    aliases: [
      "Fidji",
      "Fiji",
      "Îles Fidji",
      "Iles Fidji",
    ],
  },
  {
    code: "KI",
    name: "Kiribati",
    aliases: [
      "Kiribati",
    ],
  },
  {
    code: "MH",
    name: "Îles Marshall",
    aliases: [
      "Îles Marshall",
      "Iles Marshall",
      "Marshall",
      "Marshall Islands",
    ],
  },
  {
    code: "FM",
    name: "Micronésie",
    aliases: [
      "Micronésie",
      "Micronesie",
      "États fédérés de Micronésie",
      "Etats federes de Micronesie",
      "Micronesia",
    ],
  },
  {
    code: "NR",
    name: "Nauru",
    aliases: [
      "Nauru",
    ],
  },
  {
    code: "NZ",
    name: "Nouvelle-Zélande",
    aliases: [
      "Nouvelle-Zélande",
      "Nouvelle Zelande",
      "New Zealand",
    ],
  },
  {
    code: "PW",
    name: "Palaos",
    aliases: [
      "Palaos",
      "Palau",
    ],
  },
  {
    code: "PG",
    name: "Papouasie-Nouvelle-Guinée",
    aliases: [
      "Papouasie-Nouvelle-Guinée",
      "Papouasie Nouvelle Guinée",
      "Papouasie Nouvelle Guinee",
      "Papouasie",
      "Papua New Guinea",
    ],
  },
  {
    code: "WS",
    name: "Samoa",
    aliases: [
      "Samoa",
    ],
  },
  {
    code: "SB",
    name: "Îles Salomon",
    aliases: [
      "Îles Salomon",
      "Iles Salomon",
      "Salomon",
      "Solomon Islands",
    ],
  },
  {
    code: "TO",
    name: "Tonga",
    aliases: [
      "Tonga",
    ],
  },
  {
    code: "TV",
    name: "Tuvalu",
    aliases: [
      "Tuvalu",
    ],
  },
  {
    code: "VU",
    name: "Vanuatu",
    aliases: [
      "Vanuatu",
    ],
  },
];

export const OCEANIA_COUNTRY_CODES =
  OCEANIA_COUNTRIES.map(
    (country) => country.code
  );

export const OCEANIA_TOTAL_COUNTRIES =
  OCEANIA_COUNTRIES.length;