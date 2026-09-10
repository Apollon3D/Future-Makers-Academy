import { useState } from 'react'
import { useProgress, DEFAULT_PROFILE } from '../store/useProgress'
import { Button, Card, Labeled } from '../components/ui'

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
    </div>
  )
}
