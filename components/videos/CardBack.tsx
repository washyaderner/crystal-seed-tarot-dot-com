import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CARD_BACK_URL, CARD_BACK_RADIUS, CARD_BACK_RATIO } from "@/lib/youtube-videos";

/**
 * A face-down card: the Tarotdoxa card back, the same art the app uses.
 * The box is the art's exact 369x640 shape and its corners follow the art's own
 * rounded border, so nothing is cropped or cut at any size. The photo is shown
 * as-is; the number sits on a small brand chip so a visitor can still tell
 * reading 1, 2 and 3 apart. Size it with a width class.
 */
export function CardBack({
  number,
  className,
  small,
  priority,
  style,
}: {
  number?: number;
  className?: string;
  small?: boolean;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{ aspectRatio: CARD_BACK_RATIO, borderRadius: CARD_BACK_RADIUS, ...style }}
      className={cn("relative overflow-hidden bg-black shadow-lg shadow-black/50", className)}
      aria-hidden="true"
    >
      <Image
        src={CARD_BACK_URL}
        alt=""
        fill
        priority={priority}
        sizes={small ? "64px" : "(max-width: 640px) 33vw, 240px"}
        className="object-cover"
      />
      {number !== undefined && (
        <span
          className={cn(
            "brand-chip absolute left-1/2 -translate-x-1/2",
            small ? "bottom-1 h-5 w-5 text-[11px]" : "bottom-2 h-7 w-7 text-sm md:bottom-3 md:h-9 md:w-9 md:text-lg",
          )}
        >
          {number}
        </span>
      )}
    </div>
  );
}
