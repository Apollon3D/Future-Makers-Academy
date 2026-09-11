# Future Makers Academy

An interactive, **simulation-first learning platform for FDM 3D printing**,
by [Apollon3D](https://apollon3d.com). Built as a JSON-driven LMS: the whole
curriculum is data, so new lessons never require code changes.

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
> `G:\My Drive\Apollon3D\Apps\Future Makers Academy`.

## How it's structured

```
src/
  content/                 the curriculum — pure data
    modules/*.ts            one Module per file (6 built-in, FDM-focused)
    index.ts               aggregation + progress/unlock helpers + JSON validator
    useCurriculum.ts       merges built-in modules with in-app authored ones
    workshop.ts            printers + shared part library for the Workshop
  store/
    useAuth.ts             local student profiles (name + photo) + who's active
    session.ts             switchProfile/logout/syncActiveProfile — the only
                           code that should change which profile is active
    useProgress.ts         Zustand store: completions, XP, streak, time,
                           spaced-repetition schedules, printer profile, theme,
                           maintenance log. Storage is namespaced per active
                           student profile (see "Student profiles" below).
    useCustomContent.ts    authored modules — shared by every profile on this
                           device (NOT per-student)
  lib/
    srs.ts                 SM-2-style flashcard scheduler
    markdown.tsx           tiny markdown renderer for lesson bodies
    image.ts               resize an uploaded photo to a small data URL
  components/
    ProfileGate            full-screen "who's making today?" picker, shown
                           whenever no profile is active (see App.tsx)
    widgets/               interactive "cause and effect" simulators + registry
    QuizBlock / FlashcardReview / ChecklistBlock / WidgetHost
  pages/
    Dashboard              student avatar + greeting, rings, XP/streak/time,
                           weak-topic list, module chart
    Pathway                gamified vertical skill tree with prerequisite locks
    LessonPlayer           distraction-free reader; renders any lesson type
    Review                 spaced-repetition session across all decks
    Workshop / PrinterDetail  clickable printer schematics — per-part function,
                           failure signs, and a maintenance log with due dates
    Sandbox                every widget, unlocked, for free exploration
    Author                 paste/validate/preview module JSON → add to the path
    Settings               my profile (name/photo, other students on this
                           device), printer profile, theme, reset progress
```

## Student profiles

Login is required and is a **local, unsecured picker** — a name and optional
photo per student, not an account system. On first load (or after "Switch
student") `ProfileGate` shows every profile created on this device; picking
one, or creating a new one, calls `switchProfile(id)` in `store/session.ts`.

Each profile's `useProgress` data lives in its own `localStorage` slot
(`future-makers-academy-progress:<profileId>`) via a custom Zustand `persist`
storage adapter that reads the active id from `useAuth`. Switching profiles
reads that slot directly (bypassing zustand's own async rehydration, which
would race against "which profile is active") and does a hard navigation back
to `/` so no other page's local state leaks between students. Authored
content (`useCustomContent`) is intentionally **not** part of this — it is one
shared library for every student on the device.

Deleting a profile (in `ProfileGate` or Settings) removes its progress slot
too. There is no password and no server — anyone with the device can open any
profile; it exists to keep each student's own progress and photo separate,
not to secure it.

## Workshop

`src/content/workshop.ts` holds `PART_LIBRARY` (≈20 parts — each with how-it-works,
failure symptoms, a maintenance schedule, and repair guidance, all universal to
the part type) and `PRINTERS` (each machine composes a subset of parts, with
per-model `note`s and a hotspot coordinate for its diagram).

`src/components/PrinterDiagram.tsx` draws a schematic front elevation
(`bedslinger` or `corexy`) with numbered, clickable hotspots; passing a
`focus={x,y}` prop crops+magnifies the same drawing around one hotspot. Clicking
any part switches `PrinterDetail` into **focus mode**: a real reference photo
(when one exists) beside the zoomed diagram, then the full write-up below, with
prev/next to step through every part. Maintenance completion is stored in the
progress store as `maintenanceLog` (`${printerId}:${partId}:${taskIndex}` →
epoch ms); "due" is derived from the task's interval.

v1 printers: **Creality Ender-3 V2**, **Prusa MK4S** (both bed-slinger),
**Bambu Lab P1S** (CoreXY). Model-specific facts are drawn from general
knowledge — the UI links each machine's official manual and tells users to
verify procedures there. Add a printer by appending to `PRINTERS`; add a part by
adding to `PART_LIBRARY` and referencing it.

### Part photos

`PartInfo.photo` is optional — about a third of the ~20 parts have one, sourced
from Wikimedia Commons and verified (content + license) before adding. Where no
part-specific photo exists on Commons, the part shows the zoomed diagram alone
rather than a mismatched stand-in. A few photos are explicitly **illustrative**
(a generic cooling fan or PSU standing in for the general idea, a NEMA 17 motor
representing "the stepper on this axis") — that's flagged in the photo's `note`
field and shown under the image in amber. Every photo carries its real
`credit` (photographer + license) per the source's terms.

## Content model

A module is a JSON object with an ordered `lessons[]`. Lesson `type` is one of:

| type          | payload                                                            |
| ------------- | ----------------------------------------------------------------- |
| `reading`     | `body` (markdown), optional `widget`, `keyTakeaways[]`            |
| `video`       | `provider` (`youtube` \| `file`), `src` (id/URL; `""` = "coming soon"), optional `credit`, `chapters[]`, `body`, `keyTakeaways[]` |
| `quiz`        | `questions[]` (`prompt`, `options[]`, `answer` index, `explanation`), optional `passScore` |
| `flashcards`  | `cards[]` (`front`, `back`) — flow into the spaced-repetition queue |
| `interactive` | `widget` key (see the Sandbox for available keys)                 |
| `checklist`   | `items[]` (`text`, optional `detail`)                             |

### Video lessons

`provider: 'youtube'` embeds via `youtube-nocookie.com` (privacy mode); `src`
takes a bare id, a `youtu.be/…`, `watch?v=…`, `/embed/…` or `/shorts/…` URL.
`provider: 'file'` plays a direct `.mp4`/`.webm` URL (host it yourself — e.g. an
`assets/` path, S3, Cloudflare R2). A `"Watch on YouTube ↗"` link always shows
as a fallback in case the uploader disabled embedding. Completion is a manual
**"Mark as watched"** button (40 XP).

**The seeded YouTube videos are curated starting picks — review them before any
public launch.** Confirmed on-topic: Fundamentals (`T-Z3GmM20JM`, Thomas
Sanladerer), Materials (`ycGDR752fT0`, Thomas Sanladerer), First Layer
(`Ze36SX1xzOE`, Teaching Tech). Chosen from search, creator not fully verified:
Slicer (`mE521Q4H6aY`), Troubleshooting (`YPAXeBuq9qU`), DfAM (`2_nVzoHC9YM`).
Swap any of them in the **Author** tab or the module file — it's a one-line
change. For original Future Makers Academy videos, switch to
`provider: 'file'`.

Author a module in the **Author** tab (it validates and previews), or drop a
new file in `src/content/modules/` and add it to `builtinCurriculum` in
`src/content/index.ts`.

### Interactive widgets

Registered in `src/components/widgets/index.ts`. Add a component + registry
entry and it's usable from any `interactive` lesson and appears in the Sandbox.

- `slicer-sim` — 5 sliders (layer/infill/walls/speed/temp) → time, strength,
  quality, stringing, filament, with a live cutaway + stair-stepping strip
- `axis-visualizer` — the nozzle animates through each layer's toolpath in
  top + side views; Z steps between layers; X/Y/Z readout
- `material-picker` — requirement questionnaire + printer capability toggles →
  ranked pick from `src/content/filaments.ts` (27 filaments); second tab is the
  full reference with per-axis scores and temps
- `infill-compare` — pick any two of nine patterns at one density (density adds
  lines, not zoom); strength/speed/material bars per pattern
- `z-offset` — first-layer squish in cross-section and top-down, with a verdict
- `overhang-dial` — overhang angle vs. printed-surface quality

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
