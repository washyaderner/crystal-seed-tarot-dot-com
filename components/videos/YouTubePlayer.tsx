"use client";

import * as React from "react";
import { embedUrl } from "@/lib/youtube-videos";

export type PlayerState = "unstarted" | "ended" | "playing" | "paused" | "buffering" | "cued";

const STATE_BY_CODE: Record<number, PlayerState> = {
  [-1]: "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued",
};

const API_SRC = "https://www.youtube.com/iframe_api";
const HOST = "https://www.youtube-nocookie.com";
const API_TIMEOUT_MS = 6000;

interface YTPlayer {
  loadVideoById(id: string): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/**
 * Load YouTube's IFrame Player API once per page. Resolves with the YT
 * namespace; rejects if the script is blocked or never calls back, in which
 * case the player falls back to a plain embed (everything still works, the
 * page just cannot tell when a video ends).
 */
function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube IFrame API loaded without a Player"));
    };
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("YouTube IFrame API failed to load"));
    document.head.appendChild(script);
    window.setTimeout(() => reject(new Error("YouTube IFrame API timed out")), API_TIMEOUT_MS);
  });
  // A failed load should not poison every later player on the page
  apiPromise.catch(() => {
    apiPromise = null;
  });
  return apiPromise;
}

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  /** Change this value to restart the same video from the top */
  playToken?: number;
  onStateChange?: (state: PlayerState) => void;
  onModeChange?: (mode: "api" | "iframe") => void;
}

/**
 * One persistent YouTube player. Switching `videoId` swaps the video inside the
 * same player (no iframe reload) and autoplays, because the switch always
 * follows a click.
 */
export function YouTubePlayer({
  videoId,
  title,
  playToken = 0,
  onStateChange,
  onModeChange,
}: YouTubePlayerProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<YTPlayer | null>(null);
  const readyRef = React.useRef(false);
  const pendingRef = React.useRef<string | null>(null);
  const constructedRef = React.useRef<{ id: string; token: number } | null>(null);
  const [mode, setMode] = React.useState<"loading" | "api" | "iframe">("loading");

  // Keep the latest callbacks without re-creating the player
  const stateCb = React.useRef(onStateChange);
  stateCb.current = onStateChange;
  const modeCb = React.useRef(onModeChange);
  modeCb.current = onModeChange;

  // The id the player was built with; later ids arrive through loadVideoById
  const initialRef = React.useRef({ id: videoId, token: playToken });

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;

    // The API replaces this element with its iframe. It lives outside React's
    // tree on purpose so reconciliation never touches it.
    const target = document.createElement("div");
    mount.appendChild(target);
    constructedRef.current = initialRef.current;

    loadApi()
      .then((YT) => {
        if (cancelled) return;
        playerRef.current = new YT.Player(target, {
          host: HOST,
          videoId: initialRef.current.id,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              readyRef.current = true;
              setMode("api");
              modeCb.current?.("api");
              if (pendingRef.current) {
                playerRef.current?.loadVideoById(pendingRef.current);
                pendingRef.current = null;
              }
            },
            onStateChange: (event: { data: number }) => {
              const state = STATE_BY_CODE[event.data];
              if (state) stateCb.current?.(state);
            },
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        setMode("iframe");
        modeCb.current?.("iframe");
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        // the API throws if the iframe is already gone; nothing to do
      }
      playerRef.current = null;
      mount.replaceChildren();
    };
  }, []);

  React.useEffect(() => {
    const built = constructedRef.current;
    if (built && built.id === videoId && built.token === playToken) return;
    if (readyRef.current && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    } else {
      pendingRef.current = videoId;
    }
  }, [videoId, playToken]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {mode === "iframe" ? (
        <iframe
          key={`${videoId}-${playToken}`}
          src={embedUrl(videoId)}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          <div ref={mountRef} className="yt-mount absolute inset-0" aria-label={title} />
          {mode === "loading" && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/70"
              aria-live="polite"
            >
              <span className="animate-pulse">Shuffling the deck…</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
