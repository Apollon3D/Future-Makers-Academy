import type { ReactNode } from 'react'

export function WidgetShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        'my-5 rounded-xl border border-border bg-surface-2 p-4 sm:p-5 ' +
        (className ?? '')
      }
    >
      {children}
    </div>
  )
}

export function Range({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  accent = 'var(--accent)',
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  format?: (v: number) => string
  accent?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-mono text-sm text-accent">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent"
        style={{
          background: `linear-gradient(to right, ${accent} ${pct}%, var(--surface-3) ${pct}%)`,
        }}
      />
    </div>
  )
}

export function Meter({
  label,
  value,
  caption,
  tone = 'var(--accent)',
}: {
  label: string
  /** 0-100 */
  value: number
  caption?: string
  tone?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        {caption && <span className="font-mono text-xs text-muted">{caption}</span>}
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full"
          style={{
            width: `${v}%`,
            background: tone,
            transition: 'width 0.35s ease, background 0.35s ease',
          }}
        />
      </div>
    </div>
  )
}

export function scoreTone(v: number): string {
  if (v >= 66) return 'var(--success)'
  if (v >= 33) return 'var(--warn)'
  return 'var(--danger)'
}
