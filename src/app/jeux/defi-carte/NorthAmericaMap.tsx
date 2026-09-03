"use client";

import {
  type PointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NORTH_AMERICA_COUNTRIES,
  NORTH_AMERICA_COUNTRY_CODES,
} from "@/lib/defi-carte/north-america";

type NorthAmericaMapProps = {
  foundCodes: string[];
  revealCodes?: string[];
};

type TooltipState = {
  name: string;
  x: number;
  y: number;
} | null;

const DEFAULT_COUNTRY = "#d9dce5";
const FOUND_COUNTRY = "#22c55e";
const REVEALED_COUNTRY = "#dfe5ff";
const BORDER = "#6f7484";

/* =========================================================
   MAPPING CODE JEU -> ID DU SVG
========================================================= */

const COUNTRY_TO_SVG_IDS: Record<string, string[]> = {
  CA: ["CAN"],
  US: ["USA"],
  MX: ["MEX"],

  BZ: ["BLZ"],
  CR: ["CRI"],
  SV: ["SLV"],
  GT: ["GTM"],
  HN: ["HND"],
  NI: ["NIC"],
  PA: ["PAN"],

  AG: ["ATG"],
  BS: ["BHS"],
  BB: ["BRB"],
  CU: ["CUB"],
  DM: ["DMA"],
  DO: ["DOM"],
  GD: ["GRD"],
  HT: ["HTI"],
  JM: ["JAM"],
  KN: ["KNA"],
  LC: ["LCA"],
  VC: ["VCT"],
  TT: ["TTO"],
};

/* =========================================================
   TERRITOIRES PRÉSENTS DANS LE SVG MAIS NON JOUABLES
========================================================= */

const NON_PLAYABLE_IDS = [
  "MAF", // Saint-Martin
  "CUW", // Curaçao
  "ABW", // Aruba
  "TCA", // Turks-et-Caïcos
  "SPM", // Saint-Pierre-et-Miquelon
  "VIR", // Îles Vierges américaines
  "PRI", // Porto Rico
  "CYM", // Îles Caïmans
];

/* =========================================================
   RÉCUPÉRATION DES ÉLÉMENTS D'UNE ZONE
========================================================= */

function getCountryElements(
  svg: SVGSVGElement,
  svgId: string
): SVGElement[] {
  const elements =
    svg.querySelectorAll<SVGElement>(
      `[data-id="${svgId}"], #${CSS.escape(svgId)}`
    );

  return Array.from(
    new Set(elements)
  );
}

/* =========================================================
   FRONTIÈRES
========================================================= */

function applyBorder(
  element: SVGElement
) {
  element.setAttribute(
    "stroke",
    BORDER
  );

  element.setAttribute(
    "stroke-width",
    "0.8"
  );

  element.style.setProperty(
    "stroke",
    BORDER,
    "important"
  );

  element.style.setProperty(
    "stroke-width",
    "0.8",
    "important"
  );
}

/* =========================================================
   COLORATION D'UN ÉLÉMENT
========================================================= */

function paintElement(
  element: SVGElement,
  color: string
) {
  element.setAttribute(
    "fill",
    color
  );

  element.style.setProperty(
    "fill",
    color,
    "important"
  );

  applyBorder(element);

  element
    .querySelectorAll<SVGElement>(
      "path, polygon, circle, rect, ellipse"
    )
    .forEach((child) => {
      child.setAttribute(
        "fill",
        color
      );

      child.style.setProperty(
        "fill",
        color,
        "important"
      );

      applyBorder(child);
    });
}

/* =========================================================
   COLORATION D'UN PAYS
========================================================= */

function paintCountry(
  svg: SVGSVGElement,
  countryCode: string,
  color: string
) {
  const svgIds =
    COUNTRY_TO_SVG_IDS[
      countryCode.toUpperCase()
    ] ?? [];

  svgIds.forEach((svgId) => {
    getCountryElements(
      svg,
      svgId
    ).forEach((element) => {
      paintElement(
        element,
        color
      );
    });
  });
}

/* =========================================================
   RENDRE UN PAYS TROUVÉ INTERACTIF
========================================================= */

