export interface Level {
  id: string
  number: number
  name: string
  tagline: string
}

/**
 * The curriculum is organised into three levels. Each level is a group of
 * modules (assigned via `Module.level`) capped by a gating exam module
 * (`Module.isExam`). Passing a level's exam awards a printable certificate
 * (see store/useProgress.ts `certificates` and components/Certificate.tsx)
 * and unlocks the next level's modules.
 */
export const LEVELS: Level[] = [
  {
    id: 'level-1',
    number: 1,
    name: 'Foundations',
    tagline: 'How FDM printing works, what to print it in, and how a slicer thinks.',
  },
  {
    id: 'level-2',
    number: 2,
    name: 'Practitioner',
    tagline: 'Get parts to stick, diagnose failures, finish them, and keep the machine healthy.',
  },
  {
    id: 'level-3',
    number: 3,
    name: 'Advanced Maker',
    tagline: 'Design for the process, calibrate like a pro, and print in more than one material.',
  },
]

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id)
}
