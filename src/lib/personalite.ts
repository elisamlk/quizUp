import fs from "node:fs";
import path from "node:path";

/* =========================================================
   TYPES — TESTS DE PERSONNALITÉ
   ========================================================= */

export type PersonalityProfile = {
  key: string;
  title: string;
  description: string;
  emoji?: string;
  image?: string;
};

export type PersonalityQuestionAnswer = {
  label: string;
  scores: Record<string, number>;
};

export type PersonalityQuestion = {
  id: string;
  question: string;
  image?: string | null;
  imagePrompt?: string | null;
  answers: PersonalityQuestionAnswer[];
  explanation?: string;
};

export type PersonalityTest = {
  descriptionSeo: string;
  slug: string;
  title: string;
  description?: string;

  category: {
    name: string;
    slug: string;
  };

  createdAt?: string;
  isNew?: boolean;
  isPopular?: boolean;

  images?: {
    thumbnail?: string;
    cover?: string;
    alt?: string;
  };

  profiles: PersonalityProfile[];
  questions: PersonalityQuestion[];
};

/* =========================================================
   TYPES — CATÉGORIES
   ========================================================= */

export type PersonalityCategory = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
};

/* =========================================================
   CATÉGORIES DE TESTS DE PERSONNALITÉ
   ========================================================= */

export const personalityCategories: PersonalityCategory[] = [
  {
    slug: "amitie",
    name: "Amitié",

    shortDescription:
      "Relations amicales, confiance, compatibilité et comportements entre amis.",

    seoTitle:
      "Tests d'amitié gratuits : découvre ton profil en amitié",

    seoDescription:
      "Découvre nos tests d'amitié gratuits et explore ta façon de vivre tes relations amicales : confiance, jalousie, compatibilité, conflits et comportements entre amis.",

    intro:
      "Quelle place occupes-tu dans tes amitiés ? Explore ta manière de faire confiance, de gérer les conflits, la jalousie, la distance ou les nouvelles rencontres grâce à nos tests consacrés aux relations amicales.",

    image:
      "/images/personnalite-categories/amitie.jpg",
  },

  {
    slug: "amour",
    name: "Amour",

    shortDescription:
      "Sentiments, relations amoureuses, compatibilité et vie de couple.",

    seoTitle:
      "Tests d'amour gratuits : sentiments, couple et compatibilité",

    seoDescription:
      "Fais nos tests d'amour gratuits sur les sentiments, les relations de couple, l'attachement, la compatibilité et les comportements amoureux.",

    intro:
      "Amour, attachement, séduction, couple ou compatibilité : nos tests te placent face à des situations concrètes pour explorer ta manière d'aimer, de t'attacher et de vivre tes relations sentimentales.",

    image:
      "/images/personnalite-categories/amour.jpg",
  },

  {
    slug: "argent",
    name: "Argent",

    shortDescription:
      "Rapport à l'argent, dépenses, économies et décisions financières.",

    seoTitle:
      "Tests sur l'argent : quel est ton rapport à l'argent ?",

    seoDescription:
      "Découvre ton rapport à l'argent avec nos tests gratuits sur les dépenses, l'épargne, les achats, les décisions financières et tes habitudes au quotidien.",

    intro:
      "Économe, dépensier, prudent ou impulsif ? Nos tests sur l'argent explorent tes habitudes, tes priorités et les décisions que tu prends lorsqu'il est question de dépenses, d'épargne ou de plaisir.",

    image:
      "/images/personnalite-categories/argent.jpg",
  },

  {
    slug: "bien-etre",
    name: "Bien-être",

    shortDescription:
      "Équilibre personnel, habitudes, émotions et rapport au quotidien.",

    seoTitle:
      "Tests bien-être gratuits : habitudes, équilibre et émotions",

    seoDescription:
      "Explore ton équilibre personnel avec nos tests bien-être gratuits consacrés aux habitudes, aux émotions, au stress et à ta façon de vivre le quotidien.",

    intro:
      "Nos habitudes et nos réactions en disent beaucoup sur notre équilibre quotidien. Découvre des tests autour du bien-être, des émotions, du stress et de la manière dont tu prends soin de toi au jour le jour.",

    image:
      "/images/personnalite-categories/bien-etre.jpg",
  },

  {
    slug: "carriere",
    name: "Carrière",

    shortDescription:
      "Travail, ambitions, personnalité professionnelle et choix de carrière.",

    seoTitle:
      "Tests de carrière gratuits : découvre ton profil professionnel",

    seoDescription:
      "Découvre ton profil professionnel grâce à nos tests de carrière gratuits : ambitions, travail, leadership, motivation, choix professionnels et personnalité au travail.",

    intro:
      "Comment fonctionnes-tu dans le monde professionnel ? Ambition, leadership, motivation, prise de décision ou rapport au travail : découvre les traits qui façonnent ton profil professionnel.",

    image:
      "/images/personnalite-categories/carriere.jpg",
  },

  {
    slug: "famille",
    name: "Famille",

    shortDescription:
      "Relations familiales, parentalité, conflits et place dans la famille.",

    seoTitle:
      "Tests famille gratuits : relations, parentalité et personnalité",

    seoDescription:
      "Découvre nos tests famille gratuits sur les relations familiales, la parentalité, les conflits, les rôles et les comportements au sein de la famille.",

    intro:
      "Parents, enfants, frères et sœurs ou vie familiale : découvre comment tu réagis aux situations du quotidien et quelle place tu tends à prendre dans tes relations avec tes proches.",

    image:
      "/images/personnalite-categories/famille.jpg",
  },

  {
    slug: "fun",
    name: "Fun",

    shortDescription:
      "Tests légers, situations improbables et questions pour s'amuser.",

    seoTitle:
      "Tests fun gratuits : découvre ton profil en t'amusant",

    seoDescription:
      "Découvre nos tests fun gratuits avec des situations amusantes, des choix improbables et des questions originales pour révéler différentes facettes de ta personnalité.",

    intro:
      "Pas besoin de tout prendre au sérieux. Fais des choix improbables, imagine-toi dans des situations inattendues et découvre ce que tes réponses révèlent de toi avec nos tests les plus amusants.",

    image:
      "/images/personnalite-categories/fun.jpg",
  },

  {
    slug: "lifestyle",
    name: "Lifestyle",

    shortDescription:
      "Mode de vie, habitudes, goûts, quotidien et préférences personnelles.",

    seoTitle:
      "Tests lifestyle gratuits : quel mode de vie te correspond ?",

    seoDescription:
      "Découvre nos tests lifestyle gratuits sur ton mode de vie, tes habitudes, tes goûts, tes préférences et les petits choix qui rythment ton quotidien.",

    intro:
      "Tes habitudes, tes goûts et tes petits choix quotidiens dessinent un mode de vie qui t'est propre. Explore différentes facettes de ton lifestyle et découvre les profils qui te ressemblent le plus.",

    image:
      "/images/personnalite-categories/lifestyle.jpg",
  },

  {
    slug: "psychologie",
    name: "Psychologie",

    shortDescription:
      "Traits de personnalité, comportements, émotions et réactions.",

    seoTitle:
      "Tests de psychologie et personnalité gratuits en ligne",

    seoDescription:
      "Explore ta personnalité avec nos tests gratuits sur tes comportements, tes émotions, tes réactions, tes relations et différents traits de caractère.",

    intro:
      "Comment réagis-tu face aux autres, aux émotions ou aux situations difficiles ? Ces tests explorent différents aspects de ta personnalité et de tes comportements à travers des questions et des situations concrètes.",

    image:
      "/images/personnalite-categories/psychologie.jpg",
  },
];

