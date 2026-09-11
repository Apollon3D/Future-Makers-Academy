import type { Module } from '../../types'

export const level2Exam: Module = {
  id: 'level-2-exam',
  title: 'Level 2 Exam: Practitioner',
  blurb: 'Covers First Layer, Troubleshooting, Post-Processing, and Maintenance. Pass to earn your Practitioner certificate.',
  icon: '🎓',
  level: 'level-2',
  isExam: true,
  requires: ['first-layer', 'troubleshooting', 'post-processing', 'maintenance-care'],
  lessons: [
    {
      id: 'about-exam',
      title: 'Before You Start',
      summary: 'Format, scope, and what passing unlocks.',
      estMinutes: 2,
      type: 'reading',
      body: `## What this covers

Questions are drawn from all four Level 2 modules: **Bed Adhesion & First Layer**, **Print Quality & Troubleshooting**, **Post-Processing & Finishing**, and **Printer Maintenance & Care**.

## Passing

**80%** is required, with unlimited attempts. This level leans heavily on diagnosis — expect scenario-style questions, not just definitions.

## What passing unlocks

- A **Level 2: Practitioner certificate**.
- Every Level 3 module (**Design for FDM**, **Advanced Calibration & Tuning**, **Multi-Material & Specialty Printing**).`,
    },
    {
      id: 'exam',
      title: 'Level 2 Exam',
      summary: 'First layer, troubleshooting, finishing, and maintenance — 80% to pass.',
      estMinutes: 14,
      type: 'quiz',
      passScore: 80,
      questions: [
        {
          id: 'q1',
          prompt: 'A first layer with round, separated lines you can see the bed through means the nozzle is:',
          options: ['Too close to the bed', 'Too far from the bed', 'The right height but too cold', 'Moving too fast'],
          answer: 1,
          explanation: 'Gaps between un-squished lines mean the gap is too large — lower the Z-offset.',
        },
        {
          id: 'q2',
          prompt: 'Why tram/level the bed at printing temperature rather than cold?',
          options: [
            'Firmware requires it',
            'Thermal expansion changes the geometry once heated',
            'It is faster',
            'Cold levelling damages the sensor',
          ],
          answer: 1,
          explanation: 'Metal expands with heat; a cold tram will be off once bed and nozzle reach temperature.',
        },
        {
          id: 'q3',
          prompt: 'Automatic bed levelling (ABL) primarily:',
          options: [
            'Sets your ideal nozzle-to-bed distance for you',
            'Measures bed warp and compensates for it with a height mesh',
            'Replaces the need for a Z-offset entirely',
            'Physically flattens the bed with motors',
          ],
          answer: 1,
          explanation: 'ABL builds a correction mesh for warp; you still set the overall Z-offset separately.',
        },
        {
          id: 'q4',
          prompt: 'Fine hairs strung between separate towers on freshly dried, sealed filament point first to:',
          options: ['Moisture', 'Temperature or retraction settings', 'Bed temperature', 'Layer height'],
          answer: 1,
          explanation: 'With moisture ruled out, temperature and retraction are the next things to tune for stringing.',
        },
        {
          id: 'q5',
          prompt: 'A print shifts sideways at one height and stays offset. This is caused by:',
          options: [
            'Under-extrusion',
            'Lost steps — a loose belt, collision, or too-aggressive speed/acceleration',
            'Too few top layers',
            'Bed adhesion failure',
          ],
          answer: 1,
          explanation: 'A sudden, persistent positional offset in one axis is the signature of lost steps.',
        },
        {
          id: 'q6',
          prompt: 'Ringing/ghosting after sharp corners is best reduced by:',
          options: [
            'Increasing nozzle temperature',
            'Lowering acceleration/jerk and stiffening the frame (input shaping if available)',
            'Adding a raft',
            'Drying the filament',
          ],
          answer: 1,
          explanation: 'Ringing is frame vibration; reducing acceleration and adding rigidity (or input shaping) addresses the cause.',
        },
        {
          id: 'q7',
          prompt: 'The bottom few layers of every print bulge wider than the walls above (elephant’s foot). The fix is to:',
          options: [
            'Lower the Z-offset further',
            'Raise the Z-offset slightly and/or enable elephant’s-foot compensation',
            'Increase infill',
            'Switch infill pattern',
          ],
          answer: 1,
          explanation: 'Elephant’s foot comes from an over-squished first layer (or too-hot bed) — raise the offset and/or use compensation.',
        },
        {
          id: 'q8',
          prompt: 'Sanding a print before painting should proceed:',
          options: [
            'Fine grit first, then coarse',
            'Coarse grit first, progressing to fine — each grit removes the previous one’s scratches',
            'With one grit throughout',
            'Only with wet sanding, never dry',
          ],
          answer: 1,
          explanation: 'Working coarse-to-fine ensures each step removes the scratches the previous, rougher step left behind.',
        },
        {
          id: 'q9',
          prompt: 'Acetone vapor smoothing is effective on:',
          options: ['PLA', 'PETG', 'ABS/ASA', 'Nylon'],
          answer: 2,
          explanation: 'Acetone dissolves and re-flows ABS/ASA specifically; it does not work this way on PLA or PETG.',
        },
        {
          id: 'q10',
          prompt: 'A heat-set insert is installed by:',
          options: [
            'Gluing it in place',
            'Melting it into an undersized hole with a heated tool',
            'Screwing it in like a bolt',
            'Freezing it and press-fitting',
          ],
          answer: 1,
          explanation: 'Heat melts the surrounding plastic so it re-solidifies around the insert’s knurling.',
        },
        {
          id: 'q11',
          prompt: 'Which of these should be lubricated?',
          options: ['V-slot POM wheels', 'GT2 belts', 'A leadscrew, with an appropriate grease', 'The bed surface'],
          answer: 2,
          explanation: 'Leadscrews benefit from grease; wheels run dry by design and belts should never be lubricated.',
        },
        {
          id: 'q12',
          prompt: 'A printer that ran fine for hours suddenly starts jamming and clicking. First suspect:',
          options: ['The slicer profile', 'The hotend cooling fan (heat creep)', 'The bed surface', 'The Wi-Fi module'],
          answer: 1,
          explanation: 'New jamming after a healthy stretch is the classic heat-creep signature from a slowing hotend fan.',
        },
        {
          id: 'q13',
          prompt: 'A heated-bed connector that runs noticeably warm to the touch during a print is:',
          options: [
            'Completely normal',
            'A warning sign of a loose/resistive connection worth investigating before the next print',
            'Only a concern above 100 °C',
            'Fixed by increasing bed temperature',
          ],
          answer: 1,
          explanation: 'Unusual heat at a connector indicates resistance under high current — a fire-risk warning sign.',
        },
        {
          id: 'q14',
          prompt: 'You return to a bird’s-nest of stringy plastic with no part on the bed. The underlying cause was most likely:',
          options: [
            'Too much retraction',
            'The part detached from the bed (or snapped) and the printer kept extruding',
            'The infill pattern',
            'The part cooling fan',
          ],
          answer: 1,
          explanation: 'Spaghetti failures happen upstream — the part left the bed, and the fix is first-layer quality, brim, and watching the start.',
        },
      ],
    },
  ],
}
