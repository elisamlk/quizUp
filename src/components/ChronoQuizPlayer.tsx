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
  const data = game.data as {
    durationSeconds?: number;
  };

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

  const scorePct = total
    ? Math.round((score / total) * 100)
    : 0;

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

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  function finalizeBest(finalScore: number) {
    const currentBest =
      best ?? readBestScore(game.slug);

    if (
      currentBest === null ||
      finalScore > currentBest
    ) {
      writeBestScore(game.slug, finalScore);

      setBest(finalScore);

      setIsNewBest(true);

      return;
    }

    setBest(currentBest);

    setIsNewBest(false);
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

  function chooseAnswer(
    questionIndex: number,
    answerIndex: number,
  ) {
    if (
      !started ||
      finished ||
      selected !== null ||
      questionIndex !== step
    ) {
      return;
    }

    const currentQuestion =
      items[questionIndex];

    if (!currentQuestion) return;

    setSelected(answerIndex);

    const ok =
      answerIndex ===
      currentQuestion.correctIndex;

    const nextScore =
      ok ? score + 1 : score;

    if (ok) {
      setScore(nextScore);
    }

    window.setTimeout(() => {
      if (questionIndex + 1 >= total) {
        finishGame(nextScore);

        return;
      }

      setStep(questionIndex + 1);

      setSelected(null);
    }, 450);
  }

  function resultMessage() {
    if (scorePct >= 90) {
      return "Incroyable 🔥";
    }

    if (scorePct >= 70) {
      return "Très bon score ✅";
    }

    if (scorePct >= 50) {
      return "Bien joué ⚡";
    }

    return "Tu peux faire mieux 💪";
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

  if (total === 0) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Aucune question disponible pour ce jeu.
          </p>
        </div>

        {toast ? (
          <div className="toast">
            {toast}
          </div>
        ) : null}
      </>
    );
  }

  /*
   * IMPORTANT SEO / SSR
   *
   * Toutes les questions sont rendues ici.
   *
   * On ne rend plus uniquement `items[step]`.
   * Chaque question possède son propre article.
   *
   * Le track se déplace ensuite horizontalement
   * pour ne montrer qu'une question à la fois.
   */
  const questionsViewport = (
    <div
      className="chronoQuestionsViewport"
      aria-hidden={!started}
      style={
        !started
          ? {
              position: "absolute",
              left: "-200vw",
              width: "100%",
              pointerEvents: "none",
            }
          : {
              overflow: "hidden",
              width: "100%",
            }
      }
    >
      <div
        className="chronoQuestionsTrack"
        style={{
          display: "flex",
          width: "100%",
          transform: `translateX(-${step * 100}%)`,
          transition: "transform 0.3s ease",
        }}
      >
        {items.map(
          (
            item,
            questionIndex,
          ) => {
            const isActive =
              questionIndex === step;

            return (
              <article
                key={item.id}
                className={`chronoQuestionSlide ${
                  isActive
                    ? "is-active"
                    : questionIndex < step
                      ? "is-before"
                      : "is-after"
                }`}
                aria-current={
                  isActive
                    ? "step"
                    : undefined
                }
                style={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <h3 className="quizQuestion">
                  {item.question}
                </h3>

                <ul className="quizAnswers">
                  {item.answers.map(
                    (
                      answer,
                      answerIndex,
                    ) => {
                      const chosen =
                        isActive &&
                        selected ===
                          answerIndex;

                      const correct =
                        answerIndex ===
                        item.correctIndex;

                      let cls =
                        "quizAnswerBtn";

                      if (
                        isActive &&
                        selected !== null
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
                          key={`${item.id}-${answer}`}
                        >
                          <button
                            type="button"
                            className={cls}
                            onClick={() =>
                              chooseAnswer(
                                questionIndex,
                                answerIndex,
                              )
                            }
                            disabled={
                              !started ||
                              !isActive ||
                              selected !==
                                null
                            }
                            tabIndex={
                              started &&
                              isActive
                                ? 0
                                : -1
                            }
                          >
                            {answer}
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>

                {item.explanation ? (
                  <div className="chronoExplanation">
                    <p>
                      {
                        item.explanation
                      }
                    </p>
                  </div>
                ) : null}
              </article>
            );
          },
        )}
      </div>
    </div>
  );

  /*
   * ÉCRAN DE DÉPART
   *
   * Les questions sont malgré tout déjà
   * présentes dans le HTML grâce au
   * questionsViewport rendu en dessous.
   */
  if (!started) {
    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Jeu chrono
                </span>

                <h3 className="resultTitle">
                  Prêt pour le défi ?
                </h3>

                <p className="resultSub">
                  Réponds au maximum de
                  questions en{" "}
                  <strong>
                    {duration} secondes
                  </strong>
                  .
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
                <strong>
                  {duration}
                </strong>

                <span>sec</span>
              </div>
            </div>
          </div>

          <div className="resultActions">
            <button
              type="button"
              className="quizBtnPrimary"
              onClick={startGame}
            >
              Lancer le chrono
            </button>
          </div>
        </div>

        {questionsViewport}

        {toast ? (
          <div className="toast">
            {toast}
          </div>
        ) : null}
      </>
    );
  }

  /*
   * ÉCRAN DE RÉSULTAT
   */
  if (finished) {
    const pageUrl =
      encodeURIComponent(
        typeof window !==
          "undefined"
          ? window.location.href
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
                  background: `conic-gradient(
                    #3055ff 0 ${scorePct}%,
                    #e7ebff ${scorePct}% 100%
                  )`,
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
              type="button"
              className="quizBtnPrimary"
              onClick={startGame}
            >
              Rejouer
            </button>

            <button
              type="button"
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
            <button
              type="button"
              className="shareBtn"
              onClick={copyLink}
            >
              Copier le lien
            </button>

            <button
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
              Prochain :{" "}
              <strong>
                {nextGame.title}
              </strong>
            </p>
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

  /*
   * JEU EN COURS
   */
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
                • Record {best}
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
              <strong>
                {timeLeft}
              </strong>

              <span>sec</span>
            </div>
          </div>
        </div>

        {questionsViewport}
      </div>

      {toast ? (
        <div className="toast">
          {toast}
        </div>
      ) : null}
    </>
  );
}
