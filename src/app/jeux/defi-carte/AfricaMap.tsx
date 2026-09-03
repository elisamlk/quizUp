"use client";

import { type PointerEvent, useEffect, useMemo, useState } from "react";

import { AFRICA_COUNTRIES } from "@/lib/defi-carte/africa";

type AfricaMapProps = {
  foundCodes: string[];
  revealCodes?: string[];
};

type TooltipState = {
  name: string;
  x: number;
  y: number;
};

const DEFAULT_COUNTRY = "#d9dce5";
const FOUND_COUNTRY = "#22c55e";
const REVEALED_COUNTRY = "#dfe5ff";
const BORDER = "#6f7484";

/* ==========================================================
   CORRESPONDANCE CODE DU JEU -> ID DU SVG
========================================================== */

const COUNTRY_TO_SVG_IDS: Record<string, string[]> = {
  DZ: ["DZA"],
  AO: ["AGO"],
  BJ: ["BEN"],
  BW: ["BWA"],
  BF: ["BFA"],
  BI: ["BDI"],
  CV: ["CPV"],
  CM: ["CMR"],
  CF: ["CAF"],
  TD: ["TCD"],
  KM: ["COM"],

  CG: ["COG"],
  CD: ["COD"],

  CI: ["CIV"],
  DJ: ["DJI"],
  EG: ["EGY"],
  GQ: ["GNQ"],
  ER: ["ERI"],
  SZ: ["SWZ"],
  ET: ["ETH"],
  GA: ["GAB"],
  GM: ["GMB"],
  GH: ["GHA"],
  GN: ["GIN"],
  GW: ["GNB"],
  KE: ["KEN"],
  LS: ["LSO"],
  LR: ["LBR"],
  LY: ["LBY"],
  MG: ["MDG"],
  MW: ["MWI"],
  ML: ["MLI"],
  MR: ["MRT"],

  // Maurice : marqueur manuel
  MU: [],

  MA: ["MAR"],
  MZ: ["MOZ"],
  NA: ["NAM"],
  NE: ["NER"],
  NG: ["NGA"],
  RW: ["RWA"],
  ST: ["STP"],
  SN: ["SEN"],

  // Seychelles : marqueur manuel
  SC: [],

  SL: ["SLE"],

  // Le SVG distingue la Somalie du Somaliland.
  SO: ["SOM", "SOL"],

  ZA: ["ZAF"],
  SS: ["SDS"],
  SD: ["SDN"],
  TZ: ["TZA"],
  TG: ["TGO"],
  TN: ["TUN"],
  UG: ["UGA"],
  ZM: ["ZMB"],
  ZW: ["ZWE"],
};

/* ==========================================================
   MARQUEURS POUR MAURICE ET SEYCHELLES
========================================================== */

const CUSTOM_MARKERS: Record<
  string,
  {
    x: number;
    y: number;
    radius: number;
  }
> = {
  SC: {
    x: 1128,
    y: 690,
    radius: 7,
  },

  MU: {
    x: 1172,
    y: 930,
    radius: 7,
  },
};

/* ==========================================================
   RÉCUPÉRATION D'UNE RÉGION DU SVG
========================================================== */

function getCountryElements(svg: SVGSVGElement, svgId: string): SVGElement[] {
  const element = svg.querySelector<SVGElement>(`#${CSS.escape(svgId)}`);

  return element ? [element] : [];
}

/* ==========================================================
   FRONTIÈRE
========================================================== */

function applyBorder(element: SVGElement) {
  element.setAttribute("stroke", BORDER);

  element.setAttribute("stroke-width", "0.8");

  element.setAttribute("stroke-opacity", "1");

  element.style.setProperty("stroke", BORDER, "important");

  element.style.setProperty("stroke-width", "0.8", "important");

  element.style.setProperty("stroke-opacity", "1", "important");
}

/* ==========================================================
   COLORATION D'UNE ZONE SVG
========================================================== */

function paintElement(element: SVGElement, color: string) {
  /*
   * On modifie à la fois l'attribut SVG
   * et le style inline.
   */
  element.setAttribute("fill", color);

  element.style.setProperty("fill", color, "important");

  applyBorder(element);

  element
    .querySelectorAll<SVGElement>("path, polygon, circle, rect, ellipse")
    .forEach((child) => {
      child.setAttribute("fill", color);

      child.style.setProperty("fill", color, "important");

      applyBorder(child);
    });
}

