import fs from "node:fs";
import path from "node:path";

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
  category: { name: string; slug: string };
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

export type PersonalityCategory = {
  name: string;
  slug: string;
};

const PERSONALITY_DIR = path.join(process.cwd(), "data", "personalite");

let _cache: PersonalityTest[] | null = null;

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      files.push(...walkJsonFiles(full));
    } else if (e.isFile() && e.name.endsWith(".json")) {
      files.push(full);
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
      throw new Error(`Test de personnalité sans slug : ${file}`);
    }

    return data;
  });

  const seen = new Set<string>();

  for (const test of tests) {
    if (seen.has(test.slug)) {
      throw new Error(`Slug dupliqué détecté : ${test.slug}`);
    }
    seen.add(test.slug);
  }

  return tests;
}

export function getAllPersonalityTests(): PersonalityTest[] {
  if (_cache) return _cache;
  _cache = loadAllPersonalityTests();
  return _cache;
}

export function getPersonalityTestBySlug(slug: string): PersonalityTest | null {
  return getAllPersonalityTests().find((test) => test.slug === slug) ?? null;
}

export function getAllPersonalityCategories(): PersonalityCategory[] {
  const map = new Map<string, { name: string; slug: string }>();

  for (const test of getAllPersonalityTests()) {
    map.set(test.category.slug, test.category);
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}