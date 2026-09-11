import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LEVELS } from '../content/levels'
import { useCurriculum } from '../content/useCurriculum'
import { levelProgress, isLevelUnlocked, modulesForLevel } from '../content'
import { useProgress } from '../store/useProgress'
import { useAuth } from '../store/useAuth'
import { Badge, Button, Card } from '../components/ui'
import { BrandGlow } from '../components/BrandGlow'
import { Certificate } from '../components/Certificate'

const LEVEL_ORDER = LEVELS.map((l) => l.id)

export function Certificates() {
  const curr = useCurriculum()
  const { completedLessons, certificates } = useProgress()
  const student = useAuth((s) => s.profiles.find((p) => p.id === s.activeProfileId))
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <header className="relative isolate">
        <BrandGlow />
        <h1 className="text-2xl font-semibold text-ink">Certificates</h1>
        <p className="mt-1 text-sm text-muted">
          Pass a level's exam to earn a printable certificate.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {LEVELS.map((level) => {
          const prog = levelProgress(curr, level.id, completedLessons)
          const unlocked = isLevelUnlocked(curr, LEVEL_ORDER, level.id, completedLessons)
          const earned = certificates[level.id]
          const examModule = prog.examModule

          return (
            <Card
              key={level.id}
              className={!unlocked ? 'opacity-60' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{earned ? '🎓' : unlocked ? '📘' : '🔒'}</span>
                <div>
                  <div className="text-xs text-muted">Level {level.number}</div>
                  <h2 className="text-base font-semibold text-ink">{level.name}</h2>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">{level.tagline}</p>
              <div className="mt-3">
                {earned ? (
                  <Badge tone="xp">Certified</Badge>
                ) : unlocked ? (
                  <Badge tone="accent">
                    {prog.done}/{prog.total} lessons
                  </Badge>
                ) : (
                  <Badge tone="muted">Locked</Badge>
                )}
              </div>
              <div className="mt-4">
                {earned ? (
                  <Button
                    variant="outline"
                    onClick={() => setOpen(open === level.id ? null : level.id)}
                  >
                    {open === level.id ? 'Hide' : 'View'} certificate
                  </Button>
                ) : unlocked && examModule ? (
                  prog.contentComplete ? (
                    <Link to={`/learn/${examModule.id}/about-exam`}>
                      <Button>Take the exam →</Button>
                    </Link>
                  ) : (
                    <Link to={`/pathway#${level.id}`}>
                      <Button variant="outline">Continue level →</Button>
                    </Link>
                  )
                ) : (
                  <span className="text-xs text-muted">
                    Finish {LEVELS[LEVELS.findIndex((l) => l.id === level.id) - 1]?.name} first
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {open && certificates[open] && (
        <div className="animate-fade-rise space-y-3">
          <Certificate
            studentName={student?.name ?? 'Maker'}
            level={LEVELS.find((l) => l.id === open)!}
            certificate={certificates[open]}
          />
          <div className="flex justify-center gap-2 print:hidden">
            <Button onClick={() => window.print()}>🖨 Print / Save as PDF</Button>
          </div>
        </div>
      )}

      {Object.keys(certificates).length === 0 && (
        <Card className="bg-surface-2 text-center text-sm text-muted">
          No certificates yet — modules for each level list an exam once
          you've completed them all.{' '}
          {modulesForLevel(curr, 'level-1').length > 0 && (
            <Link to="/pathway" className="text-accent hover:underline">
              Open the path
            </Link>
          )}
        </Card>
      )}
    </div>
  )
}
