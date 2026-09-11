import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { useProgress } from '../store/useProgress'
import { QUICK_TIPS, type QuickTip } from '../content/quickTips'
import {
  addClip,
  deleteClip,
  getClipBlob,
  listClips,
  MAX_CLIP_BYTES,
  MAX_CLIPS_PER_PROFILE,
  type StudentClip,
} from '../lib/clipsDb'
import { youTubeId } from '../components/VideoPlayer'
import { Avatar } from '../components/Avatar'
import { Button, EmptyState } from '../components/ui'

type FeedItem =
  | { kind: 'curated'; id: string; tip: QuickTip }
  | { kind: 'clip'; id: string; clip: StudentClip }

/** Curated tips first, with the learner's own clips folded in every few slots
 *  (and any remainder tacked on the end) — a personal reel, not a shared one. */
function buildFeed(clips: StudentClip[]): FeedItem[] {
  const curated: FeedItem[] = QUICK_TIPS.map((tip) => ({
    kind: 'curated',
    id: tip.id,
    tip,
  }))
  const mine: FeedItem[] = clips.map((clip) => ({
    kind: 'clip',
    id: clip.id,
    clip,
  }))
  const out: FeedItem[] = []
  let ci = 0
  curated.forEach((item, i) => {
    out.push(item)
    if ((i + 1) % 3 === 0 && ci < mine.length) out.push(mine[ci++])
  })
  while (ci < mine.length) out.push(mine[ci++])
  return out
}

export function QuickTips() {
  const profileId = useAuth((s) => s.activeProfileId)
  const student = useAuth((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId),
  )
  const watchedTips = useProgress((s) => s.watchedTips)
  const watchTip = useProgress((s) => s.watchTip)

  const [clips, setClips] = useState<StudentClip[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef(new Map<string, HTMLDivElement>())
  const [activeId, setActiveId] = useState<string | null>(null)

  const refresh = () => {
    if (!profileId) return
    listClips(profileId)
      .then(setClips)
      .catch(() => setClips([]))
  }
  useEffect(refresh, [profileId])

  const feed = useMemo(() => buildFeed(clips), [clips])

  // Track which slide is centred so only it plays / loads its media.
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.tipId
          if (!id) continue
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { id, ratio: entry.intersectionRatio }
          }
        }
        if (best) setActiveId(best.id)
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    slideRefs.current.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [feed])

  // Default to the first slide being active before any scroll/observer fires.
  useEffect(() => {
    if (!activeId && feed.length > 0) setActiveId(feed[0].id)
  }, [feed, activeId])

  return (
    <div className="-mx-4 -mt-6 sm:-mx-8 sm:-mt-10">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold text-ink">Quick Tips</h1>
          <p className="text-xs text-muted">
            1-2 minute picks, plus your own clips. Swipe or scroll to the next.
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>+ Add a clip</Button>
      </div>

      {feed.length === 0 ? (
        <div className="px-4 sm:px-8">
          <EmptyState title="No tips yet">
            Add your first clip to get started.
          </EmptyState>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="h-[calc(100svh-8.5rem)] snap-y snap-mandatory overflow-y-scroll sm:mx-8 sm:h-[calc(100svh-11rem)] sm:rounded-2xl sm:border sm:border-border"
        >
          {feed.map((item) => (
            <TipSlide
              key={item.id}
              item={item}
              active={item.id === activeId}
              watched={item.kind === 'curated' && watchedTips.includes(item.tip.id)}
              onWatched={watchTip}
              onDelete={async (id) => {
                await deleteClip(id)
                refresh()
              }}
              studentName={student?.name}
              studentPhoto={student?.photo}
              refEl={(el) => {
                if (el) slideRefs.current.set(item.id, el)
                else slideRefs.current.delete(item.id)
              }}
            />
          ))}
        </div>
      )}

      {showUpload && profileId && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSubmit={async (file, caption) => {
            const clip = await addClip(profileId, file, caption)
            setShowUpload(false)
            setClips((prev) => [clip, ...prev])
          }}
        />
      )}
    </div>
  )
}