/* ==========================================================
   COLORATION D'UN PAYS
========================================================== */

function paintCountry(svg: SVGSVGElement, countryCode: string, color: string) {
  const svgIds = COUNTRY_TO_SVG_IDS[countryCode] ?? [];

  svgIds.forEach((svgId) => {
    getCountryElements(svg, svgId).forEach((element) => {
      paintElement(element, color);
    });
  });

  const marker = svg.querySelector<SVGElement>(
    `[data-map-marker="${countryCode}"]`,
  );

  if (marker) {
    marker.setAttribute("fill", color);

    marker.style.setProperty("fill", color, "important");

    applyBorder(marker);
  }
}

/* ==========================================================
   PAYS TROUVÉ -> TOOLTIP + CURSEUR
========================================================== */

function makeCountryInteractive(
  svg: SVGSVGElement,
  countryCode: string,
  countryName: string,
) {
  const svgIds = COUNTRY_TO_SVG_IDS[countryCode] ?? [];

  svgIds.forEach((svgId) => {
    getCountryElements(svg, svgId).forEach((element) => {
      element.setAttribute("data-found-country", countryName);

      element.setAttribute("pointer-events", "all");

      element.style.setProperty("pointer-events", "all", "important");

      element.style.setProperty("cursor", "pointer", "important");

      element
        .querySelectorAll<SVGElement>("path, polygon, circle, rect, ellipse")
        .forEach((child) => {
          child.setAttribute("data-found-country", countryName);

          child.setAttribute("pointer-events", "all");

          child.style.setProperty("pointer-events", "all", "important");

          child.style.setProperty("cursor", "pointer", "important");
        });
    });
  });

  const marker = svg.querySelector<SVGElement>(
    `[data-map-marker="${countryCode}"]`,
  );

  if (marker) {
    marker.setAttribute("data-found-country", countryName);

    marker.setAttribute("pointer-events", "all");

    marker.style.setProperty("pointer-events", "all", "important");

    marker.style.setProperty("cursor", "pointer", "important");
  }
}

/* ==========================================================
   CRÉATION DES MARQUEURS
========================================================== */

function createCustomMarkers(svg: SVGSVGElement) {
  const namespace = "http://www.w3.org/2000/svg";

  Object.entries(CUSTOM_MARKERS).forEach(([countryCode, markerData]) => {
    const existing = svg.querySelector(`[data-map-marker="${countryCode}"]`);

    if (existing) {
      return;
    }

    const circle = svg.ownerDocument.createElementNS(namespace, "circle");

    circle.setAttribute("cx", String(markerData.x));

    circle.setAttribute("cy", String(markerData.y));

    circle.setAttribute("r", String(markerData.radius));

    circle.setAttribute("data-map-marker", countryCode);

    circle.setAttribute("fill", DEFAULT_COUNTRY);

    circle.setAttribute("stroke", BORDER);

    circle.setAttribute("stroke-width", "0.8");

    circle.style.setProperty("fill", DEFAULT_COUNTRY, "important");

    svg.appendChild(circle);
  });
}

/* ==========================================================
   COMPOSANT
========================================================== */

