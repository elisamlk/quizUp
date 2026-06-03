"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type PairItem = {
  id: string;
  left: string;
  right: string;
};

type RightItem = PairItem & {
  originalIndex: number;
};

function getPairs(game: Game): PairItem[] {
  const data = game.data as { pairs?: PairItem[] };
  return Array.isArray(data.pairs) ? data.pairs : [];
}

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function AssociationPlayer({ game }: { game: Game }) {
  const pairs = getPairs(game);

  const rightItems = useMemo<RightItem[]>(
    () =>
      shuffleArray(
        pairs.map((pair, index) => ({
          ...pair,
          originalIndex: index,
        })),
      ),
    [pairs],
  );

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongRight, setWrongRight] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);

  const total = pairs.length;
  const finished = total > 0 && matched.length === total;

  function chooseLeft(index: number) {
    if (matched.includes(index)) return;

    setSelectedLeft(index);
    setWrongRight(null);
  }

  function chooseRight(item: RightItem) {
    if (selectedLeft === null) return;
    if (matched.includes(item.originalIndex)) return;

    if (item.originalIndex === selectedLeft) {
      setMatched((prev) => [...prev, selectedLeft]);
      setSelectedLeft(null);
      setWrongRight(null);
      return;
    }

    setErrors((prev) => prev + 1);
    setWrongRight(item.originalIndex);
  }

  function restart() {
    setSelectedLeft(null);
    setMatched([]);
    setWrongRight(null);
    setErrors(0);
  }

  if (total === 0) {
    return (
      <div className="quizPanel">
        <p>Aucune association disponible pour ce jeu.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quizPanel">
        <div className="resultHeadQuiz">
          <div className="resultTop">
            <div>
              <span className="resultKicker">
                Résultat du jeu
              </span>

              <h3 className="resultTitle">
                Associations terminées 🎉
              </h3>

              <p className="resultSub">
                Tu as trouvé les {total} associations avec{" "}
                <strong>{errors}</strong> erreur
                {errors > 1 ? "s" : ""}.
              </p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="quizPanel">
      <div className="quizTop">
        <span className="quizCounter">
          Associations{" "}
          <strong>{matched.length}</strong> / {total}
        </span>

        <span className="quizScore">
          Erreurs : {errors}
        </span>
      </div>

      <div className="quizProgressBar" aria-hidden="true">
        <div
          className="quizProgressFill"
          style={{
            width: `${Math.round(
              (matched.length / total) * 100,
            )}%`,
          }}
        />
      </div>

      <h3 className="quizQuestion">
        Associe les bonnes réponses
      </h3>

      <div className="associationGame">
        <div className="associationColumn">
          {pairs.map((pair, index) => {
            const isSelected =
              selectedLeft === index;

            const isMatched =
              matched.includes(index);

            return (
              <button
                key={pair.id}
                type="button"
                className={`associationCard ${
                  isSelected ? "isSelected" : ""
                } ${isMatched ? "isMatched" : ""}`}
                onClick={() => chooseLeft(index)}
                disabled={isMatched}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="associationColumn">
          {rightItems.map((item) => {
            const isMatched = matched.includes(
              item.originalIndex,
            );

            const isWrong =
              wrongRight === item.originalIndex;

            return (
              <button
                key={`${item.id}-${item.right}`}
                type="button"
                className={`associationCard ${
                  isMatched ? "isMatched" : ""
                } ${isWrong ? "isWrong" : ""}`}
                onClick={() => chooseRight(item)}
                disabled={isMatched}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>

      <div className="quizExplain">
        <p style={{ margin: 0 }}>
          Sélectionne un élément à gauche,
          puis sa correspondance à droite.
        </p>
      </div>
    </div>
  );
}