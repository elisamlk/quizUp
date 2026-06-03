"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type EmojiQuizItem = {
  id: string;
  emoji: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation?: string;
};

function bestKey(slug: string) {
  return `bestGameScore:${slug}`;
}

function readBestScore(slug: string): number | null {
  try {
    const raw = localStorage.getItem(bestKey(slug));

    if (!raw) return null;

    const n = Number(raw);

    return Number.isFinite(n)
      ? n
      : null;
  } catch {
    return null;
  }
}

function writeBestScore(
  slug: string,
  value: number,
) {
  try {
    localStorage.setItem(
      bestKey(slug),
      String(value),
    );
  } catch {
    // ignore
  }
}

function clampText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (
    ctx.measureText(text).width <=
    maxWidth
  ) {
    return text;
  }

  let t = text;

  while (
    t.length > 0 &&
    ctx.measureText(t + "…").width >
      maxWidth
  ) {
    t = t.slice(0, -1);
  }

  return t.length
    ? t + "…"
    : "";
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(
    r,
    w / 2,
    h / 2,
  );

  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.arcTo(
    x + w,
    y,
    x + w,
    y + h,
    radius,
  );

  ctx.arcTo(
    x + w,
    y + h,
    x,
    y + h,
    radius,
  );

  ctx.arcTo(
    x,
    y + h,
    x,
    y,
    radius,
  );

  ctx.arcTo(
    x,
    y,
    x + w,
    y,
    radius,
  );

  ctx.closePath();
}

