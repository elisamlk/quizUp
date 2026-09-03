"use client";

import {
  type PointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { europeCountries } from "@/lib/defi-carte/europe";

type EuropeMapProps = {
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

/*
 * Correspondance entre les codes ISO2 utilisés
 * par le jeu et les IDs du nouveau SVG.
 */
const ISO2_TO_SVG_ID: Record<string, string> = {
  AL: "ALB",
  DE: "DEU",
  AD: "AND",
  AM: "ARM",
  AT: "AUT",
  AZ: "AZE",
  BE: "BEL",
  BY: "BLR",
  BA: "BIH",
  BG: "BGR",
  CY: "CYP",
  HR: "HRV",
  DK: "DNK",
  ES: "ESP",
  EE: "EST",
  FI: "FIN",
  FR: "FRA",
  GE: "GEO",
  GR: "GRC",
  HU: "HUN",
  IE: "IRL",
  IS: "ISL",
  IT: "ITA",

  /*
   * Le SVG utilise KOS et non XKX.
   */
  XK: "KOS",

  LV: "LVA",
  LT: "LTU",
  LU: "LUX",
  MK: "MKD",
  MT: "MLT",
  MD: "MDA",
  ME: "MNE",
  NO: "NOR",
  NL: "NLD",
  PL: "POL",
  PT: "PRT",
  CZ: "CZE",
  RO: "ROU",
  GB: "GBR",
  RU: "RUS",
  RS: "SRB",
  SK: "SVK",
  SI: "SVN",
  SE: "SWE",
  CH: "CHE",
  TR: "TUR",
  UA: "UKR",
};

function getCountryElements(
  svg: SVGSVGElement,
  svgId: string
): SVGElement[] {
  const elements =
    new Set<SVGElement>();

  svg
    .querySelectorAll<SVGElement>(
      `#${svgId}, [data-id="${svgId}"]`
    )
    .forEach((element) => {
      elements.add(element);
    });

  return Array.from(elements);
}

function applyBorder(
  element: SVGElement
) {
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

  element.style.setProperty(
    "stroke-opacity",
    "1",
    "important"
  );
}

function paintElement(
  element: SVGElement,
  color: string
) {
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
      child.style.setProperty(
        "fill",
        color,
        "important"
      );

      applyBorder(child);
    });
}

function colorCountry(
  svg: SVGSVGElement,
  svgId: string,
  color: string
) {
  getCountryElements(
    svg,
    svgId
  ).forEach((element) => {
    paintElement(
      element,
      color
    );
  });
}

function makeCountryInteractive(
  svg: SVGSVGElement,
  svgId: string,
  countryName: string
) {
  getCountryElements(
    svg,
    svgId
  ).forEach((element) => {
    element.setAttribute(
      "data-found-country",
      countryName
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

        child.style.setProperty(
          "cursor",
          "pointer",
          "important"
        );
      });
  });
}

