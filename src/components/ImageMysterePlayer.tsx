"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Game } from "@/lib/games";

type NextGame = {
  slug: string;
  title: string;
};

type MystereItem = {
  id: string;
  image: string;
  answer: string;
  hints?: string[];
};

function getItems(game: Game): MystereItem[] {
  const data = game.data as {
    items?: MystereItem[];
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
    .replace(/[\u0300-\u036f]/g, "");
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

export function ImageMysterePlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const items = getItems(game);

  const [step, setStep] =
    useState(0);

  const [
    blurLevel,
    setBlurLevel,
  ] = useState(28);

  const [input, setInput] =
    useState("");

  const [
    revealed,
    setRevealed,
  ] = useState(false);

  const [score, setScore] =
    useState(0);

  const [toast, setToast] =
    useState<string | null>(
      null,
    );

  const current = items[step];

  const total = items.length;

  const progress =
    useMemo(() => {
      return Math.round(
        ((28 - blurLevel) /
          28) *
          100,
      );
    }, [blurLevel]);

  const finished =
    step >= total;

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

  function revealAnswer() {
    setBlurLevel(0);
    setRevealed(true);
  }

  function submitAnswer() {
    if (
      !current ||
      revealed
    ) {
      return;
    }

    const ok =
      normalize(input) ===
      normalize(
        current.answer,
      );

    if (ok) {
      const gained =
        Math.max(
          1,
          Math.round(
            blurLevel / 4,
          ),
        );

      setScore(
        (prev) =>
          prev + gained,
      );

      setRevealed(true);

      return;
    }

    setBlurLevel((prev) => {
      const next =
        Math.max(
          0,
          prev - 6,
        );

      if (next <= 0) {
        setRevealed(true);
      }

      return next;
    });

    showToast(
      "Mauvaise réponse",
    );
  }

  function revealMore() {
    setBlurLevel((prev) => {
      const next =
        Math.max(
          0,
          prev - 5,
        );

      if (next <= 0) {
        setRevealed(true);
      }

      return next;
    });
  }

  function nextImage() {
    if (
      step + 1 >= total
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

    setBlurLevel(28);
    setInput("");
    setRevealed(false);
  }

  function restart() {
    setStep(0);
    setBlurLevel(28);
    setInput("");
    setRevealed(false);
    setScore(0);
  }

  if (
    !current &&
    !finished
  ) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Données insuffisantes.
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
    const maxScore =
      total * 7;

    const pct = Math.round(
      (score / maxScore) *
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
        `J’ai obtenu ${score} points au jeu "${game.title}" !`,
      );

    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz imageMystereResult">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Résultat du jeu
                </span>

                <h3 className="resultTitle">
                  {pct >= 80
                    ? "Vision incroyable 👀"
                    : pct >= 50
                      ? "Bien joué 🔥"
                      : "Continue 💪"}
                </h3>

                <p className="resultSub">
                  Tu as obtenu{" "}
                  <strong>
                    {score} points
                  </strong>
                  .
                </p>
              </div>

              <div
                className="resultScoreCircle imageMystereScoreCircle"
                style={{
                  background: `conic-gradient(#3055ff 0 ${pct}%, #e7ebff ${pct}% 100%)`,
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

          <div className="resultActions imageMystereActions">
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

          <div className="shareBar imageMystereShareBar">
            <button
              className="shareBtn"
              onClick={
                copyLink
              }
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
        <div className="quizTop imageMystereTop">
          <span className="quizCounter">
            Image{" "}
            <strong>
              {step + 1}
            </strong>{" "}
            / {total}
          </span>

          <span className="quizScore">
            Score : {score}
          </span>
        </div>

        <div className="quizProgressBar imageMystereProgress">
          <div
            className="quizProgressFill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <h3 className="quizQuestion imageMystereQuestion">
          Devine l’image mystère
        </h3>

        <div className="imageMystereSlides">
          {items.map(
            (item, index) => {
              const isActive =
                index === step;

              return (
                <article
                  key={item.id}
                  className={`blurGame imageMystereGame imageMystereSlide ${
                    isActive
                      ? "is-active"
                      : index < step
                        ? "is-before"
                        : "is-after"
                  }`}
                  aria-current={
                    isActive
                      ? "step"
                      : undefined
                  }
                >
                  <h4 className="imageMystereSeoTitle">
                    Animal mystère{" "}
                    {index + 1} :{" "}
                    {item.answer}
                  </h4>

                  <div className="blurImageWrap imageMystereImageWrap">
                    <Image
                      src={
                        item.image
                      }
                      alt={
                        `Image mystère : ${item.answer}`
                      }
                      fill
                      unoptimized
                      className="blurImage imageMystereImage"
                      style={{
                        objectFit:
                          "cover",
                        filter:
                          isActive
                            ? `blur(${
                                revealed
                                  ? 0
                                  : blurLevel
                              }px)`
                            : "blur(0px)",
                      }}
                    />
                  </div>

                  <div className="imageMystereSeoHints">
                    {item.hints?.map(
                      (
                        hint,
                        hintIndex,
                      ) => (
                        <p
                          key={`${item.id}-hint-${hintIndex}`}
                        >
                          Indice{" "}
                          {hintIndex +
                            1}
                          : {hint}
                        </p>
                      ),
                    )}

                    <p>
                      Réponse :{" "}
                      <strong>
                        {
                          item.answer
                        }
                      </strong>
                    </p>
                  </div>

                  {isActive ? (
                    <>
                      {item.hints
                        ?.length ? (
                        <div className="quizExplain imageMystereHint">
                          <p
                            style={{
                              margin:
                                0,
                            }}
                          >
                            Indice :{" "}
                            {
                              item
                                .hints[
                                Math.min(
                                  item
                                    .hints
                                    .length -
                                    1,
                                  Math.floor(
                                    (28 -
                                      blurLevel) /
                                      7,
                                  ),
                                )
                              ]
                            }
                          </p>
                        </div>
                      ) : null}

                      {!revealed ? (
                        <>
                          <div className="quiInputWrap imageMystereInputWrap">
                            <input
                              type="text"
                              className="quiInput imageMystereInput"
                              placeholder="Ta réponse..."
                              value={
                                input
                              }
                              onChange={(
                                e,
                              ) =>
                                setInput(
                                  e
                                    .target
                                    .value,
                                )
                              }
                              onKeyDown={(
                                e,
                              ) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  submitAnswer();
                                }
                              }}
                            />

                            <button
                              className="quizBtnPrimary quiBtn imageMystereBtn"
                              onClick={
                                submitAnswer
                              }
                            >
                              Valider
                            </button>
                          </div>

                          <div className="imageMystereActionsRow">
                            <button
                              className="quizBtnGhost imageMystereRevealBtn"
                              onClick={
                                revealMore
                              }
                            >
                              Révéler un
                              peu plus
                            </button>

                            <button
                              className="quizBtnGhost imageMystereRevealAnswerBtn"
                              onClick={
                                revealAnswer
                              }
                            >
                              Voir la
                              réponse
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="quizExplain imageMystereReveal">
                          <p
                            style={{
                              margin:
                                0,
                            }}
                          >
                            Réponse :{" "}
                            <strong>
                              {
                                item.answer
                              }
                            </strong>
                          </p>

                          <div
                            style={{
                              marginTop:
                                14,
                            }}
                          >
                            <button
                              className="quizBtnPrimary"
                              onClick={
                                nextImage
                              }
                            >
                              {step +
                                  1 >=
                                total
                                ? "Voir le résultat"
                                : "Image suivante"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </article>
              );
            },
          )}
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