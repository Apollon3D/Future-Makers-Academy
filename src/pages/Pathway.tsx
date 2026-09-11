import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProgress } from '../store/useProgress'
import { useCurriculum } from '../content/useCurriculum'
import {
  isModuleUnlocked,
  isLevelUnlocked,
  levelProgress,
  lessonKey,
  modulesForLevel,
  moduleProgress,
} from '../content'
import { LEVELS } from '../content/levels'
import { Badge, Button, cn } from '../components/ui'
import { BrandGlow } from '../components/BrandGlow'
import type { Curriculum, LessonType, Module } from '../types'

const TYPE_GLYPH: Record<LessonType, string> = {
  reading: '¶',
  video: '▶',
  quiz: '?',
  flashcards: '⚏',
  interactive: '⚙',
  checklist: '☑',
}

const LEVEL_ORDER = LEVELS.map((l) => l.id)

export function Pathway() {
  const curr = useCurriculum()
  const { completedLessons: completed, certificates } = useProgress()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <div className="space-y-6">
      <header className="relative isolate">
        <BrandGlow />
        <h1 className="text-2xl font-semibold text-ink">Learning Path</h1>
        <p className="mt-1 text-sm text-muted">
          Three levels, each capped by an exam. Work top to bottom — a level
          unlocks once the previous level's exam is passed.
        </p>
      </header>

      {LEVELS.map((level) => {
        const levelUnlocked = isLevelUnlocked(curr, LEVEL_ORDER, level.id, completed)
        const lProg = levelProgress(curr, level.id, completed)
        const mods = modulesForLevel(curr, level.id)
        const earned = certificates[level.id]

        return (
          <section key={level.id} id={level.id} className="scroll-mt-20">
            <div
              className={cn(
                'mb-3 flex flex-wrap items-center gap-3 rounded-xl border p-4',
                earned
                  ? 'border-xp/40 bg-xp-soft'
                  : levelUnlocked
                    ? 'border-border bg-surface-2'
                    : 'border-border bg-surface-2 opacity-60',
              )}
            >
              <span className="text-2xl">{earned ? '🎓' : levelUnlocked ? '📘' : '🔒'}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink">
                    Level {level.number}: {level.name}
                  </h2>
                  {earned && <Badge tone="xp">Certified</Badge>}
                </div>
                <p className="text-xs text-muted">{level.tagline}</p>
              </div>
              {earned ? (
                <Link to="/certificates">
                  <Button variant="outline">View certificate</Button>
                </Link>
              ) : (
                levelUnlocked && (
                  <span className="font-mono text-xs text-muted">
                    {lProg.done}/{lProg.total} lessons
                  </span>
                )
              )}
            </div>

            <div className="relative pl-1">
              {mods.map((m, mi) => (
                <ModuleBlock
                  key={m.id}
                  curr={curr}
                  m={m}
                  index={mi + 1}
                  completed={completed}
                  levelUnlocked={levelUnlocked}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ModuleBlock({
  curr,
  m,
  index,
  completed,
  levelUnlocked,
}: {
  curr: Curriculum
  m: Module
  index: number
  completed: string[]
  levelUnlocked: boolean
}) {
  const prog = moduleProgress(m, completed)
  const unlocked = levelUnlocked && isModuleUnlocked(curr, m, completed)

  return (
    <section id={m.id} className="scroll-mt-20 pb-2">
      <div className="flex items-center gap-3 py-3">
        <div
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-lg',
            prog.complete
              ? 'border-success bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-success'
              : unlocked
                ? m.isExam
                  ? 'border-xp bg-xp-soft text-xp'
                  : 'border-accent bg-accent-soft text-accent'
                : 'border-border bg-surface-2 text-muted',
          )}
        >
          {unlocked ? m.icon : '🔒'}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink">
              {index}. {m.title}
            </h3>
            {m.isExam && <Badge tone="xp">Level exam</Badge>}
            {prog.complete && <Badge tone="success">Complete</Badge>}
            {!unlocked && (
              <Badge tone="muted">needs {m.requires?.join(' + ')}</Badge>
            )}
          </div>
          <p className="text-xs text-muted">
            {prog.done}/{prog.total} · {m.blurb}
          </p>
        </div>
      </div>

      <ol className="ml-5 border-l border-border pl-6">
        {m.lessons.map((l, li) => {
          const key = lessonKey(m.id, l.id)
          const done = completed.includes(key)
          const prevDone =
            li === 0 ||
            m.lessons.slice(0, li).every((p) => completed.includes(lessonKey(m.id, p.id)))
          const available = unlocked && (prevDone || done)

          const inner = (
            <div
              className={cn(
                'relative -ml-[33px] flex items-start gap-3 rounded-lg border py-2.5 pl-3 pr-3 transition-colors',
                done
                  ? 'border-border bg-surface'
                  : available
                    ? 'border-accent/40 bg-surface hover:border-accent'
                    : 'border-border bg-surface-2 opacity-60',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs',
                  done
                    ? 'border-success bg-success text-[color:var(--bg)]'
                    : available
                      ? 'border-accent text-accent'
                      : 'border-border-strong text-muted',
                )}
              >
                {done ? '✓' : available ? TYPE_GLYPH[l.type] : '🔒'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">
                  {l.title}
                </span>
                <span className="block text-xs text-muted">{l.summary}</span>
                <span className="mt-1 flex gap-2 text-[11px] text-muted">
                  <span className="capitalize">{l.type}</span>
                  <span>·</span>
                  <span>{l.estMinutes} min</span>
                </span>
              </span>
            </div>
          )

          return (
            <li key={l.id} className="py-1.5">
              {available ? (
                <Link to={`/learn/${m.id}/${l.id}`} className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
