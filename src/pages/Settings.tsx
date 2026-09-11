import { useRef, useState } from 'react'
import { useProgress, DEFAULT_PROFILE } from '../store/useProgress'
import { useAuth } from '../store/useAuth'
import { switchProfile, logout } from '../store/session'
import { readAndResizeImage } from '../lib/image'
import { Button, Card, Labeled } from '../components/ui'
import { Logo } from '../components/Logo'
import { Avatar } from '../components/Avatar'

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent'

export function Settings() {
  const {
    profile,
    setProfile,
    theme,
    setTheme,
    resetProgress,
    xp,
    completedLessons,
  } = useProgress()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Your printer profile tailors examples and recommendations. Everything
          is stored locally in this browser.
        </p>
      </header>

      <StudentCard />

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Printer profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Labeled label="Printer name">
            <input
              className={inputCls}
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value })}
            />
          </Labeled>
          <Labeled label="Nozzle diameter (mm)">
            <select
              className={inputCls}
              value={profile.nozzle}
              onChange={(e) => setProfile({ nozzle: Number(e.target.value) })}
            >
              {[0.2, 0.4, 0.6, 0.8].map((n) => (
                <option key={n} value={n}>
                  {n.toFixed(1)}
                </option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Bed X (mm)">
            <input
              type="number"
              className={inputCls}
              value={profile.bedX}
              onChange={(e) => setProfile({ bedX: Number(e.target.value) })}
            />
          </Labeled>
          <Labeled label="Bed Y (mm)">
            <input
              type="number"
              className={inputCls}
              value={profile.bedY}
              onChange={(e) => setProfile({ bedY: Number(e.target.value) })}
            />
          </Labeled>
          <Labeled label="Extruder">
            <select
              className={inputCls}
              value={profile.extruder}
              onChange={(e) =>
                setProfile({
                  extruder: e.target.value as 'bowden' | 'direct',
                })
              }
            >
              <option value="bowden">Bowden</option>
              <option value="direct">Direct drive</option>
            </select>
          </Labeled>
          <Labeled label="Enclosure">
            <select
              className={inputCls}
              value={profile.enclosed ? 'yes' : 'no'}
              onChange={(e) =>
                setProfile({ enclosed: e.target.value === 'yes' })
              }
            >
              <option value="no">Open frame</option>
              <option value="yes">Enclosed</option>
            </select>
          </Labeled>
        </div>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setProfile(DEFAULT_PROFILE)}
        >
          Reset profile to defaults
        </Button>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Appearance
        </h2>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={
                'rounded-lg border px-4 py-2 text-sm capitalize ' +
                (theme === t
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-text hover:bg-surface-2')
              }
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Progress
        </h2>
        <p className="text-sm text-muted">
          {completedLessons.length} lessons complete · {xp} XP
        </p>
        {!confirmReset ? (
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmReset(true)}
          >
            Reset all progress
          </Button>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-danger">
              This clears XP, streaks, completions and review schedules. Authored
              modules are kept.
            </span>
            <Button
              variant="danger"
              onClick={() => {
                resetProgress()
                setConfirmReset(false)
              }}
            >
              Confirm reset
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>

      <Card className="flex items-center gap-4">
        <Logo size={36} />
        <div>
          <div className="text-sm font-semibold text-ink">
            Future Makers Academy
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Built by{' '}
            <a
              href="https://apollon3d.com"
              target="_blank"
              rel="noreferrer"
              className="text-xp hover:underline"
            >
              Apollon3D
            </a>
            . Everything on this page lives only in this browser.
          </p>
        </div>
      </Card>
    </div>
  )
}

function StudentCard() {
  const { profiles, activeProfileId, updateProfile } = useAuth()
  const me = profiles.find((p) => p.id === activeProfileId)
  const others = profiles.filter((p) => p.id !== activeProfileId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!me) return null

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      updateProfile(me.id, { photo: await readAndResizeImage(file) })
    } catch {
      /* ignore unreadable file */
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        My profile
      </h2>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative"
        >
          <Avatar photo={me.photo} name={me.name} size={64} />
          <span className="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {busy ? '…' : 'Change'}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickPhoto(e.target.files?.[0])}
        />
        <div className="flex-1">
          <Labeled label="Name">
            <input
              className={inputCls}
              value={me.name}
              onChange={(e) => updateProfile(me.id, { name: e.target.value })}
            />
          </Labeled>
        </div>
      </div>

      <Button variant="outline" className="mt-4" onClick={logout}>
        Switch student
      </Button>

      {others.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Other students on this device
          </div>
          <ul className="space-y-1.5">
            {others.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <Avatar photo={p.photo} name={p.name} size={28} />
                <span className="flex-1 text-sm text-ink">{p.name}</span>
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() => switchProfile(p.id)}
                >
                  Switch to
                </button>
                {confirmDelete === p.id ? (
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="text-danger">Remove?</span>
                    <button
                      type="button"
                      className="font-medium text-danger hover:underline"
                      onClick={() => useAuth.getState().removeProfile(p.id)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="text-muted hover:underline"
                      onClick={() => setConfirmDelete(null)}
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-xs text-muted hover:text-danger"
                    onClick={() => setConfirmDelete(p.id)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
