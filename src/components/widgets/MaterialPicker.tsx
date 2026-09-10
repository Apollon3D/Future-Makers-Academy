import { useMemo, useState } from 'react'
import { WidgetShell } from './common'
import { Badge, cn } from '../ui'
import {
  AXIS_LABEL,
  FAMILY_ORDER,
  FILAMENTS,
  type Filament,
  type ScoreAxis,
} from '../../content/filaments'

interface Question {
  id: string
  label: string
  /** Score axes this requirement rewards, with weights. */
  weights: Partial<Record<ScoreAxis, number>>
}

const QUESTIONS: Question[] = [
  { id: 'load', label: 'Takes mechanical load / must stay stiff', weights: { strength: 3 } },
  { id: 'impact', label: 'Gets dropped, knocked, or must survive impact', weights: { toughness: 3 } },
  { id: 'heat', label: 'Exposed to heat — car interior, electronics, hot water, dishwasher', weights: { heat: 3 } },
  { id: 'outdoor', label: 'Lives outdoors / in sunlight', weights: { outdoor: 3 } },
  { id: 'flex', label: 'Must bend, stretch, grip, or damp vibration', weights: { flex: 3 } },
  { id: 'detail', label: 'Fine detail or display-quality finish matters most', weights: { detail: 3 } },
  { id: 'easy', label: 'As easy to print as possible (beginner, no enclosure)', weights: { ease: 3, lowWarp: 1 } },
  { id: 'chem', label: 'Contact with oils, fuels, solvents, or moisture', weights: { chem: 3 } },
  { id: 'big', label: 'Large flat part — warping would ruin it', weights: { lowWarp: 3 } },
]

type Tab = 'recommend' | 'all'

export function MaterialPicker() {
  const [tab, setTab] = useState<Tab>('recommend')
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [hardened, setHardened] = useState(true)
  const [enclosure, setEnclosure] = useState(false)
  const [directDrive, setDirectDrive] = useState(false)

  const active = QUESTIONS.filter((q) => answers[q.id])

  const ranked = useMemo(() => {
    const scored = FILAMENTS.filter((f) => f.family !== 'Support').map((f) => {
      let score = 0
      let max = 0
      if (active.length === 0) {
        // Neutral: reward a good all-round beginner material.
        score = f.scores.ease * 2 + f.scores.detail + f.scores.strength + f.scores.lowWarp
        max = 21
      } else {
        for (const q of active) {
          for (const [axis, w] of Object.entries(q.weights) as [ScoreAxis, number][]) {
            score += f.scores[axis] * w
            max += 3 * w
          }
        }
      }
      // Practicality penalties for the user's setup.
      const flags: string[] = []
      if (f.enclosure === 'required' && !enclosure) {
        score -= max * 0.28
        flags.push('needs an enclosure you don’t have')
      } else if (f.enclosure === 'helpful' && !enclosure) {
        score -= max * 0.05
      }
      if (f.abrasive && !hardened) {
        score -= max * 0.18
        flags.push('needs a hardened nozzle')
      }
      if (f.scores.flex >= 3 && !directDrive) {
        score -= max * 0.22
        flags.push('needs a direct-drive extruder')
      }
      if (f.family === 'Industrial') {
        score -= max * 0.6
        flags.push('needs a specialised high-temp printer')
      }
      return { f, pct: max > 0 ? Math.max(0, (score / max) * 100) : 0, flags }
    })
    scored.sort((a, b) => b.pct - a.pct)
    return scored
  }, [active, hardened, enclosure, directDrive])

  const top = ranked.slice(0, 5)

  return (
    <WidgetShell>
      <div className="mb-3 flex gap-1 border-b border-border">
        {(
          [
            ['recommend', 'Find a material'],
            ['all', `All filaments (${FILAMENTS.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-1.5 text-sm font-medium',
              tab === id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'recommend' ? (
        <>
          <h4 className="mb-2 text-sm font-semibold text-ink">
            What does the part need to do?
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {QUESTIONS.map((q) => (
              <label
                key={q.id}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-surface p-2.5 text-sm text-text has-[:checked]:border-accent has-[:checked]:text-ink"
              >
                <input
                  type="checkbox"
                  checked={Boolean(answers[q.id])}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [q.id]: e.target.checked }))
                  }
                  className="mt-0.5 accent-[var(--accent)]"
                />
                {q.label}
              </label>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 rounded-lg bg-surface p-3 text-xs text-text">
            <span className="font-medium text-muted">My printer:</span>
            <Toggle label="Hardened nozzle" on={hardened} set={setHardened} />
            <Toggle label="Enclosure" on={enclosure} set={setEnclosure} />
            <Toggle label="Direct drive" on={directDrive} set={setDirectDrive} />
          </div>

          <div className="mt-4 space-y-2">
            {top.map(({ f, pct, flags }, i) => (
              <div
                key={f.id}
                className="rounded-lg border border-border bg-surface p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">#{i + 1}</span>
                  <span className="font-semibold text-ink">{f.name}</span>
                  <Badge tone="muted">{f.family}</Badge>
                  {i === 0 && flags.length === 0 && (
                    <Badge tone="accent">Best match</Badge>
                  )}
                  <div className="ml-auto h-1.5 w-20 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${pct}%`, transition: 'width .3s' }}
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-text">{f.bestFor}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  nozzle {f.nozzle[0]}–{f.nozzle[1]} °C · bed {f.bed[0]}–{f.bed[1]} °C
                  {f.enclosure !== 'no' && ` · enclosure ${f.enclosure}`}
                </p>
                {flags.length > 0 && (
                  <p className="mt-1 text-[11px] text-warn">
                    ⚠ {flags.join('; ')}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Tick nothing for a sensible default. Scores weigh your requirements
            against each material and your printer’s capabilities — they don’t
            know your exact part.
          </p>
        </>
      ) : (
        <AllFilaments />
      )}
    </WidgetShell>
  )
}

function Toggle({
  label,
  on,
  set,
}: {
  label: string
  on: boolean
  set: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
        on
          ? 'border-accent bg-accent-soft text-accent'
          : 'border-border text-muted',
      )}
    >
      {on ? '✓ ' : ''}
      {label}
    </button>
  )
}