export function AfricaMap({ foundCodes, revealCodes = [] }: AfricaMapProps) {
  const [rawSvg, setRawSvg] = useState("");

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  /* ========================================================
     CHARGEMENT DU SVG
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch("/maps/afrique.svg");

        if (!response.ok) {
          throw new Error(
            `Impossible de charger la carte Afrique : ${response.status}`,
          );
        }

        const svgText = await response.text();

        if (!cancelled) {
          setRawSvg(svgText);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la carte Afrique :", error);
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================
     PRÉPARATION DU SVG
  ======================================================== */

  const svgMarkup = useMemo(() => {
    if (!rawSvg) {
      return "";
    }

    const parser = new DOMParser();

    const document = parser.parseFromString(rawSvg, "image/svg+xml");

    const svg = document.querySelector<SVGSVGElement>("svg");

    if (!svg) {
      console.error("Aucun élément <svg> trouvé dans afrique.svg");

      return "";
    }

    /* ====================================================
         DIMENSIONS
      ==================================================== */

    svg.removeAttribute("width");

    svg.removeAttribute("height");

    svg.setAttribute("viewBox", "0 0 1200 1200");

    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    svg.setAttribute("aria-hidden", "true");

    svg.setAttribute("focusable", "false");

    /* ====================================================
         SUPPRESSION DU CRÉDIT VISUEL
      ==================================================== */

    svg.querySelectorAll<SVGElement>("text").forEach((element) => {
      const text = element.textContent?.trim().toLowerCase() ?? "";

      if (text.includes("ultimaps")) {
        element.remove();
      }
    });

    svg
      .querySelectorAll<SVGElement>('[id*="ultimap" i], [class*="ultimap" i]')
      .forEach((element) => {
        element.remove();
      });

    /* ====================================================
         COUCHES DE FRONTIÈRES SUPERPOSÉES
      ====================================================
      
         Elles restent visibles mais ne doivent jamais
         intercepter les événements souris.
      */

    svg
      .querySelectorAll<SVGElement>(".region-boundary, .boundary")
      .forEach((element) => {
        element.setAttribute("pointer-events", "none");

        element.style.setProperty("pointer-events", "none", "important");

        element.setAttribute("fill", "none");

        element.style.setProperty("fill", "none", "important");

        element.setAttribute("stroke", BORDER);

        element.style.setProperty("stroke", BORDER, "important");
      });

    /* ====================================================
         LES VRAIES RÉGIONS RESTENT INTERACTIVES
      ==================================================== */

    svg.querySelectorAll<SVGElement>(".region[data-id]").forEach((element) => {
      element.setAttribute("pointer-events", "all");

      element.style.setProperty("pointer-events", "all", "important");
    });

    /* ====================================================
         INITIALISATION DES PAYS EN GRIS
      ==================================================== */

    Object.keys(COUNTRY_TO_SVG_IDS).forEach((countryCode) => {
      paintCountry(svg, countryCode, DEFAULT_COUNTRY);
    });

    /* ====================================================
         ZONES HORS JEU
      ==================================================== */

    ["SAH", "BRT"].forEach((svgId) => {
      getCountryElements(svg, svgId).forEach((element) => {
        paintElement(element, DEFAULT_COUNTRY);
      });
    });

    /* ====================================================
         MAURICE + SEYCHELLES
      ==================================================== */

    createCustomMarkers(svg);

    /* ====================================================
         PAYS TROUVÉS
      ==================================================== */

    foundCodes.forEach((countryCode) => {
      const country = AFRICA_COUNTRIES.find(
        (item) => item.code === countryCode,
      );

      /*
       * Le pays devient vert.
       */
      paintCountry(svg, countryCode, FOUND_COUNTRY);

      /*
       * Et devient interactif pour le tooltip.
       */
      if (country) {
        makeCountryInteractive(svg, countryCode, country.name);
      }
    });

    /* ====================================================
         PAYS MANQUANTS À LA FIN
      ==================================================== */

    revealCodes.forEach((countryCode) => {
      if (foundCodes.includes(countryCode)) {
        return;
      }

      paintCountry(svg, countryCode, REVEALED_COUNTRY);
    });

    /*
     * IMPORTANT :
     * aucune recoloration globale après cette étape.
     */

    return svg.outerHTML;
  }, [rawSvg, foundCodes, revealCodes]);

  /* ========================================================
     TOOLTIP
  ======================================================== */

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const target = event.target as Element | null;

    if (!target) {
      setTooltip(null);
      return;
    }

    const countryElement = target.closest<SVGElement>("[data-found-country]");

    if (!countryElement) {
      setTooltip(null);
      return;
    }

    const countryName = countryElement.getAttribute("data-found-country");

    if (!countryName) {
      setTooltip(null);
      return;
    }

    const containerRect = event.currentTarget.getBoundingClientRect();

    setTooltip({
      name: countryName,

      x: event.clientX - containerRect.left,

      y: event.clientY - containerRect.top,
    });
  }

  function handlePointerLeave() {
    setTooltip(null);
  }

  /* ========================================================
     CHARGEMENT
  ======================================================== */

  if (!rawSvg) {
    return (
      <div className="europeMap africaMap africaMap--loading">
        Chargement de la carte…
      </div>
    );
  }

  /* ========================================================
     RENDU
  ======================================================== */

  return (
    <div
      className="europeMap africaMap"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="africaMap__svg"
        dangerouslySetInnerHTML={{
          __html: svgMarkup,
        }}
      />

      {tooltip && (
        <div
          className="africaMap__tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
