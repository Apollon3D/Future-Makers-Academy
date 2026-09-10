import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../store/useProgress'
import { useCurriculum } from '../content/useCurriculum'
import { allCards } from '../content'
import { Button, Card, EmptyState } from '../components/ui'
import { FlashcardReview } from '../components/FlashcardReview'
import type { Flashcard } from '../types'

export function Review() {
  const curr = useCurriculum()
  const { srs, dueCardIds } = useProgress()
  const [session, setSession] = useState<Flashcard[] | null>(null)
  const [mode, setMode] = useState<'due' | 'all'>('due')

  const cardMap = useMemo(() => allCards(curr), [curr])
  const allIds = useMemo(() => [...cardMap.keys()], [cardMap])
  const dueIds = dueCardIds(allIds)

  const nextDue = useMemo(() => {
    const times = allIds
      .map((id) => srs[id]?.due)
      .filter((t): t is number => typeof t === 'number' && t > Date.now())
      .sort((a, b) => a - b)
    return times[0]
  }, [allIds, srs])

  const start = (which: 'due' | 'all') => {
    const ids = which === 'due' ? dueIds : allIds
    const cards = ids
      .map((id) => cardMap.get(id)?.card)
      .filter((c): c is Flashcard => Boolean(c))
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
    }
    setMode(which)
    setSession(cards.slice(0, 20))
  }

  if (session) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-ink">
            {mode === 'due' ? 'Review' : 'Practice'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Rate honestly — it sets when each card comes back.
          </p>
        </header>
        <FlashcardReview
          cards={session}
          doneLabel="Done"
          onDone={() => setSession(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Review</h1>
        <p className="mt-1 text-sm text-muted">
          Spaced repetition for the terminology and numbers. Cards are added as
          you finish flashcard lessons.
        </p>
      </header>

      {allIds.length === 0 ? (
        <EmptyState title="No cards yet">
          Finish a flashcard lesson (each module has one) and its cards land
          here on a spaced schedule.{' '}
          <Link to="/pathway" className="text-accent hover:underline">
            Open the path
          </Link>
          .
        </EmptyState>
      ) : dueIds.length > 0 ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-3xl font-semibold text-accent">
              {dueIds.length}
            </div>
            <div className="text-sm text-muted">
              card{dueIds.length === 1 ? '' : 's'} due now
              {dueIds.length > 20 && ' (20 per session)'}
            </div>
          </div>
          <Button onClick={() => start('due')}>Start review →</Button>
        </Card>
      ) : (
        <Card>
          <div className="text-sm text-ink">You’re all caught up. ✓</div>
          <div className="mt-1 text-sm text-muted">
            {nextDue
              ? `Next card is due ${relTime(nextDue)}.`
              : 'No cards scheduled.'}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => start('all')}
          >
            Practice all {Math.min(20, allIds.length)} anyway
          </Button>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Deck status
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Total" value={allIds.length} />
          <Stat
            label="Learned"
            value={allIds.filter((id) => (srs[id]?.reps ?? 0) >= 2).length}
          />
          <Stat label="Due" value={dueIds.length} />
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface-2 py-3">
      <div className="font-mono text-xl font-semibold text-ink">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}

function relTime(ts: number): string {
  const diff = ts - Date.now()
  const hours = Math.round(diff / 3_600_000)
  if (hours < 1) return 'in under an hour'
  if (hours < 24) return `in ~${hours}h`
  return `in ~${Math.round(hours / 24)}d`
}
