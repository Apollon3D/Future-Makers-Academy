import type { Module } from '../../types'

export const advancedCalibration: Module = {
  id: 'advanced-calibration',
  title: 'Advanced Calibration & Tuning',
  blurb: 'Move past factory defaults: measure your printer and tune it to what it actually does.',
  icon: '⌖',
  level: 'level-3',
  requires: ['level-2-exam'],
  lessons: [
    {
      id: 'why-calibrate',
      title: 'Defaults Are a Starting Point, Not a Target',
      summary: 'Why identical printer models still need individual calibration.',
      estMinutes: 4,
      type: 'reading',
      body: `Two printers of the exact same model, fresh out of the same factory, can still extrude measurably different amounts of plastic for the same commanded move — small variances in the extruder gear, the motor, even the filament diameter all stack up. Slicer and firmware defaults describe an *average* machine; calibration measures *your* machine and corrects for the difference.

## The calibration ladder

Each of the next lessons builds on the one before it — do them in order, since a wrong value earlier will make later measurements misleading:

1. **Extruder steps (E-steps)** — is the extruder feeding the length of filament it thinks it is?
2. **Flow / extrusion multiplier** — accounting for filament diameter variance and any remaining volumetric error.
3. **Retraction** — tuned in the context of your now-accurate extrusion.
4. **Pressure / linear advance** — timing extrusion around accelerations, once the base extrusion amount is trustworthy.
5. **Input shaping** — a firmware-level fix for a mechanical problem (resonance), independent of the extrusion chain but usually tuned around the same time.

> Recalibrate E-steps and flow whenever you change extruder hardware, and re-check pressure advance / input shaping after any change to the toolhead's weight or the frame's rigidity.`,
      keyTakeaways: [
        'Identical printer models still vary machine-to-machine — defaults are an average, not a measurement of yours.',
        'Calibrate in order: E-steps, then flow, then retraction, then pressure advance, then input shaping.',
        'Recalibrate after hardware changes that could affect the step being tuned.',
      ],
    },
    {
      id: 'esteps-flow',
      title: 'E-Steps & Flow Calibration',
      summary: 'Make the extruder push exactly the length of filament it is told to.',
      estMinutes: 7,
      type: 'reading',
      body: `## E-steps: how far, not how much

**E-steps/mm** is the number of motor steps the firmware uses to feed one millimetre of filament. If it is wrong, *every* extrusion-related setting downstream is being fed bad information.

### The 100 mm method

1. Heat the hotend so filament can move freely, but don't extrude yet.
2. Mark the filament **120 mm** above the extruder's entry point (a spot you can measure back to).
3. Command the firmware to extrude exactly **100 mm** (\`M83\` then \`G1 E100 F100\` on Marlin, or your firmware's extrude-test command) at a slow, controlled speed.
4. Measure the remaining distance from the entry point to your mark. Subtract from 120 mm to get the **actual** length fed.
5. Compute the corrected value:

\`\`\`
new_e_steps = current_e_steps × (100 / actual_mm_extruded)
\`\`\`

Example: current E-steps = 93, actual extruded = 92 mm → new = 93 × (100/92) ≈ **101.1**. Save it (\`M92 E101.1\` then \`M500\` on Marlin) and re-test to confirm.

## Flow / extrusion multiplier: how much, not how far

Once E-steps are correct, **flow** (also called extrusion multiplier or flow rate) fine-tunes the *volume* actually deposited — it compensates for filament diameter tolerance and any remaining systematic over/under-extrusion.

### The single-wall-thickness test

1. Slice and print a simple tall single-wall test (a thin rectangular tube, one wall thick, no top/bottom).
2. With calipers, measure the wall thickness at several points and average it.
3. Compare to the wall thickness the slicer intended (usually your nozzle diameter, or line width if you set one).
4. Adjust flow proportionally: \`new_flow = old_flow × (expected_thickness / measured_thickness)\`.

Retest after any large change — flow and E-steps interact, and getting both right (rather than using one to paper over an error in the other) gives the most consistent results across different print speeds and infill densities.`,
      keyTakeaways: [
        'E-steps calibration corrects how far the extruder thinks it is feeding filament.',
        'new_e_steps = current × (100 / actual measured mm)',
        'Flow calibration then corrects the volume via a measured single-wall thickness test.',
      ],
    },
    {
      id: 'retraction-tuning',
      title: 'Systematic Retraction Tuning',
      summary: 'A repeatable method instead of guessing numbers.',
      estMinutes: 5,
      type: 'reading',
      body: `You met retraction as a stringing fix in the Troubleshooting module. Here is the calibration method properly, now that extrusion itself is trustworthy.

## The retraction tower

Most slicers can generate (or you can find online) a **retraction tower**: a single tall model where retraction distance (or sometimes speed) changes every few layers, clearly labelled by height. Print one, then:

1. Inspect each labelled section for stringing between the tower's features.
2. Find the **lowest** retraction distance where stringing disappears — going higher than necessary adds wear on the extruder gear and, on Bowden setups, adds latency to every retraction.
3. Do the same sweep for **retraction speed**: too slow strings; too fast (especially direct drive) can strip the filament against the drive gear or cause the "no-load" clatter of a skipped step.

## Typical starting ranges

- **Direct drive**: 0.5–2 mm distance, 25–45 mm/s speed.
- **Bowden**: 3–7 mm distance, 25–45 mm/s speed.

These ranges exist because of tube slack (Bowden) versus a short, stiff path (direct drive) — not because one number is universally "correct."

## Diminishing returns

Past the point where stringing stops, more retraction does not improve anything further — it only adds risk (grinding, heat-creep from the filament repeatedly withdrawing past the heat break). Stop tuning once test strings vanish.`,
      keyTakeaways: [
        'A retraction tower finds the lowest distance/speed that eliminates stringing.',
        'Direct drive needs much less retraction distance than Bowden.',
        'More retraction past the point of no stringing adds risk without adding benefit.',
      ],
    },
    {
      id: 'pressure-advance',
      title: 'Pressure Advance / Linear Advance',
      summary: 'Compensating for the "spring" of pressurised molten plastic.',
      estMinutes: 6,
      type: 'reading',
      body: `## The problem it solves

Molten plastic in the nozzle behaves a little like a compressed spring: when the toolhead accelerates into a fast, wide extrusion, pressure has to build before flow catches up — leaving a thin start. When it decelerates into a corner, the still-pressurised nozzle keeps oozing for a moment — leaving a blob. This shows up as **bulging corners** and **thin line starts**, and it happens even with perfect retraction, because it is a *pressure* problem, not a *stringing-between-parts* problem.

Marlin calls this **Linear Advance**; Klipper calls it **Pressure Advance** — same underlying idea, different firmware, different unit for the tuning constant.

## What it actually does

The firmware predicts upcoming accelerations/decelerations from the toolpath and adjusts extruder position slightly *ahead of time* — pushing a bit more filament just before speeding up, backing off just before slowing down — so the pressure in the nozzle tracks the intended flow instead of lagging behind it.

## The K-factor

A single tuning constant controls how aggressively this compensation is applied:

- **Direct drive**: typically a small K value (short, stiff filament path needs less compensation).
- **Bowden**: typically a larger K value (the longer, more compliant tube path needs more).

Both firmwares provide a **pattern-based calibration test** (a tower or a zig-zag pattern printed at a sweep of K values) — you pick the value that gives the sharpest corners and most even line width, the same "print a test, read off the best result" method as the retraction tower.

## When to redo it

Any change to the toolhead's extrusion path — a new hotend, switching Bowden/direct drive, a different nozzle diameter — changes the "spring" being compensated for, and the K-factor should be re-tuned.`,
      keyTakeaways: [
        'Pressure/Linear Advance compensates for pressure lag in the melt, fixing corner bulging and thin line starts.',
        'It adjusts extruder position ahead of accelerations/decelerations based on the toolpath.',
        'The K-factor is tuned with a printed test pattern; Bowden setups need a larger K than direct drive.',
      ],
    },
    {
      id: 'input-shaping',
      title: 'Input Shaping (Resonance Compensation)',
      summary: 'A firmware fix for ringing that does not require slowing down.',
      estMinutes: 6,
      type: 'reading',
      body: `You met **ringing/ghosting** in Troubleshooting as a mechanical problem solved by lowering acceleration and stiffening the frame. Input shaping attacks the same problem from the firmware side.

## The idea

Every frame has natural resonant frequencies — hit them with a sharp direction change and the structure vibrates briefly at that frequency, and the nozzle traces that vibration into the print as fading ripples. Input shaping (available in Klipper, and in some other modern firmwares) **measures** those frequencies and then deliberately splits each move into multiple smaller, precisely timed impulses whose vibrations cancel each other out — instead of avoiding the vibration by moving slowly, it cancels the vibration while still moving fast.

## How it is measured

Firmwares that support it typically pair with a small **accelerometer** (clipped to the toolhead, then to the bed) that records actual vibration during a series of test moves. The firmware analyses that data to find the resonant frequency per axis and picks (or lets you pick) a shaping algorithm tuned to it.

Without an accelerometer, some tools estimate reasonable values from a printed ringing test (similar in spirit to the belt-tension pluck test, but with software analysis rather than by ear) — less precise, but still an improvement over untuned defaults.

## What it changes and what it doesn't

Input shaping meaningfully reduces ringing at a given speed and can let a rigid, well-built machine run faster without new ringing appearing. It does **not** fix a genuinely loose, wobbly frame — cancelling vibration in software works far better on a mechanically sound structure than on one with real physical play, so the frame and wheel-preload checks from the Maintenance module still matter first.`,
      keyTakeaways: [
        'Input shaping cancels resonant vibration by splitting moves into timed impulses, rather than avoiding it by slowing down.',
        'It is typically measured with an accelerometer that records real vibration data per axis.',
        'It improves a mechanically sound machine; it does not replace fixing a loose or wobbly frame.',
      ],
    },
    {
      id: 'check-calibration',
      title: 'Checkpoint: Advanced Calibration',
      summary: 'Apply the calibration ladder to real scenarios.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt: 'Current E-steps are 100. A 100 mm extrusion test actually measures 95 mm fed. The corrected E-steps value is closest to:',
          options: ['95', '100', '105', '90'],
          answer: 2,
          explanation: 'new = 100 × (100/95) ≈ 105.3 — the extruder is under-feeding, so E-steps must increase.',
        },
        {
          id: 'q2',
          prompt: 'Why calibrate E-steps before flow / extrusion multiplier?',
          options: [
            'They are unrelated and order does not matter',
            'Flow calibration corrects volume on top of a distance that should already be accurate, or the two errors get tangled together',
            'Flow calibration is not necessary if E-steps is correct',
            'Firmware requires E-steps to be set first or it will not boot',
          ],
          answer: 1,
          explanation: 'Getting E-steps right first means flow calibration is correcting the real remaining volumetric error, not compensating for a distance error.',
        },
        {
          id: 'q3',
          prompt: 'Bulging corners and thin line starts, even with well-tuned retraction, are best addressed by:',
          options: ['More retraction distance', 'Pressure Advance / Linear Advance', 'A cooler nozzle', 'A slower first layer'],
          answer: 1,
          explanation: 'That symptom is a pressure/timing issue, which Pressure/Linear Advance is specifically designed to correct.',
        },
        {
          id: 'q4',
          prompt: 'Input shaping reduces ringing by:',
          options: [
            'Slowing down every move near corners',
            'Splitting moves into timed impulses that cancel the frame’s resonant vibration',
            'Increasing part cooling fan speed',
            'Adding more infill for rigidity',
          ],
          answer: 1,
          explanation: 'It is a firmware technique that cancels vibration via precisely timed impulses, rather than avoiding it by moving slowly.',
        },
        {
          id: 'q5',
          prompt: 'A Bowden printer typically needs a __ K-factor than a direct-drive printer for Pressure/Linear Advance.',
          options: ['Larger', 'Smaller', 'Identical', 'Negative'],
          answer: 0,
          explanation: 'The longer, more compliant Bowden filament path needs more compensation, i.e. a larger K value.',
        },
      ],
    },
    {
      id: 'calibration-cards',
      title: 'Flashcards: Calibration Ladder',
      summary: 'Recall the order, methods, and formulas.',
      estMinutes: 4,
      type: 'flashcards',
      cards: [
        { id: 'fc-order', front: 'What order should you calibrate: E-steps, flow, retraction, pressure advance, input shaping?', back: 'That is the order — each later step assumes the earlier ones are already correct.' },
        { id: 'fc-esteps-formula', front: 'E-steps correction formula?', back: 'new_e_steps = current_e_steps × (100 / actual_mm_extruded)' },
        { id: 'fc-flow-test', front: 'How do you calibrate flow/extrusion multiplier?', back: 'Print a single-wall test, measure wall thickness with calipers, scale flow by (expected / measured) thickness.' },
        { id: 'fc-retract-ranges', front: 'Typical retraction distance: direct drive vs. Bowden?', back: 'Direct drive ~0.5–2 mm; Bowden ~3–7 mm.' },
        { id: 'fc-pa-symptom', front: 'Symptom that points specifically at Pressure/Linear Advance?', back: 'Bulging corners and thin line starts that persist even with good retraction — a pressure/timing issue, not a stringing-between-parts one.' },
        { id: 'fc-shaping-tool', front: 'What is typically used to measure resonance for input shaping?', back: 'An accelerometer clipped to the toolhead (then the bed) during a series of test moves.' },
      ],
    },
  ],
}
