"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  SOUTH_AMERICA_COUNTRIES,
  SOUTH_AMERICA_COUNTRY_CODES,
} from "@/lib/defi-carte/south-america";

type SouthAmericaMapProps = {
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
   CODE DU JEU -> ID DU SVG
========================================================== */

const COUNTRY_TO_SVG_IDS: Record<
  string,
  string[]
> = {
  AR: ["ARG"],
  BO: ["BOL"],
  BR: ["BRA"],
  CL: ["CHL"],
  CO: ["COL"],
  EC: ["ECU"],
  GY: ["GUY"],
  PY: ["PRY"],
  PE: ["PER"],
  SR: ["SUR"],
  UY: ["URY"],
  VE: ["VEN"],
};

/* ==========================================================
   ZONES NON JOUABLES
========================================================== */

const NON_PLAYABLE_IDS = [
  "BRI",
  "SPI",
  "FLK",
];

/* ==========================================================
   NOM D'UN PAYS
========================================================== */

function getCountryName(
  code: string
) {
  return (
    SOUTH_AMERICA_COUNTRIES.find(
      (country) =>
        country.code === code
    )?.name ?? code
  );
}

/* ==========================================================
   RÉCUPÉRATION D'UNE ZONE
========================================================== */

function getCountryElements(
  svg: SVGSVGElement,
  svgId: string
): SVGElement[] {
  return Array.from(
    svg.querySelectorAll<SVGElement>(
      `[data-id="${svgId}"], #${CSS.escape(
        svgId
      )}`
    )
  );
}

/* ==========================================================
   COLORATION D'UNE ZONE
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

  element.setAttribute(
    "stroke",
    BORDER
  );

  element.style.setProperty(
    "stroke",
    BORDER,
    "important"
  );

  element.setAttribute(
    "stroke-width",
    "1"
  );

  element.style.setProperty(
    "stroke-width",
    "1",
    "important"
  );
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
      countryCode
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
   PAYS TROUVÉ INTERACTIF
========================================================== */

function makeCountryInteractive(
  svg: SVGSVGElement,
  countryCode: string
) {
  const svgIds =
    COUNTRY_TO_SVG_IDS[
      countryCode
    ] ?? [];

  svgIds.forEach((svgId) => {
    getCountryElements(
      svg,
      svgId
    ).forEach((element) => {
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

      element.setAttribute(
        "data-found-country",
        "true"
      );

      element.setAttribute(
        "data-country-code",
        countryCode
      );
    });
  });
}

/* ==========================================================
   COMPOSANT
========================================================== */

export function SouthAmericaMap({
  foundCodes,
  revealCodes = [],
}: SouthAmericaMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [svgMarkup, setSvgMarkup] =
    useState("");

  const [tooltip, setTooltip] =
    useState<TooltipState>(null);

  const foundSet = useMemo(
    () =>
      new Set(
        foundCodes
      ),
    [foundCodes]
  );

  const revealSet = useMemo(
    () =>
      new Set(
        revealCodes
      ),
    [revealCodes]
  );

  /* ========================================================
     CHARGEMENT + CONSTRUCTION SVG
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response =
          await fetch(
            "/maps/south-america.svg"
          );

        if (!response.ok) {
          throw new Error(
            "Impossible de charger la carte d'Amérique du Sud."
          );
        }

        const text =
          await response.text();

        if (cancelled) {
          return;
        }

        const parser =
          new DOMParser();

        const documentSvg =
          parser.parseFromString(
            text,
            "image/svg+xml"
          );

        const svg =
          documentSvg.querySelector<SVGSVGElement>(
            "svg"
          );

        if (!svg) {
          return;
        }

        /* ====================================================
           DIMENSIONS
        ==================================================== */

        svg.removeAttribute(
          "width"
        );

        svg.removeAttribute(
          "height"
        );

        /*
         * On conserve volontairement :
         *
         * viewBox="0 0 1200 1200"
         */

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
           WRAPPER RESPONSIVE INTERNE
        ==================================================== */

        const mapGroup =
          svg.querySelector<SVGGElement>(
            "#um-layer-map"
          );

        if (mapGroup) {
          const wrapper =
            documentSvg.createElementNS(
              "http://www.w3.org/2000/svg",
              "g"
            );

          wrapper.setAttribute(
            "class",
            "southAmericaMap__responsiveContent"
          );

          const parent =
            mapGroup.parentNode;

          if (parent) {
            parent.insertBefore(
              wrapper,
              mapGroup
            );

            wrapper.appendChild(
              mapGroup
            );
          }
        }

        /* ====================================================
           SUPPRESSION DU CRÉDIT VISUEL
        ==================================================== */

        documentSvg
          .querySelectorAll<SVGElement>(
            "text"
          )
          .forEach((element) => {
            const value =
              element.textContent
                ?.trim()
                .toLowerCase() ??
              "";

            if (
              value.includes(
                "ultimaps"
              )
            ) {
              element.remove();
            }
          });

        documentSvg
          .querySelectorAll<SVGElement>(
            '[id*="ultimap" i], [class*="ultimap" i]'
          )
          .forEach((element) => {
            element.remove();
          });

        /* ====================================================
           COUCHES DE FRONTIÈRES SUPERPOSÉES

           IMPORTANT :
           elles ne doivent avoir AUCUN remplissage.
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
           BASE DES VRAIES RÉGIONS
        ==================================================== */

        svg
          .querySelectorAll<SVGElement>(
            ".region"
          )
          .forEach((region) => {
            paintElement(
              region,
              DEFAULT_COUNTRY
            );

            region.setAttribute(
              "pointer-events",
              "none"
            );

            region.style.setProperty(
              "pointer-events",
              "none",
              "important"
            );

            region.style.setProperty(
              "cursor",
              "default",
              "important"
            );

            region.removeAttribute(
              "data-found-country"
            );

            region.removeAttribute(
              "data-country-code"
            );
          });

        /* ====================================================
           ZONES NON JOUABLES
        ==================================================== */

        NON_PLAYABLE_IDS.forEach(
          (svgId) => {
            getCountryElements(
              svg,
              svgId
            ).forEach(
              (element) => {
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

                element.style.setProperty(
                  "cursor",
                  "default",
                  "important"
                );
              }
            );
          }
        );

        /* ====================================================
           TOUS LES PAYS JOUABLES EN GRIS
        ==================================================== */

        SOUTH_AMERICA_COUNTRY_CODES.forEach(
          (countryCode) => {
            paintCountry(
              svg,
              countryCode,
              DEFAULT_COUNTRY
            );
          }
        );

        /* ====================================================
           PAYS TROUVÉS EN VERT
        ==================================================== */

        foundSet.forEach(
          (countryCode) => {
            paintCountry(
              svg,
              countryCode,
              FOUND_COUNTRY
            );

            makeCountryInteractive(
              svg,
              countryCode
            );
          }
        );

        /* ====================================================
           PAYS MANQUÉS EN BLEU CLAIR
        ==================================================== */

        revealSet.forEach(
          (countryCode) => {
            if (
              foundSet.has(
                countryCode
              )
            ) {
              return;
            }

            paintCountry(
              svg,
              countryCode,
              REVEALED_COUNTRY
            );
          }
        );

        /*
         * IMPORTANT :
         *
         * ne surtout rien recolorer globalement
         * après les pays trouvés / révélés.
         */

        const serializer =
          new XMLSerializer();

        setSvgMarkup(
          serializer.serializeToString(
            svg
          )
        );
      } catch (error) {
        console.error(
          error
        );
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, [
    foundSet,
    revealSet,
  ]);

  /* ========================================================
     TOOLTIP
  ======================================================== */

  useEffect(() => {
    const container =
      containerRef.current;

    if (
      !container ||
      !svgMarkup
    ) {
      return;
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      const target =
        event.target;

      if (
        !(target instanceof Element)
      ) {
        setTooltip(null);

        return;
      }

      const countryElement =
        target.closest<SVGElement>(
          "[data-found-country='true']"
        );

      if (
        !countryElement ||
        !container.contains(
          countryElement
        )
      ) {
        setTooltip(null);

        return;
      }

      const countryCode =
        countryElement.getAttribute(
          "data-country-code"
        );

      if (!countryCode) {
        setTooltip(null);

        return;
      }

      const rect =
        container.getBoundingClientRect();

      setTooltip({
        name:
          getCountryName(
            countryCode
          ),

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

    container.addEventListener(
      "pointermove",
      handlePointerMove
    );

    container.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      container.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, [svgMarkup]);

  /* ========================================================
     CHARGEMENT
  ======================================================== */

  if (!svgMarkup) {
    return (
      <div
        className="europeMap southAmericaMap southAmericaMap--loading"
        aria-hidden="true"
      />
    );
  }

  /* ========================================================
     RENDU
  ======================================================== */

  return (
    <div
      ref={containerRef}
      className="europeMap southAmericaMap"
    >
      <div
        className="southAmericaMap__svg"
        dangerouslySetInnerHTML={{
          __html: svgMarkup,
        }}
      />

      {tooltip ? (
        <div
          className="europeMap__tooltip southAmericaMap__tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.name}
        </div>
      ) : null}
    </div>
  );
}