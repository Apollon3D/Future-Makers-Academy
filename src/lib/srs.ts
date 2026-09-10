/**
 * Minimal SM-2-style spaced repetition scheduler for flashcards.
 * Ratings: 0 = "again", 1 = "hard", 2 = "good", 3 = "easy".
 */

export interface CardSchedule {
  /** Ease factor, clamped to [1.3, 3.0]. */
  ease: number
  /** Current interval in days. */
  intervalDays: number
  /** Consecutive successful reviews. */
  reps: number
  /** Epoch ms when the card is next due. */
  due: number
  /** Epoch ms of the last review, or 0 if never reviewed. */
  lastReviewed: number
}

export const DAY_MS = 24 * 60 * 60 * 1000

export function newCard(now = Date.now()): CardSchedule {
  return { ease: 2.5, intervalDays: 0, reps: 0, due: now, lastReviewed: 0 }
}

export function schedule(
  card: CardSchedule,
  rating: 0 | 1 | 2 | 3,
  now = Date.now(),
): CardSchedule {
  let { ease, reps } = card
  let intervalDays: number

  if (rating === 0) {
    reps = 0
    intervalDays = 0 // relearn same session; due immediately-ish
    ease = Math.max(1.3, ease - 0.2)
    return {
      ease,
      intervalDays,
      reps,
      due: now + 8 * 60 * 1000, // 8 minutes
      lastReviewed: now,
    }
  }

  reps += 1
  if (reps === 1) intervalDays = 1
  else if (reps === 2) intervalDays = 3
  else intervalDays = Math.round(card.intervalDays * ease)

  const easeDelta = rating === 1 ? -0.15 : rating === 3 ? 0.15 : 0
  ease = Math.min(3, Math.max(1.3, ease + easeDelta))
  if (rating === 1) intervalDays = Math.max(1, Math.round(intervalDays * 0.7))

  return {
    ease,
    intervalDays,
    reps,
    due: now + intervalDays * DAY_MS,
    lastReviewed: now,
  }
}

export function isDue(card: CardSchedule, now = Date.now()): boolean {
  return card.due <= now
}