function TipSlide({
  item,
  active,
  watched,
  onWatched,
  onDelete,
  studentName,
  studentPhoto,
  refEl,
}: {
  item: FeedItem
  active: boolean
  watched: boolean
  onWatched: (id: string) => void
  onDelete: (id: string) => void
  studentName?: string
  studentPhoto?: string
  refEl: (el: HTMLDivElement | null) => void
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Load the clip's blob lazily, only while this slide is active.
  useEffect(() => {
    if (item.kind !== 'clip' || !active) return
    let url: string | null = null
    let cancelled = false
    getClipBlob(item.clip.id).then((blob) => {
      if (cancelled || !blob) return
      url = URL.createObjectURL(blob)
      setVideoUrl(url)
    })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
      setVideoUrl(null)
    }
  }, [item, active])

  // Count a curated tip "watched" after a few seconds of it being active.
  useEffect(() => {
    if (item.kind !== 'curated' || watched || !active) return
    const timer = window.setTimeout(() => onWatched(item.tip.id), 3000)
    return () => window.clearTimeout(timer)
  }, [item, watched, active, onWatched])

  const ytId =
    item.kind === 'curated' && item.tip.provider === 'youtube'
      ? youTubeId(item.tip.src)
      : null

  return (
    <div
      ref={refEl}
      data-tip-id={item.id}
      className="relative flex h-full w-full snap-start snap-always items-center justify-center overflow-hidden bg-black"
    >
      {item.kind === 'curated' ? (
        ytId ? (
          active ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&playsinline=1&rel=0&modestbranding=1`}
              title={item.tip.caption}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-70"
              loading="lazy"
            />
          )
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-muted">
            Video unavailable — it may have been removed.
          </div>
        )
      ) : videoUrl ? (
        <video
          className="h-full w-full object-contain"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          controls
        />
      ) : (
        <div className="grid h-full place-items-center text-sm text-muted">
          {active ? 'Loading…' : ''}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 pt-10 text-white">
        <div className="pointer-events-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            {item.kind === 'clip' && (
              <div className="mb-1 flex items-center gap-2">
                <Avatar photo={studentPhoto} name={studentName ?? '?'} size={22} />
                <span className="text-xs font-semibold">
                  {studentName ?? 'You'} · My clip
                </span>
              </div>
            )}
            <p className="text-sm font-medium">
              {item.kind === 'curated' ? item.tip.caption : item.clip.caption || 'Untitled clip'}
            </p>
            {item.kind === 'curated' ? (
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/70">
                <span>{item.tip.credit}</span>
                {item.tip.relatedLesson && (
                  <Link
                    to={`/learn/${item.tip.relatedLesson.moduleId}/${item.tip.relatedLesson.lessonId}`}
                    className="rounded-full bg-white/15 px-2 py-0.5 font-medium text-white hover:bg-white/25"
                  >
                    Full lesson →
                  </Link>
                )}
              </div>
            ) : (
              <p className="mt-0.5 text-[11px] text-white/60">
                {new Date(item.clip.createdAt).toLocaleDateString()} · only on this device
              </p>
            )}
          </div>
          {item.kind === 'clip' && !confirmDelete && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] hover:bg-white/20"
            >
              Delete
            </button>
          )}
        </div>
        {item.kind === 'clip' && confirmDelete && (
          <div className="pointer-events-auto mt-2 flex items-center gap-2 text-xs">
            <span>Delete this clip from this device?</span>
            <button
              type="button"
              className="font-semibold text-danger"
              onClick={() => onDelete(item.clip.id)}
            >
              Yes
            </button>
            <button
              type="button"
              className="text-white/70"
              onClick={() => setConfirmDelete(false)}
            >
              No
            </button>
          </div>
        )}
      </div>

      {item.kind === 'curated' && watched && (
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white">
          ✓ Watched
        </span>
      )}
    </div>
  )
}

function UploadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (file: File, caption: string) => Promise<void>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      await onSubmit(file, caption)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-ink">Add a clip</h2>
        <p className="mt-1 text-xs text-muted">
          Saved only in this browser, on this device — not shared with other
          students. Keep it short (1-2 minutes) and under{' '}
          {Math.round(MAX_CLIP_BYTES / 1e6)}MB. Up to {MAX_CLIPS_PER_PROFILE}{' '}
          clips.
        </p>
        <input
          type="file"
          accept="video/*"
          capture="environment"
          className="mt-3 block w-full text-sm text-text file:mr-3 file:rounded-lg file:border-0 file:bg-surface-3 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What did you make? (optional)"
          className="mt-3 h-20 w-full resize-none rounded-lg border border-border bg-surface-2 p-2 text-sm text-ink outline-none focus:border-accent"
        />
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!file || busy} onClick={submit}>
            {busy ? 'Saving…' : 'Save clip'}
          </Button>
        </div>
      </div>
    </div>
  )
}
