import fs from "node:fs";
import path from "node:path";

const QUIZZES_DIR = path.join(process.cwd(), "data", "quizzes");
const EXPECTED_QUESTIONS = 20;

function walkJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkJsonFiles(full));
    else if (e.isFile() && e.name.endsWith(".json")) files.push(full);
  }
  return files;
}

function fail(errors) {
  console.error("\n❌ Validation échouée :");
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}

function ok(msg) {
  console.log("✅ " + msg);
}

const files = walkJsonFiles(QUIZZES_DIR);
if (files.length === 0) {
  console.warn("⚠️ Aucun fichier quiz trouvé dans:", QUIZZES_DIR);
  process.exit(0);
}

const errors = [];
const slugs = new Set();

for (const file of files) {
  let data;
  try {
    const raw = fs.readFileSync(file, "utf-8");
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`${file}: JSON invalide (${String(e)})`);
    continue;
  }

  // Champs obligatoires
  const required = ["slug", "title", "category", "questions"];
  for (const k of required) {
    if (data[k] === undefined || data[k] === null || data[k] === "") {
      errors.push(`${file}: champ manquant "${k}"`);
    }
  }

  // Slug
  if (typeof data.slug !== "string" || !data.slug.trim()) {
    errors.push(`${file}: slug invalide`);
  } else {
    if (slugs.has(data.slug)) errors.push(`${file}: slug dupliqué "${data.slug}"`);
    slugs.add(data.slug);

    // Bonus: vérifier que le nom de fichier contient le slug (optionnel)
    const baseName = path.basename(file, ".json");
    if (baseName !== data.slug) {
      // pas bloquant, mais utile
      console.warn(`⚠️ ${file}: le nom de fichier "${baseName}" ≠ slug "${data.slug}"`);
    }

    // Bonus SEO: slug sans espaces/maj/accents (contrôle léger)
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      console.warn(`⚠️ ${file}: slug contient des caractères inhabituels (recommandé: a-z 0-9 -)`);
    }
  }

  // Category
  if (!data.category || typeof data.category !== "object") {
    errors.push(`${file}: category invalide`);
  } else {
    if (!data.category.slug || !data.category.name) {
      errors.push(`${file}: category.slug et category.name sont requis`);
    }
  }

  // Images (recommandé mais pas bloquant)
  if (data.images?.cover && typeof data.images.cover === "string") {
    if (!data.images.cover.startsWith("/images/")) {
      console.warn(`⚠️ ${file}: images.cover devrait commencer par "/images/..."`);
    }
  }
  if (data.images?.thumbnail && typeof data.images.thumbnail === "string") {
    if (!data.images.thumbnail.startsWith("/images/")) {
      console.warn(`⚠️ ${file}: images.thumbnail devrait commencer par "/images/..."`);
    }
  }

  // Questions
  if (!Array.isArray(data.questions)) {
    errors.push(`${file}: questions doit être un tableau`);
    continue;
  }

  if (data.questions.length !== EXPECTED_QUESTIONS) {
    console.warn(
      `⚠️ ${file}: ${data.questions.length} questions (attendu: ${EXPECTED_QUESTIONS})`
    );
  }

  const qIds = new Set();
  data.questions.forEach((q, i) => {
    const p = `${file}: question #${i + 1}`;

    if (!q || typeof q !== "object") {
      errors.push(`${p}: objet question invalide`);
      return;
    }

    if (!q.id || typeof q.id !== "string") errors.push(`${p}: id manquant`);
    else {
      if (qIds.has(q.id)) errors.push(`${p}: id dupliqué "${q.id}"`);
      qIds.add(q.id);
    }

    if (!q.question || typeof q.question !== "string") errors.push(`${p}: question manquante`);
    if (!Array.isArray(q.answers) || q.answers.length < 2) {
      errors.push(`${p}: answers doit contenir au moins 2 réponses`);
    } else {
      // Reco UX: 4 réponses
      if (q.answers.length !== 4) {
        console.warn(`⚠️ ${p}: ${q.answers.length} réponses (recommandé: 4)`);
      }
      q.answers.forEach((a, j) => {
        if (typeof a !== "string" || !a.trim()) errors.push(`${p}: answers[${j}] vide/invalide`);
      });
    }

    if (!Number.isInteger(q.correctIndex)) errors.push(`${p}: correctIndex doit être un entier`);
    else if (!q.answers || q.correctIndex < 0 || q.correctIndex >= q.answers.length) {
      errors.push(`${p}: correctIndex hors limites`);
    }

    if (q.explanation !== undefined && typeof q.explanation !== "string") {
      errors.push(`${p}: explanation doit être une string si présent`);
    }
  });
}

if (errors.length) fail(errors);

ok(`${files.length} fichier(s) quiz validé(s) sans erreur bloquante.`);
console.log("🎉 Tout est OK.");