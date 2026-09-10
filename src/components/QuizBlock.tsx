import { useState } from 'react'
import type { QuizQuestion } from '../types'
import { useProgress, type QuizResult } from '../store/useProgress'
import { Button, cn } from './ui'
import { Markdown } from '../lib/markdown'

export function QuizBlock({
  quizKey,
  questions,
  passScore = 70,
  onResult,
}: {
  quizKey: string
  questions: QuizQuestion[]
  passScore?: number
  onResult?: (result: QuizResult) => void
}) {
  const recordQuiz = useProgress((s) => s.recordQuiz)
  const [choices, setChoices] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const answeredAll = questions.every((q) => choices[q.id] !== undefined)

  const submit = () => {
    const correct = questions.filter(
      (q) => choices[q.id] === q.answer,
    ).length
    const r = recordQuiz(quizKey, correct, questions.length, passScore)
    setResult(r)
    onResult?.(r)
  }

  const retry = () => {
    setChoices({})
    setResult(null)
  }

  const correctCount = questions.filter(
    (q) => choices[q.id] === q.answer,
  ).length
  const scorePct = Math.round((correctCount / questions.length) * 100)

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div
          key={q.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="mb-3 flex gap-2">
            <span className="font-mono text-xs text-muted">
              {String(qi + 1).padStart(2, '0')}
            </span>
            <div className="prose-lesson flex-1 text-[0.97rem] [&_p]:my-0">
              <Markdown source={q.prompt} />
            </div>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const chosen = choices[q.id] === oi
              const revealed = result !== null
              const isAnswer = q.answer === oi
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={revealed}
                  onClick={() =>
                    setChoices((c) => ({ ...c, [q.id]: oi }))
                  }
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                    revealed && isAnswer
                      ? 'border-success bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-ink'
                      : revealed && chosen && !isAnswer
                        ? 'border-danger bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-ink'
                        : chosen
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-border text-text hover:border-border-strong hover:bg-surface-2',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs',
                      chosen ? 'border-accent text-accent' : 'border-border-strong',
                    )}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {result !== null && (
            <p className="mt-3 rounded-md bg-surface-2 px-3 py-2 text-sm text-text">
              {choices[q.id] === q.answer ? '✓ ' : '✗ '}
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {result === null ? (
        <Button onClick={submit} disabled={!answeredAll}>
          {answeredAll
            ? 'Submit answers'
            : `Answer all ${questions.length} questions`}
        </Button>
      ) : (
        <div
          className={cn(
            'rounded-xl border p-4',
            result.passed
              ? 'border-success bg-[color-mix(in_srgb,var(--success)_10%,transparent)]'
              : 'border-warn bg-[color-mix(in_srgb,var(--warn)_10%,transparent)]',
          )}
        >
          <div className="text-lg font-semibold text-ink">
            {correctCount} / {questions.length} correct — {scorePct}%
          </div>
          <p className="mt-1 text-sm text-text">
            {result.passed
              ? 'Passed. This checkpoint is complete and the module unlocks what comes next.'
              : `You need ${passScore}% to pass. Review the explanations above and try again.`}
          </p>
          {!result.passed && (
            <Button variant="outline" className="mt-3" onClick={retry}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
