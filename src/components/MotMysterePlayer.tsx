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

const KEYBOARD = [
  "AZERTYUIOP",
  "QSDFGHJKLM",
  "WXCVBN",
];

export function MotMysterePlayer({
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

  const maxTries = 6;

  const [
    currentGuess,
    setCurrentGuess,
  ] = useState("");

  const [guesses, setGuesses] =
    useState<string[]>([]);

  const [message, setMessage] =
    useState<string | null>(
      null,
    );

  const [finished, setFinished] =
    useState(false);

  const [won, setWon] =
    useState(false);

  const progress =
    useMemo(() => {
      return Math.round(
        (guesses.length /
          maxTries) *
          100,
      );
    }, [guesses.length]);

  function addLetter(
    letter: string,
  ) {
    if (finished) return;

    if (
      currentGuess.length >=
      answer.length
    ) {
      return;
    }

    setCurrentGuess(
      (prev) =>
        prev + letter,
    );

    setMessage(null);
  }

  function removeLetter() {
    if (finished) return;

    setCurrentGuess(
      (prev) =>
        prev.slice(0, -1),
    );
  }

  function submitGuess() {
    if (finished) return;

    if (
      currentGuess.length !==
      answer.length
    ) {
      setMessage(
        `Le mot doit faire ${answer.length} lettres.`,
      );

      return;
    }

    const nextGuesses = [
      ...guesses,
      currentGuess,
    ];

    setGuesses(
      nextGuesses,
    );

    if (
      currentGuess ===
      answer
    ) {
      setWon(true);

      setFinished(true);

      return;
    }

    if (
      nextGuesses.length >=
      maxTries
    ) {
      setWon(false);

      setFinished(true);

      return;
    }

    setCurrentGuess("");

    setMessage(null);
  }

  function restartSameWord() {
    setCurrentGuess("");

    setGuesses([]);

    setMessage(null);

    setFinished(false);

    setWon(false);
  }

  function nextWord() {
    const nextIndex =
      words.length
        ? (wordIndex + 1) %
          words.length
        : 0;

    setWordIndex(nextIndex);

    setCurrentGuess("");

    setGuesses([]);

    setMessage(null);

    setFinished(false);

    setWon(false);
  }

  function getLetterStatus(
    letter: string,
    index: number,
  ) {
    if (
      answer[index] ===
      letter
    ) {
      return "isCorrect";
    }

    if (
      answer.includes(
        letter,
      )
    ) {
      return "isCorrectSoft";
    }

    return "isDisabled";
  }

  function getKeyboardStatus(
    letter: string,
  ) {
    let status = "";

    for (const guess of guesses) {
      for (
        let i = 0;
        i < guess.length;
        i++
      ) {
        if (
          guess[i] !== letter
        ) {
          continue;
        }

        const s =
          getLetterStatus(
            letter,
            i,
          );

        if (
          s ===
          "isCorrect"
        ) {
          return "isCorrect";
        }

        if (
          s ===
          "isCorrectSoft"
        ) {
          status =
            "isCorrectSoft";
        }

        if (!status) {
          status =
            "isDisabled";
        }
      }
    }

    return status;
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
                  {won
                    ? "Mot trouvé 🎉"
                    : "Mot non trouvé 😅"}
                </h3>

                <p className="resultSub">
                  {won ? (
                    <>
                      Trouvé en{" "}
                      <strong>
                        {
                          guesses.length
                        }
                      </strong>{" "}
                      essai
                      {guesses.length >
                      1
                        ? "s"
                        : ""}
                      .
                    </>
                  ) : (
                    <>
                      Le mot
                      était :{" "}
                      <strong>
                        {answer}
                      </strong>
                    </>
                  )}
                </p>
              </div>
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
              className="quizBtnPrimary"
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

  const rows =
    Array.from(
      {
        length:
          maxTries,
      },
      (
        _,
        rowIndex,
      ) => {
        if (
          guesses[
            rowIndex
          ]
        ) {
          return guesses[
            rowIndex
          ];
        }

        if (
          rowIndex ===
          guesses.length
        ) {
          return currentGuess;
        }

        return "";
      },
    );

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop">
          <span className="quizCounter">
            Essai{" "}
            <strong>
              {
                guesses.length +
                1
              }
            </strong>{" "}
            / {maxTries}
          </span>

          <span className="quizScore">
            Mot de{" "}
            {
              answer.length
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
          mystère
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

        <div
          className="wordleGrid"
          style={
            {
              "--word-length":
                answer.length,
            } as React.CSSProperties
          }
        >
          {rows.map(
            (
              row,
              rowIndex,
            ) => (
              <div
                className="wordleRow"
                key={
                  rowIndex
                }
              >
                {Array.from(
                  {
                    length:
                      answer.length,
                  },
                  (
                    _,
                    colIndex,
                  ) => {
                    const letter =
                      row[
                        colIndex
                      ] ??
                      "";

                    const isValidated =
                      rowIndex <
                      guesses.length;

                    let cls =
                      "wordleCell";

                    if (
                      isValidated &&
                      letter
                    ) {
                      cls += ` ${getLetterStatus(
                        letter,
                        colIndex,
                      )}`;
                    }

                    return (
                      <span
                        className={
                          cls
                        }
                        key={
                          colIndex
                        }
                      >
                        {
                          letter
                        }
                      </span>
                    );
                  },
                )}
              </div>
            ),
          )}
        </div>

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
                      const status =
                        getKeyboardStatus(
                          letter,
                        );

                      return (
                        <button
                          key={
                            letter
                          }
                          type="button"
                          className={`wordleKey ${status}`}
                          onClick={() =>
                            addLetter(
                              letter,
                            )
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

          <div className="wordleKeyboardRow">
            <button
              type="button"
              className="wordleKey wordleKey--wide"
              onClick={
                removeLetter
              }
            >
              Effacer
            </button>

            <button
              type="button"
              className="wordleKey wordleKey--wide"
              onClick={
                submitGuess
              }
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </>
  );
}