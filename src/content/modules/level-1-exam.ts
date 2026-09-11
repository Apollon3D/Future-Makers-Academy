import type { Module } from '../../types'

export const level1Exam: Module = {
  id: 'level-1-exam',
  title: 'Level 1 Exam: Foundations',
  blurb: 'A comprehensive check across Fundamentals, Materials, and The Slicer. Pass to earn your Foundations certificate.',
  icon: '🎓',
  level: 'level-1',
  isExam: true,
  requires: ['fundamentals', 'materials', 'slicer'],
  lessons: [
    {
      id: 'about-exam',
      title: 'Before You Start',
      summary: 'Format, scope, and what passing unlocks.',
      estMinutes: 2,
      type: 'reading',
      body: `## What this covers

This exam draws questions from all three Level 1 modules: **FDM Fundamentals**, **Filament & Materials**, and **The Slicer**. If a question stumps you, that is useful information — it names exactly which lesson to revisit before retrying.

## Passing

You need **80%** to pass — higher than a normal module checkpoint, because this exam certifies the whole level, not one lesson. There is no limit on attempts; review the modules and try again if you don't clear it the first time.

## What passing unlocks

- A **Level 1: Foundations certificate**, viewable and printable from the Certificates page.
- Every Level 2 module (**Bed Adhesion & First Layer**, **Print Quality & Troubleshooting**, **Post-Processing & Finishing**, **Printer Maintenance & Care**).

Take your time — there's no clock on this.`,
    },
    {
      id: 'exam',
      title: 'Level 1 Exam',
      summary: 'Foundations, Materials, and The Slicer — 80% to pass.',
      estMinutes: 12,
      type: 'quiz',
      passScore: 80,
      questions: [
        {
          id: 'q1',
          prompt: 'FDM stands for:',
          options: ['Fast Deposition Method', 'Fused Deposition Modelling', 'Filament Drive Mechanism', 'Full Density Manufacturing'],
          answer: 1,
          explanation: 'Fused Deposition Modelling — melting and depositing filament layer by layer.',
        },
        {
          id: 'q2',
          prompt: 'The heat break\'s job is to:',
          options: [
            'Melt the filament',
            'Keep the melt zone short so filament stays solid until near the nozzle',
            'Cool the printed part',
            'Measure nozzle temperature',
          ],
          answer: 1,
          explanation: 'It resists heat travelling up the filament path, preventing premature softening and jams.',
        },
        {
          id: 'q3',
          prompt: 'A mesh file (STL/3MF) contains:',
          options: [
            'Only the surface geometry of a model, no print instructions',
            'The full G-code toolpath',
            'Slicer settings',
            'Material temperature data',
          ],
          answer: 0,
          explanation: 'Meshes describe the surface as triangles — the slicer decides how to actually print it.',
        },
        {
          id: 'q4',
          prompt: 'Which material softens around 55–60 °C and should never sit in a hot car?',
          options: ['ABS', 'ASA', 'PLA', 'Nylon'],
          answer: 2,
          explanation: 'PLA has by far the lowest heat resistance of the common filaments.',
        },
        {
          id: 'q5',
          prompt: 'PETG generally needs __ part cooling than PLA.',
          options: ['More', 'Less', 'The same amount of', 'No'],
          answer: 1,
          explanation: 'PETG wants roughly 30–50% cooling versus PLA’s ~100% — too much cooling embrittles PETG layers.',
        },
        {
          id: 'q6',
          prompt: 'Why does PETG often need a release agent or textured plate on smooth PEI?',
          options: [
            'It never sticks to anything',
            'It bonds so aggressively it can tear the PEI sheet on removal',
            'It requires a heated chamber',
            'It reacts chemically with PEI',
          ],
          answer: 1,
          explanation: 'PETG welds hard to bare smooth PEI; a release layer or textured surface prevents damage.',
        },
        {
          id: 'q7',
          prompt: 'Doubling print quality by halving layer height from 0.2 mm to 0.1 mm roughly:',
          options: ['Halves print time', 'Doubles print time', 'Has no effect on time', 'Only affects the first layer'],
          answer: 1,
          explanation: 'Twice as many layers means roughly twice the time for the same part.',
        },
        {
          id: 'q8',
          prompt: 'For a load-bearing functional part, which change generally adds strength most efficiently?',
          options: ['Raising infill from 20% to 90%', 'Adding more walls', 'Increasing print speed', 'Switching to concentric infill'],
          answer: 1,
          explanation: 'Walls contribute more strength per minute of print time than very high infill.',
        },
        {
          id: 'q9',
          prompt: 'Which infill pattern has near-equal strength in every direction with no weak crossing points?',
          options: ['Grid', 'Lines', 'Gyroid', 'Concentric'],
          answer: 2,
          explanation: 'Gyroid is a 3D wave pattern that is close to isotropic and prints without hard crossing points.',
        },
        {
          id: 'q10',
          prompt: 'Pillowing / gaps on a top surface almost always means:',
          options: ['Too much infill', 'Too few top solid layers', 'Nozzle too hot', 'Bed not level'],
          answer: 1,
          explanation: 'The solid skin cannot bridge the infill gaps beneath it without enough top layers.',
        },
        {
          id: 'q11',
          prompt: 'A skirt (as opposed to a brim or raft) is:',
          options: [
            'A flange attached to the part, fighting warping',
            'A loop printed around, not touching, the part — primes the nozzle and previews the first layer',
            'A full platform under the entire part',
            'The bottom solid layers of the part itself',
          ],
          answer: 1,
          explanation: 'A skirt purges the nozzle and lets you check the first layer before the real print starts.',
        },
        {
          id: 'q12',
          prompt: 'On a G-code line, a negative jump in the E value with no X/Y movement represents:',
          options: ['A layer change', 'A retraction', 'A temperature change', 'A fan speed change'],
          answer: 1,
          explanation: 'E is the filament axis; retracting means pulling filament back with no accompanying travel.',
        },
        {
          id: 'q13',
          prompt: 'Support Z distance (top gap) mainly controls:',
          options: ['How much filament is used overall', 'How easily supports separate from the part', 'Bed adhesion', 'Print speed'],
          answer: 1,
          explanation: 'The vertical air gap between support and part is the main lever for clean, easy removal.',
        },
        {
          id: 'q14',
          prompt: 'Which is a genuinely accurate reason to choose ASA over PLA for an outdoor bracket?',
          options: [
            'ASA is easier to print',
            'ASA has meaningfully better UV and heat resistance for sustained outdoor exposure',
            'ASA requires no enclosure',
            'ASA is cheaper',
          ],
          answer: 1,
          explanation: 'ASA is the UV-stable, heat-resistant choice for real outdoor use — PLA would soften and degrade.',
        },
      ],
    },
  ],
}
