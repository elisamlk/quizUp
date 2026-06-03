"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type NextGame = {
  slug: string;
  title: string;
};

type MemoryCardItem = {
  id: string;
  label?: string;
  emoji?: string;
  image?: string;
};

type MemoryCard = MemoryCardItem & {
  uid: string;
};

function getCards(game: Game): MemoryCardItem[] {
  const data = game.data as {
    cards?: MemoryCardItem[];
  };

  return Array.isArray(data.cards)
    ? data.cards
    : [];
}

function shuffleArray<T>(
  items: T[],
): T[] {
  return [...items].sort(
    () => Math.random() - 0.5,
  );
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

export function MemoryPlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const baseCards =
    getCards(game);

  const initialCards =
    useMemo<MemoryCard[]>(
      () => {
        return shuffleArray(
          baseCards.flatMap(
            (card) => [
              {
                ...card,
                uid: `${card.id}-a`,
              },
              {
                ...card,
                uid: `${card.id}-b`,
              },
            ],
          ),
        );
      },
      [baseCards],
    );

  const [cards, setCards] =
    useState<MemoryCard[]>(
      initialCards,
    );

  const [flipped, setFlipped] =
    useState<string[]>([]);

  const [matched, setMatched] =
    useState<string[]>([]);

  const [moves, setMoves] =
    useState(0);

  const [locked, setLocked] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(
      null,
    );

  const totalPairs =
    baseCards.length;

  const finished =
    totalPairs > 0 &&
    matched.length ===
      totalPairs;

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

  function restart() {
    setCards(
      shuffleArray(
        initialCards,
      ),
    );

    setFlipped([]);

    setMatched([]);

    setMoves(0);

    setLocked(false);
  }

  function chooseCard(
    card: MemoryCard,
  ) {
    if (locked) return;

    if (
      matched.includes(
        card.id,
      )
    ) {
      return;
    }

    if (
      flipped.includes(
        card.uid,
      )
    ) {
      return;
    }

    if (
      flipped.length >= 2
    ) {
      return;
    }

    const nextFlipped = [
      ...flipped,
      card.uid,
    ];

    setFlipped(
      nextFlipped,
    );

    if (
      nextFlipped.length !==
      2
    ) {
      return;
    }

    setMoves(
      (prev) => prev + 1,
    );

    setLocked(true);

    const first =
      cards.find(
        (c) =>
          c.uid ===
          nextFlipped[0],
      );

    const second =
      cards.find(
        (c) =>
          c.uid ===
          nextFlipped[1],
      );

    if (
      first &&
      second &&
      first.id === second.id
    ) {
      window.setTimeout(() => {
        setMatched(
          (prev) => [
            ...prev,
            first.id,
          ],
        );

        setFlipped([]);

        setLocked(false);
      }, 450);

      return;
    }

    window.setTimeout(() => {
      setFlipped([]);

      setLocked(false);
    }, 850);
  }

  if (totalPairs === 0) {
    return (
      <>
        <div className="quizPanel">
          <p>
            Aucune carte
            disponible pour
            ce jeu.
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
        `J’ai terminé le jeu "${game.title}" en ${moves} coups !`,
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
                  Memory terminé
                  🎉
                </h3>

                <p className="resultSub">
                  Tu as retrouvé
                  les {totalPairs}{" "}
                  paires en{" "}
                  <strong>
                    {moves}
                  </strong>{" "}
                  coup
                  {moves > 1
                    ? "s"
                    : ""}
                  .
                </p>
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

          {nextGame ? (
            <p className="resultNextHint">
              Prochain :{" "}
              <strong>
                {
                  nextGame.title
                }
              </strong>
            </p>
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

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop">
          <span className="quizCounter">
            Paires{" "}
            <strong>
              {
                matched.length
              }
            </strong>{" "}
            / {totalPairs}
          </span>

          <span className="quizScore">
            Coups : {moves}
          </span>
        </div>

        <div
          className="quizProgressBar"
          aria-hidden="true"
        >
          <div
            className="quizProgressFill"
            style={{
              width: `${Math.round(
                (matched.length /
                  totalPairs) *
                  100,
              )}%`,
            }}
          />
        </div>

        <h3 className="quizQuestion">
          Retrouve toutes
          les paires
        </h3>

        <div className="memoryGrid">
          {cards.map(
            (card) => {
              const isFlipped =
                flipped.includes(
                  card.uid,
                );

              const isMatched =
                matched.includes(
                  card.id,
                );

              const isVisible =
                isFlipped ||
                isMatched;

              return (
                <button
                  key={
                    card.uid
                  }
                  type="button"
                  className={`memoryCard ${
                    isVisible
                      ? "isVisible"
                      : ""
                  } ${
                    isMatched
                      ? "isMatched"
                      : ""
                  }`}
                  onClick={() =>
                    chooseCard(
                      card,
                    )
                  }
                  disabled={
                    isMatched
                  }
                  aria-label={
                    isVisible
                      ? card.label ??
                        card.id
                      : "Carte retournée"
                  }
                >
                  <span className="memoryCardInner">
                    <span className="memoryCardBack">
                      ?
                    </span>

                    <span className="memoryCardFront">
                      {card.image ? (
                        <img
                          src={
                            card.image
                          }
                          alt={
                            card.label ??
                            card.id
                          }
                        />
                      ) : (
                        <span className="memoryEmoji">
                          {card.emoji ??
                            card.label ??
                            card.id}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            },
          )}
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
