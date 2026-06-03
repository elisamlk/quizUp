"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type NextGame = {
  slug: string;
  title: string;
};

type PlusItem = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

function getItems(game: Game): PlusItem[] {
  const data = game.data as {
    items?: PlusItem[];
  };

  return Array.isArray(data.items)
    ? data.items
    : [];
}

function formatValue(
  value: number,
  suffix?: string,
) {
  return `${value.toLocaleString(
    "fr-FR",
  )} ${suffix ?? ""}`.trim();
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

export function PlusOuMoinsPlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const items = getItems(game);

  const [step, setStep] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [
    revealed,
    setRevealed,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState<
    "plus" | "moins" | null
  >(null);

  const [toast, setToast] =
    useState<string | null>(
      null,
    );

  const current = items[step];

  const next =
    items[step + 1];

  const total = Math.max(
    0,
    items.length - 1,
  );

  const progress =
    useMemo(() => {
      if (total === 0)
        return 0;

      return Math.round(
        (step / total) * 100,
      );
    }, [step, total]);

  const finished =
    step >=
    items.length - 1;

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

      showToast(
        "Lien copié ✅",
      );
    } catch {
      showToast(
        "Impossible de copier",
      );
    }
  }

  function choose(
    choice:
      | "plus"
      | "moins",
  ) {
    if (
      !current ||
      !next ||
      revealed
    ) {
      return;
    }

    setSelected(choice);

    const isPlus =
      next.value >=
      current.value;

    const ok =
      (choice ===
        "plus" &&
        isPlus) ||
      (choice ===
        "moins" &&
        !isPlus);

    if (ok) {
      setScore(
        (prev) =>
          prev + 1,
      );
    }

    setRevealed(true);
  }

  function nextRound() {
    if (
      step + 1 >=
      items.length - 1
    ) {
      setStep(
        (prev) =>
          prev + 1,
      );

      return;
    }

    setStep(
      (prev) =>
        prev + 1,
    );

    setSelected(null);

    setRevealed(false);
  }

  function restart() {
    setStep(0);

    setScore(0);

    setSelected(null);

    setRevealed(false);
  }

  if (!current) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Données
            insuffisantes.
          </p>
        </div>

        {toast && (
          <div className="toastQui">
            {toast}
          </div>
        )}
      </>
    );
  }

  if (finished) {
    const pct = Math.round(
      (score / total) *
        100,
    );

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
        `J’ai fait ${score}/${total} au jeu "${game.title}" !`,
      );

    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Résultat du
                  jeu
                </span>

                <h3 className="resultTitle">
                  {pct >= 80
                    ? "Incroyable 🔥"
                    : pct >=
                        50
                      ? "Bien joué 👏"
                      : "Continue 💪"}
                </h3>

                <p className="resultSub">
                  Tu as obtenu{" "}
                  <strong>
                    {score}/
                    {total}
                  </strong>
                  .
                </p>
              </div>

              <div
                className="resultScoreCircle"
                style={{
                  background: `conic-gradient(#3055ff 0 ${pct}%, #e7ebff ${pct}% 100%)`,
                }}
              >
                <div className="resultScoreInner">
                  <div className="resultScoreMain">
                    {score}/
                    {total}
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
              onClick={
                restart
              }
            >
              Rejouer
            </button>

            <button
              className="quizBtnShare"
              onClick={
                copyLink
              }
            >
              Copier le
              lien
            </button>

            {nextGame ? (
              <a
                className="quizBtnPrimaryOutline"
                href={`/jeux/${nextGame.slug}`}
              >
                Jeu suivant
                →
              </a>
            ) : null}
          </div>

          <div className="shareBar">
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
                  `https://wa.me/?text=${shareText}%20${pageUrl}`,
                )
              }
            >
              WhatsApp
            </button>
          </div>
        </div>

        {toast && (
          <div className="toastQui">
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
            Manche{" "}
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
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="plusScene">
          <div className="plusTop">
            <div className="plusCity">
              {
                next?.label
              }
            </div>

            {revealed &&
            next ? (
              <div className="plusUnknown">
                {formatValue(
                  next.value,
                  next.suffix,
                )}
              </div>
            ) : (
              <div className="plusUnknown">
                ?
              </div>
            )}
          </div>

          <div className="plusVs">
            VS
          </div>

          <div className="plusBottom">
            <span className="plusLabel">
              {
                current.label
              }
            </span>

            <div className="plusValue">
              {formatValue(
                current.value,
                current.suffix,
              )}
            </div>
          </div>
        </div>

        {!revealed ? (
          <div className="plusActions">
            <button
              className="plusBtn plusBtn--up"
              onClick={() =>
                choose(
                  "plus",
                )
              }
            >
              ⬆ PLUS
            </button>

            <button
              className="plusBtn plusBtn--down"
              onClick={() =>
                choose(
                  "moins",
                )
              }
            >
              ⬇ MOINS
            </button>
          </div>
        ) : (
          <div className="quizExplain">
            <p
              style={{
                margin: 0,
              }}
            >
              {selected ===
              "plus"
                ? next &&
                  next.value >=
                    current.value
                  ? "Bonne réponse ✅"
                  : "Mauvaise réponse ❌"
                : next &&
                    next.value <
                      current.value
                  ? "Bonne réponse ✅"
                  : "Mauvaise réponse ❌"}
            </p>

            <div
              style={{
                marginTop: 14,
              }}
            >
              <button
                className="quizBtnPrimary"
                onClick={
                  nextRound
                }
              >
                {step +
                  1 >=
                total
                  ? "Voir le résultat"
                  : "Continuer"}
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