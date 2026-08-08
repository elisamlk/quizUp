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
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#0b1220");
  background.addColorStop(0.5, "#0f172a");
  background.addColorStop(1, "#111827");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  if (coverUrl) {
    const cover = await loadImage(coverUrl);

    if (cover) {
      const scale = Math.max(width / cover.width, height / cover.height);
      const drawnWidth = cover.width * scale;
      const drawnHeight = cover.height * scale;
      const drawnX = (width - drawnWidth) / 2;
      const drawnY = (height - drawnHeight) / 2;

      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.drawImage(cover, drawnX, drawnY, drawnWidth, drawnHeight);
      ctx.restore();

      const overlay = ctx.createLinearGradient(0, 0, 0, height);
      overlay.addColorStop(0, "rgba(0,0,0,0.55)");
      overlay.addColorStop(1, "rgba(0,0,0,0.82)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);
    }
  }

  const cardX = 90;
  const cardY = 260;
  const cardWidth = width - cardX * 2;
  const cardHeight = 980;

  ctx.save();
  roundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 44);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 44);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.font = "600 34px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  const pillPaddingX = 26;
  const pillWidth = Math.min(
    cardWidth - 120,
    ctx.measureText(category).width + pillPaddingX * 2,
  );
  const pillHeight = 64;
  const pillX = cardX + 60;
  const pillY = cardY + 60;

  ctx.save();
  roundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 999);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textBaseline = "middle";
  ctx.fillText(
    clampText(ctx, category, pillWidth - pillPaddingX * 2),
    pillX + pillPaddingX,
    pillY + pillHeight / 2,
  );

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.font = "900 62px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  const titleMaxWidth = cardWidth - 120;
  const titleX = cardX + 60;
  let titleY = pillY + pillHeight + 40;

  const words = title.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (ctx.measureText(candidate).width <= titleMaxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === 2) break;
    }
  }

  if (lines.length < 2 && line) lines.push(line);

  if (lines.length === 2) {
    lines[1] = clampText(ctx, lines[1], titleMaxWidth);
  }

  for (const titleLine of lines) {
    ctx.fillText(titleLine, titleX, titleY);
    titleY += 76;
  }

  const scoreY = cardY + 460;

  ctx.textBaseline = "alphabetic";
  ctx.font = "900 180px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "#ffffff";

  const scoreText = `${score}/${total}`;
  const scoreWidth = ctx.measureText(scoreText).width;
  ctx.fillText(scoreText, cardX + (cardWidth - scoreWidth) / 2, scoreY);

  ctx.font = "800 64px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,0.92)";

  const percentText = `${percent}%`;
  const percentWidth = ctx.measureText(percentText).width;
  ctx.fillText(
    percentText,
    cardX + (cardWidth - percentWidth) / 2,
    scoreY + 90,
  );

  ctx.font = "700 42px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,0.85)";

  const challenge = "Peux-tu faire mieux ?";
  const challengeWidth = ctx.measureText(challenge).width;

  ctx.fillText(
    challenge,
    cardX + (cardWidth - challengeWidth) / 2,
    cardY + cardHeight - 130,
  );

  ctx.font = "800 34px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.fillText(brand, 90, height - 120);

  ctx.font = "600 30px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.fillText("Fais le quiz et partage ton score →", 90, height - 74);

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
