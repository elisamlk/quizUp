"use client";

import { useEffect, useRef } from "react";

export default function MoneytizerQuizAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const container = containerRef.current;
    if (!container) return;

    const genScript = document.createElement("script");
    genScript.src = "https://ads.themoneytizer.com/s/gen.js?type=31";
    genScript.async = false;

    const requestScript = document.createElement("script");
    requestScript.src =
      "https://ads.themoneytizer.com/s/requestform.js?siteId=143502&formatId=31";
    requestScript.async = false;

    container.appendChild(genScript);
    container.appendChild(requestScript);

    return () => {
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="moneytizerQuizAd" aria-label="Publicité">
      <span className="moneytizerQuizAd__label">Publicité</span>

      <div
        ref={containerRef}
        id="143502-31"
        className="moneytizerQuizAd__container"
      />
    </div>
  );
}