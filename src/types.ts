/**
 * Content model for the platform.
 *
 * The whole curriculum is data: a list of {@link Module}s, each holding an
 * ordered list of {@link Lesson}s. Adding content never requires new UI code —
 * you add a lesson object (or author one in-app, which emits this same shape).
 */

export type LessonType =
  | 'reading'
  | 'video'
  | 'quiz'
  | 'flashcards'
  | 'interactive'
  | 'checklist'

export interface QuizQuestion {
  id: string
  /** The scenario or question stem. Supports the lightweight markdown subset. */
  prompt: string
  options: string[]
  /** Index into `options`. */
  answer: number
  /** Shown after the learner answers, right or wrong. */
  explanation: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface ChecklistItem {
  id: string
  text: string
  /** Optional detail revealed under the item. */
  detail?: string
}

export interface BaseLesson {
  id: string
  title: string
  /** One-line summary shown in lesson lists and the pathway. */
  summary: string
  estMinutes: number
  type: LessonType
}

export interface ReadingLesson extends BaseLesson {
  type: 'reading'
  /** Markdown (lightweight subset — see lib/markdown). */
  body: string
  /** Optional interactive widget embedded at the end of the reading. */
  widget?: string
  keyTakeaways?: string[]
}

export interface VideoChapter {
  /** "m:ss" or "h:mm:ss" — display only (and a seek target for self-hosted). */
  time: string
  label: string
}

export interface VideoLesson extends BaseLesson {
  type: 'video'
  /** 'youtube' embeds by id/URL; 'file' plays a direct MP4/WebM URL. */
  provider: 'youtube' | 'file'
  /** YouTube video id or full URL, or a direct video file URL. Empty = "coming soon". */
  src: string
  /** Creator / attribution shown under the player. */
  credit?: string
  /** Where to watch if the embed is blocked (auto-derived for YouTube). */
  externalUrl?: string
  intro?: string
  /** Markdown notes / transcript shown below the video. */
  body?: string
  chapters?: VideoChapter[]
  keyTakeaways?: string[]
}

export interface QuizLesson extends BaseLesson {
  type: 'quiz'
  intro?: string
  questions: QuizQuestion[]
  /** Percentage (0-100) needed to count as passed. Default 70. */
  passScore?: number
}

export interface FlashcardLesson extends BaseLesson {
  type: 'flashcards'
  intro?: string
  cards: Flashcard[]
}

export interface InteractiveLesson extends BaseLesson {
  type: 'interactive'
  /** Key into the widget registry (components/widgets/index.ts). */
  widget: string
  intro?: string
  body?: string
}

export interface ChecklistLesson extends BaseLesson {
  type: 'checklist'
  intro?: string
  items: ChecklistItem[]
}

export type Lesson =
  | ReadingLesson
  | VideoLesson
  | QuizLesson
  | FlashcardLesson
  | InteractiveLesson
  | ChecklistLesson

export interface Module {
  id: string
  title: string
  /** Short tagline for cards. */
  blurb: string
  /** Emoji or short glyph used as the module mark. */
  icon: string
  /** Ordered lesson list. */
  lessons: Lesson[]
  /** Module ids that must be completed before this one unlocks. */
  requires?: string[]
  /** Which level (src/content/levels.ts) this module belongs to. */
  level?: string
  /** Marks this as a level's gating exam rather than a regular module. */
  isExam?: boolean
}

export type Curriculum = Module[]

/** A resolved pointer to a specific lesson within a module. */
export interface LessonRef {
  moduleId: string
  lessonId: string
}
