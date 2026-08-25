"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";

type RelatedItem = {
  slug: string;
  title: string;
  questions: { question?: string; id?: string }[];
  category: {
    name: string;
    slug: string;
  };
  images?: {
    thumbnail?: string;
    cover?: string;
  };
};

type Props = {
  children: ReactNode;
  related: RelatedItem[];
  categorySlug: string;
  categoryName: string;
  type?: "quiz" | "personality";
};

export function QuizDisplay({
  children,
  related,
  categorySlug,
  categoryName,
  type = "quiz",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const quizRef = useRef<HTMLDivElement | null>(null);
  const relatedRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const moreRef = useRef<HTMLParagraphElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncHeights = () => {
      const quizEl = quizRef.current;
      const relatedEl = relatedRef.current;
      const titleEl = titleRef.current;
      const moreEl = moreRef.current;
      const gridEl = gridRef.current;

      if (!quizEl || !relatedEl || !gridEl) return;

      const quizHeight = quizEl.offsetHeight;

      relatedEl.style.height = `${quizHeight}px`;

      const relatedStyles = window.getComputedStyle(relatedEl);
      const titleHeight = titleEl?.offsetHeight ?? 0;
      const moreHeight = moreEl?.offsetHeight ?? 0;
      const paddingTop = parseFloat(relatedStyles.paddingTop || "0");
      const paddingBottom = parseFloat(relatedStyles.paddingBottom || "0");
      const rowGap = parseFloat(
        relatedStyles.rowGap || relatedStyles.gap || "0",
      );

      const availableHeight =
        quizHeight -
        titleHeight -
        moreHeight -
        paddingTop -
        paddingBottom -
        rowGap * 2;

      gridEl.style.height = `${Math.max(0, availableHeight)}px`;
    };

    syncHeights();

    const resizeObserver = new ResizeObserver(() => {
      syncHeights();
    });

    if (quizRef.current) {
      resizeObserver.observe(quizRef.current);
    }

    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }

    if (moreRef.current) {
      resizeObserver.observe(moreRef.current);
    }

    window.addEventListener("resize", syncHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);
    };
  }, []);

  const itemHrefBase =
    type === "personality"
      ? "/personalite"
      : "/quiz";

  const categoryHrefBase =
    type === "personality"
      ? "/personalite/categorie"
      : "/categorie";

  return (
    <div
      ref={wrapperRef}
      className="quiz-display"
    >
      <div
        ref={quizRef}
        className="quiz-display-main"
      >
        {children}
      </div>

      {related.length > 0 ? (
        <section
          ref={relatedRef}
          className="related"
        >
          <h2
            ref={titleRef}
            className="sectionTitle"
          >
            {type === "personality"
              ? "Tests similaires"
              : "Quiz similaires"}
          </h2>

          <div
            ref={gridRef}
            className="relatedGrid"
          >
            {related.map((item) => {
              const img =
                item.images?.thumbnail ||
                item.images?.cover ||
                "/images/placeholder-thumb.jpg";

              return (
                <Link
                  key={item.slug}
                  href={`${itemHrefBase}/${item.slug}`}
                  className="relatedCard"
                  style={{
                    backgroundImage: `url("${img}")`,
                  }}
                >
                  <span className="relatedCardOverlay" />

                  <h3 className="relatedCardTitle">
                    {item.title}
                  </h3>
                </Link>
              );
            })}
          </div>

          <p
            ref={moreRef}
            className="relatedMore"
          >
            <Link
              href={`${categoryHrefBase}/${categorySlug}`}
            >
              {type === "personality"
                ? `Voir tous les tests ${categoryName} →`
                : `Voir tous les quiz ${categoryName} →`}
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}