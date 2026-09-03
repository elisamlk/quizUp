function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(
    radius,
    width / 2,
    height / 2
  );

  ctx.beginPath();

  ctx.moveTo(
    x + safeRadius,
    y
  );

  ctx.arcTo(
    x + width,
    y,
    x + width,
    y + height,
    safeRadius
  );

  ctx.arcTo(
    x + width,
    y + height,
    x,
    y + height,
    safeRadius
  );

  ctx.arcTo(
    x,
    y + height,
    x,
    y,
    safeRadius
  );

  ctx.arcTo(
    x,
    y,
    x + width,
    y,
    safeRadius
  );

  ctx.closePath();
}

async function loadImage(
  src: string
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image =
      new Image();

    image.crossOrigin =
      "anonymous";

    image.onload =
      () => resolve(image);

    image.onerror =
      () => resolve(null);

    image.src = src;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(
                new Error(
                  "Impossible de créer l’image"
                )
              ),
        "image/png",
        1
      );
    }
  );
}

export function downloadBlob(
  blob: Blob,
  filename: string
) {
  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export async function generateMapShareImage({
  continent,
  score,
  total,
  percent,
  coverUrl,
}: {
  continent: string;
  score: number;
  total: number;
  percent: number;
  coverUrl: string;
}): Promise<Blob> {
  const width = 1080;
  const height = 1920;

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = width;
  canvas.height = height;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas indisponible"
    );
  }

  /* FOND */

  const fallback =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  fallback.addColorStop(
    0,
    "#111827"
  );

  fallback.addColorStop(
    1,
    "#050914"
  );

  ctx.fillStyle =
    fallback;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  /* IMAGE HERO */

  const cover =
    await loadImage(
      coverUrl
    );

  if (cover) {
    const scale =
      Math.max(
        width /
          cover.width,
        height /
          cover.height
      );

    const drawnWidth =
      cover.width *
      scale;

    const drawnHeight =
      cover.height *
      scale;

    const drawnX =
      (width -
        drawnWidth) /
      2;

    const drawnY =
      (height -
        drawnHeight) /
      2;

    ctx.drawImage(
      cover,
      drawnX,
      drawnY,
      drawnWidth,
      drawnHeight
    );

    const overlay =
      ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );

    overlay.addColorStop(
      0,
      "rgba(5, 10, 25, 0.22)"
    );

    overlay.addColorStop(
      0.45,
      "rgba(5, 10, 25, 0.38)"
    );

    overlay.addColorStop(
      1,
      "rgba(5, 10, 25, 0.68)"
    );

    ctx.fillStyle =
      overlay;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );
  }

  /* QUIZUP */

  ctx.textBaseline =
    "top";

  ctx.font =
    "900 46px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#ffffff";

  ctx.fillText(
    "QuizUp",
    72,
    80
  );

  /* CARTE CENTRALE */

  const cardX = 70;
  const cardY = 340;

  const cardWidth =
    width -
    cardX * 2;

  const cardHeight =
    1080;

  ctx.save();

  roundedRect(
    ctx,
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    48
  );

  ctx.fillStyle =
    "rgba(7, 14, 32, 0.74)";

  ctx.fill();
  ctx.restore();

  ctx.save();

  roundedRect(
    ctx,
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    48
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.18)";

  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  /* BADGE */

  const badgeText =
    "DÉFI CARTE";

  ctx.font =
    "800 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  const badgePaddingX =
    30;

  const badgeHeight =
    68;

  const badgeWidth =
    ctx.measureText(
      badgeText
    ).width +
    badgePaddingX * 2;

  const badgeX =
    cardX + 60;

  const badgeY =
    cardY + 60;

  ctx.save();

  roundedRect(
    ctx,
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    999
  );

  ctx.fillStyle =
    "#3d5afe";

  ctx.fill();

  ctx.restore();

  ctx.fillStyle =
    "#ffffff";

  ctx.textBaseline =
    "middle";

  ctx.fillText(
    badgeText,
    badgeX +
      badgePaddingX,
    badgeY +
      badgeHeight / 2
  );

  /* CONTINENT */

  ctx.textBaseline =
    "top";

  ctx.font =
    "900 92px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#ffffff";

  const title =
    continent.toUpperCase();

  const titleWidth =
    ctx.measureText(
      title
    ).width;

  /*
   * Réduction automatique pour les noms
   * longs comme AMÉRIQUE DU NORD.
   */

  if (
    titleWidth >
    cardWidth - 120
  ) {
    ctx.font =
      "900 68px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  }

  const finalTitleWidth =
    ctx.measureText(
      title
    ).width;

  ctx.fillText(
    title,
    cardX +
      (cardWidth -
        finalTitleWidth) /
        2,
    cardY + 210
  );

  /* SOUS-TITRE */

  ctx.font =
    "600 38px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,0.72)";

  const subtitle =
    `Défi des ${total} pays`;

  const subtitleWidth =
    ctx.measureText(
      subtitle
    ).width;

  ctx.fillText(
    subtitle,
    cardX +
      (cardWidth -
        subtitleWidth) /
        2,
    cardY + 330
  );

  /* SCORE */

  ctx.font =
    "900 210px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#ffffff";

  const scoreText =
    `${score}/${total}`;

  const scoreWidth =
    ctx.measureText(
      scoreText
    ).width;

  ctx.fillText(
    scoreText,
    cardX +
      (cardWidth -
        scoreWidth) /
        2,
    cardY + 450
  );

  /* LABEL */

  ctx.font =
    "700 32px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,0.62)";

  const scoreLabel =
    "PAYS TROUVÉS";

  const scoreLabelWidth =
    ctx.measureText(
      scoreLabel
    ).width;

  ctx.fillText(
    scoreLabel,
    cardX +
      (cardWidth -
        scoreLabelWidth) /
        2,
    cardY + 690
  );

  /* POURCENTAGE */

  ctx.font =
    "900 92px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#5f76ff";

  const percentText =
    `${percent}%`;

  const percentWidth =
    ctx.measureText(
      percentText
    ).width;

  ctx.fillText(
    percentText,
    cardX +
      (cardWidth -
        percentWidth) /
        2,
    cardY + 790
  );

  /* SÉPARATEUR */

  const separatorY =
    cardY + 930;

  ctx.beginPath();

  ctx.moveTo(
    cardX + 100,
    separatorY
  );

  ctx.lineTo(
    cardX +
      cardWidth -
      100,
    separatorY
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.15)";

  ctx.lineWidth = 2;

  ctx.stroke();

  /* CHALLENGE */

  ctx.font =
    "700 40px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#ffffff";

  const challenge =
    "Peux-tu faire mieux ?";

  const challengeWidth =
    ctx.measureText(
      challenge
    ).width;

  ctx.fillText(
    challenge,
    cardX +
      (cardWidth -
        challengeWidth) /
        2,
    cardY + 985
  );

  /* FOOTER */

  ctx.textBaseline =
    "alphabetic";

  ctx.font =
    "900 42px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "#ffffff";

  ctx.fillText(
    "QuizUp",
    72,
    height - 125
  );

  ctx.font =
    "600 31px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,0.72)";

  const website =
    "quizup.fr";

  const websiteWidth =
    ctx.measureText(
      website
    ).width;

  ctx.fillText(
    website,
    width -
      72 -
      websiteWidth,
    height - 125
  );

  return canvasToBlob(
    canvas
  );
}