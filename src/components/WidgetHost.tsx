import { getWidget } from './widgets'

export function WidgetHost({ widgetKey }: { widgetKey: string }) {
  const meta = getWidget(widgetKey)
  if (!meta) {
    return (
      <div className="my-5 rounded-xl border border-dashed border-border bg-surface-2 p-4 text-sm text-muted">
        Interactive widget <code>{widgetKey}</code> is not registered yet.
      </div>
    )
  }
  const Component = meta.component
  return <Component />
}
