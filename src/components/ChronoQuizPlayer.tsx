"use client";

import { useEffect, useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type NextGame = {
  slug: string;
  title: string;
};

type ChronoItem = {
  id: string;
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
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeBestScore(slug: string, value: number) {
  try {
    localStorage.setItem(bestKey(slug), String(value));
  } catch {
    // ignore
  }
}

function getItems(game: Game): ChronoItem[] {
  const data = game.data as {
    items?: ChronoItem[];
    durationSeconds?: number;
  };

  return Array.isArray(data.items) ? data.items : [];
}

function getDuration(game: Game) {
  const data = game.data as { durationSeconds?: number };

  return typeof data.durationSeconds === "number"
    ? data.durationSeconds
    : 60;
}

function openShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ChronoQuizPlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const items = getItems(game);
  const total = items.length;
  const duration = getDuration(game);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selected, setSelected] = useState<number | null>(null);

  const [best, setBest] = useState<number | null>(() =>
    readBestScore(game.slug),
  );
  const [isNewBest, setIsNewBest] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const q = items[step];

  const progress = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((step / total) * 100);
  }, [step, total]);

  const timeProgress = duration
    ? Math.round((timeLeft / duration) * 100)
    : 0;

  const scorePct = total ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft <= 0) {
      finishGame(score);
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [started, finished, timeLeft, score]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function finalizeBest(finalScore: number) {
    setBest((prev) => {
      const currentBest = prev ?? readBestScore(game.slug);

      if (currentBest === null || finalScore > currentBest) {
        writeBestScore(game.slug, finalScore);
        setIsNewBest(true);
        return finalScore;
      }

      setIsNewBest(false);
      return currentBest;
    });
  }

  function finishGame(finalScore: number) {
    finalizeBest(finalScore);
    setFinished(true);
  }

  function startGame() {
    setStarted(true);
    setFinished(false);
    setStep(0);
    setScore(0);
    setTimeLeft(duration);
    setSelected(null);
    setIsNewBest(false);
  }

  function chooseAnswer(index: number) {
    if (!started || finished || selected !== null || !q) return;

    setSelected(index);

    const ok = index === q.correctIndex;
    const nextScore = ok ? score + 1 : score;

    if (ok) {
      setScore(nextScore);
    }

    window.setTimeout(() => {
      if (step + 1 >= total) {
        finishGame(nextScore);
        return;
      }

      setStep((prev) => prev + 1);
      setSelected(null);
    }, 450);
  }

  function resultMessage() {
    if (scorePct >= 90) return "Incroyable 🔥";
    if (scorePct >= 70) return "Très bon score ✅";
    if (scorePct >= 50) return "Bien joué ⚡";
    return "Tu peux faire mieux 💪";
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Lien copié ✅");
    } catch {
      showToast("Impossible de copier");
    }
  }

  if (total === 0) {
    return (
      <>
        <div className="quizPanel">
          <p>Aucune question disponible pour ce jeu.</p>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </>
    );
  }

  if (!started) {
    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz">
            <div className="resultTop">
              <div>
                <span className="resultKicker">Jeu chrono</span>

                <h3 className="resultTitle">
                  Prêt pour le défi ?
                </h3>

                <p className="resultSub">
                  Réponds au maximum de questions en{" "}
                  <strong>{duration} secondes</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="chronoTimer chronoTimer--circle">
            <div
              className="chronoCircle"
              style={{
                background: `conic-gradient(
                  #3055ff 0% 100%,
                  rgba(48, 85, 255, 0.12) 100% 100%
                )`,
              }}
            >
              <div className="chronoCircleInner">
                <strong>{duration}</strong>
                <span>sec</span>
              </div>
            </div>
          </div>

          <div className="resultActions">
            <button
              className="quizBtnPrimary"
              onClick={startGame}
            >
              Lancer le chrono
            </button>
          </div>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </>
    );
  }

  if (finished) {
    const pageUrl = encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : "",
    );

    const shareText = encodeURIComponent(
      `J’ai fait ${score}/${total} (${scorePct}%) au jeu "${game.title}" !`,
    );

    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Résultat chrono
                </span>

                <h3 className="resultTitle">
                  {resultMessage()}
                </h3>

                <p className="resultSub">
                  Tu as marqué{" "}
                  <strong>
                    {score}/{total}
                  </strong>{" "}
                  avant la fin du chrono.
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
                    Nouveau record
                  </span>
                ) : (
                  <span className="bestBadge bestBadge--soft">
                    Meilleur score
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
              onClick={startGame}
            >
              Rejouer
            </button>

            <button
              className="quizBtnShare"
              onClick={copyLink}
            >
              Copier le lien
            </button>

            {nextGame ? (
              <a
                className="quizBtnPrimaryOutline"
                href={`/jeux/${nextGame.slug}`}
              >
                Jeu suivant →
              </a>
            ) : null}
          </div>

          <div
            className="shareBar"
            aria-label="Partager sur les réseaux"
          >
            <button className="shareBtn" onClick={copyLink}>
              Copier le lien
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
                openShare(`https://wa.me/?text=${shareText}%20${pageUrl}`)
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

          {nextGame ? (
            <p className="resultNextHint">
              Prochain : <strong>{nextGame.title}</strong>
            </p>
          ) : null}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </>
    );
  }

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop">
          <span className="quizCounter">
            Question <strong>{step + 1}</strong> / {total}
          </span>

          <span className="quizScore">
            Score : {score}
            {best !== null ? (
              <span style={{ opacity: 0.75 }}>
                {" "}
                • Record {best}
              </span>
            ) : null}
          </span>
        </div>

        <div className="quizProgressBar" aria-hidden="true">
          <div
            className="quizProgressFill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="chronoTimer chronoTimer--circle">
          <div
            className="chronoCircle"
            style={{
              background: `conic-gradient(
                #3055ff 0% ${timeProgress}%,
                rgba(48, 85, 255, 0.12) ${timeProgress}% 100%
              )`,
            }}
          >
            <div className="chronoCircleInner">
              <strong>{timeLeft}</strong>
              <span>sec</span>
            </div>
          </div>
        </div>

        <h3 className="quizQuestion">{q.question}</h3>

        <ul className="quizAnswers">
          {q.answers.map((answer, index) => {
            const chosen = selected === index;
            const correct = index === q.correctIndex;

            let cls = "quizAnswerBtn";

            if (selected !== null) {
              if (chosen && correct) cls += " isCorrect";
              else if (chosen && !correct)
                cls += " isWrong";
              else if (correct)
                cls += " isCorrectSoft";
              else cls += " isDisabled";
            }

            return (
              <li key={`${q.id}-${answer}`}>
                <button
                  type="button"
                  className={cls}
                  onClick={() => chooseAnswer(index)}
                  disabled={selected !== null}
                >
                  {answer}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