function makeCountryInteractive(
  svg: SVGSVGElement,
  countryCode: string,
  countryName: string
) {
  const svgIds =
    COUNTRY_TO_SVG_IDS[
      countryCode.toUpperCase()
    ] ?? [];

  svgIds.forEach((svgId) => {
    getCountryElements(
      svg,
      svgId
    ).forEach((element) => {
      element.setAttribute(
        "data-found-country",
        countryName
      );

      element.setAttribute(
        "pointer-events",
        "all"
      );

      element.style.setProperty(
        "pointer-events",
        "all",
        "important"
      );

      element.style.setProperty(
        "cursor",
        "pointer",
        "important"
      );

      element
        .querySelectorAll<SVGElement>(
          "path, polygon, circle, rect, ellipse"
        )
        .forEach((child) => {
          child.setAttribute(
            "data-found-country",
            countryName
          );

          child.setAttribute(
            "pointer-events",
            "all"
          );

          child.style.setProperty(
            "pointer-events",
            "all",
            "important"
          );

          child.style.setProperty(
            "cursor",
            "pointer",
            "important"
          );
        });
    });
  });
}

/* =========================================================
   COMPOSANT
========================================================= */

export function NorthAmericaMap({
  foundCodes,
  revealCodes = [],
}: NorthAmericaMapProps) {
  const [rawSvg, setRawSvg] =
    useState("");

  const [
    tooltip,
    setTooltip,
  ] = useState<TooltipState>(
    null
  );

  /* =======================================================
     CHARGEMENT DU SVG
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response =
          await fetch(
            "/maps/north-america.svg"
          );

        if (!response.ok) {
          throw new Error(
            `Impossible de charger la carte Amérique du Nord : ${response.status}`
          );
        }

        const svgText =
          await response.text();

        if (!cancelled) {
          setRawSvg(
            svgText
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la carte Amérique du Nord :",
          error
        );
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     CONSTRUCTION DU SVG
  ======================================================= */

  const svgMarkup =
    useMemo(() => {
      if (!rawSvg) {
        return "";
      }

      const parser =
        new DOMParser();

      const document =
        parser.parseFromString(
          rawSvg,
          "image/svg+xml"
        );

      const svg =
        document.querySelector<SVGSVGElement>(
          "svg"
        );

      if (!svg) {
        console.error(
          "Défi Carte Amérique du Nord : aucun élément SVG trouvé."
        );

        return "";
      }

      /* ===================================================
         DIMENSIONS

         IMPORTANT :
         on conserve pour l'instant le viewBox original
         de la carte.

         On ajustera le cadrage ensuite visuellement,
         comme pour l'Asie.
      =================================================== */

      svg.removeAttribute(
        "width"
      );

      svg.removeAttribute(
        "height"
      );

      svg.setAttribute(
        "preserveAspectRatio",
        "xMidYMid meet"
      );

      svg.setAttribute(
        "aria-hidden",
        "true"
      );

      svg.setAttribute(
        "focusable",
        "false"
      );

      /* ===================================================
         WRAPPER RESPONSIVE INTERNE

         Même principe que l'Asie :
         on pourra faire le responsive de la carte
         sans toucher au viewBox.
      =================================================== */

      const mapGroup =
        svg.querySelector<SVGGElement>(
          "#um-layer-map"
        );

      if (mapGroup) {
        const responsiveWrapper =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );

        responsiveWrapper.setAttribute(
          "class",
          "northAmericaMap__responsiveContent"
        );

        const parent =
          mapGroup.parentNode;

        if (parent) {
          parent.insertBefore(
            responsiveWrapper,
            mapGroup
          );

          responsiveWrapper.appendChild(
            mapGroup
          );
        }
      }

      /* ===================================================
         SUPPRESSION DU TEXTE ULTIMAPS
      =================================================== */

      svg
        .querySelectorAll<SVGElement>(
          "text"
        )
        .forEach((element) => {
          const text =
            element.textContent
              ?.trim()
              .toLowerCase() ??
            "";

          if (
            text.includes(
              "ultimaps"
            )
          ) {
            element.remove();
          }
        });

      /* ===================================================
         COUCHES DE FRONTIÈRES
      =================================================== */

      svg
        .querySelectorAll<SVGElement>(
          ".region-boundary, .boundary"
        )
        .forEach((element) => {
          element.setAttribute(
            "pointer-events",
            "none"
          );

          element.style.setProperty(
            "pointer-events",
            "none",
            "important"
          );

          element.setAttribute(
            "fill",
            "none"
          );

          element.style.setProperty(
            "fill",
            "none",
            "important"
          );

          element.setAttribute(
            "stroke",
            BORDER
          );

          element.style.setProperty(
            "stroke",
            BORDER,
            "important"
          );
        });

      /* ===================================================
         RÉGIONS
      =================================================== */

      svg
        .querySelectorAll<SVGElement>(
          ".region[data-id]"
        )
        .forEach((element) => {
          element.setAttribute(
            "pointer-events",
            "all"
          );

          element.style.setProperty(
            "pointer-events",
            "all",
            "important"
          );
        });

      /* ===================================================
         1 — PAYS JOUABLES EN GRIS
      =================================================== */

      NORTH_AMERICA_COUNTRY_CODES.forEach(
        (countryCode) => {
          paintCountry(
            svg,
            countryCode,
            DEFAULT_COUNTRY
          );
        }
      );

      /* ===================================================
         2 — TERRITOIRES NON JOUABLES
      =================================================== */

      NON_PLAYABLE_IDS.forEach(
        (svgId) => {
          getCountryElements(
            svg,
            svgId
          ).forEach((element) => {
            paintElement(
              element,
              DEFAULT_COUNTRY
            );

            element.setAttribute(
              "pointer-events",
              "none"
            );

            element.style.setProperty(
              "pointer-events",
              "none",
              "important"
            );
          });
        }
      );

      /* ===================================================
         3 — PAYS TROUVÉS
      =================================================== */

      foundCodes.forEach(
        (countryCode) => {
          const normalizedCode =
            countryCode.toUpperCase();

          const country =
            NORTH_AMERICA_COUNTRIES.find(
              (item) =>
                item.code.toUpperCase() ===
                normalizedCode
            );

          if (!country) {
            return;
          }

          paintCountry(
            svg,
            normalizedCode,
            FOUND_COUNTRY
          );

          makeCountryInteractive(
            svg,
            normalizedCode,
            country.name
          );
        }
      );

      /* ===================================================
         4 — PAYS MANQUÉS
      =================================================== */

      revealCodes.forEach(
        (countryCode) => {
          const normalizedCode =
            countryCode.toUpperCase();

          const alreadyFound =
            foundCodes.some(
              (foundCode) =>
                foundCode.toUpperCase() ===
                normalizedCode
            );

          if (alreadyFound) {
            return;
          }

          paintCountry(
            svg,
            normalizedCode,
            REVEALED_COUNTRY
          );
        }
      );

      return svg.outerHTML;
    }, [
      rawSvg,
      foundCodes,
      revealCodes,
    ]);

  /* =======================================================
     TOOLTIP
  ======================================================= */

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    const target =
      event.target;

    if (
      !(target instanceof Element)
    ) {
      setTooltip(
        null
      );

      return;
    }

    const countryElement =
      target.closest<SVGElement>(
        "[data-found-country]"
      );

    if (!countryElement) {
      setTooltip(
        null
      );

      return;
    }

    const countryName =
      countryElement.getAttribute(
        "data-found-country"
      );

    if (!countryName) {
      setTooltip(
        null
      );

      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    setTooltip({
      name: countryName,

      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    });
  }

  function handlePointerLeave() {
    setTooltip(
      null
    );
  }

  /* =======================================================
     CHARGEMENT
  ======================================================= */

  if (!rawSvg) {
    return (
      <div
        className="
          europeMap
          northAmericaMap
          northAmericaMap--loading
        "
      >
        Chargement de la carte…
      </div>
    );
  }

  /* =======================================================
     RENDU
  ======================================================= */

  return (
    <div
      className="europeMap northAmericaMap"
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
    >
      <div
        className="northAmericaMap__svg"
        dangerouslySetInnerHTML={{
          __html: svgMarkup,
        }}
      />

      {tooltip && (
        <div
          className="europeMap__tooltip northAmericaMap__tooltip"
          style={{
            left:
              tooltip.x,

            top:
              tooltip.y,
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}