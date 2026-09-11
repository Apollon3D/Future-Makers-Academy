import type { LessonRef } from '../types'

/**
 * Quick Tips: a short-form ("1-2 minute") video feed, separate from the
 * curriculum's Lesson/Module structure — these aren't graded or tracked
 * toward level completion, just a fast, social-feed-style way to pick up one
 * idea at a time. See src/pages/QuickTips.tsx.
 *
 * IMPORTANT — sourcing honesty: these are real, existing YouTube Shorts found
 * via search and confirmed to exist/be on-topic (checked against YouTube's
 * oEmbed endpoint, which returns the real title + channel for a given URL).
 * Unlike the hand-picked full video lessons in src/content/modules/*, none of
 * these small channels have been individually vetted for accuracy the way
 * Thomas Sanladerer / Teaching Tech have — **review each one yourself before
 * relying on it in front of a class**, and swap out anything that turns out
 * to be wrong or has since been deleted/gone private. Every entry carries its
 * real creator credit per YouTube's terms.
 */
export interface QuickTip {
  id: string
  /** Short caption shown over the video. */
  caption: string
  provider: 'youtube' | 'file'
  /** YouTube video id (or a direct file URL when provider is 'file'). */
  src: string
  /** Creator / channel, shown under the caption. */
  credit: string
  /** Optional link back into the curriculum for "want the full lesson?". */
  relatedLesson?: LessonRef
}

export const QUICK_TIPS: QuickTip[] = [
  {
    id: 'tip-petg-stringing',
    caption: 'Fighting PETG stringing? Try this retraction/temp tweak first.',
    provider: 'youtube',
    src: 'vNQcOGghiZw',
    credit: '3DPrintSOS on YouTube',
    relatedLesson: { moduleId: 'troubleshooting', lessonId: 'stringing' },
  },
  {
    id: 'tip-first-layer-setting',
    caption: 'Bad first layer? Check this one setting before anything else.',
    provider: 'youtube',
    src: 'SRPuuu1ycKA',
    credit: 'FLASHFORGE 3D PRINTER on YouTube',
    relatedLesson: { moduleId: 'first-layer', lessonId: 'z-offset' },
  },
  {
    id: 'tip-bed-adhesion-fixes',
    caption: 'Five quick fixes when a print won’t stick to the plate.',
    provider: 'youtube',
    src: 'tWcO3UvWzi8',
    credit: 'Kennedy DIY on YouTube',
    relatedLesson: { moduleId: 'first-layer', lessonId: 'surfaces-adhesives' },
  },
  {
    id: 'tip-wet-petg-look',
    caption: 'This is what wet PETG looks like mid-print — know the signs.',
    provider: 'youtube',
    src: 'R2c2LYNk6dc',
    credit: 'JDub Hannah on YouTube',
    relatedLesson: { moduleId: 'materials', lessonId: 'moisture' },
  },
  {
    id: 'tip-retraction-issues',
    caption: 'Clicking and skipping during retraction? Start here.',
    provider: 'youtube',
    src: 'v_4-TuVHY9g',
    credit: '3D Musketeers on YouTube',
    relatedLesson: { moduleId: 'troubleshooting', lessonId: 'extrusion-issues' },
  },
  {
    id: 'tip-temp-tower',
    caption: 'How to actually read a temperature tower once it’s printed.',
    provider: 'youtube',
    src: 'EyBCEgRHwos',
    credit: 'That Dude 3D Prints on YouTube',
    relatedLesson: { moduleId: 'slicer', lessonId: 'speed-temp' },
  },
  {
    id: 'tip-support-settings',
    caption: 'Dialling in support settings so they actually pop off clean.',
    provider: 'youtube',
    src: 'hLVjbggCQ10',
    credit: '3Digiprints on YouTube',
    relatedLesson: { moduleId: 'slicer', lessonId: 'supports' },
  },
  {
    id: 'tip-surface-texturing',
    caption: 'Skip fuzzy skin — a free tool for real surface texture.',
    provider: 'youtube',
    src: 'cWlzYI1t6W0',
    credit: '3D Printing Canada on YouTube (featuring CNC Kitchen’s BumpMesh)',
    relatedLesson: { moduleId: 'dfam', lessonId: 'overhangs' },
  },
]
