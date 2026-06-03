// /lib/games.ts

import fs from "node:fs";
import path from "node:path";

export type GameCategory = {
  name: string;
  slug: string;
};

export type GameImage = {
  thumbnail?: string;
  cover?: string;
  alt?: string;
};

export type Game = {
  descriptionSeo: string;
  slug: string;
  title: string;
  description?: string;

  type: string;

  category: GameCategory;

  createdAt?: string;
  isNew?: boolean;
  isPopular?: boolean;

  images?: GameImage;

  data: Record<string, unknown>;
};

export type GameTypeCard = {
  slug: string;
  title: string;
  image: string;
  href: string;
};

const GAMES_DIR = path.join(
  process.cwd(),
  "data",
  "games"
);

let _cache: Game[] | null = null;

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      files.push(...walkJsonFiles(full));
    } else if (
      e.isFile() &&
      e.name.endsWith(".json")
    ) {
      files.push(full);
    }
  }

  return files;
}

function loadAllGames(): Game[] {
  const files = walkJsonFiles(GAMES_DIR);

  const games = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw) as Game;

    if (!data.slug) {
      throw new Error(`Jeu sans slug : ${file}`);
    }

    if (!data.type) {
      throw new Error(`Jeu sans type : ${file}`);
    }

    if (!data.category?.slug) {
      throw new Error(`Jeu sans catégorie : ${file}`);
    }

    if (!data.data) {
      throw new Error(`Jeu sans data : ${file}`);
    }

    return data;
  });

  const seen = new Set<string>();

  for (const game of games) {
    if (seen.has(game.slug)) {
      throw new Error(
        `Slug dupliqué détecté : ${game.slug}`
      );
    }

    seen.add(game.slug);
  }

  return games;
}

export function formatGameType(type: string): string {
  switch (type) {
    case "emoji-quiz":
      return "Emoji Quiz";

    case "wordle":
      return "Mot mystère";

    case "pendu":
      return "Pendu";

    case "association":
      return "Trouve les paires";

    case "chrono-quiz":
      return "Chrono Quiz";

    case "memory":
      return "Memory";

    case "qui-suis-je":
      return "Qui suis-je ?";

    case "plus-ou-moins":
      return "Plus ou Moins";

    case "image-mystere":
      return "Image Mystère";

    case "classement":
      return "Classement";

    default:
      return type;
  }
}

export function getAllGames(): Game[] {
  if (_cache) return _cache;

  _cache = loadAllGames();

  return _cache;
}

export function getGameBySlug(
  slug: string
): Game | null {
  return (
    getAllGames().find(
      (game) => game.slug === slug
    ) ?? null
  );
}

export function getAllGameCategories(): GameCategory[] {
  const map = new Map<string, GameCategory>();

  for (const game of getAllGames()) {
    map.set(game.category.slug, game.category);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getGamesByCategory(
  categorySlug: string
): Game[] {
  return getAllGames().filter(
    (game) => game.category.slug === categorySlug
  );
}

export function getGamesByType(type: string): Game[] {
  return getAllGames().filter(
    (game) => game.type === type
  );
}

export function getPopularGames(): Game[] {
  return getAllGames().filter(
    (game) => game.isPopular
  );
}

export function getNewGames(): Game[] {
  return getAllGames().filter(
    (game) => game.isNew
  );
}

export function getGameTypes(): GameTypeCard[] {
  const games = getAllGames();

  const map = new Map<string, GameTypeCard>();

  for (const game of games) {
    if (!map.has(game.type)) {
      map.set(game.type, {
        slug: game.type,
        title: formatGameType(game.type),
        image: `/images/jeux/${game.type}.jpg`,
        href: `/jeux/${game.slug}`,
      });
    }
  }

  return Array.from(map.values());
}
