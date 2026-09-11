import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CATEGORY_LABEL,
  INTERVAL_DAYS,
  INTERVAL_LABEL,
  PART_LIBRARY,
  getPrinter,
  maintKey,
  partOf,
  type MaintenanceInterval,
  type PartCategory,
} from '../content/workshop'
import { useCurriculum } from '../content/useCurriculum'
import { getLesson } from '../content'
import { useProgress } from '../store/useProgress'
import { Markdown } from '../lib/markdown'
import { Badge, Button, Card, cn } from '../components/ui'
import { PrinterDiagram } from '../components/PrinterDiagram'

type Tab = 'breakdown' | 'maintenance'

function relative(ms: number | undefined): string {
  if (!ms) return 'never'
  const days = Math.floor((Date.now() - ms) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 60) return 'a month ago'
  return `${Math.round(days / 30)} months ago`
}

const INTERVAL_ORDER: MaintenanceInterval[] = [
  'each-print',
  'weekly',
  'monthly',
  'quarterly',
  'biannual',
  'annual',
  'as-needed',
]

type View = 'overview' | 'focus'

export function PrinterDetail() {
  const { printerId = '' } = useParams()
  const printer = getPrinter(printerId)
  const curr = useCurriculum()
  const { maintenanceLog, logMaintenance, clearMaintenance } = useProgress()
  const [tab, setTab] = useState<Tab>('breakdown')
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<View>('overview')

  const focusOn = (partId: string) => {
    setSelected(partId)
    setView('focus')
  }

  const isDue = useMemo(() => {
    return (key: string, interval: MaintenanceInterval) => {
      const days = INTERVAL_DAYS[interval]
      if (days < 0) return false // as-needed
      if (days === 0) return false // each-print — a checklist item, not "overdue"
      const last = maintenanceLog[key]
      if (!last) return true
      return Date.now() - last > days * 86_400_000
    }
  }, [maintenanceLog])

  if (!printer) {
    return (
      <Card>
        <p className="text-text">No printer with id “{printerId}”.</p>
        <Link to="/workshop">
          <Button variant="outline" className="mt-3">
            All printers
          </Button>
        </Link>
      </Card>
    )
  }

  // Group parts by category, preserving the printer's declared order.
  const grouped = new Map<PartCategory, typeof printer.parts>()
  printer.parts.forEach((ref) => {
    const cat = PART_LIBRARY[ref.partId]?.category
    if (!cat) return
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(ref)
  })
  const indexOf = (partId: string) =>
    printer.parts.findIndex((r) => r.partId === partId)

  const selectedRef = printer.parts.find((r) => r.partId === selected)
  const selectedInfo = selectedRef ? partOf(selectedRef) : undefined

  // Flatten every maintenance task for the schedule tab.
  const allTasks = printer.parts.flatMap((ref) => {
    const info = PART_LIBRARY[ref.partId]
    if (!info) return []
    return info.maintenance.map((m, ti) => ({
      key: maintKey(printer.id, ref.partId, ti),
      partId: ref.partId,
      partName: info.name,
      interval: m.interval,
      task: m.task,
      ti,
    }))
  })
  const dueCount = allTasks.filter((t) => isDue(t.key, t.interval)).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Link to="/workshop" className="text-xs text-muted hover:text-ink">
            ← Workshop
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            {printer.maker} {printer.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{printer.blurb}</p>
          <a
            href={printer.manualUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-accent hover:underline"
          >
            {printer.manualLabel} ↗
          </a>
        </div>

        {printer.photo && (
          <figure className="w-full shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-64">
            <img
              src={printer.photo.url}
              alt={`${printer.maker} ${printer.name}`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="space-y-0.5 p-2.5 text-[11px] text-muted">
              <div>{printer.photo.credit}</div>
              {printer.photo.note && (
                <div className="text-warn">{printer.photo.note}</div>
              )}
            </figcaption>
          </figure>
        )}
      </div>

      <div className="flex gap-1 border-b border-border">
        {(
          [
            ['breakdown', 'Part breakdown'],
            ['maintenance', `Maintenance${dueCount ? ` · ${dueCount} due` : ''}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
              tab === id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'breakdown' ? (
        view === 'overview' ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <PrinterDiagram
                printer={printer}
                selectedPartId={selected}
                onSelect={focusOn}
              />
              <p className="mt-2 text-center text-xs text-muted">
                Tap a number on the diagram or in the list to focus on that part.
              </p>
            </div>

            <div className="space-y-4">
              {[...grouped.entries()].map(([cat, refs]) => (
                <div key={cat}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {CATEGORY_LABEL[cat]}
                  </div>
                  <ul className="space-y-0.5">
                    {refs.map((ref) => {
                      const info = PART_LIBRARY[ref.partId]
                      const n = indexOf(ref.partId) + 1
                      return (
                        <li key={ref.partId}>
                          <button
                            type="button"
                            onClick={() => focusOn(ref.partId)}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-surface-2 hover:text-ink"
                          >
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border-strong text-[10px] font-semibold text-muted">
                              {n}
                            </span>
                            {info?.name}
                            {info?.photo && (
                              <span title="Reference photo available" className="text-[10px] text-muted">
                                📷
                              </span>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedInfo &&
          selectedRef && (
            <div className="animate-fade-rise space-y-5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setView('overview')}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  ← Full diagram
                </button>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <button
                    type="button"
                    disabled={indexOf(selectedInfo.id) === 0}
                    onClick={() => focusOn(printer.parts[indexOf(selectedInfo.id) - 1].partId)}
                    className="rounded-md border border-border px-2 py-1 hover:text-ink disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <span>
                    Part {indexOf(selectedInfo.id) + 1} / {printer.parts.length}
                  </span>
                  <button
                    type="button"
                    disabled={indexOf(selectedInfo.id) === printer.parts.length - 1}
                    onClick={() => focusOn(printer.parts[indexOf(selectedInfo.id) + 1].partId)}
                    className="rounded-md border border-border px-2 py-1 hover:text-ink disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {selectedInfo.photo ? (
                  <figure className="overflow-hidden rounded-xl border border-border bg-surface">
                    <img
                      src={selectedInfo.photo.url}
                      alt={selectedInfo.name}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                    <figcaption className="space-y-0.5 p-2.5 text-[11px] text-muted">
                      <div>{selectedInfo.photo.credit}</div>
                      {selectedInfo.photo.note && (
                        <div className="text-warn">{selectedInfo.photo.note}</div>
                      )}
                    </figcaption>
                  </figure>
                ) : (
                  <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-border bg-surface-2 p-4 text-center text-xs text-muted">
                    No reference photo yet for this part — see the diagram for
                    where it sits.
                  </div>
                )}
                <div>
                  <PrinterDiagram
                    printer={printer}
                    selectedPartId={selected}
                    onSelect={focusOn}
                    focus={selectedRef.hotspot}
                  />
                  <p className="mt-1.5 text-center text-xs text-muted">
                    Zoomed to where this part sits on the machine.
                  </p>
                </div>
              </div>

              <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted">
                    {CATEGORY_LABEL[selectedInfo.category]} · part{' '}
                    {indexOf(selectedInfo.id) + 1}
                  </div>
                  <h2 className="text-lg font-semibold text-ink">
                    {selectedInfo.name}
                  </h2>
                  <p className="text-sm text-muted">{selectedInfo.tagline}</p>
                </div>
              </div>

              <section className="prose-lesson mt-4 text-[0.95rem]">
                <h3 className="!mt-0">How it works</h3>
                <Markdown source={selectedInfo.how} />
                {selectedRef.note && (
                  <blockquote className="my-3 rounded-r-md border-l-2 border-accent bg-accent-soft px-4 py-2 text-[0.9rem]">
                    <strong className="text-ink">
                      On the {printer.maker} {printer.name}:
                    </strong>{' '}
                    {selectedRef.note}
                  </blockquote>
                )}
              </section>

              <section className="mt-4">
                <h3 className="text-sm font-semibold text-ink">
                  Signs this part is the problem
                </h3>
                <ul className="mt-1.5 space-y-1 text-sm text-text">
                  {selectedInfo.symptoms.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-warn">▸</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-4">
                <h3 className="text-sm font-semibold text-ink">Maintenance</h3>
                <ul className="mt-1.5 space-y-1.5">
                  {selectedInfo.maintenance.map((m, ti) => {
                    const key = maintKey(printer.id, selectedInfo.id, ti)
                    const done = maintenanceLog[key]
                    const due = isDue(key, m.interval)
                    return (
                      <li
                        key={ti}
                        className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                      >
                        <div>
                          <div className="text-text">{m.task}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs">
                            <Badge tone={due ? 'warn' : 'muted'}>
                              {INTERVAL_LABEL[m.interval]}
                            </Badge>
                            <span className="text-muted">
                              last: {relative(done)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            done ? clearMaintenance(key) : logMaintenance(key)
                          }
                          className={cn(
                            'shrink-0 rounded-md border px-2 py-1 text-xs font-medium',
                            done
                              ? 'border-border text-muted hover:text-ink'
                              : 'border-accent text-accent hover:bg-accent-soft',
                          )}
                        >
                          {done ? 'Undo' : 'Mark done'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className="prose-lesson mt-4 text-[0.95rem]">
                <h3>Repair &amp; replacement</h3>
                <Markdown source={selectedInfo.repair} />
              </section>

              {selectedInfo.relatedLessons &&
                selectedInfo.relatedLessons.length > 0 && (
                  <section className="mt-4 border-t border-border pt-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Related lessons
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedInfo.relatedLessons.map((ref) => {
                        const found = getLesson(
                          curr,
                          ref.moduleId,
                          ref.lessonId,
                        )
                        if (!found) return null
                        return (
                          <Link
                            key={`${ref.moduleId}/${ref.lessonId}`}
                            to={`/learn/${ref.moduleId}/${ref.lessonId}`}
                            className="rounded-lg border border-border px-2.5 py-1 text-xs text-text hover:border-accent hover:text-ink"
                          >
                            {found.lesson.title} →
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )}
              </Card>
            </div>
          )
        )
      ) : (
        <MaintenanceTab
          tasks={allTasks}
          isDue={isDue}
          log={maintenanceLog}
          onToggle={(key, done) =>
            done ? clearMaintenance(key) : logMaintenance(key)
          }
        />
      )}
    </div>
  )
}

interface FlatTask {
  key: string
  partName: string
  interval: MaintenanceInterval
  task: string
}

function MaintenanceTab({
  tasks,
  isDue,
  log,
  onToggle,
}: {
  tasks: FlatTask[]
  isDue: (key: string, interval: MaintenanceInterval) => boolean
  log: Record<string, number>
  onToggle: (key: string, done: boolean) => void
}) {
  const byInterval = new Map<MaintenanceInterval, FlatTask[]>()
  tasks.forEach((t) => {
    if (!byInterval.has(t.interval)) byInterval.set(t.interval, [])
    byInterval.get(t.interval)!.push(t)
  })

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">
        Every part’s upkeep in one schedule. “Mark done” stamps the date;
        “Every print” items are a pre-flight checklist rather than something
        that falls overdue.
      </p>
      {INTERVAL_ORDER.filter((iv) => byInterval.has(iv)).map((iv) => (
        <div key={iv}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            {INTERVAL_LABEL[iv]}
          </h2>
          <ul className="space-y-1.5">
            {byInterval.get(iv)!.map((t) => {
              const done = log[t.key]
              const due = isDue(t.key, t.interval)
              return (
                <li
                  key={t.key}
                  className={cn(
                    'flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm',
                    due ? 'border-warn/40 bg-[color-mix(in_srgb,var(--warn)_7%,transparent)]' : 'border-border',
                  )}
                >
                  <div>
                    <div className="text-text">{t.task}</div>
                    <div className="mt-0.5 text-xs text-muted">
                      {t.partName}
                      {t.interval !== 'each-print' && (
                        <> &middot; last done {relative(done)}</>
                      )}
                      {due && (
                        <span className="font-medium text-warn">
                          {' '}
                          &middot; due
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(t.key, Boolean(done))}
                    className={cn(
                      'shrink-0 rounded-md border px-2 py-1 text-xs font-medium',
                      done
                        ? 'border-border text-muted hover:text-ink'
                        : 'border-accent text-accent hover:bg-accent-soft',
                    )}
                  >
                    {done ? 'Undo' : 'Mark done'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
