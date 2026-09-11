import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { type CardSchedule, newCard, schedule } from '../lib/srs'
import { todayKey, daysBetween } from '../lib/format'
import type { LessonRef } from '../types'
import { PROGRESS_KEY_PREFIX, useAuth } from './useAuth'

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

export interface Certificate {
  levelId: string
  earnedAt: number
  /** A display-only code, not a real verification mechanism (no server). */
  serial: string
}

/** The persisted data shape — no actions. Reused as the default state and to
 *  rebuild a clean slate whenever the active student profile changes. */
export interface ProgressData {
  completedLessons: string[]
  quizResults: Record<string, QuizResult>
  xp: number
  streak: StreakState
  timeSpentSec: number
  srs: Record<string, CardSchedule>
  profile: PrinterProfile
  theme: 'dark' | 'light'
  lastLesson: LessonRef | null
  /** Workshop maintenance log: `${printerId}:${partId}:${taskIndex}` -> epoch ms last done. */
  maintenanceLog: Record<string, number>
  /** Earned certificates, keyed by level id. */
  certificates: Record<string, Certificate>
  /** Quick Tips (src/content/quickTips.ts) ids the learner has watched. */
  watchedTips: string[]
  /** Bumped whenever the learner does something meaningful (for effects). */
  activityNonce: number
}

interface ProgressActions {
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

  logMaintenance: (key: string) => void
  clearMaintenance: (key: string) => void

  /** Idempotent: awards once, first time called for a given level. */
  awardCertificate: (levelId: string) => void

  /** Idempotent: marks a Quick Tip watched and awards its XP once. */
  watchTip: (tipId: string) => void

  setProfile: (patch: Partial<PrinterProfile>) => void
  setTheme: (theme: 'dark' | 'light') => void
  setLastLesson: (ref: LessonRef) => void
  resetProgress: () => void
}

type ProgressState = ProgressData & ProgressActions

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

/** A brand-new student's starting data. */
export const DEFAULT_PROGRESS: ProgressData = {
  completedLessons: [],
  quizResults: {},
  xp: 0,
  streak: { current: 0, longest: 0, lastActiveDay: null },
  timeSpentSec: 0,
  srs: {},
  profile: DEFAULT_PROFILE,
  theme: 'dark',
  lastLesson: null,
  maintenanceLog: {},
  certificates: {},
  watchedTips: [],
  activityNonce: 0,
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

/**
 * Progress is per-student: the storage key is namespaced by whichever
 * profile is currently logged in (see src/store/useAuth.ts). Switching
 * profiles is handled explicitly in src/store/session.ts, which re-reads the
 * target profile's slot and replaces state directly — this adapter only
 * needs to read/write "whoever is active right now".
 */
const profileScopedStorage: StateStorage = {
  getItem: (name) => {
    const id = useAuth.getState().activeProfileId
    if (!id) return null
    try {
      return localStorage.getItem(`${name}:${id}`)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    const id = useAuth.getState().activeProfileId
    if (!id) return
    try {
      localStorage.setItem(`${name}:${id}`, value)
    } catch {
      /* storage full or unavailable — progress just won't persist */
    }
  },
  removeItem: (name) => {
    const id = useAuth.getState().activeProfileId
    if (!id) return
    try {
      localStorage.removeItem(`${name}:${id}`)
    } catch {
      /* ignore */
    }
  },
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

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

      logMaintenance: (key) =>
        set((s) => ({
          maintenanceLog: { ...s.maintenanceLog, [key]: Date.now() },
          streak: bumpStreak(s.streak),
          activityNonce: s.activityNonce + 1,
        })),

      clearMaintenance: (key) =>
        set((s) => {
          const next = { ...s.maintenanceLog }
          delete next[key]
          return { maintenanceLog: next }
        }),

      awardCertificate: (levelId) =>
        set((s) => {
          if (s.certificates[levelId]) return {}
          const serial = `FMA-${levelId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
          return {
            certificates: {
              ...s.certificates,
              [levelId]: { levelId, earnedAt: Date.now(), serial },
            },
            streak: bumpStreak(s.streak),
            activityNonce: s.activityNonce + 1,
          }
        }),

      watchTip: (tipId) =>
        set((s) => {
          if (s.watchedTips.includes(tipId)) return {}
          return {
            watchedTips: [...s.watchedTips, tipId],
            xp: s.xp + TIP_WATCH_XP,
            streak: bumpStreak(s.streak),
            activityNonce: s.activityNonce + 1,
          }
        }),

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

      resetProgress: () =>
        set({
          completedLessons: [],
          quizResults: {},
          xp: 0,
          streak: { current: 0, longest: 0, lastActiveDay: null },
          timeSpentSec: 0,
          srs: {},
          lastLesson: null,
          maintenanceLog: {},
          certificates: {},
          watchedTips: [],
          activityNonce: 0,
        }),
    }),
    {
      name: PROGRESS_KEY_PREFIX,
      version: 5,
      storage: createJSONStorage(() => profileScopedStorage),
      // We hydrate manually (see store/session.ts) because the right storage
      // slot depends on useAuth, which may not have hydrated itself yet at
      // the moment this store is created. Letting persist auto-hydrate here
      // races with that manual sync and can clobber it with stale/default
      // data — skip it entirely and always go through session.ts instead.
      skipHydration: true,
    },
  ),
)

/** XP awarded the first time a Quick Tip is watched. */
export const TIP_WATCH_XP = 5

/** XP awarded for completing each lesson type. */
export const XP_BY_TYPE: Record<string, number> = {
  reading: 40,
  video: 40,
  quiz: 60,
  flashcards: 30,
  interactive: 45,
  checklist: 25,
}
