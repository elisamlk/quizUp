// "use client";

// import Link from "next/link";
// import { ReactNode, useEffect, useRef } from "react";

// import type { GameTypeCard } from "@/lib/games";

// type Props = {
//   children: ReactNode;
//   gameTypes?: GameTypeCard[];
// };

// export function GameDisplay({
//   children,
//   gameTypes = [],
// }: Props) {
//   const wrapperRef = useRef<HTMLDivElement | null>(null);

//   const gameRef = useRef<HTMLDivElement | null>(null);

//   const relatedRef = useRef<HTMLElement | null>(null);

//   const titleRef =
//     useRef<HTMLHeadingElement | null>(null);

//   const moreRef =
//     useRef<HTMLParagraphElement | null>(null);

//   const gridRef =
//     useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const syncHeights = () => {
//       const gameEl = gameRef.current;
//       const relatedEl = relatedRef.current;
//       const titleEl = titleRef.current;
//       const moreEl = moreRef.current;
//       const gridEl = gridRef.current;

//       if (
//         !gameEl ||
//         !relatedEl ||
//         !gridEl
//       ) {
//         return;
//       }

//       const isMobile =
//         window.innerWidth <= 1100;

//       if (isMobile) {
//         relatedEl.style.height = "auto";
//         gridEl.style.height = "auto";
//         return;
//       }

//       const gameHeight =
//         gameEl.offsetHeight;

//       relatedEl.style.height = `${gameHeight}px`;

//       const relatedStyles =
//         window.getComputedStyle(
//           relatedEl,
//         );

//       const titleHeight =
//         titleEl?.offsetHeight ?? 0;

//       const moreHeight =
//         moreEl?.offsetHeight ?? 0;

//       const paddingTop = parseFloat(
//         relatedStyles.paddingTop || "0",
//       );

//       const paddingBottom =
//         parseFloat(
//           relatedStyles.paddingBottom ||
//             "0",
//         );

//       const rowGap = parseFloat(
//         relatedStyles.rowGap ||
//           relatedStyles.gap ||
//           "0",
//       );

//       const availableHeight =
//         gameHeight -
//         titleHeight -
//         moreHeight -
//         paddingTop -
//         paddingBottom -
//         rowGap * 2;

//       gridEl.style.height = `${Math.max(
//         0,
//         availableHeight,
//       )}px`;
//     };

//     syncHeights();

//     const resizeObserver =
//       new ResizeObserver(() => {
//         syncHeights();
//       });

//     if (gameRef.current) {
//       resizeObserver.observe(
//         gameRef.current,
//       );
//     }

//     if (titleRef.current) {
//       resizeObserver.observe(
//         titleRef.current,
//       );
//     }

//     if (moreRef.current) {
//       resizeObserver.observe(
//         moreRef.current,
//       );
//     }

//     window.addEventListener(
//       "resize",
//       syncHeights,
//     );

//     return () => {
//       resizeObserver.disconnect();

//       window.removeEventListener(
//         "resize",
//         syncHeights,
//       );
//     };
//   }, []);

//   return (
//     <div
//       ref={wrapperRef}
//       className="quiz-display"
//     >
//       <div
//         ref={gameRef}
//         className="quiz-display-main"
//       >
//         {children}
//       </div>

//       {gameTypes.length > 0 ? (
//         <section
//           ref={relatedRef}
//           className="related"
//         >
//           <h2
//             ref={titleRef}
//             className="sectionTitle"
//           >
//             Types de jeux
//           </h2>

//           <div
//             ref={gridRef}
//             className="relatedGrid"
//           >
//             {gameTypes.map((game) => (
//               <Link
//                 key={game.slug}
//                 href={game.href}
//                 className="relatedCard"
//                 style={{
//                   backgroundImage: `url("${game.image}")`,
//                 }}
//                 aria-label={`Voir le jeu ${game.title}`}
//               >
//                 <span className="relatedCardOverlay" />

//                 <h3 className="relatedCardTitle">
//                   {game.title}
//                 </h3>
//               </Link>
//             ))}
//           </div>

//           <p
//             ref={moreRef}
//             className="relatedMore"
//           >
//             <Link href="/jeux">
//               Voir tous les jeux →
//             </Link>
//           </p>
//         </section>
//       ) : null}
//     </div>
//   );
// }






"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";

import type { GameTypeCard } from "@/lib/games";

type Props = {
  children: ReactNode;
  gameTypes?: GameTypeCard[];
};

export function GameDisplay({
  children,
  gameTypes = [],
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);
  const relatedRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const moreRef = useRef<HTMLParagraphElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncHeights = () => {
      const gameEl = gameRef.current;
      const relatedEl = relatedRef.current;
      const titleEl = titleRef.current;
      const moreEl = moreRef.current;
      const gridEl = gridRef.current;

      if (!gameEl || !relatedEl || !gridEl) return;

      const gameHeight = gameEl.offsetHeight;

      relatedEl.style.height = `${gameHeight}px`;

      const relatedStyles = window.getComputedStyle(relatedEl);
      const titleHeight = titleEl?.offsetHeight ?? 0;
      const moreHeight = moreEl?.offsetHeight ?? 0;
      const paddingTop = parseFloat(relatedStyles.paddingTop || "0");
      const paddingBottom = parseFloat(relatedStyles.paddingBottom || "0");
      const rowGap = parseFloat(
        relatedStyles.rowGap || relatedStyles.gap || "0",
      );

      const availableHeight =
        gameHeight -
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

    if (gameRef.current) resizeObserver.observe(gameRef.current);
    if (titleRef.current) resizeObserver.observe(titleRef.current);
    if (moreRef.current) resizeObserver.observe(moreRef.current);

    window.addEventListener("resize", syncHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="quiz-display">
      <div ref={gameRef} className="quiz-display-main">
        {children}
      </div>

      {gameTypes.length > 0 ? (
        <section ref={relatedRef} className="related">
          <h2 ref={titleRef} className="sectionTitle">
            Types de jeux
          </h2>

          <div ref={gridRef} className="relatedGrid">
            {gameTypes.map((game) => {
              const img = game.image || "/images/placeholder-thumb.jpg";

              return (
                <Link
                  key={game.slug}
                  href={game.href}
                  className="relatedCard"
                  style={{
                    backgroundImage: `url("${img}")`,
                  }}
                  aria-label={`Voir le jeu ${game.title}`}
                >
                  <span className="relatedCardOverlay" />

                  <h3 className="relatedCardTitle">
                    {game.title}
                  </h3>
                </Link>
              );
            })}
          </div>

          <p ref={moreRef} className="relatedMore">
            <Link href="/jeux">
              Voir tous les jeux →
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}