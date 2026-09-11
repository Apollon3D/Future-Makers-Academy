import { useRef, useState } from 'react'
import { useAuth } from '../store/useAuth'
import { switchProfile } from '../store/session'
import { readAndResizeImage } from '../lib/image'
import { Avatar } from './Avatar'
import { Logo } from './Logo'
import { BrandGlow } from './BrandGlow'
import { Button, Card, cn } from './ui'

export function ProfileGate() {
  const { profiles, addProfile, removeProfile } = useAuth()
  const [creating, setCreating] = useState(profiles.length === 0)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  return (
    <div className="bp-grid grid min-h-svh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-lg">
        <header className="relative isolate mb-8 text-center">
          <BrandGlow />
          <div className="flex flex-col items-center gap-2">
            <Logo size={44} />
            <h1 className="text-xl font-semibold text-ink">
              Future Makers Academy
            </h1>
          </div>
        </header>

        <Card>
          {!creating ? (
            <>
              <h2 className="text-center text-base font-semibold text-ink">
                Who&rsquo;s making today?
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {profiles.map((p) => (
                  <div key={p.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => switchProfile(p.id)}
                      className="flex w-full flex-col items-center gap-2 rounded-lg p-2 text-center hover:bg-surface-2"
                    >
                      <Avatar photo={p.photo} name={p.name} size={60} />
                      <span className="line-clamp-1 text-xs font-medium text-ink">
                        {p.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => setConfirmDelete(p.id)}
                      className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-border bg-surface text-[10px] text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 focus:opacity-100"
                      style={{ opacity: confirmDelete === p.id ? 1 : undefined }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong p-2 text-center text-muted hover:border-accent hover:text-accent"
                >
                  <span className="grid h-[60px] w-[60px] place-items-center rounded-full border border-dashed border-current text-2xl leading-none">
                    +
                  </span>
                  <span className="text-xs font-medium">Add student</span>
                </button>
              </div>

              {confirmDelete && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-danger/40 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2 text-sm">
                  <span className="text-text">
                    Remove{' '}
                    <strong className="text-ink">
                      {profiles.find((p) => p.id === confirmDelete)?.name}
                    </strong>
                    ? Their progress on this device will be deleted.
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="danger"
                      onClick={() => {
                        removeProfile(confirmDelete)
                        setConfirmDelete(null)
                      }}
                    >
                      Remove
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <CreateProfileForm
              onCancel={profiles.length > 0 ? () => setCreating(false) : undefined}
              onCreate={(name, photo) => {
                const id = addProfile(name, photo)
                switchProfile(id)
              }}
            />
          )}
        </Card>

        <p className="mt-4 text-center text-xs text-muted">
          Profiles live only on this device — a name and photo to keep track
          of your own progress, not a secured account.
        </p>
      </div>
    </div>
  )
}

function CreateProfileForm({
  onCreate,
  onCancel,
}: {
  onCreate: (name: string, photo?: string) => void
  onCancel?: () => void
}) {
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      setPhoto(await readAndResizeImage(file))
    } catch {
      /* ignore unreadable file */
    } finally {
      setBusy(false)
    }
  }

  const submit = () => {
    if (!name.trim()) return
    onCreate(name, photo)
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-ink">New student</h2>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative"
        >
          <Avatar photo={photo} name={name || '?'} size={72} />
          <span
            className={cn(
              'absolute inset-0 grid place-items-center rounded-full bg-black/50 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100',
            )}
          >
            {busy ? '…' : photo ? 'Change' : 'Add photo'}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-ink">
            Name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="First name"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={submit} disabled={!name.trim()}>
          Start learning →
        </Button>
      </div>
    </div>
  )
}
