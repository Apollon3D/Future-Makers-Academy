import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProgress, XP_BY_TYPE } from '../store/useProgress'
import { useCurriculum } from '../content/useCurriculum'
import { getLesson, lessonKey, siblingLesson } from '../content'
import { Markdown } from '../lib/markdown'
import { Badge, Button, Card, cn } from '../components/ui'
import { WidgetHost } from '../components/WidgetHost'
import { QuizBlock } from '../components/QuizBlock'
import { FlashcardReview } from '../components/FlashcardReview'
import { ChecklistBlock } from '../components/ChecklistBlock'

export function LessonPlayer() {
  const { moduleId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const curr = useCurriculum()
  const {
    completedLessons,
    isLessonComplete,
    completeLesson,
    setLastLesson,
  } = useProgress()

  const found = useMemo(
    () => getLesson(curr, moduleId, lessonId),
    [curr, moduleId, lessonId],
  )
  const key = lessonKey(moduleId, lessonId)
  const done = isLessonComplete(key)

  const [checklistReady, setChecklistReady] = useState(false)
  const [justEarned, setJustEarned] = useState<number | null>(null)

  const exists = Boolean(found)
  useEffect(() => {
    if (exists) setLastLesson({ moduleId, lessonId })
    setChecklistReady(false)
    setJustEarned(null)
  }, [moduleId, lessonId, exists, setLastLesson])

  const next = useMemo(
    () => siblingLesson(curr, { moduleId, lessonId }, 1),
    [curr, moduleId, lessonId],
  )
  const prev = useMemo(
    () => siblingLesson(curr, { moduleId, lessonId }, -1),
    [curr, moduleId, lessonId],
  )

  if (!found) {
    return (
      <Card className="text-center">
        <p className="text-text">This lesson doesn’t exist.</p>
        <Link to="/pathway">
          <Button variant="outline" className="mt-3">
            Back to the path
          </Button>
        </Link>
      </Card>
    )
  }

  const { module, lesson } = found

  const markComplete = () => {
    if (!done) {
      completeLesson(key, XP_BY_TYPE[lesson.type] ?? 30)
      setJustEarned(XP_BY_TYPE[lesson.type] ?? 30)
    } else if (next) {
      navigate(`/learn/${next.moduleId}/${next.lessonId}`)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      {/* Lesson rail */}
      <nav className="hidden lg:block">
        <div className="sticky top-10">
          <Link
            to={`/pathway#${module.id}`}
            className="text-xs font-medium text-muted hover:text-ink"
          >
            ← {module.title}
          </Link>
          <ol className="mt-3 space-y-1">
            {module.lessons.map((l, i) => {
              const lk = lessonKey(module.id, l.id)
              const isCurrent = l.id === lessonId
              const lDone = completedLessons.includes(lk)
              return (
                <li key={l.id}>
                  <Link
                    to={`/learn/${module.id}/${l.id}`}
                    className={cn(
                      'flex items-start gap-2 rounded-md px-2 py-1.5 text-xs',
                      isCurrent
                        ? 'bg-accent-soft text-accent'
                        : 'text-muted hover:bg-surface-2 hover:text-ink',
                    )}
                  >
                    <span className="font-mono">
                      {lDone ? '✓' : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{l.title}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </nav>

      <article className="min-w-0">
        <div className="mb-1 flex items-center gap-2 text-xs text-muted">
          <span className="lg:hidden">
            <Link to={`/pathway#${module.id}`} className="hover:text-ink">
              {module.title}
            </Link>{' '}
            /
          </span>
          <Badge tone="muted">{lesson.type}</Badge>
          <span>{lesson.estMinutes} min</span>
          {done && <Badge tone="success">done</Badge>}
        </div>
        <h1 className="text-2xl font-semibold text-ink">{lesson.title}</h1>
        <p className="mt-1 text-sm text-muted">{lesson.summary}</p>

        <div className="mt-6">
          {lesson.type === 'reading' && (
            <>
              <div className="prose-lesson">
                <Markdown source={lesson.body} />
              </div>
              {lesson.widget && <WidgetHost widgetKey={lesson.widget} />}
              {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                <Card className="mt-6 border-accent/30 bg-accent-soft">
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Key takeaways
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-text">
                    {lesson.keyTakeaways.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent">▸</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </>
          )}

          {lesson.type === 'interactive' && (
            <>
              {lesson.intro && (
                <p className="prose-lesson">{lesson.intro}</p>
              )}
              <WidgetHost widgetKey={lesson.widget} />
              {lesson.body && (
                <div className="prose-lesson mt-4">
                  <Markdown source={lesson.body} />
                </div>
              )}
            </>
          )}

          {lesson.type === 'quiz' && (
            <>
              {lesson.intro && <p className="prose-lesson mb-4">{lesson.intro}</p>}
              <QuizBlock
                quizKey={key}
                questions={lesson.questions}
                passScore={lesson.passScore ?? 70}
                onResult={(r) => {
                  if (r.passed && !done) {
                    completeLesson(key, XP_BY_TYPE.quiz)
                    setJustEarned(XP_BY_TYPE.quiz)
                  }
                }}
              />
            </>
          )}

          {lesson.type === 'flashcards' && (
            <>
              {lesson.intro && <p className="prose-lesson mb-4">{lesson.intro}</p>}
              <FlashcardReview
                cards={lesson.cards}
                doneLabel={next ? 'Continue' : 'Done'}
                onDone={() => {
                  if (!done) {
                    completeLesson(key, XP_BY_TYPE.flashcards)
                    setJustEarned(XP_BY_TYPE.flashcards)
                  } else if (next) {
                    navigate(`/learn/${next.moduleId}/${next.lessonId}`)
                  }
                }}
              />
            </>
          )}

          {lesson.type === 'checklist' && (
            <>
              {lesson.intro && <p className="prose-lesson mb-4">{lesson.intro}</p>}
              <ChecklistBlock
                items={lesson.items}
                onAllChecked={() => setChecklistReady(true)}
              />
            </>
          )}
        </div>

        {/* Completion / navigation bar */}
        {justEarned !== null && (
          <div className="mt-6 animate-fade-rise rounded-lg border border-xp/40 bg-xp-soft px-4 py-3 text-sm text-xp">
            +{justEarned} XP — lesson complete.
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          {prev ? (
            <Link to={`/learn/${prev.moduleId}/${prev.lessonId}`}>
              <Button variant="ghost">← Previous</Button>
            </Link>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            {lesson.type !== 'quiz' && lesson.type !== 'flashcards' && (
              <Button
                onClick={markComplete}
                disabled={lesson.type === 'checklist' && !checklistReady && !done}
                variant={done ? 'outline' : 'primary'}
              >
                {done ? (next ? 'Next lesson →' : 'Completed ✓') : 'Mark as complete'}
              </Button>
            )}
            {(lesson.type === 'quiz' || lesson.type === 'flashcards') &&
              done &&
              next && (
                <Link to={`/learn/${next.moduleId}/${next.lessonId}`}>
                  <Button>Next lesson →</Button>
                </Link>
              )}
            {done && !next && (
              <Link to="/pathway">
                <Button variant="outline">Back to path</Button>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
