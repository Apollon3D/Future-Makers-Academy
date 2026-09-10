import { useEffect, useMemo, useState } from 'react'
import type { Flashcard } from '../types'
import { useProgress } from '../store/useProgress'
import { Button, cn } from './ui'

const RATINGS: { label: string; value: 0 | 1 | 2 | 3; tone: string }[] = [
  { label: 'Again', value: 0, tone: 'var(--danger)' },
  { label: 'Hard', value: 1, tone: 'var(--warn)' },
  { label: 'Good', value: 2, tone: 'var(--accent)' },
  { label: 'Easy', value: 3, tone: 'var(--success)' },
]

export function FlashcardReview({
  cards,
  onDone,
  doneLabel = 'Finish',
}: {
  cards: Flashcard[]
  onDone?: () => void
  doneLabel?: string
}) {
  const ensureCards = useProgress((s) => s.ensureCards)
  const reviewCard = useProgress((s) => s.reviewCard)

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards])
  useEffect(() => {
    ensureCards(cardIds)
  }, [cardIds, ensureCards])

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [ratings, setRatings] = useState<Record<string, number>>({})

  if (cards.length === 0) {
    return <p className="text-sm text-muted">No cards to review right now.</p>
  }

  const done = i >= cards.length
  const card = cards[Math.min(i, cards.length - 1)]

  const rate = (value: 0 | 1 | 2 | 3) => {
    reviewCard(card.id, value)
    setRatings((r) => ({ ...r, [card.id]: value }))
    setFlipped(false)
    setI((n) => n + 1)
  }

  if (done) {
    const again = Object.values(ratings).filter((v) => v === 0).length
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <div className="text-lg font-semibold text-ink">
          Reviewed {cards.length} card{cards.length === 1 ? '' : 's'}
        </div>
        <p className="mt-1 text-sm text-muted">
          {again === 0
            ? 'All recalled. They will come back on a longer schedule.'
            : `${again} marked "Again" — those return soon.`}
        </p>
        <Button className="mt-4" onClick={onDone}>
          {doneLabel}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>
          Card {i + 1} of {cards.length}
        </span>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${(i / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="grid min-h-44 w-full place-items-center rounded-xl border border-border bg-surface p-6 text-center transition-colors hover:border-border-strong"
      >
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">
            {flipped ? 'Answer' : 'Prompt'}
          </div>
          <div className="mt-2 text-lg text-ink">
            {flipped ? card.back : card.front}
          </div>
          {!flipped && (
            <div className="mt-3 text-xs text-muted">click to reveal</div>
          )}
        </div>
      </button>

      {flipped && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => rate(r.value)}
              className={cn(
                'rounded-lg border border-border py-2 text-sm font-medium text-text hover:text-ink',
              )}
              style={{ borderColor: r.tone, color: r.tone }}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
