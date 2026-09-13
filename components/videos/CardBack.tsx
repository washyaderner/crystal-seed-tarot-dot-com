import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** A face-down card: the visual for a reading that has not been chosen yet */
export function CardBack({
  number,
  className,
  small,
  style,
}: {
  number?: number;
  className?: string;
  small?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-600 via-indigo-800 to-purple-950 shadow-lg shadow-purple-900/50",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-[6%] rounded-lg border border-purple-200/30" />
      <div className="card-shimmer absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-purple-100">
        <Sparkles className={small ? "h-4 w-4" : "h-6 w-6 md:h-7 md:w-7"} />
        {number !== undefined && (
          <span className={cn("font-serif leading-none", small ? "text-xl" : "text-4xl md:text-5xl")}>
            {number}
          </span>
        )}
      </div>
    </div>
  );
}
