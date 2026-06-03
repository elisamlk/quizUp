"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type WordItem = {
  id: string;
  word: string;
  hint?: string;
};

function getWords(game: Game): WordItem[] {
  const data = game.data as {
    words?: WordItem[];
  };

  return Array.isArray(data.words)
    ? data.words
    : [];
}

function normalizeWord(
  word: string,
) {
  return word
    .toUpperCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

function isGuessableLetter(
  char: string,
) {
  return /^[A-Z]$/.test(
    char,
  );
}

const KEYBOARD = [
  "AZERTYUIOP",
  "QSDFGHJKLM",
  "WXCVBN",
];

const MAX_ERRORS = 7;

export function PenduPlayer({
  game,
}: {
  game: Game;
}) {
  const words =
    getWords(game);

  const [
    wordIndex,
    setWordIndex,
  ] = useState(0);

  const currentWord =
    words[wordIndex];

  const answer =
    currentWord
      ? normalizeWord(
          currentWord.word,
        )
      : "";

  const [
    guessedLetters,
    setGuessedLetters,
  ] = useState<string[]>(
    [],
  );

  const [message, setMessage] =
    useState<string | null>(
      null,
    );

  const wrongLetters =
    useMemo(() => {
      return guessedLetters.filter(
        (letter) =>
          !answer.includes(
            letter,
          ),
      );
    }, [
      guessedLetters,
      answer,
    ]);

  const errors =
    wrongLetters.length;

  const visibleLetterCount =
    useMemo(() => {
      return answer
        .split("")
        .filter(
          isGuessableLetter,
        ).length;
    }, [answer]);

  const isWon = useMemo(() => {
    if (!answer)
      return false;

    return answer
      .split("")
      .every((letter) => {
        if (
          !isGuessableLetter(
            letter,
          )
        ) {
          return true;
        }

        return guessedLetters.includes(
          letter,
        );
      });
  }, [
    answer,
    guessedLetters,
  ]);

  const isLost =
    errors >= MAX_ERRORS;

  const finished =
    isWon || isLost;

  const progress =
    Math.round(
      (errors /
        MAX_ERRORS) *
        100,
    );

  function chooseLetter(
    letter: string,
  ) {
    if (finished) return;

    if (
      guessedLetters.includes(
        letter,
      )
    ) {
      setMessage(
        "Lettre déjà utilisée.",
      );

      return;
    }

    setGuessedLetters(
      (prev) => [
        ...prev,
        letter,
      ],
    );

    setMessage(null);
  }

  function restartSameWord() {
    setGuessedLetters([]);

    setMessage(null);

  

   
  }

  function nextWord() {
    const nextIndex =
      words.length
        ? (wordIndex + 1) %
          words.length
        : 0;

    setWordIndex(nextIndex);

    setGuessedLetters([]);

    setMessage(null);

   

   
  }

  function renderHiddenWord() {
    return answer
      .split("")
      .map(
        (
          letter,
          index,
        ) => {
          if (
            letter ===
            " "
          ) {
            return (
              <span
                className="penduSpace"
                key={`space-${index}`}
              >
                &nbsp;
              </span>
            );
          }

          if (
            !isGuessableLetter(
              letter,
            )
          ) {
            return (
              <span
                className="penduSymbol"
                key={`symbol-${letter}-${index}`}
              >
                {letter}
              </span>
            );
          }

          const visible =
            guessedLetters.includes(
              letter,
            ) ||
            finished;

          return (
            <span
              className={`penduLetter ${
                visible
                  ? "isVisible"
                  : ""
              }`}
              key={`${letter}-${index}`}
            >
              {visible
                ? letter
                : ""}
            </span>
          );
        },
      );
  }

  if (!currentWord) {
    return (
      <div className="quizPanel">
        <p>
          Aucun mot
          disponible pour
          ce jeu.
        </p>
      </div>
    );
  }

  if (finished) {
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
                  {isWon
                    ? "Bravo 🎉"
                    : "Perdu 😅"}
                </h3>

                <p className="resultSub">
                  Le mot
                  était :{" "}
                  <strong>
                    {answer}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="penduBox penduBox--result">
            <div className="penduWord penduWord--result">
              {renderHiddenWord()}
            </div>
          </div>

          <div className="resultActions">
            <button
              className="quizBtnPrimary"
              onClick={
                restartSameWord
              }
            >
              Rejouer
            </button>

            <button
              className="quizBtnPrimaryOutline"
              onClick={
                nextWord
              }
            >
              Mot suivant →
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop">
          <span className="quizCounter">
            Erreurs{" "}
            <strong>
              {errors}
            </strong>{" "}
            /{" "}
            {
              MAX_ERRORS
            }
          </span>

          <span className="quizScore">
            {
              visibleLetterCount
            }{" "}
            lettres
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

        <h3 className="quizQuestion">
          Trouve le mot
          avant d’être
          pendu
        </h3>

        {currentWord.hint ? (
          <div className="quizExplain">
            <p
              style={{
                margin: 0,
              }}
            >
              Indice :{" "}
              {
                currentWord.hint
              }
            </p>
          </div>
        ) : null}

        <div className="penduBox">
          <div
            className="penduDrawing"
            aria-hidden="true"
          >
            <div className="penduBase" />

            <div className="penduPole" />

            <div className="penduTop" />

            <div className="penduRope" />

            {errors >= 1 ? (
              <div className="penduHead" />
            ) : null}

            {errors >= 2 ? (
              <div className="penduBody" />
            ) : null}

            {errors >= 3 ? (
              <div className="penduArm penduArm--left" />
            ) : null}

            {errors >= 4 ? (
              <div className="penduArm penduArm--right" />
            ) : null}

            {errors >= 5 ? (
              <div className="penduLeg penduLeg--left" />
            ) : null}

            {errors >= 6 ? (
              <div className="penduLeg penduLeg--right" />
            ) : null}

            {errors >= 7 ? (
              <div className="penduFace" />
            ) : null}
          </div>

          <div className="penduWord">
            {renderHiddenWord()}
          </div>
        </div>

        {wrongLetters.length >
        0 ? (
          <p className="penduWrong">
            Lettres
            fausses :{" "}
            {wrongLetters.join(
              ", ",
            )}
          </p>
        ) : null}

        {message ? (
          <div
            className="quizExplain"
            style={{
              marginTop: 14,
            }}
          >
            <p
              style={{
                margin: 0,
              }}
            >
              {message}
            </p>
          </div>
        ) : null}

        <div className="wordleKeyboard">
          {KEYBOARD.map(
            (row) => (
              <div
                className="wordleKeyboardRow"
                key={row}
              >
                {row
                  .split("")
                  .map(
                    (
                      letter,
                    ) => {
                      const used =
                        guessedLetters.includes(
                          letter,
                        );

                      const correct =
                        used &&
                        answer.includes(
                          letter,
                        );

                      const wrong =
                        used &&
                        !answer.includes(
                          letter,
                        );

                      let cls =
                        "wordleKey";

                      if (
                        correct
                      ) {
                        cls +=
                          " isCorrect";
                      }

                      if (
                        wrong
                      ) {
                        cls +=
                          " isDisabled";
                      }

                      return (
                        <button
                          key={
                            letter
                          }
                          type="button"
                          className={
                            cls
                          }
                          onClick={() =>
                            chooseLetter(
                              letter,
                            )
                          }
                          disabled={
                            used
                          }
                        >
                          {
                            letter
                          }
                        </button>
                      );
                    },
                  )}
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}
