"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Game } from "@/lib/games";

type RankItem = {
  id: string;
  label: string;
  image?: string;
  alt?: string;
  rank: number;
};

type NextGame = {
  slug: string;
  title: string;
};

type RankingQuestion = {
  id: string;
  question: string;
  explanation?: string;
  items: RankItem[];
};

const MAX_MOVES = 4;

function getItems(game: Game): RankingQuestion[] {
  const data = game.data as {
    items?: RankingQuestion[];
  };

  return Array.isArray(data.items)
    ? data.items
    : [];
}

function openShare(url: string) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

function SortableItem({
  item,
  locked,
  position,
}: {
  item: RankItem;
  locked: boolean;
  position: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform,
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        classementCard
        ${
          locked
            ? "classementCard--locked"
            : ""
        }
        ${
          isDragging
            ? "classementCard--dragging"
            : ""
        }
      `}
    >
      <div className="classementPos">
        #{position + 1}
      </div>

      {item.image ? (
        <div className="classementThumb">
          <img
            src={item.image}
            alt={
              item.alt ?? item.label
            }
          />
        </div>
      ) : null}

      <div className="classementBody">
        <span className="classementLabel">
          {item.label}
        </span>

        {!locked ? (
          <span className="classementDrag">
            ⇅
          </span>
        ) : (
          <span className="classementCheck">
            ✓
          </span>
        )}
      </div>
    </div>
  );
}

export function ClassementPlayer({
  game,
  nextGame,
}: {
  game: Game;
  nextGame?: NextGame | null;
}) {
  const questions = getItems(game);

  const [step, setStep] = useState(0);

  const [score, setScore] = useState(0);

  const [toast, setToast] = useState<
    string | null
  >(null);

  const [items, setItems] = useState<
    RankItem[]
  >([]);

  const [lockedIds, setLockedIds] =
    useState<string[]>([]);

  const [validated, setValidated] =
    useState(false);

  const [failed, setFailed] =
    useState(false);

  const [movesLeft, setMovesLeft] =
    useState(MAX_MOVES);

  const scoredRef = useRef(false);

  const current = questions[step];

  const total = questions.length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );

  useEffect(() => {
    if (!current?.items) return;

    const shuffled = [
      ...current.items,
    ].sort(() => Math.random() - 0.5);

    setItems(shuffled);

    setLockedIds([]);

    setValidated(false);

    setFailed(false);

    setMovesLeft(MAX_MOVES);

    scoredRef.current = false;
  }, [step]);

  const finished = step >= total;

  const progress = useMemo(() => {
    if (total === 0) return 0;

    return Math.round(
      (step / total) * 100,
    );
  }, [step, total]);

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 1800);
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

  function handlePerfectRanking() {
    if (scoredRef.current) return;

    scoredRef.current = true;

    setValidated(true);

    setScore((prev) => prev + 1);

    showToast(
      "Classement parfait 🔥",
    );
  }

  function handleFailure() {
    setFailed(true);

    const ordered = [
      ...(current?.items ?? []),
    ].sort((a, b) => a.rank - b.rank);

    setItems(ordered);

    setLockedIds(
      ordered.map((item) => item.id),
    );

    showToast("Plus de coups 😭");
  }

  function handleDragEnd(
    event: DragEndEvent,
  ) {
    if (validated || failed) return;

    const { active, over } = event;

    if (!over || active.id === over.id)
      return;

    setItems((currentItems) => {
      const oldIndex =
        currentItems.findIndex(
          (i) => i.id === active.id,
        );

      const newIndex =
        currentItems.findIndex(
          (i) => i.id === over.id,
        );

      if (oldIndex === newIndex)
        return currentItems;

      const moved = arrayMove(
        currentItems,
        oldIndex,
        newIndex,
      );

      const correctIds = moved
        .filter(
          (item, index) =>
            item.rank === index + 1,
        )
        .map((item) => item.id);

      setLockedIds(correctIds);

      const nextMoves =
        movesLeft - 1;

      setMovesLeft(nextMoves);

      if (
        correctIds.length ===
        moved.length
      ) {
        handlePerfectRanking();
      } else if (nextMoves <= 0) {
        handleFailure();
      }

      return moved;
    });
  }

  function nextQuestion() {
    setStep((prev) => prev + 1);
  }

  function restart() {
    setStep(0);

    setScore(0);

    setValidated(false);

    setFailed(false);

    setLockedIds([]);

    setMovesLeft(MAX_MOVES);

    scoredRef.current = false;
  }

  if (!current?.items && !finished) {
    return (
      <div className="quizPanel">
        <p>Aucune question.</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round(
      (score / total) * 100,
    );

    const pageUrl = encodeURIComponent(
      typeof window !== "undefined"
        ? window.location.href
        : "",
    );

    const shareText = encodeURIComponent(
      `J’ai obtenu ${score}/${total} au jeu "${game.title}" !`,
    );

    return (
      <>
        <div className="quizPanel">
          <div className="resultHeadQuiz classementResult">
            <div className="resultTop">
              <div>
                <span className="resultKicker">
                  Résultat du jeu
                </span>

                <h3 className="resultTitle">
                  {pct >= 80
                    ? "Excellent 🏆"
                    : pct >= 50
                      ? "Bien joué 👏"
                      : "Continue 💪"}
                </h3>

                <p className="resultSub">
                  Tu as obtenu{" "}
                  <strong>
                    {score}/{total}
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
                    {score}/{total}
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
                  `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                )
              }
            >
              Facebook
            </button>
          </div>
        </div>

        {toast ? (
          <div className="toastQui">
            {toast}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="quizPanel">
        <div className="quizTop classementTop">
          <span className="quizCounter">
            Classement{" "}
            <strong>{step + 1}</strong> /{" "}
            {total}
          </span>

          <div className="classementStats">
            <span className="quizScore">
              Score : {score}
            </span>

            <span
              className={`
                classementMoves
                ${
                  movesLeft <= 1
                    ? "classementMoves--danger"
                    : ""
                }
              `}
            >
              {movesLeft} coup
              {movesLeft > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="quizProgressBar classementProgress">
          <div
            className="quizProgressFill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <h3 className="quizQuestion classementQuestion">
          {current?.question}
        </h3>

        <div className="classementBoard">
          <DndContext
            sensors={sensors}
            collisionDetection={
              closestCenter
            }
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(
                (item) => item.id,
              )}
              strategy={
                verticalListSortingStrategy
              }
            >
              <div className="classementList">
                {items.map(
                  (item, index) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      locked={lockedIds.includes(
                        item.id,
                      )}
                      position={index}
                    />
                  ),
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {validated || failed ? (
          <div className="quizExplain classementExplain">
            <p style={{ margin: 0 }}>
              {validated
                ? "✅ Classement parfait"
                : "❌ Classement raté"}
            </p>

            <p
              style={{
                marginTop: 10,
              }}
            >
              {current?.explanation ??
                "Classement révélé."}
            </p>

            <div
              style={{
                marginTop: 14,
              }}
            >
              <button
                className="quizBtnPrimary"
                onClick={nextQuestion}
              >
                {step + 1 >= total
                  ? "Voir le résultat final"
                  : "Classement suivant"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {toast ? (
        <div className="toastQui">
          {toast}
        </div>
      ) : null}
    </>
  );
}
