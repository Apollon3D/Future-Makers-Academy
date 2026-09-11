import type { Module } from '../../types'

export const level3Exam: Module = {
  id: 'level-3-exam',
  title: 'Level 3 Exam: Advanced Maker',
  blurb: 'Covers Design for FDM, Advanced Calibration, and Multi-Material Printing. Pass to earn your Advanced Maker certificate.',
  icon: '🎓',
  level: 'level-3',
  isExam: true,
  requires: ['dfam', 'advanced-calibration', 'multi-material'],
  lessons: [
    {
      id: 'about-exam',
      title: 'Before You Start',
      summary: 'Format, scope, and what passing means.',
      estMinutes: 2,
      type: 'reading',
      body: `## What this covers

Questions are drawn from **Design for FDM (DfAM)**, **Advanced Calibration & Tuning**, and **Multi-Material & Specialty Printing** — the full Level 3.

## Passing

**80%** required, unlimited attempts.

## What passing means

A **Level 3: Advanced Maker certificate** — the top of the current curriculum. You'll have gone from "what is a layer" to designing for the process, calibrating a machine by measurement, and choosing the right multi-material approach for a job. That's a real, complete skill set.`,
    },
    {
      id: 'exam',
      title: 'Level 3 Exam',
      summary: 'Design for FDM, calibration, and multi-material printing — 80% to pass.',
      estMinutes: 14,
      type: 'quiz',
      passScore: 80,
      questions: [
        {
          id: 'q1',
          prompt: 'FDM parts are generally weaker:',
          options: [
            'Along the layers (X/Y)',
            'Across the layers (Z) — at the welds between layers',
            'Equally in every direction',
            'Only when printed in PETG',
          ],
          answer: 1,
          explanation: 'The bonds between layers are the weakest link; orient loads to run along layers, not across them.',
        },
        {
          id: 'q2',
          prompt: 'The practical overhang limit without support, on a well-cooled printer, is roughly:',
          options: ['10–15°', '45–60° from vertical', '90° (fully horizontal)', 'There is no limit'],
          answer: 1,
          explanation: 'Most printers manage up to about 45°, well-cooled machines somewhat more, before quality collapses.',
        },
        {
          id: 'q3',
          prompt: 'A horizontal round hole prints with a collapsed top because:',
          options: [
            'The hole is too small',
            'The top of a round hole is a steep, unsupported overhang',
            'The material is wrong',
            'The layer height is too low',
          ],
          answer: 1,
          explanation: 'Reshaping into a teardrop keeps every surface within the printable overhang angle.',
        },
        {
          id: 'q4',
          prompt: 'A sensible designed clearance for two printed parts that must slide against each other is about:',
          options: ['0.02 mm total', '0.2–0.25 mm per side', '2 mm per side', 'Zero — sand to fit'],
          answer: 1,
          explanation: 'That range gives a working moving fit on a typical 0.4 mm nozzle machine.',
        },
        {
          id: 'q5',
          prompt: 'Part consolidation (combining an assembly into one printed part) is NOT a good idea when:',
          options: [
            'The parts never need to come apart',
            'You need to service or replace one sub-part independently later',
            'You want fewer fasteners',
            'You want an internal channel impossible to machine',
          ],
          answer: 1,
          explanation: 'Consolidating away serviceability is the real cost — keep deliberate joints where replacement or adjustment matters.',
        },
        {
          id: 'q6',
          prompt: 'The correct order to calibrate is:',
          options: [
            'Pressure advance, then E-steps, then flow',
            'E-steps, then flow, then retraction, then pressure advance, then input shaping',
            'Input shaping, then E-steps',
            'Order does not matter',
          ],
          answer: 1,
          explanation: 'Each later calibration assumes the earlier ones are already correct — starting with the most foundational (E-steps) first.',
        },
        {
          id: 'q7',
          prompt: 'E-steps calibration corrects:',
          options: [
            'How much plastic is deposited per millimetre of travel',
            'How far the extruder actually feeds filament for a commanded length',
            'The nozzle temperature',
            'The bed mesh',
          ],
          answer: 1,
          explanation: 'It corrects the distance-to-steps relationship; flow calibration handles the volumetric fine-tuning afterward.',
        },
        {
          id: 'q8',
          prompt: 'Bulging corners and thin line starts, despite well-tuned retraction, point to:',
          options: ['A clogged nozzle', 'A need for Pressure/Linear Advance tuning', 'Wet filament', 'Incorrect bed temperature'],
          answer: 1,
          explanation: 'That is a pressure-timing issue in the melt, which Pressure/Linear Advance is designed to correct.',
        },
        {
          id: 'q9',
          prompt: 'Input shaping reduces ringing by:',
          options: [
            'Slowing down every move',
            'Measuring resonance and cancelling it with precisely timed move impulses',
            'Increasing layer height',
            'Reducing infill',
          ],
          answer: 1,
          explanation: 'It is a firmware technique that cancels vibration rather than avoiding it by moving slowly.',
        },
        {
          id: 'q10',
          prompt: 'IDEX (Independent Dual Extruder) machines can uniquely do which of the following?',
          options: [
            'Print in only one colour',
            'Duplication/mirror mode — printing two parts simultaneously on independent carriages',
            'Skip retraction entirely',
            'Print without a heated bed',
          ],
          answer: 1,
          explanation: 'Independent carriages let IDEX machines print duplicate or mirrored parts side by side.',
        },
        {
          id: 'q11',
          prompt: 'AMS/MMU-style systems feed multiple filaments through:',
          options: ['Multiple hotends at once', 'One shared hotend, one material at a time, with a purge at each swap', 'No hotend at all', 'Two nozzles printing the same layer simultaneously'],
          answer: 1,
          explanation: 'They share a single melt path and must purge the old material before the new one prints reliably.',
        },
        {
          id: 'q12',
          prompt: 'For a rigid part with a genuinely load-bearing flexible seal, the more robust multi-material approach is:',
          options: ['An AMS/MMU-style system', 'Dedicated dual extrusion or IDEX', 'Manual pause-and-swap', 'Gradient filament'],
          answer: 1,
          explanation: 'A dedicated second melt path is more reliable for structural multi-material parts than a shared, purge-dependent one.',
        },
        {
          id: 'q13',
          prompt: 'Chamfering a flat overhanging underside to 45° instead of adding support is an example of:',
          options: [
            'A slicer setting',
            'Designing the overhang away rather than compensating for it after the fact',
            'A material choice',
            'A calibration step',
          ],
          answer: 1,
          explanation: 'This is the core DfAM idea: redesign the geometry so the constraint never applies, rather than working around it.',
        },
        {
          id: 'q14',
          prompt: 'Printed holes typically come out:',
          options: ['Oversized', 'Undersized — needing compensation in CAD or the slicer', 'Exactly nominal size, always', 'Randomly sized with no pattern'],
          answer: 1,
          explanation: 'Extrusion behaviour and corner rounding consistently shrink printed holes slightly below the CAD dimension.',
        },
      ],
    },
  ],
}
