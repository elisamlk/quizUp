"use client";

import {
  type PointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ASIA_COUNTRIES,
  ASIA_COUNTRY_CODES,
} from "@/lib/defi-carte/asia";

type AsiaMapProps = {
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

/* ==========================================================
   CODE DU JEU -> DATA-ID DU SVG
========================================================== */

const COUNTRY_TO_SVG_IDS: Record<string, string[]> = {
  AF: ["AFG"],
  AM: ["ARM"],
  AZ: ["AZE"],
  BH: ["BHR"],
  BD: ["BGD"],
  BT: ["BTN"],
  BN: ["BRN"],
  KH: ["KHM"],
  CN: ["CHN"],
  CY: ["CYP"],
  KP: ["PRK"],
  KR: ["KOR"],
  AE: ["ARE"],
  GE: ["GEO"],
  IN: ["IND"],
  ID: ["IDN"],
  IQ: ["IRQ"],
  IR: ["IRN"],
  IL: ["ISR"],
  JP: ["JPN"],
  JO: ["JOR"],
  KZ: ["KAZ"],
  KG: ["KGZ"],
  KW: ["KWT"],
  LA: ["LAO"],
  LB: ["LBN"],
  MY: ["MYS"],
  MN: ["MNG"],
  MM: ["MMR"],
  NP: ["NPL"],
  OM: ["OMN"],
  UZ: ["UZB"],
  PK: ["PAK"],
  PS: ["PSX"],
  PH: ["PHL"],
  QA: ["QAT"],

  /*
   * La Russie n'est pas représentée comme
   * une région exploitable dans ce SVG.
   */
  RU: [],

  SA: ["SAU"],
  SG: ["SGP"],
  LK: ["LKA"],
  SY: ["SYR"],
  TJ: ["TJK"],
  TW: ["TWN"],
  TH: ["THA"],
  TM: ["TKM"],
  TR: ["TUR"],
  VN: ["VNM"],
  YE: ["YEM"],
};

/* ==========================================================
   ZONES NON JOUABLES
========================================================== */

const NON_PLAYABLE_IDS = [
  "CNM",
  "CYN",
  "ESB",
  "HKG",
  "IOA",
  "KAB",
  "KAS",
  "MAC",
  "PGA",
  "SCR",
  "TLS",
  "WSB",
];

/* ==========================================================
   RÉCUPÉRATION D'UNE ZONE
========================================================== */

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

/* ==========================================================
   FRONTIÈRES
========================================================== */

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

/* ==========================================================
   COLORATION D'UN ÉLÉMENT
========================================================== */

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

/* ==========================================================
   COLORATION D'UN PAYS
========================================================== */

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

/* ==========================================================
   TOOLTIP D'UN PAYS TROUVÉ
========================================================== */

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

/* ==========================================================
   COMPOSANT
========================================================== */

export function AsiaMap({
  foundCodes,
  revealCodes = [],
}: AsiaMapProps) {
  const [rawSvg, setRawSvg] =
    useState("");

  const [
    tooltip,
    setTooltip,
  ] = useState<TooltipState>(
    null
  );

  /* ========================================================
     CHARGEMENT DU SVG
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response =
          await fetch(
            "/maps/asie.svg"
          );

        if (!response.ok) {
          throw new Error(
            `Impossible de charger la carte Asie : ${response.status}`
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
          "Erreur lors du chargement de la carte Asie :",
          error
        );
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================
     CONSTRUCTION DU SVG
  ======================================================== */

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
          "Défi Carte Asie : aucun élément SVG trouvé."
        );

        return "";
      }

      /* ====================================================
         DIMENSIONS / VIEWBOX

         IMPORTANT :
         TA VIEWBOX RESTE STRICTEMENT IDENTIQUE.
      ==================================================== */

      svg.removeAttribute(
        "width"
      );

      svg.removeAttribute(
        "height"
      );

      svg.setAttribute(
        "viewBox",
        "110 180 980 810"
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

      /* ====================================================
         WRAPPER RESPONSIVE

         On ne transforme PAS le SVG.
         On ne transforme PAS le viewBox.

         On place uniquement le groupe contenant la carte
         dans un nouveau groupe que le CSS pourra réduire
         sur mobile.
      ==================================================== */

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
          "asiaMap__responsiveContent"
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

      /* ====================================================
         SUPPRESSION DU TEXTE ULTIMAPS
      ==================================================== */

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

      /* ====================================================
         COUCHES DE FRONTIÈRES
      ==================================================== */

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

      /* ====================================================
         RÉGIONS INTERACTIVES
      ==================================================== */

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

      /* ====================================================
         PAYS DU JEU EN GRIS
      ==================================================== */

      ASIA_COUNTRY_CODES.forEach(
        (countryCode) => {
          paintCountry(
            svg,
            countryCode,
            DEFAULT_COUNTRY
          );
        }
      );

      /* ====================================================
         ZONES NON JOUABLES
      ==================================================== */

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

      /* ====================================================
         PAYS TROUVÉS
      ==================================================== */

      foundCodes.forEach(
        (countryCode) => {
          const normalizedCode =
            countryCode.toUpperCase();

          const country =
            ASIA_COUNTRIES.find(
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

      /* ====================================================
         PAYS MANQUÉS
      ==================================================== */

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

  /* ========================================================
     TOOLTIP
  ======================================================== */

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    const target =
      event.target as Element | null;

    if (!target) {
      setTooltip(null);
      return;
    }

    const countryElement =
      target.closest<SVGElement>(
        "[data-found-country]"
      );

    if (!countryElement) {
      setTooltip(null);
      return;
    }

    const countryName =
      countryElement.getAttribute(
        "data-found-country"
      );

    if (!countryName) {
      setTooltip(null);
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
    setTooltip(null);
  }

  /* ========================================================
     CHARGEMENT
  ======================================================== */

  if (!rawSvg) {
    return (
      <div
        className="
          europeMap
          africaMap
          asiaMap
          africaMap--loading
        "
      >
        Chargement de la carte…
      </div>
    );
  }

  /* ========================================================
     RENDU
  ======================================================== */

  return (
    <div
      className="europeMap africaMap asiaMap"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="africaMap__svg asiaMap__svg"
        dangerouslySetInnerHTML={{
          __html: svgMarkup,
        }}
      />

      {tooltip && (
        <div
          className="africaMap__tooltip asiaMap__tooltip"
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