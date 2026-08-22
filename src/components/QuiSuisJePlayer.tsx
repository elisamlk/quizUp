"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type NextGame = {
  slug: string;
  title: string;
};

type QuiItem = {
  id: string;
  answer: string;
  acceptedAnswers?: string[];
  hints: string[];
};

function getItems(game: Game): QuiItem[] {
  const data = game.data as {
    items?: QuiItem[];
  };

  return Array.isArray(data.items)
    ? data.items
    : [];
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

export function QuiSuisJePlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const items = getItems(game);

  const [step, setStep] = useState(0);

  const [hintIndex, setHintIndex] =
    useState(0);

  const [input, setInput] =
    useState("");

  const [revealed, setRevealed] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(null);

  const current = items[step];

  const total = items.length;

  const progress = useMemo(() => {
    if (total === 0) {
      return 0;
    }

    return Math.round(
      (step / total) * 100,
    );
  }, [step, total]);

  const visibleHints = current
    ? current.hints.slice(
        0,
        hintIndex + 1,
      )
    : [];

  function showToast(
    message: string,
  ) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      showToast("Lien copié ✅");
    } catch {
      showToast(
        "Impossible de copier",
      );
    }
  }

  function submitAnswer() {
    if (
      !current ||
      revealed
    ) {
      return;
    }

    const user =
      normalize(input);

    if (!user) {
      showToast(
        "Entre une réponse",
      );
      return;
    }

    const acceptedAnswers = [
      current.answer,
      ...(current.acceptedAnswers ?? []),
    ]
      .map(normalize)
      .filter(Boolean);

    const ok =
      acceptedAnswers.some(
        (answer) =>
          user === answer,
      );

    if (ok) {
      const gained =
        Math.max(
          1,
          current.hints.length -
            hintIndex,
        );

      setScore(
        (prev) =>
          prev + gained,
      );

      setRevealed(true);

      showToast(
        `Bonne réponse ! +${gained} point${
          gained > 1 ? "s" : ""
        }`,
      );

      return;
    }

    /*
      UNE SEULE TENTATIVE PAR INDICE

      Mauvaise réponse :
      - s'il reste un indice,
        on révèle automatiquement
        l'indice suivant ;
      - si c'était le dernier indice,
        on révèle la réponse.
    */

    if (
      hintIndex + 1 <
      current.hints.length
    ) {
      setHintIndex(
        (prev) =>
          prev + 1,
      );

      setInput("");

      showToast(
        "Pas encore ! Nouvel indice 👀",
      );

      return;
    }

    setInput("");
    setRevealed(true);

    showToast(
      "La réponse est révélée",
    );
  }

  function nextHint() {
    if (
      !current ||
      revealed
    ) {
      return;
    }

    if (
      hintIndex + 1 >=
      current.hints.length
    ) {
      setRevealed(true);
      setInput("");

      return;
    }

    setHintIndex(
      (prev) =>
        prev + 1,
    );

    setInput("");
  }

  function nextQuestion() {
    if (
      step + 1 >=
      total
    ) {
      setFinished(true);

      return;
    }

    setStep(
      (prev) =>
        prev + 1,
    );

    setHintIndex(0);

    setInput("");

    setRevealed(false);
  }

  function restart() {
    setStep(0);

    setHintIndex(0);

    setInput("");

    setRevealed(false);

    setScore(0);

    setFinished(false);
  }

  if (total === 0) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Aucun élément disponible.
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

  if (finished) {
    const maxScore =
      items.reduce(
        (
          acc,
          item,
        ) =>
          acc +
          item.hints.length,
        0,
      );

    const pct =
      maxScore > 0
        ? Math.round(
            (score /
              maxScore) *
              100,
          )
        : 0;

    const pageUrl =
      encodeURIComponent(
        typeof window !==
          "undefined"
          ? window.location.href
          : "",
      );

    const shareText =
      encodeURIComponent(
        `J’ai obtenu ${score}/${maxScore} points au jeu "${game.title}" !`,
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
                  {pct >= 80
                    ? "Excellent 🧠"
                    : pct >= 50
                      ? "Bien joué 👏"
                      : "Continue 💪"}
                </h3>

                <p className="resultSub">
                  Tu as obtenu{" "}
                  <strong>
                    {score}/{maxScore} points
                  </strong>
                  .
                </p>

              </div>

              <div
                className="resultScoreCircle"
                style={{
                  background:
                    `conic-gradient(#3055ff 0 ${pct}%, #e7ebff ${pct}% 100%)`,
                }}
              >
                <div className="resultScoreInner">

                  <div className="resultScoreMain">
                    {score}
                  </div>

                  <div className="resultScorePercent">
                    {pct}%
                  </div>

                </div>
              </div>

            </div>

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

          <div className="shareBar">

            <button
              className="shareBtn"
              onClick={copyLink}
            >
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
                  `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                )
              }
            >
              Facebook
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
            Énigme{" "}
            <strong>
              {step + 1}
            </strong>{" "}
            / {total}
          </span>

          <span className="quizScore">
            Score : {score}
          </span>

        </div>

        <div className="quizProgressBar">
          <div
            className="quizProgressFill"
            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>

        <h3 className="quizQuestion">
          Qui suis-je ?
        </h3>

        <div className="quiHints">

          {visibleHints.map(
            (
              hint,
              index,
            ) => (
              <div
                key={`${current.id}-${index}`}
                className="quiHint"
              >
                <span className="quiHintIndex">
                  {index + 1}
                </span>

                <p>
                  {hint}
                </p>
              </div>
            ),
          )}

        </div>

        {!revealed ? (
          <>

            <div className="quiInputWrap">

              <input
                type="text"
                className="quiInput"
                placeholder="Ta réponse..."
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value,
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    submitAnswer();
                  }
                }}
                autoComplete="off"
              />

              <button
                className="quizBtnPrimary quiBtn"
                onClick={
                  submitAnswer
                }
              >
                Valider
              </button>

            </div>

            <button
              className="quizBtnGhost"
              onClick={nextHint}
            >
              {hintIndex + 1 <
              current.hints.length
                ? "Voir un autre indice"
                : "Voir la réponse"}
            </button>

          </>
        ) : (
          <div className="quizExplain">

            <p
              style={{
                margin: 0,
              }}
            >
              Réponse :{" "}
              <strong>
                {current.answer}
              </strong>
            </p>

            <div
              style={{
                marginTop: 14,
              }}
            >
              <button
                className="quizBtnPrimary"
                onClick={
                  nextQuestion
                }
              >
                {step + 1 >=
                total
                  ? "Voir le résultat"
                  : "Énigme suivante"}
              </button>
            </div>

          </div>
        )}

      </div>

      {toast && (
        <div className="toastQui">
          {toast}
        </div>
      )}
    </>
  );
}