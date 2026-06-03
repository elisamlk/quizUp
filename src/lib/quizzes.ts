import fs from "node:fs";
import path from "node:path";
import { categoriesMeta } from "@/lib/categories";

export type Quiz = {
  descriptionSeo: string;
  slug: string;
  title: string;
  description?: string;
  category: { name: string; slug: string };
  isNew?: boolean;
  isPopular?: boolean;
  images?: {
    thumbnail?: string;
    cover?: string;
    alt?: string;
  };
  questions: {
    id: string;
    question: string;
    image?: string | null;
    answers: string[];
    correctIndex: number;
    explanation?: string;
  }[];
};

export type Category = {
  name: string;
  slug: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  intro?: string;
  faqs?: Array<{ q: string; a: string }>;
};

const QUIZZES_DIR = path.join(process.cwd(), "data", "quizzes");

let _cache: Quiz[] | null = null;

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

function loadAllQuizzes(): Quiz[] {
  const files = walkJsonFiles(QUIZZES_DIR);

  const quizzes = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw) as Quiz;

    if (!data.slug) {
      throw new Error(`Quiz sans slug : ${file}`);
    }

    return data;
  });

  // Vérifie unicité des slugs
  const seen = new Set<string>();
  for (const q of quizzes) {
    if (seen.has(q.slug)) {
      throw new Error(`Slug dupliqué détecté : ${q.slug}`);
    }
    seen.add(q.slug);
  }

  return quizzes;
}

export function getAllQuizzes(): Quiz[] {
  if (_cache) return _cache;
  _cache = loadAllQuizzes();
  return _cache;
}

export function getQuizBySlug(slug: string): Quiz | null {
  return getAllQuizzes().find((q) => q.slug === slug) ?? null;
}

export function getAllCategories(): Category[] {
  const map = new Map<string, { name: string; slug: string }>();

  for (const q of getAllQuizzes()) {
    map.set(q.category.slug, q.category);
  }

  return Array.from(map.values())
    .map((c) => ({
      ...c,
      ...(categoriesMeta[c.slug] ?? {}),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
