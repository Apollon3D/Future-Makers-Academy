import { Link } from 'react-router-dom'
import { PRINTERS, PART_LIBRARY } from '../content/workshop'
import { Badge, Card } from '../components/ui'
import { BrandGlow } from '../components/BrandGlow'

export function Workshop() {
  return (
    <div className="space-y-6">
      <header className="relative isolate">
        <BrandGlow />
        <h1 className="text-2xl font-semibold text-ink">Workshop</h1>
        <p className="mt-1 text-sm text-muted">
          Pick a printer and take it apart, part by part — what each component
          does, how to tell when it is failing, and how to service or replace
          it. {Object.keys(PART_LIBRARY).length} parts documented.
        </p>
      </header>

      <div className="grid gap-4">
        {PRINTERS.map((p) => (
          <Link key={p.id} to={`/workshop/${p.id}`}>
            <Card className="transition-colors hover:border-accent">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h2 className="text-lg font-semibold text-ink">
                  {p.maker} {p.name}
                </h2>
                <span className="font-mono text-xs text-muted">{p.year}</span>
                <Badge tone="accent" className="ml-auto">
                  {p.diagram === 'bedslinger' ? 'Bed-slinger' : 'CoreXY'}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-text">{p.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {p.specs.slice(0, 4).map((s) => (
                  <span key={s.label}>
                    <span className="text-ink">{s.label}:</span> {s.value}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs font-medium text-accent">
                Open the breakdown →
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-surface-2 text-xs text-muted">
        Diagrams are schematic, not to scale. Model-specific details are a
        starting point — always check torque values, wiring and procedures
        against your printer’s official manual before a repair.
      </Card>
    </div>
  )
}
