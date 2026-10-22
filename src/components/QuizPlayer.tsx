"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Quiz } from "@/lib/quizzes";
// import { AdSlot } from "@/components/AdSlot";

type NextQuiz = {
  slug: string;
  title: string;
};

type QuizQuestion = Quiz["questions"][number];

type AnswerState = {
  selectedIndex: number;
  isCorrect: boolean;
};

type QuestionCardProps = {
  question: QuizQuestion;
  questionIndex: number;
  total: number;
  answerState: AnswerState | null;
  isActive: boolean;
  isBefore: boolean;
  titleRef: (element: HTMLHeadingElement | null) => void;
  onChooseAnswer: (questionIndex: number, answerIndex: number) => void;
  onNext: () => void;
  onRestart: () => void;
};

type QuizResultsProps = {
  quiz: Quiz;
  nextQuiz?: NextQuiz | null;
  score: number;
  total: number;
  best: number | null;
  isNewBest: boolean;
  isSharing: boolean;
  onRestart: () => void;
  onShareImage: () => void;
  onCopyLink: () => void;
};

function bestKey(slug: string) {
  return `bestScore:${slug}`;
}

function readBestScore(slug: string): number | null {
  try {
    const raw = window.localStorage.getItem(bestKey(slug));
    if (!raw) return null;

    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeBestScore(slug: string, value: number) {
  try {
    window.localStorage.setItem(bestKey(slug), String(value));
  } catch {
    // localStorage may be unavailable in private or restricted browsing.
  }
}

function clampText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let shortened = text;

  while (
    shortened.length > 0 &&
    ctx.measureText(`${shortened}…`).width > maxWidth
  ) {
    shortened = shortened.slice(0, -1);
  }

  return shortened ? `${shortened}…` : "";
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Impossible de créer l’image")),
      "image/png",
      1,
    );
  });
}

const SHARE_FONT = "system-ui, -apple-system, Segoe UI, Roboto, Arial";

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): { lines: string[]; truncated: boolean } {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  let i = 0;

  for (; i < words.length; i++) {
    const candidate = line ? `${line} ${words[i]}` : words[i];

    if (!line || ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    lines.push(line);

    if (lines.length === maxLines) {
      line = "";
      break;
    }

    line = words[i];
  }

  if (line) lines.push(line);

  const truncatedWords = i < words.length;
  const result = lines.map((l) => clampText(ctx, l, maxWidth));
  const clampedAny = result.some((l, index) => l !== lines[index]);

  if (truncatedWords && result.length > 0) {
    let last = result[result.length - 1];

    while (last.length && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }

    result[result.length - 1] = `${last.trimEnd()}…`;
  }

  return { lines: result, truncated: truncatedWords || clampedAny };
}

function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  sizes: number[],
  weight: number,
): { lines: string[]; truncated: boolean; size: number } {
  let best = { lines: [] as string[], truncated: false, size: sizes[0] };

  for (const size of sizes) {
    ctx.font = `${weight} ${size}px ${SHARE_FONT}`;
    const r = wrapLines(ctx, text, maxWidth, maxLines);
    best = { ...r, size };

    if (!r.truncated) break;
  }

  return best;
}