export function EuropeMap({
  foundCodes,
  revealCodes = [],
}: EuropeMapProps) {
  const [rawSvg, setRawSvg] =
    useState("");

  const [tooltip, setTooltip] =
    useState<TooltipState | null>(
      null
    );

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response =
          await fetch(
            "/maps/europe.svg"
          );

        if (!response.ok) {
          throw new Error(
            `Impossible de charger la carte Europe : ${response.status}`
          );
        }

        const svgText =
          await response.text();

        if (!cancelled) {
          setRawSvg(svgText);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la carte Europe :",
          error
        );
      }
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

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
          "Aucun élément <svg> trouvé dans europe.svg"
        );

        return "";
      }

      /*
       * --------------------------------------------------
       * SVG RESPONSIVE + CADRAGE EUROPE
       * --------------------------------------------------
       */

      svg.removeAttribute(
        "width"
      );

      svg.removeAttribute(
        "height"
      );

      /*
       * Le fichier original possède un viewBox
       * 1200 x 1200 avec beaucoup d'espace inutile.
       *
       * Ce cadrage rapproche et centre la carte
       * dans le plateau de jeu.
       */
      svg.setAttribute(
        "viewBox",
        "120 70 980 1030"
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

      /*
       * --------------------------------------------------
       * SUPPRESSION DU CRÉDIT VISUEL DANS LE SVG
       * --------------------------------------------------
       */

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

      svg
        .querySelectorAll<SVGElement>(
          '[id*="ultimap" i], [class*="ultimap" i]'
        )
        .forEach((element) => {
          element.remove();
        });

      /*
       * --------------------------------------------------
       * CONTOURS ORIGINAUX
       * --------------------------------------------------
       *
       * Certains contours extérieurs du SVG
       * utilisent du beige. On les force dans
       * le même gris que les frontières internes.
       */

      svg
        .querySelectorAll<SVGElement>(
          "path, polygon, polyline"
        )
        .forEach((element) => {
          const stroke =
            element
              .getAttribute(
                "stroke"
              )
              ?.toLowerCase();

          const styleStroke =
            element.style.stroke?.toLowerCase();

          const isOriginalOutline =
            stroke ===
              "#c7c09a" ||
            stroke ===
              "#bcb58e" ||
            styleStroke ===
              "#c7c09a" ||
            styleStroke ===
              "#bcb58e";

          if (
            isOriginalOutline
          ) {
            applyBorder(
              element
            );
          }
        });

      /*
       * --------------------------------------------------
       * INITIALISATION DES 46 PAYS
       * --------------------------------------------------
       */

      Object.values(
        ISO2_TO_SVG_ID
      ).forEach((svgId) => {
        colorCountry(
          svg,
          svgId,
          DEFAULT_COUNTRY
        );
      });

      /*
       * --------------------------------------------------
       * PAYS TROUVÉS
       * --------------------------------------------------
       */

      foundCodes.forEach(
        (iso2) => {
          const svgId =
            ISO2_TO_SVG_ID[
              iso2
            ];

          if (!svgId) {
            return;
          }

          const country =
            europeCountries.find(
              (item) =>
                item.code ===
                iso2
            );

          colorCountry(
            svg,
            svgId,
            FOUND_COUNTRY
          );

          if (country) {
            makeCountryInteractive(
              svg,
              svgId,
              country.name
            );
          }
        }
      );

      /*
       * --------------------------------------------------
       * PAYS MANQUANTS APRÈS LA FIN
       * --------------------------------------------------
       */

      revealCodes.forEach(
        (iso2) => {
          if (
            foundCodes.includes(
              iso2
            )
          ) {
            return;
          }

          const svgId =
            ISO2_TO_SVG_ID[
              iso2
            ];

          if (!svgId) {
            return;
          }

          colorCountry(
            svg,
            svgId,
            REVEALED_COUNTRY
          );
        }
      );

      /*
       * --------------------------------------------------
       * PASSE FINALE SUR LES FRONTIÈRES
       * --------------------------------------------------
       */

      Object.values(
        ISO2_TO_SVG_ID
      ).forEach((svgId) => {
        getCountryElements(
          svg,
          svgId
        ).forEach(
          (element) => {
            applyBorder(
              element
            );

            element
              .querySelectorAll<SVGElement>(
                "path, polygon, circle, rect, ellipse"
              )
              .forEach(
                (child) => {
                  applyBorder(
                    child
                  );
                }
              );
          }
        );
      });

      /*
       * Une dernière passe sur les anciennes
       * bordures beige indépendantes.
       */

      svg
        .querySelectorAll<SVGElement>(
          "path, polygon, polyline"
        )
        .forEach((element) => {
          const stroke =
            element
              .getAttribute(
                "stroke"
              )
              ?.toLowerCase();

          if (
            stroke ===
              "#c7c09a" ||
            stroke ===
              "#bcb58e"
          ) {
            applyBorder(
              element
            );
          }
        });

      return svg.outerHTML;
    }, [
      rawSvg,
      foundCodes,
      revealCodes,
    ]);

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    const target =
      event.target as
        | Element
        | null;

    const countryElement =
      target?.closest<SVGElement>(
        "[data-found-country]"
      );

    if (
      !countryElement
    ) {
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

    const containerRect =
      event.currentTarget.getBoundingClientRect();

    setTooltip({
      name: countryName,

      x:
        event.clientX -
        containerRect.left,

      y:
        event.clientY -
        containerRect.top,
    });
  }

  function handlePointerLeave() {
    setTooltip(null);
  }

  if (!rawSvg) {
    return (
      <div className="europeMap europeMap--loading">
        Chargement de la
        carte…
      </div>
    );
  }

  return (
    <div
      className="europeMap"
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
    >
      <div
        className="europeMap__tooltipAnchor"
        dangerouslySetInnerHTML={{
          __html:
            svgMarkup,
        }}
      />

      {tooltip && (
        <div
          className="europeMap__tooltip"
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