"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  SOUTH_AMERICA_COUNTRIES,
} from "@/lib/defi-carte/south-america";

import {
  generateMapShareImage,
  downloadBlob,
} from "@/lib/defi-carte/shareImage";

import {
  SouthAmericaMap,
} from "@/app/jeux/defi-carte/SouthAmericaMap";

const GAME_DURATION = 4 * 60;

const COVER_IMAGE =
  "https://res.cloudinary.com/dsv7oziap/image/upload/v1788439882/south-america_aywknj.jpg";

/*
 * ========================================
 * NORMALISATION
 * ========================================
 */

function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

/*
 * ========================================
 * FORMAT DU CHRONO
 * ========================================
 */

function formatTime(seconds: number) {
  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

/*
 * ========================================
 * JEU
 * ========================================
 */

export function SouthAmericaMapGame() {
  const [
    isStarted,
    setIsStarted,
  ] = useState(false);

  const [
    isFinished,
    setIsFinished,
  ] = useState(false);

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(GAME_DURATION);

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    foundCodes,
    setFoundCodes,
  ] = useState<string[]>([]);

  const [
    isCopied,
    setIsCopied,
  ] = useState(false);

  const [
    isSharing,
    setIsSharing,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /*
   * ========================================
   * PAYS NORMALISÉS
   * ========================================
   */

  const normalizedCountries =
    useMemo(() => {
      return SOUTH_AMERICA_COUNTRIES.map(
        (country) => ({
          ...country,

          normalizedAliases: [
            country.name,
            ...country.aliases,
          ].map(
            normalizeAnswer
          ),
        })
      );
    }, []);

  /*
   * ========================================
   * PAYS TROUVÉS
   * ========================================
   */

  const foundCountries =
    useMemo(() => {
      return SOUTH_AMERICA_COUNTRIES.filter(
        (country) =>
          foundCodes.includes(
            country.code
          )
      );
    }, [
      foundCodes,
    ]);

  /*
   * ========================================
   * PAYS MANQUÉS
   * ========================================
   */

  const missingCountries =
    useMemo(() => {
      return SOUTH_AMERICA_COUNTRIES.filter(
        (country) =>
          !foundCodes.includes(
            country.code
          )
      );
    }, [
      foundCodes,
    ]);

  /*
   * ========================================
   * PROGRESSION
   * ========================================
   */

  const progress =
    (foundCodes.length /
      SOUTH_AMERICA_COUNTRIES.length) *
    100;

  const progressDegrees =
    progress * 3.6;

  /*
   * ========================================
   * TIMER
   * ========================================
   */

  useEffect(() => {
    if (
      !isStarted ||
      isFinished
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeLeft(
          (currentTime) => {
            if (
              currentTime <= 1
            ) {
              window.clearInterval(
                timer
              );

              return 0;
            }

            return (
              currentTime - 1
            );
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    isStarted,
    isFinished,
  ]);

  /*
   * ========================================
   * FIN DU TEMPS
   * ========================================
   */

  useEffect(() => {
    if (
      isStarted &&
      timeLeft === 0
    ) {
      setIsFinished(
        true
      );
    }
  }, [
    isStarted,
    timeLeft,
  ]);

  /*
   * ========================================
   * TOUS LES PAYS TROUVÉS
   * ========================================
   */

  useEffect(() => {
    if (
      isStarted &&
      foundCodes.length ===
        SOUTH_AMERICA_COUNTRIES.length
    ) {
      setIsFinished(
        true
      );
    }
  }, [
    isStarted,
    foundCodes,
  ]);

  /*
   * ========================================
   * FOCUS AUTOMATIQUE
   * ========================================
   */

  useEffect(() => {
    if (
      isStarted &&
      !isFinished
    ) {
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [
    isStarted,
    isFinished,
  ]);

  /*
   * ========================================
   * LANCER LE CHRONO
   * ========================================
   */

  function startGame() {
    if (
      isStarted ||
      isFinished
    ) {
      return;
    }

    setIsStarted(
      true
    );
  }

  /*
   * ========================================
   * REJOUER
   * ========================================
   */

  function restartGame() {
    setFoundCodes([]);
    setAnswer("");

    setTimeLeft(
      GAME_DURATION
    );

    setIsFinished(
      false
    );

    setIsStarted(
      false
    );

    setIsCopied(
      false
    );

    setIsSharing(
      false
    );
  }

  /*
   * ========================================
   * RÉPONSE
   * ========================================
   */

  function handleAnswer(
    value: string
  ) {
    if (
      !isStarted ||
      isFinished
    ) {
      return;
    }

    setAnswer(
      value
    );

    const normalizedValue =
      normalizeAnswer(
        value
      );

    if (
      !normalizedValue
    ) {
      return;
    }

    const country =
      normalizedCountries.find(
        (item) =>
          item.normalizedAliases.includes(
            normalizedValue
          )
      );

    if (!country) {
      return;
    }

    if (
      foundCodes.includes(
        country.code
      )
    ) {
      setAnswer("");

      return;
    }

    setFoundCodes(
      (currentCodes) => [
        ...currentCodes,
        country.code,
      ]
    );

    setAnswer("");
  }

  /*
   * ========================================
   * TEXTE DE PARTAGE
   * ========================================
   */

  function getShareText() {
    return `J'ai trouvé ${foundCodes.length} pays sur ${SOUTH_AMERICA_COUNTRIES.length} au Défi Carte Amérique du Sud sur QuizUp ! 🌎`;
  }

  /*
   * ========================================
   * PARTAGE IMAGE
   * ========================================
   */

  async function shareResult() {
    if (
      isSharing
    ) {
      return;
    }

    setIsSharing(
      true
    );

    try {
      const score =
        foundCodes.length;

      const total =
        SOUTH_AMERICA_COUNTRIES.length;

      const scorePercent =
        total === 0
          ? 0
          : Math.round(
              (score /
                total) *
                100
            );

      const blob =
        await generateMapShareImage({
          continent:
            "Amérique du Sud",

          score,

          total,

          percent:
            scorePercent,

          coverUrl:
            COVER_IMAGE,
        });

      const filename =
        "score-defi-carte-amerique-du-sud.png";

      const file =
        new File(
          [blob],
          filename,
          {
            type:
              "image/png",
          }
        );

      const canShareFiles =
        typeof navigator !==
          "undefined" &&
        typeof navigator.canShare ===
          "function" &&
        navigator.canShare({
          files: [
            file,
          ],
        });

      /*
       * PARTAGE NATIF
       */

      if (
        typeof navigator.share ===
          "function" &&
        canShareFiles
      ) {
        await navigator.share({
          title:
            "Mon score : Défi Carte Amérique du Sud",

          text:
            `J’ai trouvé ${score}/${total} pays (${scorePercent}%) !`,

          files: [
            file,
          ],
        });

        return;
      }

      /*
       * FALLBACK DESKTOP
       */

      downloadBlob(
        blob,
        filename
      );

      try {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setIsCopied(
          true
        );

        window.setTimeout(() => {
          setIsCopied(
            false
          );
        }, 2000);
      } catch {
        // Clipboard indisponible.
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Erreur lors du partage du Défi Carte Amérique du Sud :",
        error
      );
    } finally {
      setIsSharing(
        false
      );
    }
  }

  /*
   * ========================================
   * COPIER LE LIEN
   * ========================================
   */

  async function copyResultLink() {
    const shareUrl =
      window.location.href;

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      setIsCopied(
        true
      );

      window.setTimeout(() => {
        setIsCopied(
          false
        );
      }, 2000);
    } catch {
      // Clipboard non disponible.
    }
  }

  /*
   * ========================================
   * WHATSAPP
   * ========================================
   */

  function shareOnWhatsApp() {
    const shareText =
      encodeURIComponent(
        `${getShareText()} ${window.location.href}`
      );

    window.open(
      `https://wa.me/?text=${shareText}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /*
   * ========================================
   * FACEBOOK
   * ========================================
   */

  function shareOnFacebook() {
    const shareUrl =
      encodeURIComponent(
        window.location.href
      );

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /*
   * ========================================
   * X
   * ========================================
   */

  function shareOnX() {
    const shareUrl =
      encodeURIComponent(
        window.location.href
      );

    const shareText =
      encodeURIComponent(
        getShareText()
      );

    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <section className="mapGame">
      {!isFinished ? (
        /*
         * ==================================
         * JEU
         * ==================================
         */

        <div className="mapGame__board">
          {/* BARRE SUPÉRIEURE */}

          <div className="mapGame__boardTop">
            <div className="mapGame__boardStat">
              <span className="mapGame__statLabel">
                Temps restant
              </span>

              <strong
                className={
                  timeLeft <= 30 &&
                  isStarted
                    ? "mapGame__timer mapGame__timer--danger"
                    : "mapGame__timer"
                }
              >
                {formatTime(
                  timeLeft
                )}
              </strong>
            </div>

            <div className="mapGame__boardProgress">
              <div className="mapGame__boardProgressText">
                <span>
                  Progression
                </span>

                <strong>
                  {foundCodes.length} /{" "}
                  {
                    SOUTH_AMERICA_COUNTRIES.length
                  }
                </strong>
              </div>

              <div className="mapGame__progressTrack">
                <div
                  className="mapGame__progressValue"
                  style={{
                    width:
                      `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* CARTE + PAYS TROUVÉS */}

          <div className="mapGame__playArea">
            <div className="mapGame__mapStage">
              <SouthAmericaMap
                foundCodes={
                  foundCodes
                }

                revealCodes={
                  []
                }
              />
            </div>

            <aside className="mapGame__found">
              <div className="mapGame__foundHeader">
                <div>
                  <span className="mapGame__foundLabel">
                    Pays trouvés
                  </span>

                  <strong className="mapGame__foundCount">
                    {
                      foundCodes.length
                    }
                  </strong>
                </div>

                <span className="mapGame__foundTotal">
                  /{" "}
                  {
                    SOUTH_AMERICA_COUNTRIES.length
                  }
                </span>
              </div>

              {foundCountries.length >
              0 ? (
                <div className="mapGame__countryList">
                  {foundCountries.map(
                    (country) => (
                      <div
                        key={
                          country.code
                        }

                        className="mapGame__countryItem"
                      >
                        <span className="mapGame__countryCheck">
                          ✓
                        </span>

                        <span className="mapGame__countryName">
                          {
                            country.name
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="mapGame__empty">
                  {isStarted
                    ? "Les pays trouvés apparaîtront ici."
                    : "Lance le chrono quand tu es prêt."}
                </p>
              )}
            </aside>
          </div>

          {/* LANCEMENT / CHAMP DE RÉPONSE */}

          <div className="mapGame__dock">
            {!isStarted ? (
              <button
                type="button"
                className="mapGame__startButton"
                onClick={
                  startGame
                }
              >
                Lancer le chrono
              </button>
            ) : (
              <div className="mapGame__inputContainer">
                <input
                  ref={
                    inputRef
                  }

                  type="text"

                  value={
                    answer
                  }

                  onChange={(
                    event
                  ) =>
                    handleAnswer(
                      event.target
                        .value
                    )
                  }

                  className="mapGame__input"

                  placeholder="Écris le nom d'un pays..."

                  autoComplete="off"

                  autoCorrect="off"

                  spellCheck={
                    false
                  }

                  aria-label="Nom d'un pays d'Amérique du Sud"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /*
         * ==================================
         * RÉSULTAT
         * ==================================
         */

        <div className="mapGame__resultLayout">
          {/* CARTE */}

          <div className="mapGame__resultMapPanel">
            <SouthAmericaMap
              foundCodes={
                foundCodes
              }

              revealCodes={
                missingCountries.map(
                  (country) =>
                    country.code
                )
              }
            />
          </div>

          {/* PANNEAU DE RÉSULTAT */}

          <aside className="mapGame__resultPanel">
            <span className="mapGame__resultEyebrow">
              Résultat
            </span>

            {/* SCORE CIRCULAIRE */}

            <div
              className="mapGame__resultScore"

              style={
                {
                  "--score-progress":
                    `${progressDegrees}deg`,
                } as CSSProperties
              }
            >
              <div className="mapGame__resultScoreInner">
                {foundCodes.length} /{" "}
                {
                  SOUTH_AMERICA_COUNTRIES.length
                }
              </div>
            </div>

            <p className="mapGame__resultPercent">
              {Math.round(
                progress
              )}{" "}
              % des pays trouvés
            </p>

            <div className="mapGame__resultSeparator" />

            {/* PAYS MANQUÉS */}

            <div className="mapGame__missingSummary">
              <span className="mapGame__missingIcon">
                ⚑
              </span>

              <strong>
                {
                  missingCountries.length
                }{" "}
                {missingCountries.length >
                1
                  ? "pays manqués"
                  : "pays manqué"}
              </strong>
            </div>

            {/* REJOUER */}

            <button
              type="button"

              className="mapGame__restartButton mapGame__restartButton--result"

              onClick={
                restartGame
              }
            >
              Rejouer
            </button>

            {/* PARTAGE */}

            <div className="mapGame__share">
              <span className="mapGame__shareLabel">
                Partager mon score
              </span>

              <div className="mapGame__shareButtons">
                <button
                  type="button"

                  className="mapGame__shareMain"

                  onClick={
                    shareResult
                  }

                  disabled={
                    isSharing
                  }
                >
                  {isSharing
                    ? "Préparation..."
                    : "Partager"}
                </button>

                <button
                  type="button"

                  className="mapGame__shareButton"

                  onClick={
                    shareOnWhatsApp
                  }

                  aria-label="Partager sur WhatsApp"

                  title="WhatsApp"
                >
                  WA
                </button>

                <button
                  type="button"

                  className="mapGame__shareButton"

                  onClick={
                    shareOnFacebook
                  }

                  aria-label="Partager sur Facebook"

                  title="Facebook"
                >
                  f
                </button>

                <button
                  type="button"

                  className="mapGame__shareButton"

                  onClick={
                    shareOnX
                  }

                  aria-label="Partager sur X"

                  title="X"
                >
                  X
                </button>

                <button
                  type="button"

                  className={
                    isCopied
                      ? "mapGame__shareButton mapGame__shareButton--copied"
                      : "mapGame__shareButton"
                  }

                  onClick={
                    copyResultLink
                  }

                  aria-label="Copier le lien"

                  title="Copier le lien"
                >
                  {isCopied
                    ? "✓"
                    : "↗"}
                </button>
              </div>
            </div>

            {/* LISTE DES PAYS MANQUÉS */}

            {missingCountries.length >
            0 ? (
              <div className="mapGame__missing">
                <h3>
                  Pays manqués
                </h3>

                <div className="mapGame__missingList">
                  {missingCountries.map(
                    (country) => (
                      <span
                        key={
                          country.code
                        }

                        className="mapGame__missingCountry"
                      >
                        <span className="mapGame__missingDot" />

                        {
                          country.name
                        }
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : (
              <p className="mapGame__perfect">
                Bravo, tu as retrouvé tous les
                pays !
              </p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}