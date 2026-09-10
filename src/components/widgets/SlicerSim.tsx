import { useMemo, useState } from 'react'
import { Range, Meter, WidgetShell, scoreTone } from './common'

/**
 * The "hero" cause-and-effect widget: move slicer sliders, watch print time,
 * strength, and visual quality respond. Numbers are a simplified but
 * directionally honest model, not a real slicer.
 */
export function SlicerSim() {
  const [layer, setLayer] = useState(0.2) // mm
  const [infill, setInfill] = useState(15) // %
  const [speed, setSpeed] = useState(60) // mm/s
  const [walls, setWalls] = useState(3)

  const out = useMemo(() => {
    // Reference build: a 60 mm cube-ish part.
    // Time scales ~1/layerHeight, +infill contribution, /speed.
    const layerFactor = 0.2 / layer
    const infillFactor = 1 + (infill / 100) * 1.1
    const wallFactor = 1 + (walls - 2) * 0.12
    const speedFactor = 60 / speed
    const baseMinutes = 95
    const minutes = Math.round(
      baseMinutes * layerFactor * infillFactor * wallFactor * speedFactor,
    )

    // Strength: walls dominate, then infill, minus a speed penalty (weaker
    // layer bonding when printing fast), minus a thick-layer bonus/penalty mix.
    // Calibrated so a typical functional setup (3 walls, 15-20% infill) reads
    // in the healthy 60s and only genuinely thin parts go red.
    const wallStrength = Math.min(52, (walls - 1) * 15)
    const infillStrength = (infill / 100) * 30
    const speedPenalty = Math.max(0, (speed - 50) * 0.16)
    const layerBond = layer >= 0.24 ? 5 : layer <= 0.12 ? -3 : 0
    const strength = clamp(
      28 + wallStrength + infillStrength + layerBond - speedPenalty,
    )

    // Visual quality: thin layers + slower printing.
    const layerQuality = ((0.32 - layer) / (0.32 - 0.1)) * 66
    const speedQuality = ((100 - speed) / 70) * 20
    const quality = clamp(layerQuality + speedQuality + 14)

    // Filament use (relative), grams for the reference part.
    const grams = Math.round(
      22 + (infill / 100) * 34 + (walls - 2) * 4 + (0.2 / layer) * 2,
    )

    return { minutes, strength, quality, grams }
  }, [layer, infill, speed, walls])

  return (
    <WidgetShell>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-ink">Slicer Simulator</h4>
        <span className="font-mono text-xs text-muted">ref. part: 60 mm bracket</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-4">
          <Range
            label="Layer height"
            min={0.1}
            max={0.32}
            step={0.02}
            value={layer}
            onChange={setLayer}
            format={(v) => `${v.toFixed(2)} mm`}
          />
          <Range
            label="Infill density"
            min={0}
            max={100}
            step={5}
            value={infill}
            onChange={setInfill}
            format={(v) => `${v}%`}
          />
          <Range
            label="Print speed"
            min={30}
            max={120}
            step={5}
            value={speed}
            onChange={setSpeed}
            format={(v) => `${v} mm/s`}
          />
          <Range
            label="Wall count"
            min={1}
            max={6}
            step={1}
            value={walls}
            onChange={setWalls}
            format={(v) => `${v} walls`}
          />
        </div>

        <div className="space-y-4 rounded-lg bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink">Print time</span>
            <span className="font-mono text-lg font-semibold text-accent">
              {fmtTime(out.minutes)}
            </span>
          </div>
          <Meter
            label="Structural strength"
            value={out.strength}
            caption={`${Math.round(out.strength)}/100`}
            tone={scoreTone(out.strength)}
          />
          <Meter
            label="Visual quality"
            value={out.quality}
            caption={`${Math.round(out.quality)}/100`}
            tone={scoreTone(out.quality)}
          />
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm text-muted">Filament</span>
            <span className="font-mono text-sm text-text">~{out.grams} g</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Notice the trade-offs: dropping layer height sharpens quality but roughly
        doubles time. Walls buy more strength per minute than infill. Speed is
        nearly free until it quietly erodes strength and surface finish.
      </p>
    </WidgetShell>
  )
}

function clamp(n: number): number {
  return Math.max(2, Math.min(100, n))
}

function fmtTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
