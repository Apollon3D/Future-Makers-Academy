import { useState } from 'react'
import type { ChecklistItem } from '../types'
import { cn } from './ui'

export function ChecklistBlock({
  items,
  onAllChecked,
}: {
  items: ChecklistItem[]
  onAllChecked?: () => void
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setChecked((c) => {
      const next = { ...c, [id]: !c[id] }
      if (items.every((it) => next[it.id])) onAllChecked?.()
      return next
    })
  }

  const doneCount = items.filter((it) => checked[it.id]).length

  return (
    <div className="space-y-2">
      <div className="mb-3 text-sm text-muted">
        {doneCount} / {items.length} checked
      </div>
      {items.map((it) => (
        <label
          key={it.id}
          className={cn(
            'flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors',
            checked[it.id]
              ? 'border-accent bg-accent-soft'
              : 'border-border bg-surface hover:border-border-strong',
          )}
        >
          <input
            type="checkbox"
            checked={Boolean(checked[it.id])}
            onChange={() => toggle(it.id)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            <span
              className={cn(
                'block text-sm',
                checked[it.id] ? 'text-ink line-through decoration-muted' : 'text-text',
              )}
            >
              {it.text}
            </span>
            {it.detail && (
              <span className="mt-0.5 block text-xs text-muted">{it.detail}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  )
}
