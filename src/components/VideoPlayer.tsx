import { useRef } from 'react'
import type { VideoChapter } from '../types'

/** Extract a YouTube video id from an id or any common URL form. */
export function youTubeId(src: string): string | null {
  if (!src) return null
  if (/^[\w-]{11}$/.test(src)) return src
  try {
    const u = new URL(src)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    const m = u.pathname.match(/\/(embed|shorts)\/([\w-]{11})/)
    if (m) return m[2]
  } catch {
    /* not a URL */
  }
  return null
}

function timeToSeconds(t: string): number {
  const parts = t.split(':').map(Number)
  return parts.reduce((acc, n) => acc * 60 + (Number.isFinite(n) ? n : 0), 0)
}

export function VideoPlayer({
  provider,
  src,
  credit,
  externalUrl,
  chapters,
}: {
  provider: 'youtube' | 'file'
  src: string
  credit?: string
  externalUrl?: string
  chapters?: VideoChapter[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!src) {
    return (
      <div className="my-4 grid aspect-video place-items-center rounded-xl border border-dashed border-border bg-surface-2 text-center text-sm text-muted">
        <div>
          <div className="text-2xl">🎬</div>
          <p className="mt-2">
            Video coming soon — add a URL in the Author tool or the module file.
          </p>
        </div>
      </div>
    )
  }

  const ytId = provider === 'youtube' ? youTubeId(src) : null
  const watchUrl =
    externalUrl ?? (ytId ? `https://www.youtube.com/watch?v=${ytId}` : src)

  return (
    <div className="my-4">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        {provider === 'youtube' && ytId ? (
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
            title="Lesson video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : provider === 'file' ? (
          <video
            ref={videoRef}
            className="aspect-video w-full"
            src={src}
            controls
            preload="metadata"
          />
        ) : (
          <div className="aspect-video grid place-items-center text-sm text-muted">
            Unrecognised video source.
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        {credit ? <span>Video: {credit}</span> : <span />}
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          Watch on {provider === 'youtube' ? 'YouTube' : 'source'} ↗
        </a>
      </div>

      {chapters && chapters.length > 0 && (
        <ol className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {chapters.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  if (provider === 'file' && videoRef.current) {
                    videoRef.current.currentTime = timeToSeconds(c.time)
                    videoRef.current.play()
                  } else {
                    window.open(
                      `${watchUrl}&t=${timeToSeconds(c.time)}s`,
                      '_blank',
                      'noreferrer',
                    )
                  }
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-text hover:bg-surface-2"
              >
                <span className="font-mono text-xs text-accent">{c.time}</span>
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
