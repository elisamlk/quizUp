"use client";

import { useMemo, useRef, useState } from "react";
import type { PersonalityTest } from "@/lib/personalite";
import { AdSlot } from "@/components/AdSlot";

type NextQuiz = {
  slug: string;
  title: string;
};

type AnswerMap = Record<number, number>;
type ScoreMap = Record<string, number>;

function clampText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let t = text;

  while (t.length > 0 && ctx.measureText(t + "…").width > maxWidth) {
    t = t.slice(0, -1);
  }

  return t.length ? t + "…" : "";
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
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
  resultTitle,
  resultDescription,
  coverUrl,
  brand,
}: {
  title: string;
  category: string;
  resultTitle: string;
  resultDescription: string;
  coverUrl?: string;
  brand: string;
}): Promise<Blob> {
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  /* ---------- Fond ---------- */

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0b1220");
  grad.addColorStop(0.5, "#0f172a");
  grad.addColorStop(1, "#111827");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (coverUrl) {
    const cover = await loadImage(coverUrl);

    if (cover) {
      const scale = Math.max(W / cover.width, H / cover.height);
      const dw = cover.width * scale;
      const dh = cover.height * scale;
      const dx = (W - dw) / 2;
      const dy = (H - dh) / 2;

      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(cover, dx, dy, dw, dh);
      ctx.restore();

      const ov = ctx.createLinearGradient(0, 0, 0, H);
      ov.addColorStop(0, "rgba(0,0,0,0.30)");
      ov.addColorStop(0.5, "rgba(0,0,0,0.45)");
      ov.addColorStop(1, "rgba(0,0,0,0.70)");

      ctx.fillStyle = ov;
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

  const titleFit = fitLines(ctx, title, innerW, 6, [60, 54, 48, 42], 900);
  const titleLH = Math.round(titleFit.size * 1.2);

  const resultFit = fitLines(
    ctx,
    resultTitle,
    innerW,
    4,
    [100, 88, 76, 66, 58],
    900,
  );
  const resultLH = Math.round(resultFit.size * 1.15);

  const descFit = fitLines(
    ctx,
    resultDescription,
    innerW,
    12,
    [38, 34, 31],
    600,
  );
  const descLH = Math.round(descFit.size * 1.4);

  const labelSize = 44;
  const labelLH = 56;

  const gapAfterPill = 36;
  const gapAfterTitle = 70;
  const gapAfterLabel = 12;
  const gapAfterResult = 34;

  const cardH =
    pad +
    pillH +
    gapAfterPill +
    titleFit.lines.length * titleLH +
    gapAfterTitle +
    labelLH +
    gapAfterLabel +
    resultFit.lines.length * resultLH +
    gapAfterResult +
    descFit.lines.length * descLH +
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

  /* ---------- Titre du test ---------- */

  ctx.textBaseline = "top";
  ctx.font = `900 ${titleFit.size}px ${SHARE_FONT}`;
  ctx.fillStyle = "#ffffff";

  for (const l of titleFit.lines) {
    ctx.fillText(l, cardX + pad, y);
    y += titleLH;
  }

  y += gapAfterTitle;

  /* ---------- Profil ---------- */

  ctx.textAlign = "center";
  ctx.font = `800 ${labelSize}px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.fillText("Mon profil :", centerX, y);

  y += labelLH + gapAfterLabel;

  ctx.font = `900 ${resultFit.size}px ${SHARE_FONT}`;
  ctx.fillStyle = "#ffffff";

  for (const l of resultFit.lines) {
    ctx.fillText(l, centerX, y);
    y += resultLH;
  }

  y += gapAfterResult;

  /* ---------- Description ---------- */

  ctx.font = `600 ${descFit.size}px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.88)";

  for (const l of descFit.lines) {
    ctx.fillText(l, centerX, y);
    y += descLH;
  }

  /* ---------- Pied de page ---------- */

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.font = `800 34px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.fillText(brand, 90, H - 120);

  ctx.font = `600 30px ${SHARE_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.60)";
  ctx.fillText("Fais le test et partage ton résultat →", 90, H - 74);

  return await canvasToBlob(canvas);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function openShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function getProfileScores(
  quiz: PersonalityTest,
  answers: AnswerMap,
): ScoreMap {
  const totals: ScoreMap = {};

  for (const [questionIndexStr, answerIndex] of Object.entries(answers)) {
    const questionIndex = Number(questionIndexStr);
    const question = quiz.questions[questionIndex];
    const answer = question?.answers[answerIndex];

    if (!answer) continue;

    for (const [profileKey, points] of Object.entries(answer.scores)) {
      totals[profileKey] = (totals[profileKey] ?? 0) + points;
    }
  }

  return totals;
}

function getWinningProfile(
  quiz: PersonalityTest,
  scores: ScoreMap,
) {
  const sorted = Object.entries(scores).sort(
    (a, b) => b[1] - a[1],
  );

  const winnerKey = sorted[0]?.[0];

  if (!winnerKey) return null;

  return (
    quiz.profiles.find(
      (p) => p.key === winnerKey,
    ) ?? null
  );
}


type PersonalityQuestion = PersonalityTest["questions"][number];

type PersonalityQuestionCardProps = {
  question: PersonalityQuestion;
  questionIndex: number;
  total: number;
  selectedIndex: number | null;
  isActive: boolean;
  isBefore: boolean;
  titleRef: (element: HTMLHeadingElement | null) => void;
  onChooseAnswer: (questionIndex: number, answerIndex: number) => void;
  onNext: () => void;
  onRestart: () => void;
};

function PersonalityQuestionCard({
  question,
  questionIndex,
  total,
  selectedIndex,
  isActive,
  isBefore,
  titleRef,
  onChooseAnswer,
  onNext,
  onRestart,
}: PersonalityQuestionCardProps) {
  const isAnswered = selectedIndex !== null;

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
            const isChosen = selectedIndex === answerIndex;

            let buttonClassName = "quizAnswerBtn";

            if (isAnswered) {
              if (isChosen) {
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
                  {answer.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className={explanationClassName}
          aria-live={isActive ? "polite" : "off"}
        >
          <p style={{ margin: 0 }}>
            {isAnswered ? (
              <>
                Tu as choisi :{" "}
                <strong>
                  {question.answers[selectedIndex]?.label}
                </strong>
              </>
            ) : (
              <>
                Choisis la réponse qui te correspond le mieux.
              </>
            )}
          </p>

          {question.explanation ? (
            <p
              style={{
                margin: "8px 0 0",
                opacity: 0.9,
              }}
            >
              {question.explanation}
            </p>
          ) : null}

          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
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

export function PersonalityPlayer({
  quiz,
  nextQuiz,
}: {
  quiz: PersonalityTest;
  nextQuiz?: NextQuiz | null;
}) {
  const total = quiz.questions.length;

  const [step, setStep] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<AnswerMap>({});
  const [toast, setToast] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const toastTimer = useRef<number | null>(null);

  const isFinished = step >= total;

  const progress =
    total === 0
      ? 0
      : Math.round((Math.min(step + 1, total) / total) * 100);

  const scores = useMemo(() => {
    return getProfileScores(quiz, answersMap);
  }, [quiz, answersMap]);

  const winner = useMemo(() => {
    return getWinningProfile(quiz, scores);
  }, [quiz, scores]);

  const sortedProfiles = useMemo(() => {
    return [...quiz.profiles]
      .map((profile) => ({
        ...profile,
        score: scores[profile.key] ?? 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [quiz, scores]);

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
    if (answersMap[questionIndex] !== undefined) return;

    setAnswersMap((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: answerIndex,
    }));
  }

  function goToNextQuestion() {
    if (isFinished) return;
    if (answersMap[step] === undefined) return;

    if (step + 1 >= total) {
      setStep(total);
      scrollToTestOnMobile();
      return;
    }

    const nextStep = step + 1;
    setStep(nextStep);

    window.requestAnimationFrame(() => {
      titleRefs.current[nextStep]?.focus({
        preventScroll: true,
      });

      if (window.innerWidth <= 768) {
        const testSection = document.getElementById("jouer");

        if (testSection) {
          const navbarOffset = 95;

          const top =
            testSection.getBoundingClientRect().top +
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

  function scrollToTestOnMobile() {
    if (window.innerWidth > 768) return;

    window.requestAnimationFrame(() => {
      const testSection = document.getElementById("jouer");

      if (!testSection) return;

      const navbarOffset = 95;

      const top =
        testSection.getBoundingClientRect().top +
        window.scrollY -
        navbarOffset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  }

  function restart() {
    setStep(0);
    setAnswersMap({});

    window.requestAnimationFrame(() => {
      titleRefs.current[0]?.focus({
        preventScroll: true,
      });
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      showToast("Lien copié ✅");
    } catch {
      showToast("Impossible de copier");
    }
  }

  async function shareImageCard() {
    if (isSharing || !winner) return;

    setIsSharing(true);

    try {
      const brand = "QuizUp";

      const coverUrl =
        winner.image ||
        quiz.images?.cover ||
        undefined;

      const blob = await generateShareImage({
        title: quiz.title,
        category: quiz.category.name,
        resultTitle: `${
          winner.emoji
            ? `${winner.emoji} `
            : ""
        }${winner.title}`,
        resultDescription:
          winner.description,
        coverUrl,
        brand,
      });

      const file = new File(
        [blob],
        `resultat-${quiz.slug}.png`,
        {
          type: "image/png",
        },
      );

      const canShareFiles =
        typeof navigator !== "undefined" &&
        "canShare" in navigator &&
        typeof navigator.canShare ===
          "function" &&
        navigator.canShare({
          files: [file],
        });

      if (
        navigator.share &&
        canShareFiles
      ) {
        await navigator.share({
          title: `Mon résultat : ${quiz.title}`,
          text: `J’ai obtenu le profil ${winner.title} !`,
          files: [file],
        });

        showToast("Partagé ✅");
        return;
      }

      downloadBlob(
        blob,
        `resultat-${quiz.slug}.png`,
      );

      await copyLink();

      showToast(
        "Image téléchargée + lien copié ✅",
      );
    } catch {
      showToast(
        "Erreur lors du partage",
      );
    } finally {
      setIsSharing(false);
    }
  }

  const pageUrl =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.href)
      : "";

  const shareText = winner
    ? encodeURIComponent(
        `J’ai obtenu le profil "${winner.title}" au test "${quiz.title}" !`,
      )
    : "";

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
              Test de personnalité
            </span>
          </div>

          <div
            className="quizProgressBar"
            role="progressbar"
            aria-label="Progression du test"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="quizProgressFill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="quizQuestionsViewport">
            {quiz.questions.map((question, questionIndex) => (
              <PersonalityQuestionCard
                key={question.id ?? questionIndex}
                question={question}
                questionIndex={questionIndex}
                total={total}
                selectedIndex={
                  answersMap[questionIndex] ?? null
                }
                isActive={
                  questionIndex === step && !isFinished
                }
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
        {winner ? (
          <div className="quizPanel">
            <div
              className={`resultHead ${
                winner.image
                  ? "hasImage"
                  : "noImage"
              }`}
              style={
                winner.image
                  ? {
                      backgroundImage: `url("${winner.image}")`,
                    }
                  : undefined
              }
            >
              {!winner.image ? (
                <div className="resultScore">
                  {winner.emoji
                    ? winner.emoji
                    : "✨"}
                </div>
              ) : null}

              <div className="resultHeadContent">
                <div className="resultBadge">
                  Ton profil
                </div>

                <h3 className="resultTitle">
                  {winner.emoji
                    ? `${winner.emoji} `
                    : ""}
                  {winner.title}
                </h3>

                <p className="resultSub">
                  {winner.description}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                marginBottom: 14,
              }}
            >
              <AdSlot slot="3333333333" />
            </div>

            <div className="quizExplain">
              <p style={{ margin: 0 }}>
                Ton profil dominant est{" "}
                <strong>
                  {winner.emoji
                    ? `${winner.emoji} `
                    : ""}
                  {winner.title}
                </strong>
                .
              </p>

              {sortedProfiles.length > 0 ? (
                <div
                  style={{
                    marginTop: 12,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      opacity: 0.9,
                    }}
                  >
                    Répartition des profils :
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    {sortedProfiles.map(
                      (profile) => {
                        const max =
                          sortedProfiles[0]
                            ?.score || 1;

                        const width =
                          max > 0
                            ? Math.max(
                                (profile.score /
                                  max) *
                                  100,
                                6,
                              )
                            : 0;

                        return (
                          <div
                            key={profile.key}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                gap: 12,
                                marginBottom: 4,
                                fontSize: 14,
                              }}
                            >
                              <span>
                                {profile.emoji
                                  ? `${profile.emoji} `
                                  : ""}
                                {profile.title}
                              </span>

                              <strong>
                                {profile.score}
                              </strong>
                            </div>

                            <div
                              style={{
                                height: 8,
                                borderRadius: 999,
                                background:
                                  "rgba(255,255,255,0.08)",
                                overflow:
                                  "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${width}%`,
                                  height: "100%",
                                  borderRadius:
                                    999,
                                  background:
                                    "currentColor",
                                  opacity: 0.9,
                                }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="resultActions">
              <button
                className="quizBtnPrimary"
                type="button"
                onClick={restart}
              >
                Recommencer
              </button>

              <button
                className="quizBtnShare"
                type="button"
                onClick={shareImageCard}
                disabled={isSharing}
              >
                {isSharing
                  ? "Génération…"
                  : "Partager (image)"}
              </button>

              {nextQuiz ? (
                <a
                  className="quizBtnPrimaryOutline"
                  href={`/personalite/${nextQuiz.slug}`}
                >
                  Test suivant →
                </a>
              ) : null}
            </div>

            <div
              className="shareBar"
              aria-label="Partager sur les réseaux"
            >
              <button
                className="shareBtn"
                type="button"
                onClick={copyLink}
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
                  openShare(
                    `https://wa.me/?text=${shareText}%20${pageUrl}`,
                  )
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
                Prochain :{" "}
                <strong>
                  {nextQuiz.title}
                </strong>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {toast ? (
        <div className="toast">
          {toast}
        </div>
      ) : null}
    </>
  );
}

