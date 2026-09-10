import { useMemo, useState } from 'react'
import { Range, WidgetShell } from './common'

/**
 * First-layer squish cross-section. The slider is the nozzle gap as a fraction
 * of nominal layer height; the drawing shows the extruded bead shape and a
 * verdict.
 */
export function ZOffset() {
  const [gap, setGap] = useState(0.2) // mm nozzle-to-bed, nominal LH 0.2

  const model = useMemo(() => {
    const nominal = 0.2
    const ratio = gap / nominal // 1.0 = no squish
    // bead width grows as gap shrinks (constant volume)
    const beadW = 0.48 / Math.max(0.55, ratio)
    let verdict: string
    let tone: string
    if (ratio > 1.15) {
      verdict = 'Too high — rounded lines, gaps between them, poor adhesion. The part may pop off.'
      tone = 'var(--danger)'
    } else if (ratio > 1.02) {
      verdict = 'Slightly high — visible grooves between lines. Lower the Z-offset a touch.'
      tone = 'var(--warn)'
    } else if (ratio >= 0.8) {
      verdict = 'Good — lines are flat-topped and fused with no gaps. Save this offset.'
      tone = 'var(--success)'
    } else if (ratio >= 0.68) {
      verdict = 'Slightly low — smooth but shiny, ridges forming at line edges. Raise slightly.'
      tone = 'var(--warn)'
    } else {
      verdict = 'Too low — translucent scraped plastic, ridging, elephant’s foot, risk of a clog.'
      tone = 'var(--danger)'
    }
    return { ratio, beadW, verdict, tone }
  }, [gap])

  // Draw 5 beads in cross section
  const beads = [0, 1, 2, 3, 4]
  const scale = 90 // px per mm
  const layerH = 0.2 * scale
  const squish = Math.min(1, model.ratio)
  const beadHeight = layerH * squish
  const beadWidthPx = model.beadW * scale
  const bedY = 150

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">
        First-Layer Squish
      </h4>
      <Range
        label="Nozzle gap"
        min={0.08}
        max={0.28}
        step={0.005}
        value={gap}
        onChange={setGap}
        format={(v) => `${v.toFixed(3)} mm`}
      />
      <svg viewBox="0 0 320 180" className="mt-4 w-full rounded-lg bg-surface">
        {/* bed */}
        <rect x={0} y={bedY} width={320} height={30} fill="var(--surface-3)" />
        <line x1={0} y1={bedY} x2={320} y2={bedY} stroke="var(--border-strong)" />
        {/* nozzle */}
        <g>
          <rect x={140} y={20} width={40} height={40} fill="var(--surface-2)" stroke="var(--border-strong)" />
          <polygon
            points={`145,60 175,60 165,${bedY - beadHeight - 2} 155,${bedY - beadHeight - 2}`}
            fill="var(--border-strong)"
          />
        </g>
        {/* beads */}
        {beads.map((b) => {
          const cx = 60 + b * (beadWidthPx * 0.92)
          return (
            <ellipse
              key={b}
              cx={cx}
              cy={bedY - beadHeight / 2}
              rx={beadWidthPx / 2}
              ry={beadHeight / 2}
              fill="color-mix(in srgb, var(--accent) 30%, var(--surface))"
              stroke="var(--accent)"
              strokeWidth={1.2}
            />
          )
        })}
        {/* squish flat-top indicator for good/low range */}
        {model.ratio <= 1.02 &&
          beads.map((b) => {
            const cx = 60 + b * (beadWidthPx * 0.92)
            return (
              <line
                key={`f${b}`}
                x1={cx - beadWidthPx / 2}
                y1={bedY - beadHeight}
                x2={cx + beadWidthPx / 2}
                y2={bedY - beadHeight}
                stroke="var(--accent)"
                strokeWidth={2}
              />
            )
          })}
      </svg>
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
        A well-squished first layer ends up about 75–90% of the nominal layer
        height in real thickness. Adjust live in ~0.01 mm steps while the first
        layer prints.
      </p>
    </WidgetShell>
  )
}
