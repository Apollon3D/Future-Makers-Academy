import { useMemo, useState } from 'react'
import { WidgetShell } from './common'
import { Badge } from '../ui'

type Key = 'strength' | 'heat' | 'outdoor' | 'flex' | 'detail' | 'ease'

const QUESTIONS: { key: Key; label: string }[] = [
  { key: 'strength', label: 'Needs to take mechanical load / impact' },
  { key: 'heat', label: 'Will get hot (car interior, near electronics, dishwasher)' },
  { key: 'outdoor', label: 'Lives outdoors / in sunlight' },
  { key: 'flex', label: 'Must bend, stretch, or grip' },
  { key: 'detail', label: 'Fine detail / display quality matters most' },
  { key: 'ease', label: 'I want the least fuss to print' },
]

interface Mat {
  name: string
  scores: Record<Key, number> // 0..3 how well it serves that need
  note: string
}

const MATERIALS: Mat[] = [
  {
    name: 'PLA',
    scores: { strength: 1, heat: 0, outdoor: 0, flex: 0, detail: 3, ease: 3 },
    note: 'Easiest to print, crisp detail, but brittle and softens ~55 °C.',
  },
  {
    name: 'PETG',
    scores: { strength: 2, heat: 2, outdoor: 2, flex: 1, detail: 2, ease: 2 },
    note: 'Tough all-rounder, decent heat/UV tolerance. Strings if wet.',
  },
  {
    name: 'ASA',
    scores: { strength: 2, heat: 3, outdoor: 3, flex: 1, detail: 2, ease: 1 },
    note: 'Best heat + UV resistance. Needs an enclosure and ventilation.',
  },
  {
    name: 'TPU',
    scores: { strength: 2, heat: 1, outdoor: 2, flex: 3, detail: 1, ease: 1 },
    note: 'The flexible option. Print slow, direct drive preferred.',
  },
]

export function MaterialPicker() {
  const [answers, setAnswers] = useState<Record<Key, boolean>>({
    strength: false,
    heat: false,
    outdoor: false,
    flex: false,
    detail: false,
    ease: false,
  })

  const ranked = useMemo(() => {
    const active = QUESTIONS.filter((q) => answers[q.key])
    const scored = MATERIALS.map((m) => {
      if (active.length === 0) {
        // Neutral: reward printability + versatility.
        return { m, score: m.scores.ease + m.scores.detail + m.scores.strength }
      }
      const score = active.reduce((sum, q) => sum + m.scores[q.key], 0)
      return { m, score }
    })
    scored.sort((a, b) => b.score - a.score)
    const max = scored[0].score || 1
    return scored.map((s) => ({ ...s, pct: Math.round((s.score / max) * 100) }))
  }, [answers])

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">
        What are you building?
      </h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <label
            key={q.key}
            className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-surface p-2.5 text-sm text-text has-[:checked]:border-accent has-[:checked]:text-ink"
          >
            <input
              type="checkbox"
              checked={answers[q.key]}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [q.key]: e.target.checked }))
              }
              className="mt-0.5 accent-[var(--accent)]"
            />
            {q.label}
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {ranked.map(({ m, pct }, i) => (
          <div
            key={m.name}
            className="rounded-lg border border-border bg-surface p-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">#{i + 1}</span>
              <span className="font-semibold text-ink">{m.name}</span>
              {i === 0 && <Badge tone="accent">Best match</Badge>}
              <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pct}%`, transition: 'width .3s' }}
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-muted">{m.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Tick nothing and it recommends a sensible default. This tool weighs your
        constraints — it does not know your exact part.
      </p>
    </WidgetShell>
  )
}
