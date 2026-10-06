"use client";

import { useEffect } from "react";

export default function MoneytizerMegabanner() {
  useEffect(() => {
    const container = document.getElementById("143502-1");

    if (!container) return;

    // Évite de charger plusieurs fois le tag
    if (container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const genScript = document.createElement("script");
    genScript.src = "https://ads.themoneytizer.com/s/gen.js?type=1";
    genScript.async = true;

    const requestScript = document.createElement("script");
    requestScript.src =
      "https://ads.themoneytizer.com/s/requestform.js?siteId=143502&formatId=1";
    requestScript.async = true;

    container.appendChild(genScript);
    container.appendChild(requestScript);

    return () => {
      container.innerHTML = "";
      delete container.dataset.loaded;
    };
  }, []);

  return (
    <section
      className="moneytizerMegabanner"
      aria-label="Publicité"
    >
      <div className="moneytizerMegabanner__label">
        Publicité
      </div>

      <div
        id="143502-1"
        className="moneytizerMegabanner__ad"
      />
    </section>
  );
}