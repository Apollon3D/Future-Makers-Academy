import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type CardSchedule, newCard, schedule } from '../lib/srs'
import { todayKey, daysBetween } from '../lib/format'
import type { LessonRef } from '../types'

export interface PrinterProfile {
  name: string
  bedX: number
  bedY: number
  bedZ: number
  nozzle: number
  extruder: 'bowden' | 'direct'
  enclosed: boolean
  materials: string[]
}

export interface QuizResult {
  best: number
  total: number
  attempts: number
  lastAt: number
  passed: boolean
}

export interface StreakState {
  current: number
  longest: number
  lastActiveDay: string | null
}

interface ProgressState {
  /** Composite keys: `${moduleId}/${lessonId}`. */
  completedLessons: string[]
  quizResults: Record<string, QuizResult>
  xp: number
  streak: StreakState
  timeSpentSec: number
  srs: Record<string, CardSchedule>
  profile: PrinterProfile
  theme: 'dark' | 'light'
  lastLesson: LessonRef | null
  /** Modules added through the in-app authoring tool. */
  customModules: unknown[]
  /** Bumped whenever the learner does something meaningful (for effects). */
  activityNonce: number

  isLessonComplete: (key: string) => boolean
  completeLesson: (key: string, xpAward: number) => void
  uncompleteLesson: (key: string) => void
  recordQuiz: (
    key: string,
    correct: number,
    total: number,
    passScore: number,
  ) => QuizResult
  addTime: (seconds: number) => void
  touchStreak: () => void

  ensureCards: (ids: string[]) => void
  reviewCard: (id: string, rating: 0 | 1 | 2 | 3) => void
  dueCardIds: (allIds: string[]) => string[]

  setProfile: (patch: Partial<PrinterProfile>) => void
  setTheme: (theme: 'dark' | 'light') => void
  setLastLesson: (ref: LessonRef) => void
  addCustomModule: (mod: unknown) => void
  removeCustomModule: (id: string) => void
  resetProgress: () => void
}

export const DEFAULT_PROFILE: PrinterProfile = {
  name: 'My Printer',
  bedX: 220,
  bedY: 220,
  bedZ: 250,
  nozzle: 0.4,
  extruder: 'bowden',
  enclosed: false,
  materials: ['PLA'],
}

function bumpStreak(streak: StreakState): StreakState {
  const today = todayKey()
  if (streak.lastActiveDay === today) return streak
  let current = 1
  if (streak.lastActiveDay) {
    const gap = daysBetween(streak.lastActiveDay, today)
    if (gap === 1) current = streak.current + 1
  }
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDay: today,
  }
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      quizResults: {},
      xp: 0,
      streak: { current: 0, longest: 0, lastActiveDay: null },
      timeSpentSec: 0,
      srs: {},
      profile: DEFAULT_PROFILE,
      theme: 'dark',
      lastLesson: null,
      customModules: [],
      activityNonce: 0,

      isLessonComplete: (key) => get().completedLessons.includes(key),

      completeLesson: (key, xpAward) =>
        set((s) => {
          const already = s.completedLessons.includes(key)
          return {
            completedLessons: already
              ? s.completedLessons
              : [...s.completedLessons, key],
            xp: already ? s.xp : s.xp + xpAward,
            streak: bumpStreak(s.streak),
            activityNonce: s.activityNonce + 1,
          }
        }),

      uncompleteLesson: (key) =>
        set((s) => ({
          completedLessons: s.completedLessons.filter((k) => k !== key),
        })),

      recordQuiz: (key, correct, total, passScore) => {
        const scorePct = total > 0 ? (correct / total) * 100 : 0
        const passed = scorePct >= passScore
        const prev = get().quizResults[key]
        const result: QuizResult = {
          best: Math.max(prev?.best ?? 0, correct),
          total,
          attempts: (prev?.attempts ?? 0) + 1,
          lastAt: Date.now(),
          passed: passed || (prev?.passed ?? false),
        }
        set((s) => ({
          quizResults: { ...s.quizResults, [key]: result },
          streak: bumpStreak(s.streak),
          activityNonce: s.activityNonce + 1,
        }))
        return result
      },

      addTime: (seconds) =>
        set((s) => ({ timeSpentSec: s.timeSpentSec + Math.max(0, seconds) })),

      touchStreak: () => set((s) => ({ streak: bumpStreak(s.streak) })),

      ensureCards: (ids) =>
        set((s) => {
          let changed = false
          const srs = { ...s.srs }
          for (const id of ids) {
            if (!srs[id]) {
              srs[id] = newCard()
              changed = true
            }
          }
          return changed ? { srs } : {}
        }),

      reviewCard: (id, rating) =>
        set((s) => {
          const card = s.srs[id] ?? newCard()
          return {
            srs: { ...s.srs, [id]: schedule(card, rating) },
            xp: s.xp + (rating === 0 ? 1 : 4),
            streak: bumpStreak(s.streak),
            activityNonce: s.activityNonce + 1,
          }
        }),

      dueCardIds: (allIds) => {
        // Only cards the learner has actually encountered (seeded into the
        // scheduler by completing a flashcard lesson) can be "due".
        const now = Date.now()
        const { srs } = get()
        return allIds.filter((id) => {
          const c = srs[id]
          return c && c.due <= now
        })
      },

      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      setTheme: (theme) => set({ theme }),

      setLastLesson: (ref) =>
        set((s) =>
          s.lastLesson?.moduleId === ref.moduleId &&
          s.lastLesson?.lessonId === ref.lessonId
            ? {}
            : { lastLesson: ref },
        ),

      addCustomModule: (mod) =>
        set((s) => ({ customModules: [...s.customModules, mod] })),

      removeCustomModule: (id) =>
        set((s) => ({
          customModules: s.customModules.filter(
            (m) => (m as { id?: string }).id !== id,
          ),
        })),

      resetProgress: () =>
        set({
          completedLessons: [],
          quizResults: {},
          xp: 0,
          streak: { current: 0, longest: 0, lastActiveDay: null },
          timeSpentSec: 0,
          srs: {},
          lastLesson: null,
          activityNonce: 0,
        }),
    }),
    {
      name: 'filament-academy-progress',
      version: 1,
    },
  ),
)

/** XP awarded for completing each lesson type. */
export const XP_BY_TYPE: Record<string, number> = {
  reading: 40,
  quiz: 60,
  flashcards: 30,
  interactive: 45,
  checklist: 25,
}
