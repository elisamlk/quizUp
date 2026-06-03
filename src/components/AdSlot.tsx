"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdFormat = "auto" | "rectangle";

export function AdSlot({
  slot,
  format = "auto",
  className = "",
  style,
}: {
  slot: string; // data-ad-slot
  format?: AdFormat;
  className?: string;
  style?: React.CSSProperties;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  // ✅ réserve de la place (anti CLS)
  const reservedStyle: React.CSSProperties =
    format === "rectangle" ? { minHeight: 280 } : { minHeight: 280 }; // auto responsive (safe)

  useEffect(() => {
    if (!client) return;
    if (!insRef.current) return;
    if (pushedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // ignore
    }
  }, [client]);

  // ✅ En dev si pas de client => placeholder (ne casse pas le layout)
  if (!client) {
    return (
      <div
        className={`adSlot adSlot--placeholder ${className}`}
        style={{ ...reservedStyle, ...style }}
        aria-hidden="true"
      >
        <span className="adSlotLabel">Emplacement pub</span>
      </div>
    );
  }

  return (
    <div
      className={`adSlot  ${className}`}
      style={{ ...reservedStyle, ...style }}
    >
      <ins
        ref={(el) => {
          insRef.current = el as unknown as HTMLModElement;
        }}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  );
}
