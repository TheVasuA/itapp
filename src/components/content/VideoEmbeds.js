'use client';

// VideoEmbeds — renders up to 3 related videos in a single column, one by one.
// Only one video can play at a time — clicking a new video stops the previous.
// Renders nothing when there are no valid videos.

import { useState } from 'react';
import { Play } from 'lucide-react';

const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function VideoCard({ video, isPlaying, onPlay }) {
  const [broken, setBroken] = useState(false);

  if (broken) return null;

  const thumb =
    video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="relative aspect-video w-full bg-zinc-900">
        {isPlaying ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Play video: ${video.title}`}
            className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              loading="lazy"
              onError={() => setBroken(true)}
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white transition-transform motion-safe:group-hover:scale-110">
                <Play className="h-7 w-7" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="line-clamp-2 p-2 text-sm font-medium">{video.title}</p>
    </div>
  );
}

export default function VideoEmbeds({ videos = [] }) {
  // Track which video is currently playing (by videoId). Only one at a time.
  const [activeId, setActiveId] = useState(null);

  const valid = (videos || [])
    .filter((v) => v && VIDEO_ID_RE.test(v.videoId) && v.title)
    .slice(0, 3);

  if (valid.length === 0) return null;

  return (
    <section className="my-8">
      <h2 className="mb-3 text-xl font-bold">Suggested Videos</h2>
      <div className="flex flex-col gap-4">
        {valid.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            isPlaying={activeId === video.videoId}
            onPlay={() => setActiveId(video.videoId)}
          />
        ))}
      </div>
    </section>
  );
}