async function generateShareImage({
  title,
  category,
  score,
  total,
  percent,
  coverUrl,
  brand,
}: {
  title: string;
  category: string;
  score: number;
  total: number;
  percent: number;
  coverUrl?: string;
  brand: string;
}): Promise<Blob> {
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  /* ---------- Fond ---------- */

  const background = ctx.createLinearGradient(0, 0, W, H);
  background.addColorStop(0, "#0b1220");
  background.addColorStop(0.5, "#0f172a");
  background.addColorStop(1, "#111827");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, W, H);
  if (coverUrl) {
    const cover = await loadImage(coverUrl);

    if (cover) {
      const isLandscape = cover.width / cover.height > W / H;

      // Paysage : l’image garde toute sa largeur et reste centrée.
      // Portrait : elle remplit tout le fond, comme avant.
      const zoom = 1;
      const scale = isLandscape
        ? (W / cover.width) * zoom
        : Math.max(W / cover.width, H / cover.height);

      const dw = cover.width * scale;
      const dh = cover.height * scale;
      const dx = (W - dw) / 2;
      const dy = (H - dh) / 2;

      ctx.drawImage(cover, dx, dy, dw, dh);

      if (isLandscape) {
        const fade = Math.min(120, dh / 5);

        const topFade = ctx.createLinearGradient(0, dy, 0, dy + fade);
        topFade.addColorStop(0, "rgba(15,23,42,1)");
        topFade.addColorStop(1, "rgba(15,23,42,0)");
        ctx.fillStyle = topFade;
        ctx.fillRect(0, dy, W, fade);

        const bottomFade = ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh);
        bottomFade.addColorStop(0, "rgba(15,23,42,0)");
        bottomFade.addColorStop(1, "rgba(15,23,42,1)");
        ctx.fillStyle = bottomFade;
        ctx.fillRect(0, dy + dh - fade, W, fade);
      }

      const overlay = ctx.createLinearGradient(0, 0, 0, H);
      overlay.addColorStop(0, "rgba(0,0,0,0.10)");
      overlay.addColorStop(0.5, "rgba(0,0,0,0.20)");
      overlay.addColorStop(1, "rgba(0,0,0,0.50)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---------- Mesures ---------- */

  const cardX = 90;
  const cardW = W - cardX * 2;
  const pad = 60;
  const innerW = cardW - pad * 2;
  const centerX = W / 2;

  const pillPaddingX = 26;
  const pillH = 64;

  ctx.font = `600 34px ${SHARE_FONT}`;
  const pillText = clampText(ctx, category, innerW - pillPaddingX * 2);
  const pillW = ctx.measureText(pillText).width + pillPaddingX * 2;

  const titleFit = fitLines(ctx, title, innerW, 6, [62, 56, 50, 44], 900);
  const titleLH = Math.round(titleFit.size * 1.2);

  const scoreSize = 180;
  const scoreLH = 190;
  const percentSize = 64;
  const percentLH = 80;
  const challengeSize = 42;
  const challengeLH = 56;

  const gapAfterPill = 36;
  const gapAfterTitle = 90;
  const gapAfterScore = 10;
  const gapAfterPercent = 70;

  const cardH =
    pad +
    pillH +
    gapAfterPill +
    titleFit.lines.length * titleLH +
    gapAfterTitle +
    scoreLH +
    gapAfterScore +
    percentLH +
    gapAfterPercent +
    challengeLH +
    pad;

  const footerTop = H - 220;
  const cardY = Math.max(140, Math.round((footerTop - cardH) / 2));

  /* ---------- Carte ---------- */

  ctx.save();
  roundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  let y = cardY + pad;

  /* ---------- Catégorie ---------- */

  const pillX = cardX + pad;

  ctx.save();
  roundedRect(ctx, pillX, y, pillW, pillH, 999);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.restore();

  ctx.font = `600 34px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(pillText, pillX + pillPaddingX, y + pillH / 2);

  y += pillH + gapAfterPill;

  /* ---------- Titre du quiz ---------- */

  ctx.textBaseline = "top";
  ctx.font = `900 ${titleFit.size}px ${SHARE_FONT}`;
  ctx.fillStyle = "#ffffff";

  for (const l of titleFit.lines) {
    ctx.fillText(l, cardX + pad, y);
    y += titleLH;
  }

  y += gapAfterTitle;

  /* ---------- Score ---------- */

  ctx.textAlign = "center";
  ctx.font = `900 ${scoreSize}px ${SHARE_FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${score}/${total}`, centerX, y);

  y += scoreLH + gapAfterScore;

  ctx.font = `800 ${percentSize}px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(`${percent} %`, centerX, y);

  y += percentLH + gapAfterPercent;

  ctx.font = `700 ${challengeSize}px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("Peux-tu faire mieux ?", centerX, y);

  /* ---------- Pied de page ---------- */

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.font = `800 34px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.fillText(brand, 90, H - 120);

  ctx.font = `600 30px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.fillText("Fais le quiz et partage ton score →", 90, H - 74);

  return canvasToBlob(canvas);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function openShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function QuestionCard({
  question,
  questionIndex,
  total,
  answerState,
  isActive,
  isBefore,
  titleRef,
  onChooseAnswer,
  onNext,
  onRestart,
}: QuestionCardProps) {
  const isAnswered = answerState !== null;

  const articleClassName = [
    "quizQuestionCard",
    isActive ? "is-active" : "",
    !isActive && isBefore ? "is-before" : "",
    !isActive && !isBefore ? "is-after" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const explanationClassName = [
    "quizExplain",
    isAnswered ? "is-visible" : "is-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={articleClassName}
      data-question-number={questionIndex + 1}
      aria-current={isActive ? "step" : undefined}
    >
      <div className="quizQuestionCardInner">
        {question.image ? (
          <div className="quizQuestionImageWrap">
            <img
              src={question.image}
              alt={question.question}
              className="quizQuestionImage"
              loading={questionIndex === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ) : null}

        <h3
          ref={titleRef}
          tabIndex={-1}
          className="quizQuestion"
        >
          <span className="srOnly">
            Question {questionIndex + 1}.{" "}
          </span>
          {question.question}
        </h3>

        <ul className="quizAnswers">
          {question.answers.map((answer, answerIndex) => {
            const isChosen = answerState?.selectedIndex === answerIndex;
            const isCorrectAnswer = answerIndex === question.correctIndex;

            let buttonClassName = "quizAnswerBtn";

            if (isAnswered) {
              if (isChosen && isCorrectAnswer) {
                buttonClassName += " isCorrect";
              } else if (isChosen) {
                buttonClassName += " isWrong";
              } else if (isCorrectAnswer) {
                buttonClassName += " isCorrectSoft";
              } else {
                buttonClassName += " isDisabled";
              }
            }

            return (
              <li key={`${questionIndex}-${answerIndex}`}>
                <button
                  type="button"
                  className={buttonClassName}
                  onClick={() =>
                    onChooseAnswer(questionIndex, answerIndex)
                  }
                  disabled={!isActive || isAnswered}
                  aria-pressed={isChosen}
                  tabIndex={isActive ? 0 : -1}
                >
                  {answer}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className={explanationClassName}
          aria-live={isActive ? "polite" : "off"}
        >
          <p className="quizAnswerFeedback">
            {isAnswered ? (
              answerState.isCorrect ? (
                "Bonne réponse."
              ) : (
                <>
                  Mauvaise réponse. La bonne réponse était{" "}
                  <strong>
                    {question.answers[question.correctIndex]}
                  </strong>
                  .
                </>
              )
            ) : (
              <>
                Bonne réponse :{" "}
                <strong>
                  {question.answers[question.correctIndex]}
                </strong>
              </>
            )}
          </p>

          {question.explanation ? (
            <p className="quizExplanationText">
              {question.explanation}
            </p>
          ) : null}

          <div className="quizExplainActions">
            <button
              className="quizBtnPrimary"
              type="button"
              onClick={onNext}
              disabled={!isActive || !isAnswered}
              tabIndex={isActive && isAnswered ? 0 : -1}
            >
              {questionIndex + 1 === total
                ? "Voir le résultat"
                : "Question suivante"}
            </button>

            <button
              className="quizBtnGhost"
              type="button"
              onClick={onRestart}
              tabIndex={isActive && isAnswered ? 0 : -1}
            >
              Recommencer
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function QuizResults({
  quiz,
  nextQuiz,
  score,
  total,
  best,
  isNewBest,
  isSharing,
  onRestart,
  onShareImage,
  onCopyLink,
}: QuizResultsProps) {
  const scorePercent =
    total === 0 ? 0 : Math.round((score / total) * 100);

  const pageUrl =
    typeof window === "undefined"
      ? ""
      : encodeURIComponent(window.location.href);

  const shareText = encodeURIComponent(
    `J’ai fait ${score}/${total} (${scorePercent} %) au quiz « ${quiz.title} » !`,
  );

  function resultMessage() {
    if (scorePercent >= 90) return "Incroyable 🔥";
    if (scorePercent >= 70) return "Très bon score ✅";
    if (scorePercent >= 50) return "Bien joué 👍";
    return "Tu peux faire mieux 💪";
  }

  return (
    <div className="quizPanel">
      <div className="resultHeadQuiz">
        <div className="resultTop">
          <div>
            <span className="resultKicker">Résultat du quiz</span>

            <h3 className="resultTitle">{resultMessage()}</h3>

            <p className="resultSub">
              Continue, chaque tentative te rapproche d’un meilleur score.
            </p>
          </div>

          <div
            className="resultScoreCircle"
            style={{
              background: `conic-gradient(#3055ff 0 ${scorePercent}%, #e7ebff ${scorePercent}% 100%)`,
            }}
          >
            <div className="resultScoreInner">
              <div className="resultScoreMain">
                {score}/{total}
              </div>

              <div className="resultScorePercent">
                {scorePercent} %
              </div>
            </div>
          </div>
        </div>

        {best !== null ? (
          <div className="bestLine">
            <span
              className={`bestBadge${
                isNewBest ? "" : " bestBadge--soft"
              }`}
            >
              {isNewBest ? "Nouveau record" : "Meilleur score"}
            </span>

            <span className="bestValue">
              {best}/{total}
            </span>
          </div>
        ) : null}
      </div>

      {/* <div style={{ marginTop: 14, marginBottom: 14 }}>
        <AdSlot slot="3333333333" />
      </div> */}

      <div className="resultActions">
        <button
          className="quizBtnPrimary"
          type="button"
          onClick={onRestart}
        >
          Rejouer
        </button>

        <button
          className="quizBtnShare"
          type="button"
          onClick={onShareImage}
          disabled={isSharing}
        >
          {isSharing ? "Génération…" : "Partager le score"}
        </button>

        {nextQuiz ? (
          <a
            className="quizBtnPrimaryOutline"
            href={`/quiz/${nextQuiz.slug}`}
          >
            Quiz suivant →
          </a>
        ) : null}
      </div>

      <div className="shareBar" aria-label="Partager ce quiz">
        <button
          className="shareBtn"
          type="button"
          onClick={onCopyLink}
        >
          Copier le lien
        </button>

        <button
          className="shareBtn"
          type="button"
          onClick={() =>
            openShare(
              `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`,
            )
          }
        >
          X
        </button>

        <button
          className="shareBtn"
          type="button"
          onClick={() =>
            openShare(
              `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
            )
          }
        >
          Facebook
        </button>

        <button
          className="shareBtn"
          type="button"
          onClick={() =>
            openShare(`https://wa.me/?text=${shareText}%20${pageUrl}`)
          }
        >
          WhatsApp
        </button>

        <button
          className="shareBtn"
          type="button"
          onClick={() =>
            openShare(
              `https://t.me/share/url?url=${pageUrl}&text=${shareText}`,
            )
          }
        >
          Telegram
        </button>

        <button
          className="shareBtn"
          type="button"
          onClick={() =>
            openShare(
              `https://www.reddit.com/submit?url=${pageUrl}&title=${shareText}`,
            )
          }
        >
          Reddit
        </button>
      </div>

      {nextQuiz ? (
        <p className="resultNextHint">
          Prochain : <strong>{nextQuiz.title}</strong>
        </p>
      ) : null}
    </div>
  );
}

export function QuizPlayer({
  quiz,
  nextQuiz,
}: {
  quiz: Quiz;
  nextQuiz?: NextQuiz | null;
}) {
  const total = quiz.questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<AnswerState | null>>(
    () => quiz.questions.map(() => null),
  );

  const [best, setBest] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const toastTimer = useRef<number | null>(null);

  const isFinished = step >= total;

  const score = useMemo(
    () =>
      answers.reduce(
        (sum, answer) => sum + (answer?.isCorrect ? 1 : 0),
        0,
      ),
    [answers],
  );

  const progress =
    total === 0
      ? 0
      : Math.round((Math.min(step + 1, total) / total) * 100);

  useEffect(() => {
    setBest(readBestScore(quiz.slug));
  }, [quiz.slug]);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  function showToast(message: string) {
    setToast(message);

    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }

    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 2200);
  }

  function chooseAnswer(
    questionIndex: number,
    answerIndex: number,
  ) {
    if (isFinished || questionIndex !== step) return;
    if (answers[questionIndex] !== null) return;

    const question = quiz.questions[questionIndex];
    const isCorrect = answerIndex === question.correctIndex;

    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === questionIndex
          ? {
              selectedIndex: answerIndex,
              isCorrect,
            }
          : answer,
      ),
    );
  }

  function saveBestScore(finalScore: number) {
    const currentBest = best ?? readBestScore(quiz.slug);

    if (currentBest === null || finalScore > currentBest) {
      writeBestScore(quiz.slug, finalScore);
      setBest(finalScore);
      setIsNewBest(true);
      return;
    }

    setBest(currentBest);
    setIsNewBest(false);
  }

  function goToNextQuestion() {
  if (isFinished || answers[step] === null) return;

  if (step + 1 >= total) {
    saveBestScore(score);
    setStep(total);
    return;
  }

  const nextStep = step + 1;
  setStep(nextStep);

  window.requestAnimationFrame(() => {
    titleRefs.current[nextStep]?.focus({
      preventScroll: true,
    });

    // Sur mobile, remonte au début du quiz
    if (window.innerWidth <= 768) {
      const quizSection = document.getElementById("jouer");

      if (quizSection) {
        const navbarOffset = 95;

        const top =
          quizSection.getBoundingClientRect().top +
          window.scrollY -
          navbarOffset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }
  });
}

  function restart() {
    setStep(0);
    setAnswers(quiz.questions.map(() => null));
    setIsNewBest(false);

    window.requestAnimationFrame(() => {
      titleRefs.current[0]?.focus({
        preventScroll: true,
      });
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Lien copié ✅");
    } catch {
      showToast("Impossible de copier le lien");
    }
  }

  async function shareImageCard() {
    if (isSharing) return;

    setIsSharing(true);

    try {
      const scorePercent =
        total === 0 ? 0 : Math.round((score / total) * 100);

      const blob = await generateShareImage({
        title: quiz.title,
        category: quiz.category.name,
        score,
        total,
        percent: scorePercent,
        coverUrl: quiz.images?.cover || undefined,
        brand: "QuizUp",
      });

      const file = new File([blob], `score-${quiz.slug}.png`, {
        type: "image/png",
      });

      const canShareFiles =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (navigator.share && canShareFiles) {
        await navigator.share({
          title: `Mon score : ${quiz.title}`,
          text: `J’ai fait ${score}/${total} (${scorePercent} %) !`,
          files: [file],
        });

        showToast("Partagé ✅");
        return;
      }

      downloadBlob(blob, `score-${quiz.slug}.png`);
      await copyLink();
      showToast("Image téléchargée et lien copié ✅");
    } catch {
      showToast("Erreur lors du partage");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <>
      <div
        className="quizPlayerQuestions"
        data-finished={isFinished ? "true" : "false"}
      >
        <div className="quizPanel">
          <div className="quizTop">
            <span className="quizCounter">
              Question{" "}
              <strong>
                {Math.min(step + 1, total)}
              </strong>{" "}
              / {total}
            </span>

            <span className="quizScore">
              Score : {score}
              {best !== null ? (
                <span className="quizBestInline">
                  {" "}
                  • Record {best}
                </span>
              ) : null}
            </span>
          </div>

          <div
            className="quizProgressBar"
            role="progressbar"
            aria-label="Progression du quiz"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="quizProgressFill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="quizQuestionsViewport">
            {quiz.questions.map((question, questionIndex) => (
              <QuestionCard
                key={question.id ?? questionIndex}
                question={question}
                questionIndex={questionIndex}
                total={total}
                answerState={answers[questionIndex]}
                isActive={questionIndex === step && !isFinished}
                isBefore={questionIndex < step}
                titleRef={(element) => {
                  titleRefs.current[questionIndex] = element;
                }}
                onChooseAnswer={chooseAnswer}
                onNext={goToNextQuestion}
                onRestart={restart}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="quizPlayerResults"
        data-visible={isFinished ? "true" : "false"}
      >
        <QuizResults
          quiz={quiz}
          nextQuiz={nextQuiz}
          score={score}
          total={total}
          best={best}
          isNewBest={isNewBest}
          isSharing={isSharing}
          onRestart={restart}
          onShareImage={shareImageCard}
          onCopyLink={copyLink}
        />
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
