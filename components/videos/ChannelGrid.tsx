"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink, Play, Youtube } from "lucide-react";
import {
  embedUrl,
  formatDuration,
  thumbUrl,
  watchUrl,
  type ChannelVideo,
} from "@/lib/youtube-videos";

interface Group {
  title: string;
  blurb: string;
  videos: ChannelVideo[];
}

/**
 * The rest of the channel as click-to-play cards. Nothing from YouTube loads
 * until a card is tapped; then that card becomes the player. One open at a time.
 */
export function ChannelGrid({ groups }: { groups: Group[] }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="space-y-10 md:space-y-12">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="mb-4 md:mb-5">
            <h3 className="font-serif text-xl text-white md:text-2xl">{group.title}</h3>
            <p className="mt-1 text-sm text-white/70">{group.blurb}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {group.videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                open={openId === video.id}
                onOpen={() => setOpenId(video.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoCard({
  video,
  open,
  onOpen,
}: {
  video: ChannelVideo;
  open: boolean;
  onOpen: () => void;
}) {
  const [thumb, setThumb] = React.useState(() => thumbUrl(video.id, "max"));

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:border-purple-300/50 hover:bg-white/15 hover:shadow-lg hover:shadow-purple-500/30 md:frosted-card">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {open ? (
          <iframe
            src={embedUrl(video.id)}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-300"
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setThumb(thumbUrl(video.id, "hq"))}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* YouTube-red play button, the shape people already know from YouTube */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-[4.25rem] items-center justify-center rounded-[14px] bg-[#FF0000] text-white shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              </span>
            </span>
            <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
              {formatDuration(video.duration)}
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h4 className="font-serif text-lg leading-snug text-white">{video.title}</h4>
        <p className="mt-2 flex-1 text-sm text-white/80">{video.blurb}</p>
        <a
          href={watchUrl(video.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 self-start text-xs text-white/80 transition-colors hover:text-white"
        >
          <Youtube className="h-3.5 w-3.5 text-[#FF0000]" /> Watch on YouTube <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