async function loadImage(
  src: string,
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      return resolve(null);
    }

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () =>
      resolve(img);

    img.onerror = () =>
      resolve(null);

    img.src = src;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(
                new Error(
                  "toBlob failed",
                ),
              ),
        "image/png",
        1,
      );
    },
  );
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

  const canvas =
    document.createElement("canvas");

  canvas.width = W;
  canvas.height = H;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "No canvas context",
    );
  }

  const grad =
    ctx.createLinearGradient(
      0,
      0,
      W,
      H,
    );

  grad.addColorStop(0, "#0b1220");
  grad.addColorStop(0.5, "#0f172a");
  grad.addColorStop(1, "#111827");

  ctx.fillStyle = grad;

  ctx.fillRect(0, 0, W, H);

  if (coverUrl) {
    const cover =
      await loadImage(coverUrl);

    if (cover) {
      const scale = Math.max(
        W / cover.width,
        H / cover.height,
      );

      const dw =
        cover.width * scale;

      const dh =
        cover.height * scale;

      const dx = (W - dw) / 2;

      const dy = (H - dh) / 2;

      ctx.save();

      ctx.globalAlpha = 0.25;

      ctx.drawImage(
        cover,
        dx,
        dy,
        dw,
        dh,
      );

      ctx.restore();

      const ov =
        ctx.createLinearGradient(
          0,
          0,
          0,
          H,
        );

      ov.addColorStop(
        0,
        "rgba(0,0,0,0.55)",
      );

      ov.addColorStop(
        1,
        "rgba(0,0,0,0.82)",
      );

      ctx.fillStyle = ov;

      ctx.fillRect(0, 0, W, H);
    }
  }

  const cardX = 90;
  const cardY = 260;
  const cardW = W - cardX * 2;
  const cardH = 980;

  ctx.save();

  roundedRect(
    ctx,
    cardX,
    cardY,
    cardW,
    cardH,
    44,
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.08)";

  ctx.fill();

  ctx.restore();

  ctx.save();

  roundedRect(
    ctx,
    cardX,
    cardY,
    cardW,
    cardH,
    44,
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.10)";

  ctx.lineWidth = 2;

  ctx.stroke();

  ctx.restore();

  const pillText = category;

  ctx.font =
    "600 34px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  const pillPaddingX = 26;

  const pillW = Math.min(
    cardW - 120,
    ctx.measureText(pillText)
      .width +
      pillPaddingX * 2,
  );

  const pillH = 64;

  const pillX = cardX + 60;

  const pillY = cardY + 60;

  ctx.save();

  roundedRect(
    ctx,
    pillX,
    pillY,
    pillW,
    pillH,
    999,
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.12)";

  ctx.fill();

  ctx.restore();

  ctx.fillStyle =
    "rgba(255,255,255,0.92)";

  ctx.textBaseline = "middle";

  ctx.fillText(
    clampText(
      ctx,
      pillText,
      pillW -
        pillPaddingX * 2,
    ),
    pillX + pillPaddingX,
    pillY + pillH / 2,
  );

  ctx.fillStyle = "#ffffff";

  ctx.textBaseline = "top";

  ctx.font =
    "900 62px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  const titleMaxW =
    cardW - 120;

  const titleX = cardX + 60;

  let titleY =
    pillY + pillH + 40;

  const words =
    title.split(" ");

  let line = "";

  const lines: string[] = [];

  for (const word of words) {
    const test = line
      ? `${line} ${word}`
      : word;

    if (
      ctx.measureText(test)
        .width <= titleMaxW
    ) {
      line = test;
    } else {
      lines.push(line);

      line = word;

      if (lines.length === 2)
        break;
    }
  }

  if (
    lines.length < 2 &&
    line
  ) {
    lines.push(line);
  }

  if (lines.length === 2) {
    lines[1] = clampText(
      ctx,
      lines[1],
      titleMaxW,
    );
  }

  for (const l of lines) {
    ctx.fillText(
      l,
      titleX,
      titleY,
    );

    titleY += 76;
  }

  const scoreY =
    cardY + 460;

  ctx.textBaseline =
    "alphabetic";

  ctx.font =
    "900 180px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  ctx.fillStyle = "#ffffff";

  const scoreText = `${score}/${total}`;

  const scoreW =
    ctx.measureText(scoreText)
      .width;

  ctx.fillText(
    scoreText,
    cardX +
      (cardW - scoreW) / 2,
    scoreY,
  );

  ctx.font =
    "800 64px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  ctx.fillStyle =
    "rgba(255,255,255,0.92)";

  const pctText = `${percent}%`;

  const pctW =
    ctx.measureText(pctText)
      .width;

  ctx.fillText(
    pctText,
    cardX +
      (cardW - pctW) / 2,
    scoreY + 90,
  );

  ctx.font =
    "700 42px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  ctx.fillStyle =
    "rgba(255,255,255,0.85)";

  const challenge =
    "Peux-tu faire mieux ?";

  const chW =
    ctx.measureText(challenge)
      .width;

  ctx.fillText(
    challenge,
    cardX +
      (cardW - chW) / 2,
    cardY + cardH - 130,
  );

  ctx.font =
    "800 34px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  ctx.fillStyle =
    "rgba(255,255,255,0.80)";

  ctx.textBaseline =
    "alphabetic";

  ctx.fillText(
    brand,
    90,
    H - 120,
  );

  ctx.font =
    "600 30px system-ui, -apple-system, Segoe UI, Roboto, Arial";

  ctx.fillStyle =
    "rgba(255,255,255,0.60)";

  ctx.fillText(
    "Fais le jeu et partage ton score →",
    90,
    H - 74,
  );

  return await canvasToBlob(
    canvas,
  );
}

function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

function getEmojiItems(
  game: Game,
): EmojiQuizItem[] {
  const data = game.data as {
    items?: EmojiQuizItem[];
  };

  return Array.isArray(data.items)
    ? data.items
    : [];
}

