import { useMemo, useState } from 'react'
import { Range, WidgetShell } from './common'

/**
 * First-layer "squish": how far the nozzle sits above the bed on layer 1, and
 * what that does to the printed lines. Shows a cross-section AND a top-down
 * view of how the surface actually looks on your bed.
 */
export function ZOffset() {
  // -3 (way too low) .. +3 (way too high); 0 = ideal squish
  const [adj, setAdj] = useState(0)

  const m = useMemo(() => {
    const nominal = 0.2
    // gap as a fraction of nominal layer height
    const ratio = 1 + adj * 0.16 // adj 0 -> 1.0, adj +3 -> ~1.48, -3 -> ~0.52
    const gapMm = nominal * ratio
    const beadW = 0.46 / Math.max(0.5, ratio) // constant-volume spread
    const actualLayer = Math.min(nominal, nominal * ratio) * 0.92

    let verdict: string
    let advice: string
    let tone: string
    if (ratio > 1.22) {
      verdict = 'Too high'
      advice = 'Lines are round and separated — you can see the bed between them. The print will not stick. Lower the Z-offset.'
      tone = 'var(--danger)'
    } else if (ratio > 1.06) {
      verdict = 'A little high'
      advice = 'Faint grooves between the lines. Lower the Z-offset by 0.01–0.02 mm.'
      tone = 'var(--warn)'
    } else if (ratio >= 0.82) {
      verdict = 'Dialled in'
      advice = 'Flat-topped lines fused into a smooth sheet with no gaps. The underside will show faint line texture. Save this.'
      tone = 'var(--success)'
    } else if (ratio >= 0.66) {
      verdict = 'A little low'
      advice = 'Smooth but shiny, with ridges pushed up between lines. Raise the Z-offset slightly.'
      tone = 'var(--warn)'
    } else {
      verdict = 'Too low'
      advice = 'Translucent, scraped-looking plastic and hard ridges. Causes elephant’s foot and can clog or gouge the sheet. Raise the Z-offset.'
      tone = 'var(--danger)'
    }
    return { ratio, gapMm, beadW, actualLayer, verdict, advice, tone }
  }, [adj])

  // --- cross-section geometry ---
  const scale = 150
  const bedY = 130
  const nominalLH = 0.2
  const beadH = nominalLH * scale * Math.min(1, m.ratio)
  const beadWpx = m.beadW * scale
  const squished = m.ratio <= 1.04

  return (
    <WidgetShell>
      <h4 className="text-sm font-semibold text-ink">First-Layer Squish</h4>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        On layer 1 the nozzle stops a fraction of a millimetre <em>above</em> the
        bed and squashes the first lines flat so they weld to the plate and to
        each other. Get this wrong and nothing above it can succeed — it is the
        single highest-value thing to tune.
      </p>

      <div className="mt-3">
        <Range
          label="Z-offset"
          min={-3}
          max={3}
          step={0.25}
          value={adj}
          onChange={setAdj}
          format={() =>
            adj === 0
              ? 'nominal'
              : `${adj > 0 ? '+' : ''}${(adj * 0.02).toFixed(3)} mm`
          }
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>← nozzle lower (more squish)</span>
          <span>nozzle higher →</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Cross-section */}
        <div>
          <div className="mb-1 text-xs font-medium text-muted">
            Cross-section (nozzle &amp; bead)
          </div>
          <svg viewBox="0 0 260 170" className="w-full rounded-lg bg-surface">
            <rect x={0} y={bedY} width={260} height={40} fill="var(--surface-3)" />
            <line x1={0} y1={bedY} x2={260} y2={bedY} stroke="var(--border-strong)" />
            {/* nozzle */}
            <rect x={112} y={16} width={36} height={34} fill="var(--surface-2)" stroke="var(--border-strong)" />
            <polygon
              points={`118,50 142,50 134,${bedY - beadH - 1} 126,${bedY - beadH - 1}`}
              fill="var(--border-strong)"
            />
            {/* gap dimension */}
            <line x1={152} y1={bedY - beadH} x2={152} y2={bedY} stroke="var(--muted)" strokeWidth={0.75} />
            <text x={156} y={bedY - beadH / 2 + 3} fontSize={9} fill="var(--muted)">
              {m.gapMm.toFixed(3)} mm
            </text>
            {/* beads */}
            {[0, 1, 2, 3, 4].map((i) => {
              const cx = 40 + i * (beadWpx * 0.94)
              return (
                <g key={i}>
                  <ellipse
                    cx={cx}
                    cy={bedY - beadH / 2}
                    rx={beadWpx / 2}
                    ry={beadH / 2}
                    fill="color-mix(in srgb, var(--accent) 28%, var(--surface))"
                    stroke="var(--accent)"
                    strokeWidth={1.1}
                  />
                  {squished && (
                    <line
                      x1={cx - beadWpx / 2}
                      y1={bedY - beadH}
                      x2={cx + beadWpx / 2}
                      y2={bedY - beadH}
                      stroke="var(--accent)"
                      strokeWidth={2}
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Top-down look */}
        <div>
          <div className="mb-1 text-xs font-medium text-muted">
            What you see on the bed (top-down)
          </div>
          <svg viewBox="0 0 260 170" className="w-full rounded-lg bg-surface">
            <rect x={6} y={6} width={248} height={158} fill="var(--surface-3)" rx={4} />
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 20 + i * 17
              const w = m.beadW * 150
              const overlap = w > 15
              return (
                <rect
                  key={i}
                  x={20}
                  y={y - w / 2}
                  width={220}
                  height={w}
                  rx={m.ratio > 1.1 ? w / 2 : 2}
                  fill={
                    m.ratio > 1.1
                      ? 'color-mix(in srgb, var(--accent) 30%, var(--surface))'
                      : m.ratio < 0.7
                        ? 'color-mix(in srgb, var(--accent) 55%, var(--surface))'
                        : 'color-mix(in srgb, var(--accent) 40%, var(--surface))'
                  }
                  stroke={m.ratio < 0.7 ? 'var(--warn)' : 'var(--accent)'}
                  strokeWidth={m.ratio < 0.7 ? 1.4 : 0.8}
                  opacity={m.ratio > 1.25 ? 0.7 : overlap ? 1 : 0.9}
                />
              )
            })}
            {m.ratio <= 1.04 && m.ratio >= 0.72 && (
              <rect x={20} y={12} width={220} height={150} fill="color-mix(in srgb, var(--accent) 12%, transparent)" />
            )}
          </svg>
        </div>
      </div>

      <div
        className="mt-3 rounded-md px-3 py-2 text-sm"
        style={{
          background: `color-mix(in srgb, ${m.tone} 12%, transparent)`,
          color: m.tone,
        }}
      >
        <strong>{m.verdict}.</strong> {m.advice}
      </div>

      <p className="mt-2 text-xs text-muted">
        Tune it live while the first layer prints, in 0.01–0.02 mm steps
        (<span className="font-mono">Babystep Z</span> /{' '}
        <span className="font-mono">Tune → Z-offset</span>). A good first layer
        ends up about 75–90% of the nominal layer height thick.
      </p>
    </WidgetShell>
  )
}
