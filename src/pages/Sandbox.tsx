import { Link, useParams } from 'react-router-dom'
import { WIDGETS, getWidget } from '../components/widgets'
import { Button, Card } from '../components/ui'

export function Sandbox() {
  const { widgetKey } = useParams()

  if (widgetKey) {
    const meta = getWidget(widgetKey)
    if (!meta) {
      return (
        <Card>
          <p className="text-text">No widget called “{widgetKey}”.</p>
          <Link to="/sandbox">
            <Button variant="outline" className="mt-3">
              All widgets
            </Button>
          </Link>
        </Card>
      )
    }
    const Component = meta.component
    return (
      <div className="space-y-4">
        <Link to="/sandbox" className="text-xs text-muted hover:text-ink">
          ← All widgets
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-ink">{meta.title}</h1>
          <p className="mt-1 text-sm text-muted">{meta.description}</p>
        </div>
        <Component />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Sandbox</h1>
        <p className="mt-1 text-sm text-muted">
          Every interactive tool in the course, unlocked. Tinker without working
          through the lessons.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(WIDGETS).map(([key, meta]) => (
          <Link key={key} to={`/sandbox/${key}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <div className="font-mono text-xs text-muted">{key}</div>
              <h3 className="mt-1 text-sm font-semibold text-ink">
                {meta.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{meta.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