export function EmojiQuizPlayer({
  game,
}: {
  game: Game;
}) {
  const items =
    getEmojiItems(game);

  const total = items.length;

  const [step, setStep] =
    useState<number>(0);

  const [
    selected,
    setSelected,
  ] = useState<number | null>(
    null,
  );

  const [
    isCorrect,
    setIsCorrect,
  ] = useState<
    boolean | null
  >(null);

  const [score, setScore] =
    useState<number>(0);

  const [
    showExplanation,
    setShowExplanation,
  ] = useState<boolean>(
    false,
  );

  const [best, setBest] =
    useState<number | null>(
      () =>
        readBestScore(
          game.slug,
        ),
    );

  const [
    isNewBest,
    setIsNewBest,
  ] = useState<boolean>(
    false,
  );

  const [toast, setToast] =
    useState<string | null>(
      null,
    );

  const [
    isSharing,
    setIsSharing,
  ] = useState<boolean>(
    false,
  );

  const q = items[step];

  const progress =
    useMemo(() => {
      if (total === 0)
        return 0;

      return Math.round(
        (step / total) * 100,
      );
    }, [step, total]);

  const scorePct = total
    ? Math.round(
        (score / total) * 100,
      )
    : 0;

  function showToast(
    message: string,
  ) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function chooseAnswer(
    idx: number,
  ) {
    if (
      selected !== null ||
      !q
    ) {
      return;
    }

    setSelected(idx);

    const ok =
      idx === q.correctIndex;

    setIsCorrect(ok);

    if (ok) {
      setScore((s) => s + 1);
    }

    setShowExplanation(true);
  }

  function finalizeBest() {
    setBest((prev) => {
      const currentBest =
        prev ??
        readBestScore(
          game.slug,
        );

      if (
        currentBest === null ||
        score > currentBest
      ) {
        writeBestScore(
          game.slug,
          score,
        );

        setIsNewBest(true);

        return score;
      }

      setIsNewBest(false);

      return currentBest;
    });
  }

  function next() {
    if (
      step + 1 >= total
    ) {
      finalizeBest();

      setStep(total);

      return;
    }

    setStep((s) => s + 1);

    setSelected(null);

    setIsCorrect(null);

    setShowExplanation(false);
  }

  function restart() {
    setStep(0);

    setSelected(null);

    setIsCorrect(null);

    setScore(0);

    setShowExplanation(false);

    setIsNewBest(false);
  }

  function resultMessage() {
    if (scorePct >= 90)
      return "Incroyable 🔥";

    if (scorePct >= 70)
      return "Très bon score ✅";

    if (scorePct >= 50)
      return "Bien joué 👍";

    return "Tu peux faire mieux 💪";
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      showToast(
        "Lien copié ✅",
      );
    } catch {
      showToast(
        "Impossible de copier",
      );
    }
  }

  async function shareImageCard() {
    if (isSharing) return;

    setIsSharing(true);

    try {
      const brand =
        "QuizMania";

      const coverUrl =
        game.images?.cover
          ? game.images.cover
          : undefined;

      const blob =
        await generateShareImage(
          {
            title: game.title,
            category:
              "Emoji Quiz",
            score,
            total,
            percent:
              scorePct,
            coverUrl,
            brand,
          },
        );

      const file = new File(
        [
          blob,
        ],
        `score-${game.slug}.png`,
        {
          type: "image/png",
        },
      );

      const canShareFiles =
        typeof navigator !==
          "undefined" &&
        "canShare" in
          navigator &&
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
          title: `Mon score : ${game.title}`,
          text: `J’ai fait ${score}/${total} (${scorePct}%) !`,
          files: [file],
        });

        showToast(
          "Partagé ✅",
        );

        return;
      }

      downloadBlob(
        blob,
        `score-${game.slug}.png`,
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

  if (total === 0) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Aucune question
            disponible pour ce
            jeu.
          </p>
        </div>

        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}
      </>
    );
  }

  if (step >= total) {
    const pageUrl =
      encodeURIComponent(
        typeof window !==
          "undefined"
          ? window.location
              .href
          : "",
      );

    const shareText =
      encodeURIComponent(
        `J’ai fait ${score}/${total} (${scorePct}%) au jeu "${game.title}" !`,
      );

    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Résultat du jeu
                </span>

                <h3 className="resultTitle">
                  {resultMessage()}
                </h3>

                <p className="resultSub">
                  Continue,
                  chaque
                  tentative te
                  rapproche
                  d’un meilleur
                  score.
                </p>
              </div>

              <div
                className="resultScoreCircle"
                style={{
                  background: `conic-gradient(#3055ff 0 ${scorePct}%, #e7ebff ${scorePct}% 100%)`,
                }}
              >
                <div className="resultScoreInner">
                  <div className="resultScoreMain">
                    {score}/{total}
                  </div>

                  <div className="resultScorePercent">
                    {scorePct}%
                  </div>
                </div>
              </div>
            </div>

            {best !== null ? (
              <div className="bestLine">
                {isNewBest ? (
                  <span className="bestBadge">
                    Nouveau
                    record
                  </span>
                ) : (
                  <span className="bestBadge bestBadge--soft">
                    Meilleur
                    score
                  </span>
                )}

                <span className="bestValue">
                  {best}/{total}
                </span>
              </div>
            ) : null}
          </div>

          <div className="resultActions">
            <button
              className="quizBtnPrimary"
              onClick={restart}
            >
              Rejouer
            </button>

            <button
              className="quizBtnShare"
              onClick={
                shareImageCard
              }
              disabled={
                isSharing
              }
            >
              {isSharing
                ? "Génération…"
                : "Partager (image)"}
            </button>
          </div>

          <div
            className="shareBar"
            aria-label="Partager sur les réseaux"
          >
            <button
              className="shareBtn"
              onClick={
                copyLink
              }
            >
              Copier le
              lien
            </button>

            <button
              className="shareBtn"
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
              onClick={() =>
                openShare(
                  `https://www.reddit.com/submit?url=${pageUrl}&title=${shareText}`,
                )
              }
            >
              Reddit
            </button>
          </div>
        </div>

        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop">
          <span className="quizCounter">
            Question{" "}
            <strong>
              {step + 1}
            </strong>{" "}
            / {total}
          </span>

          <span className="quizScore">
            Score : {score}

            {best !== null ? (
              <span
                style={{
                  opacity: 0.75,
                }}
              >
                {" "}
                • Record{" "}
                {best}
              </span>
            ) : null}
          </span>
        </div>

        <div
          className="quizProgressBar"
          aria-hidden="true"
        >
          <div
            className="quizProgressFill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="quizQuestionImageWrap">
          <div className="quizQuestionImage emojiGameBox">
            {q.emoji}
          </div>
        </div>

        <h3 className="quizQuestion">
          {q.question}
        </h3>

        <ul className="quizAnswers">
          {q.answers.map(
            (
              answer,
              idx,
            ) => {
              const chosen =
                selected ===
                idx;

              const correct =
                idx ===
                q.correctIndex;

              let cls =
                "quizAnswerBtn";

              if (
                selected !==
                null
              ) {
                if (
                  chosen &&
                  correct
                ) {
                  cls +=
                    " isCorrect";
                } else if (
                  chosen &&
                  !correct
                ) {
                  cls +=
                    " isWrong";
                } else if (
                  correct
                ) {
                  cls +=
                    " isCorrectSoft";
                } else {
                  cls +=
                    " isDisabled";
                }
              }

              return (
                <li
                  key={`${q.id}-${answer}`}
                >
                  <button
                    type="button"
                    className={
                      cls
                    }
                    onClick={() =>
                      chooseAnswer(
                        idx,
                      )
                    }
                    disabled={
                      selected !==
                      null
                    }
                  >
                    {
                      answer
                    }
                  </button>
                </li>
              );
            },
          )}
        </ul>

        {showExplanation ? (
          <div className="quizExplain">
            <p
              style={{
                margin: 0,
              }}
            >
              {isCorrect
                ? "Bonne réponse."
                : "Mauvaise réponse."}
            </p>

            {q.explanation ? (
              <p
                style={{
                  margin:
                    "8px 0 0",
                  opacity:
                    0.9,
                }}
              >
                {
                  q.explanation
                }
              </p>
            ) : null}

            <div
              style={{
                marginTop: 12,
                display:
                  "flex",
                gap: 10,
                flexWrap:
                  "wrap",
              }}
            >
              <button
                className="quizBtnPrimary"
                onClick={
                  next
                }
              >
                {step + 1 ===
                total
                  ? "Voir le résultat"
                  : "Question suivante"}
              </button>

              <button
                className="quizBtnGhost"
                onClick={
                  restart
                }
              >
                Recommencer
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  );
}