/* =========================================================
   DOSSIER DES TESTS
   ========================================================= */

const PERSONALITY_DIR = path.join(
  process.cwd(),
  "data",
  "personalite",
);

let _cache: PersonalityTest[] | null = null;

/* =========================================================
   LECTURE DES JSON
   ========================================================= */

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadAllPersonalityTests(): PersonalityTest[] {
  const files = walkJsonFiles(PERSONALITY_DIR);

  const tests = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw) as PersonalityTest;

    if (!data.slug) {
      throw new Error(
        `Test de personnalité sans slug : ${file}`,
      );
    }

    if (!data.category?.slug) {
      throw new Error(
        `Test de personnalité sans catégorie : ${file}`,
      );
    }

    return data;
  });

  /* Vérification des slugs dupliqués */

  const seen = new Set<string>();

  for (const test of tests) {
    if (seen.has(test.slug)) {
      throw new Error(
        `Slug dupliqué détecté : ${test.slug}`,
      );
    }

    seen.add(test.slug);
  }

  return tests;
}

/* =========================================================
   RÉCUPÉRATION DES TESTS
   ========================================================= */

export function getAllPersonalityTests(): PersonalityTest[] {
  if (_cache) return _cache;

  _cache = loadAllPersonalityTests();

  return _cache;
}

export function getPersonalityTestBySlug(
  slug: string,
): PersonalityTest | null {
  return (
    getAllPersonalityTests().find(
      (test) => test.slug === slug,
    ) ?? null
  );
}

/* =========================================================
   RÉCUPÉRATION DES CATÉGORIES
   ========================================================= */

export function getAllPersonalityCategories(): PersonalityCategory[] {
  return personalityCategories;
}

export function getPersonalityCategory(
  slug: string,
): PersonalityCategory | undefined {
  return personalityCategories.find(
    (category) => category.slug === slug,
  );
}

/* =========================================================
   TESTS PAR CATÉGORIE
   ========================================================= */

export function getPersonalityTestsByCategory(
  categorySlug: string,
): PersonalityTest[] {
  return getAllPersonalityTests().filter(
    (test) => test.category.slug === categorySlug,
  );
}