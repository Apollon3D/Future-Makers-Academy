import { useMemo, useState } from 'react'
import { Range, WidgetShell } from './common'

/** Overhang angle from vertical -> printed-surface quality, with a failure zone. */
export function OverhangDial() {
  const [angle, setAngle] = useState(30) // degrees from vertical
  const [cooling, setCooling] = useState(true)

  const model = useMemo(() => {
    const limit = cooling ? 58 : 45
    let quality: number
    let verdict: string
    let tone: string
    if (angle <= limit - 15) {
      quality = 95
      verdict = 'Clean. Each new line rests firmly on the one below.'
      tone = 'var(--success)'
    } else if (angle <= limit) {
      quality = 72
      verdict = 'Slightly rough underside — acceptable, near the limit.'
      tone = 'var(--warn)'
    } else if (angle <= limit + 12) {
      quality = 40
      verdict = 'Drooping and curling. Lines sag before they set.'
      tone = 'var(--warn)'
    } else {
      quality = 12
      verdict = 'Failing — curled lines catch the nozzle; needs support or a redesign.'
      tone = 'var(--danger)'
    }
    return { limit, quality, verdict, tone }
  }, [angle, cooling])

  const rad = (angle * Math.PI) / 180
  const wallLen = 110
  const tipX = 160 + Math.sin(rad) * wallLen
  const tipY = 150 - Math.cos(rad) * wallLen

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">Overhang Angle</h4>
      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
        <svg viewBox="0 0 320 170" className="w-full rounded-lg bg-surface">
          <line x1={0} y1={150} x2={320} y2={150} stroke="var(--border-strong)" />
          {/* vertical reference */}
          <line
            x1={160}
            y1={150}
            x2={160}
            y2={40}
            stroke="var(--border)"
            strokeDasharray="4 4"
          />
          {/* base column */}
          <rect x={150} y={110} width={20} height={40} fill="var(--surface-3)" stroke="var(--border-strong)" />
          {/* leaning wall */}
          <line
            x1={160}
            y1={150}
            x2={tipX}
            y2={tipY}
            stroke={model.tone}
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* angle arc */}
          <path
            d={`M160 110 A 40 40 0 0 1 ${160 + Math.sin(rad) * 40} ${150 - Math.cos(rad) * 40}`}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={1}
          />
          <text x={172} y={104} fill="var(--muted)" fontSize={11}>
            {angle}°
          </text>
        </svg>

        <div className="space-y-4">
          <Range
            label="Angle from vertical"
            min={0}
            max={80}
            step={1}
            value={angle}
            onChange={setAngle}
            format={(v) => `${v}°`}
          />
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={cooling}
              onChange={(e) => setCooling(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            Good part cooling (PLA, fan 100%)
          </label>
          <div className="rounded-md bg-surface-3 p-2 text-xs text-muted">
            Practical limit here: <span className="font-mono text-ink">{model.limit}°</span>
          </div>
        </div>
      </div>

      <p
        className="mt-3 rounded-md px-3 py-2 text-sm"
        style={{
          background: 'color-mix(in srgb, ' + model.tone + ' 12%, transparent)',
          color: model.tone,
        }}
      >
        {model.verdict}
      </p>
      <p className="mt-2 text-xs text-muted">
        Chamfering a flat underside to 45° or reorienting the part usually beats
        adding support.
      </p>
    </WidgetShell>
  )
}
