import fs from "fs";
import path from "path";

const QUIZZES_DIR = path.join(process.cwd(), "data", "quizzes");
const OUTPUT_FILE = path.join(process.cwd(), "quizzes-export.csv");

function escapeCSV(value) {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  // Échappe correctement les guillemets pour le CSV
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function getJsonFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getJsonFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".json")) {
        return [fullPath];
      }

      return [];
    });
}

function exportQuizzes() {
  if (!fs.existsSync(QUIZZES_DIR)) {
    console.error(`❌ Dossier introuvable : ${QUIZZES_DIR}`);
    process.exit(1);
  }

  const files = getJsonFiles(QUIZZES_DIR);

  console.log(`🔎 ${files.length} fichiers JSON trouvés.`);

  const quizzes = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const quiz = JSON.parse(content);

      quizzes.push({
        slug: quiz.slug ?? "",
        title: quiz.title ?? "",
        category: quiz.category?.name ?? "",
        categorySlug: quiz.category?.slug ?? "",
        publishedAt: quiz.publishedAt ?? "",
        description: quiz.description ?? "",
        isNew: quiz.isNew ?? false,
        isPopular: quiz.isPopular ?? false,
        file: path.relative(process.cwd(), file),
      });
    } catch (error) {
      console.error(`❌ Erreur avec ${file}`);
      console.error(error.message);
    }
  }

  // Tri par catégorie puis titre
  quizzes.sort((a, b) => {
    const categoryCompare = a.category.localeCompare(
      b.category,
      "fr",
      { sensitivity: "base" }
    );

    if (categoryCompare !== 0) return categoryCompare;

    return a.title.localeCompare(b.title, "fr", {
      sensitivity: "base",
    });
  });

  const headers = [
    "slug",
    "title",
    "category",
    "categorySlug",
    "publishedAt",
    "description",
    "isNew",
    "isPopular",
    "file",
  ];

  const rows = [
    headers.join(","),
    ...quizzes.map((quiz) =>
      headers.map((header) => escapeCSV(quiz[header])).join(",")
    ),
  ];

  // BOM UTF-8 pour que les accents français s'affichent bien dans Excel
  fs.writeFileSync(
    OUTPUT_FILE,
    "\uFEFF" + rows.join("\n"),
    "utf8"
  );

  console.log("");
  console.log(`✅ Export terminé !`);
  console.log(`📊 ${quizzes.length} quiz exportés`);
  console.log(`📁 Fichier : ${OUTPUT_FILE}`);

  // Petit récapitulatif par catégorie
  const categories = {};

  for (const quiz of quizzes) {
    const category = quiz.category || "Sans catégorie";
    categories[category] = (categories[category] || 0) + 1;
  }

  console.log("");
  console.log("Quiz par catégorie :");

  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`- ${category}: ${count}`);
    });
}

exportQuizzes();