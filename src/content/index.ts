import type {
  Curriculum,
  Flashcard,
  Lesson,
  LessonRef,
  Module,
} from '../types'
import { fundamentals } from './modules/fundamentals'
import { materials } from './modules/materials'
import { slicer } from './modules/slicer'
import { firstLayer } from './modules/first-layer'
import { troubleshooting } from './modules/troubleshooting'
import { dfam } from './modules/dfam'

/** The built-in starter curriculum, in intended learning order. */
export const builtinCurriculum: Curriculum = [
  fundamentals,
  materials,
  slicer,
  firstLayer,
  troubleshooting,
  dfam,
]

export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}/${lessonId}`
}

export function mergeCurriculum(custom: Module[]): Curriculum {
  // Custom modules append after the built-ins; a custom module with an
  // existing id replaces the built-in one.
  const byId = new Map<string, Module>()
  for (const m of builtinCurriculum) byId.set(m.id, m)
  const order: string[] = builtinCurriculum.map((m) => m.id)
  for (const m of custom) {
    if (!byId.has(m.id)) order.push(m.id)
    byId.set(m.id, m)
  }
  return order.map((id) => byId.get(id)!).filter(Boolean)
}

export function getModule(
  curr: Curriculum,
  id: string,
): Module | undefined {
  return curr.find((m) => m.id === id)
}

export function getLesson(
  curr: Curriculum,
  moduleId: string,
  lessonId: string,
): { module: Module; lesson: Lesson } | undefined {
  const module = getModule(curr, moduleId)
  const lesson = module?.lessons.find((l) => l.id === lessonId)
  if (!module || !lesson) return undefined
  return { module, lesson }
}

export interface FlatLesson {
  module: Module
  lesson: Lesson
  key: string
  /** Global index across the whole curriculum. */
  index: number
}

export function flatLessons(curr: Curriculum): FlatLesson[] {
  const out: FlatLesson[] = []
  let i = 0
  for (const module of curr) {
    for (const lesson of module.lessons) {
      out.push({
        module,
        lesson,
        key: lessonKey(module.id, lesson.id),
        index: i++,
      })
    }
  }
  return out
}

export interface ModuleProgress {
  done: number
  total: number
  pct: number
  complete: boolean
}

export function moduleProgress(
  module: Module,
  completed: string[],
): ModuleProgress {
  const total = module.lessons.length
  const done = module.lessons.filter((l) =>
    completed.includes(lessonKey(module.id, l.id)),
  ).length
  return {
    done,
    total,
    pct: total === 0 ? 0 : (done / total) * 100,
    complete: total > 0 && done === total,
  }
}

export function isModuleUnlocked(
  curr: Curriculum,
  module: Module,
  completed: string[],
): boolean {
  if (!module.requires || module.requires.length === 0) return true
  return module.requires.every((reqId) => {
    const req = getModule(curr, reqId)
    return req ? moduleProgress(req, completed).complete : true
  })
}

export function overallProgress(
  curr: Curriculum,
  completed: string[],
): { done: number; total: number; pct: number } {
  const all = flatLessons(curr)
  const done = all.filter((f) => completed.includes(f.key)).length
  return {
    done,
    total: all.length,
    pct: all.length === 0 ? 0 : (done / all.length) * 100,
  }
}

export function siblingLesson(
  curr: Curriculum,
  ref: LessonRef,
  dir: 1 | -1,
): LessonRef | null {
  const all = flatLessons(curr)
  const idx = all.findIndex(
    (f) => f.module.id === ref.moduleId && f.lesson.id === ref.lessonId,
  )
  if (idx === -1) return null
  const target = all[idx + dir]
  if (!target) return null
  return { moduleId: target.module.id, lessonId: target.lesson.id }
}

export function firstIncompleteLesson(
  curr: Curriculum,
  completed: string[],
): LessonRef | null {
  for (const f of flatLessons(curr)) {
    if (!completed.includes(f.key)) {
      return { moduleId: f.module.id, lessonId: f.lesson.id }
    }
  }
  return null
}

export interface CardEntry {
  card: Flashcard
  moduleId: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
}

/** Every flashcard in the curriculum, indexed by card id. */
export function allCards(curr: Curriculum): Map<string, CardEntry> {
  const map = new Map<string, CardEntry>()
  for (const module of curr) {
    for (const lesson of module.lessons) {
      if (lesson.type !== 'flashcards') continue
      for (const card of lesson.cards) {
        map.set(card.id, {
          card,
          moduleId: module.id,
          moduleTitle: module.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        })
      }
    }
  }
  return map
}

// ---------------------------------------------------------------------------
// Authoring: validate a user-supplied module JSON object.
// ---------------------------------------------------------------------------

export interface ParseResult {
  ok: boolean
  module?: Module
  errors: string[]
}

const LESSON_TYPES = [
  'reading',
  'quiz',
  'flashcards',
  'interactive',
  'checklist',
]

export function parseModule(raw: unknown): ParseResult {
  const errors: string[] = []
  const push = (m: string) => errors.push(m)

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: ['Top level must be a JSON object.'] }
  }
  const obj = raw as Record<string, unknown>

  if (typeof obj.id !== 'string' || !/^[a-z0-9-]+$/.test(obj.id)) {
    push('`id` must be a lowercase-kebab string (a-z, 0-9, -).')
  }
  if (typeof obj.title !== 'string' || !obj.title.trim()) {
    push('`title` is required.')
  }
  if (typeof obj.blurb !== 'string') push('`blurb` (string) is required.')
  if (typeof obj.icon !== 'string' || !obj.icon) obj.icon = '★'
  if (!Array.isArray(obj.lessons) || obj.lessons.length === 0) {
    push('`lessons` must be a non-empty array.')
  }

  if (Array.isArray(obj.lessons)) {
    obj.lessons.forEach((l, i) => {
      const L = l as Record<string, unknown>
      const at = `lessons[${i}]`
      if (typeof L.id !== 'string') push(`${at}.id must be a string.`)
      if (typeof L.title !== 'string') push(`${at}.title must be a string.`)
      if (typeof L.summary !== 'string') L.summary = ''
      if (typeof L.estMinutes !== 'number') L.estMinutes = 5
      if (typeof L.type !== 'string' || !LESSON_TYPES.includes(L.type)) {
        push(`${at}.type must be one of: ${LESSON_TYPES.join(', ')}.`)
        return
      }
      if (L.type === 'reading' && typeof L.body !== 'string') {
        push(`${at}: reading lessons need a \`body\` string (markdown).`)
      }
      if (L.type === 'quiz') {
        if (!Array.isArray(L.questions) || L.questions.length === 0) {
          push(`${at}: quiz lessons need a \`questions\` array.`)
        } else {
          L.questions.forEach((q, qi) => {
            const Q = q as Record<string, unknown>
            if (!Array.isArray(Q.options) || Q.options.length < 2) {
              push(`${at}.questions[${qi}]: need at least 2 \`options\`.`)
            }
            if (
              typeof Q.answer !== 'number' ||
              !Array.isArray(Q.options) ||
              Q.answer < 0 ||
              Q.answer >= (Q.options as unknown[]).length
            ) {
              push(
                `${at}.questions[${qi}]: \`answer\` must index into \`options\`.`,
              )
            }
            if (typeof Q.prompt !== 'string') {
              push(`${at}.questions[${qi}]: \`prompt\` string required.`)
            }
            if (typeof Q.id !== 'string') Q.id = `q${qi + 1}`
            if (typeof Q.explanation !== 'string') Q.explanation = ''
          })
        }
      }
      if (L.type === 'flashcards') {
        if (!Array.isArray(L.cards) || L.cards.length === 0) {
          push(`${at}: flashcard lessons need a \`cards\` array.`)
        } else {
          L.cards.forEach((c, ci) => {
            const C = c as Record<string, unknown>
            if (typeof C.front !== 'string' || typeof C.back !== 'string') {
              push(`${at}.cards[${ci}]: \`front\` and \`back\` strings required.`)
            }
            if (typeof C.id !== 'string') C.id = `${obj.id}-${L.id}-c${ci}`
          })
        }
      }
      if (L.type === 'interactive' && typeof L.widget !== 'string') {
        push(`${at}: interactive lessons need a \`widget\` key.`)
      }
      if (L.type === 'checklist') {
        if (!Array.isArray(L.items) || L.items.length === 0) {
          push(`${at}: checklist lessons need an \`items\` array.`)
        } else {
          L.items.forEach((it, ii) => {
            const I = it as Record<string, unknown>
            if (typeof I.text !== 'string') {
              push(`${at}.items[${ii}]: \`text\` string required.`)
            }
            if (typeof I.id !== 'string') I.id = `${L.id}-i${ii}`
          })
        }
      }
    })
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, module: raw as Module, errors: [] }
}
