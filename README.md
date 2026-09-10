# Filament Academy

An interactive, **simulation-first learning platform for FDM 3D printing**.
Built as a JSON-driven LMS: the whole curriculum is data, so new lessons never
require code changes.

Vite + React 19 + TypeScript · Tailwind CSS v4 · Zustand (persisted) · Recharts.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
```

> This project lives at `C:\Users\lucas\Projects\3DPrintingAcademy` (a working
> copy off Google Drive, because Drive's virtual filesystem breaks
> `npm install`). `scripts/mirror.ps1` syncs source-only into
> `G:\My Drive\Apollon3D\Apps\Filament Academy`.

## How it's structured

```
src/
  content/                 the curriculum — pure data
    modules/*.ts            one Module per file (6 built-in, FDM-focused)
    index.ts               aggregation + progress/unlock helpers + JSON validator
    useCurriculum.ts       merges built-in modules with in-app authored ones
  store/useProgress.ts     Zustand store: completions, XP, streak, time,
                           spaced-repetition schedules, printer profile, theme.
                           Persisted to localStorage.
  lib/
    srs.ts                 SM-2-style flashcard scheduler
    markdown.tsx           tiny markdown renderer for lesson bodies
  components/
    widgets/               interactive "cause and effect" simulators + registry
    QuizBlock / FlashcardReview / ChecklistBlock / WidgetHost
  pages/
    Dashboard              rings, XP/streak/time, weak-topic list, module chart
    Pathway                gamified vertical skill tree with prerequisite locks
    LessonPlayer           distraction-free reader; renders any lesson type
    Review                 spaced-repetition session across all decks
    Sandbox                every widget, unlocked, for free exploration
    Author                 paste/validate/preview module JSON → add to the path
    Settings               printer profile, theme, reset progress
```

## Content model

A module is a JSON object with an ordered `lessons[]`. Lesson `type` is one of:

| type          | payload                                                            |
| ------------- | ----------------------------------------------------------------- |
| `reading`     | `body` (markdown), optional `widget`, `keyTakeaways[]`            |
| `quiz`        | `questions[]` (`prompt`, `options[]`, `answer` index, `explanation`), optional `passScore` |
| `flashcards`  | `cards[]` (`front`, `back`) — flow into the spaced-repetition queue |
| `interactive` | `widget` key (see the Sandbox for available keys)                 |
| `checklist`   | `items[]` (`text`, optional `detail`)                             |

Author a module in the **Author** tab (it validates and previews), or drop a
new file in `src/content/modules/` and add it to `builtinCurriculum` in
`src/content/index.ts`.

### Interactive widgets

Registered in `src/components/widgets/index.ts`. Current set: `slicer-sim`,
`axis-visualizer`, `material-picker`, `infill-compare`, `z-offset`,
`overhang-dial`. Add a component + registry entry and it's usable from any
`interactive` lesson and appears in the Sandbox.

## Built-in curriculum (v1)

1. **FDM Fundamentals** — the process, printer anatomy, coordinates, the workflow
2. **Filament & Materials** — PLA / PETG / TPU / ABS-ASA, moisture, selection
3. **The Slicer** — layers, walls, infill, top/bottom, supports, adhesion helpers, speed/temp, G-code
4. **Bed Adhesion & First Layer** — tramming, Z-offset, surfaces, a pre-print checklist
5. **Print Quality & Troubleshooting** — a diagnostic method + the common failures
6. **Design for FDM (DfAM)** — anisotropy, overhangs, bridging, tolerances, support avoidance, part consolidation

Each module ends with a checkpoint quiz; several include a spaced-repetition deck.

## Roadmap ideas

- The "virtual printer" throughline: calibrations that visibly improve every later simulator
- G-code toolpath viewer (scrub layers of a real file)
- Failure-photo diagnostic decision tree
- Export/import progress; optional cloud sync
- SLA/resin and multi-material tracks (author them as modules)