const AXES: ScoreAxis[] = [
  'strength',
  'toughness',
  'heat',
  'outdoor',
  'flex',
  'detail',
  'ease',
  'lowWarp',
  'chem',
]

function AllFilaments() {
  const [open, setOpen] = useState<string | null>(FILAMENTS[0].id)

  return (
    <div className="space-y-4">
      {FAMILY_ORDER.map((fam) => {
        const items = FILAMENTS.filter((f) => f.family === fam)
        if (items.length === 0) return null
        return (
          <div key={fam}>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {fam}
            </div>
            <div className="space-y-1">
              {items.map((f) => (
                <FilamentRow
                  key={f.id}
                  f={f}
                  open={open === f.id}
                  onToggle={() => setOpen(open === f.id ? null : f.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
      <p className="text-xs text-muted">
        Temperatures are typical starting ranges — always follow the spool’s spec
        sheet. Bars show relative suitability (0–3), not absolute lab values.
      </p>
    </div>
  )
}

function FilamentRow({
  f,
  open,
  onToggle,
}: {
  f: Filament
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="text-sm font-medium text-ink">{f.name}</span>
        <span className="font-mono text-[11px] text-muted">
          {f.nozzle[0]}–{f.nozzle[1]}°/{f.bed[0]}–{f.bed[1]}°
        </span>
        <span className="ml-auto flex gap-1">
          {f.abrasive && <Badge tone="warn">abrasive</Badge>}
          {f.thirsty && <Badge tone="muted">dry it</Badge>}
          {f.enclosure === 'required' && <Badge tone="warn">enclosure</Badge>}
        </span>
        <span className="text-muted">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="border-t border-border px-3 py-3">
          <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {AXES.map((axis) => (
              <div key={axis} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 text-muted">
                  {AXIS_LABEL[axis]}
                </span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="h-2 w-4 rounded-sm"
                      style={{
                        background:
                          f.scores[axis] > n
                            ? 'var(--accent)'
                            : 'var(--surface-3)',
                      }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-3 space-y-1 text-xs">
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted">Cooling</dt>
              <dd className="text-text capitalize">{f.cooling}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted">Enclosure</dt>
              <dd className="text-text capitalize">{f.enclosure}</dd>
            </div>
            {f.fumes && (
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted">Fumes</dt>
                <dd className="text-text capitalize">{f.fumes}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted">Best for</dt>
              <dd className="text-text">{f.bestFor}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-muted">Watch out</dt>
              <dd className="text-warn">{f.watchOut}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
