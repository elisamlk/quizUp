"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  OCEANIA_COUNTRIES,
  OCEANIA_COUNTRY_CODES,
} from "@/lib/defi-carte/oceania";

type OceaniaMapProps = {
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
  AU: ["AUS"],
  FJ: ["FJI"],
  KI: ["KIR"],
  MH: ["MHL"],
  FM: ["FSM"],
  NR: ["NRU"],
  NZ: ["NZL"],
  PW: ["PLW"],
  PG: ["PNG"],
  WS: ["WSM"],
  SB: ["SLB"],
  TO: ["TON"],
  TV: ["TUV"],
  VU: ["VUT"],
};

/* ==========================================================
   ZONES NON JOUABLES
========================================================== */

const NON_PLAYABLE_IDS = [
  "NCL",
  "PCN",
  "PYF",
  "NFK",
  "COK",
  "WLF",
  "NIU",
  "ASM",
  "GUM",
  "MNP",
  "CSI",
  "ATC",
];

/* ==========================================================
   NOM D'UN PAYS
========================================================== */

function getCountryName(
  code: string
) {
  return (
    OCEANIA_COUNTRIES.find(
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

export function OceaniaMap({
  foundCodes,
  revealCodes = [],
}: OceaniaMapProps) {
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
            "/maps/oceanie.svg"
          );

        if (!response.ok) {
          throw new Error(
            "Impossible de charger la carte de l'Océanie."
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
         * On conserve le viewBox original :
         *
         * viewBox="0 0 1200 1200"
         *
         * Le cadrage sera réglé après
         * validation visuelle sur desktop.
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
            "oceaniaMap__responsiveContent"
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
           SUPPRESSION DU CRÉDIT ULTIMAPS
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

           Pas de remplissage pour éviter
           le problème de couche beige.
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

        OCEANIA_COUNTRY_CODES.forEach(
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
         * aucune recoloration globale
         * après cette étape.
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
        !container?.contains(
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
        className="europeMap oceaniaMap oceaniaMap--loading"
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
      className="europeMap oceaniaMap"
    >
      <div
        className="oceaniaMap__svg"
        dangerouslySetInnerHTML={{
          __html: svgMarkup,
        }}
      />

      {tooltip ? (
        <div
          className="europeMap__tooltip oceaniaMap__tooltip"
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