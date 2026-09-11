import { Link, useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useProgress } from '../store/useProgress'
import { useCurriculum } from '../content/useCurriculum'
import {
  allCards,
  firstIncompleteLesson,
  getLesson,
  isModuleUnlocked,
  lessonKey,
  moduleProgress,
  overallProgress,
} from '../content'
import { Badge, Button, Card, ProgressRing, StatTile } from '../components/ui'
import { BrandGlow } from '../components/BrandGlow'
import { Avatar } from '../components/Avatar'
import { useAuth } from '../store/useAuth'
import { formatDuration } from '../lib/format'

export function Dashboard() {
  const navigate = useNavigate()
  const curr = useCurriculum()
  const student = useAuth((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId),
  )
  const firstName = student?.name.trim().split(/\s+/)[0] || 'Maker'
  const {
    xp,
    streak,
    timeSpentSec,
    completedLessons,
    quizResults,
    lastLesson,
    dueCardIds,
  } = useProgress()

  const overall = overallProgress(curr, completedLessons)
  const cardIds = [...allCards(curr).keys()]
  const due = dueCardIds(cardIds).length

  const resumeRef =
    lastLesson && !completedLessons.includes(lessonKey(lastLesson.moduleId, lastLesson.lessonId))
      ? lastLesson
      : firstIncompleteLesson(curr, completedLessons)
  const resume = resumeRef
    ? getLesson(curr, resumeRef.moduleId, resumeRef.lessonId)
    : undefined

  const chartData = curr.map((m) => ({
    name: m.title.replace(/^(The |FDM |Design for )/, ''),
    pct: Math.round(moduleProgress(m, completedLessons).pct),
  }))

  const weak = Object.entries(quizResults)
    .filter(([, r]) => !r.passed || r.best / r.total < 0.7)
    .map(([key, r]) => {
      const [moduleId, lessonId] = key.split('/')
      const found = getLesson(curr, moduleId, lessonId)
      return found ? { key, moduleId, lessonId, r, ...found } : null
    })
    .filter(Boolean)
    .slice(0, 4) as Array<{
    key: string
    moduleId: string
    lessonId: string
    module: { title: string }
    lesson: { title: string }
    r: { best: number; total: number }
  }>

  return (
    <div className="space-y-8">
      <header className="relative isolate">
        <BrandGlow />
        <div className="flex items-center gap-3">
          <Avatar photo={student?.photo} name={firstName} size={40} />
          <h1 className="text-2xl font-semibold text-ink">
            {overall.done === 0
              ? `Welcome, ${firstName}`
              : `Welcome back, ${firstName}`}
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          {overall.done === 0
            ? 'Start with FDM Fundamentals and work down the path.'
            : `${overall.done} of ${overall.total} lessons done — ${Math.round(
                overall.pct,
              )}% of the course.`}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="XP" value={xp} tone="xp" />
        <StatTile
          label="Streak"
          value={`${streak.current}d`}
          hint={`best ${streak.longest}d`}
        />
        <StatTile
          label="Time learned"
          value={formatDuration(timeSpentSec)}
          tone="plain"
        />
        <StatTile label="Cards due" value={due} tone={due > 0 ? 'accent' : 'plain'} />
      </div>

      {resume && resumeRef && (
        <Card className="flex flex-col gap-4 border-accent/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">
              {overall.done === 0 ? 'Start here' : 'Continue'}
            </div>
            <div className="mt-1 text-lg font-semibold text-ink">
              {resume.lesson.title}
            </div>
            <div className="text-sm text-muted">
              {resume.module.title} · {resume.lesson.estMinutes} min ·{' '}
              {resume.lesson.type}
            </div>
          </div>
          <Button
            onClick={() =>
              navigate(`/learn/${resumeRef.moduleId}/${resumeRef.lessonId}`)
            }
          >
            {overall.done === 0 ? 'Begin' : 'Resume'} →
          </Button>
        </Card>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Modules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {curr.map((m) => {
            const prog = moduleProgress(m, completedLessons)
            const unlocked = isModuleUnlocked(curr, m, completedLessons)
            return (
              <Card
                key={m.id}
                className={
                  'flex items-center gap-4 ' +
                  (unlocked ? '' : 'opacity-60')
                }
              >
                <ProgressRing
                  value={prog.pct}
                  label={
                    prog.complete ? '✓' : unlocked ? `${prog.done}/${prog.total}` : '🔒'
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base opacity-70">{m.icon}</span>
                    <h3 className="truncate text-sm font-semibold text-ink">
                      {m.title}
                    </h3>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                    {m.blurb}
                  </p>
                  <div className="mt-2">
                    {prog.complete ? (
                      <Badge tone="success">Complete</Badge>
                    ) : unlocked ? (
                      <Link
                        to={`/pathway#${m.id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        {prog.done > 0 ? 'Keep going' : 'Open module'} →
                      </Link>
                    ) : (
                      <span className="text-xs text-muted">
                        Finish {m.requires?.join(', ')} first
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Completion by module
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={92}
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-2)' }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v}%`, 'complete']}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {chartData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.pct === 100 ? 'var(--success)' : 'var(--accent)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Needs another look
          </h2>
          {weak.length === 0 ? (
            <p className="text-sm text-muted">
              No weak spots yet. Checkpoints you don’t pass on the first try
              show up here.
            </p>
          ) : (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.key}>
                  <Link
                    to={`/learn/${w.moduleId}/${w.lessonId}`}
                    className="block rounded-lg border border-border p-2.5 hover:border-border-strong"
                  >
                    <div className="text-sm text-ink">{w.lesson.title}</div>
                    <div className="text-xs text-muted">
                      {w.module.title} · best {w.r.best}/{w.r.total}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {due > 0 && (
            <Link to="/review">
              <Button variant="outline" className="mt-3 w-full">
                Review {due} card{due === 1 ? '' : 's'} →
              </Button>
            </Link>
          )}
        </Card>
      </section>
    </div>
  )
}
