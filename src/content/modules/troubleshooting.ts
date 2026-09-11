import type { Module } from '../../types'

export const troubleshooting: Module = {
  id: 'troubleshooting',
  title: 'Print Quality & Troubleshooting',
  blurb: 'A repeatable method for diagnosing failures, plus the usual suspects.',
  icon: '⚠',
  level: 'level-2',
  requires: ['level-1-exam', 'first-layer'],
  lessons: [
    {
      id: 'diagnostic-method',
      title: 'A Method for Diagnosing Failures',
      summary: 'Change one thing at a time and read the evidence.',
      estMinutes: 5,
      type: 'reading',
      body: `Random setting changes turn one problem into three. Use a method.

## 1. Locate it in space and time

- **Where** on the part? First layer, one specific height, overhangs only, one corner, the seam side?
- **When** in the print? From the start, or after N hours (thermal, moisture, or mechanical drift)?

## 2. Classify it

Adhesion, extrusion (too much / too little / inconsistent), cooling/overhang, mechanical (shifts, ringing), or material (moisture, wrong temp).

## 3. Form one hypothesis and test it

Change **one variable**, ideally with a small dedicated test print (temp tower, retraction tower, first-layer patch, overhang comb) rather than re-running the 8-hour part.

## 4. Keep a log

Filament, dry or not, temp, speed, and what you changed. A one-line note per print builds a personal knowledge base faster than any forum.

> "It was fine last week" is a clue, not a mystery. Something changed: humidity, a new spool, a loosened belt, a dirty nozzle, firmware. Find the change.`,
      keyTakeaways: [
        'Pin down where on the part and when in the print the defect appears.',
        'Change one variable at a time, using small test prints.',
        'Keep a short print log — patterns emerge quickly.',
      ],
    },
    {
      id: 'video-print-quality',
      title: 'Watch: A Step-by-Step Print Quality Guide',
      summary: 'Working through print-quality problems methodically, on camera.',
      estMinutes: 18,
      type: 'video',
      provider: 'youtube',
      src: 'YPAXeBuq9qU',
      intro:
        'A walkthrough of diagnosing and fixing common defects — the same one-variable-at-a-time approach from the previous lesson, shown in practice.',
      keyTakeaways: [
        'Match the symptom to a cause before changing anything.',
        'Small dedicated test prints beat re-running the whole part.',
      ],
    },
    {
      id: 'stringing',
      title: 'Stringing & Oozing',
      summary: 'Fine hairs between separate parts of the print.',
      estMinutes: 5,
      type: 'reading',
      body: `Thin wisps of plastic strung across gaps, most visible on parts with many separate towers or letters.

## Root cause

Molten plastic leaks from the nozzle during **travel moves** (non-printing moves).

## Fixes, in order

1. **Dry the filament.** Wet PETG/PLA strings no matter what else you do. Rule this out first.
2. **Retraction distance**: Bowden 3–6 mm, direct drive 0.5–1.5 mm. Run a retraction tower.
3. **Nozzle temperature**: drop in 5 °C steps — hotter plastic is runnier. Temperature tower.
4. **Travel speed**: faster travel gives less time to ooze (150–250 mm/s).
5. **"Combing" / avoid crossing perimeters**: routes travel moves to stay inside the part.
6. **Z-hop** only if you also get nozzle collisions — it adds travel time and can worsen stringing slightly.

> Order matters: moisture and temperature fix far more stringing than cranking retraction ever will.`,
      keyTakeaways: [
        'Stringing is plastic leaking during travel moves.',
        'Check filament dryness and nozzle temperature before touching retraction.',
        'Use retraction and temperature towers to tune methodically.',
      ],
    },
    {
      id: 'warping',
      title: 'Warping & Corner Lift',
      summary: 'The part curls up off the bed, usually at corners.',
      estMinutes: 5,
      type: 'reading',
      body: `As each layer cools it shrinks. Lower layers are pinned to the bed, so the shrinkage stress pulls the edges **up** — worst at sharp corners, worst on large flat parts, worst on high-shrink materials (ABS ≫ PETG > PLA).

## Fixes

- **Heated bed at the right temp** and a clean surface (see the first-layer module).
- **Brim** — 5–10 mm — mechanically holds the edges down.
- **Reduce part cooling** for the first layers (and overall for ABS/PETG).
- **Enclosure** or at least block drafts — keeps the whole part warm so it shrinks evenly. Essentially required for ABS/ASA.
- **Design**: add fillets to sharp corners, or "mouse ears" (small discs) at the corners of a flat part, or split a huge flat part.
- **Material**: if a part warps repeatedly in ABS and does not need the heat resistance, print it in PETG or PLA.`,
      keyTakeaways: [
        'Warping is cooling shrinkage lifting pinned edges, worst at sharp corners on big flat parts.',
        'Brim, reduced cooling, and an enclosure are the main fixes.',
        'High-shrink materials (ABS) warp far more than PLA.',
      ],
    },
    {
      id: 'layer-shift',
      title: 'Layer Shifting & Ringing',
      summary: 'Layers offset partway up; or ghosted echoes near edges.',
      estMinutes: 5,
      type: 'reading',
      body: `## Layer shift

The whole print suddenly steps sideways at some height and continues offset. The motion system **lost steps**.

Causes and fixes:

- **Loose belts** — should sound like a low bass note when plucked; tighten.
- **Nozzle caught on a warped area or a blob** and skipped — fix the underlying warp/blob; enable Z-hop on travel.
- **Printing too fast / accelerations too high** for the machine — reduce speed and acceleration.
- **Stepper driver overheating / current too low** — check driver cooling and Vref.
- **Debris or dry spots on rails/rods** — clean and lubricate.

## Ringing / ghosting

Faint repeating ripples in the surface just after a sharp corner, like an echo. The whole printer frame **vibrated** and the nozzle traced the vibration.

- Lower **acceleration** and **jerk / junction deviation**.
- Make the printer rigid: tighten frame bolts, put it on a solid surface, not a wobbly shelf.
- Enable **input shaping** if your firmware supports it — it cancels the resonance in software.`,
      keyTakeaways: [
        'Layer shift = lost steps: loose belts, collisions, or too-aggressive speed/acceleration.',
        'Ringing/ghosting = frame vibration echoed into the surface after corners.',
        'Lower acceleration/jerk and stiffen the machine; input shaping helps ringing.',
      ],
    },
    {
      id: 'extrusion-issues',
      title: 'Under-, Over-Extrusion & Elephant’s Foot',
      summary: 'Too little plastic, too much plastic, and a bulging base.',
      estMinutes: 6,
      type: 'reading',
      body: `## Under-extrusion

Gaps between lines, thin or missing top layers, visible holes in walls.

- **Partial clog** — cold-pull or replace the nozzle; check for dust burning on the filament.
- **Extruder skipping** — worn drive gear, wrong tension, too-high flow at too-low temp.
- **Temperature too low** for the speed — raise temp or slow down.
- **Wrong filament diameter** set in the slicer (1.75 vs 2.85).
- **Blocked PTFE tube** or a ground-down section of filament.

## Over-extrusion

Blobby surfaces, dimensions too large, rough tops, nozzle dragging through raised plastic.

- **Extrusion multiplier / flow** too high — tune it (target thin-wall test at nominal width).
- Filament diameter mis-measured — measure with calipers, set the true average.
- Temperature too high.

## Elephant’s foot

The bottom few layers bulge outward wider than the rest.

- **First layer squished too hard** (Z-offset too low) — raise it slightly.
- Bed too hot keeping lower layers soft under the weight above — drop bed temp a few degrees after the first layers.
- Enable the slicer’s **"elephant’s foot compensation"** (chamfers the bottom edge in software).`,
      keyTakeaways: [
        'Under-extrusion: clogs, skipping, low temp, or wrong diameter/flow.',
        'Over-extrusion: flow/diameter set too high, or temp too high.',
        'Elephant’s foot: first layer too squished or bed too hot; use compensation.',
      ],
    },
    {
      id: 'adhesion-failures',
      title: 'Spaghetti & Detachment',
      summary: 'The catastrophic failures — and how to catch them early.',
      estMinutes: 4,
      type: 'reading',
      body: `## "Spaghetti"

The printer keeps extruding into the air because the part came off the bed (or a tall part snapped off its base). You return to a bird’s nest of stringy plastic.

Prevention is entirely upstream:

- Nail the **first layer** (its own module) — this prevents the large majority of detachments.
- **Brim** for small footprints and tall narrow parts.
- Reduce **part cooling** on the lower layers so they do not shrink off the bed.
- Watch the first layer; check back in the first 20 minutes.

## Tall part knocked over

A skinny tower or an overhang the nozzle keeps hitting will eventually shear off.

- Add supports or a brim; slow down; enable Z-hop.
- Reorient or add a sacrificial "buttress" in CAD.
- Print multiple tall thin parts **one at a time** (sequential printing) so a knock does not cascade.

## Early-warning tools

Many modern printers have a camera with AI spaghetti detection that pauses the print. Even a cheap webcam you glance at from your phone pays for itself the first time.`,
      keyTakeaways: [
        'Spaghetti = the part detached and the printer kept extruding.',
        'It is prevented upstream: first layer, brim, reduced early cooling, and watching the start.',
        'Sequential printing stops one knocked-over tall part from ruining a whole plate.',
      ],
    },
    {
      id: 'diagnose-it',
      title: 'Checkpoint: Diagnose the Failure',
      summary: 'Scenario quiz — pick the right fix for each symptom.',
      estMinutes: 6,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt:
            'A print of six small separate towers is covered in fine hairs between the towers. Filament is fresh from a sealed bag with desiccant. Best next step?',
          options: [
            'Add a brim',
            'Run a temperature tower and lower the nozzle temp in 5 °C steps',
            'Increase infill density',
            'Increase layer height',
          ],
          answer: 1,
          explanation:
            'Moisture is ruled out (sealed + desiccant). Stringing between separate parts points to temperature and retraction — start with a temp tower.',
        },
        {
          id: 'q2',
          prompt:
            'At about 40 mm up, every layer is shifted 3 mm in X and stays shifted. What happened?',
          options: [
            'Under-extrusion',
            'The X motion lost steps — likely a loose belt, a collision, or too-high acceleration',
            'Warping',
            'Too few top layers',
          ],
          answer: 1,
          explanation:
            'A sudden persistent offset in one axis is lost steps. Check belt tension, look for a blob/warp it snagged on, and reduce speed/acceleration.',
        },
        {
          id: 'q3',
          prompt:
            'The bottom 3 layers of every print bulge out wider than the walls above. Fix?',
          options: [
            'Raise the Z-offset slightly and/or enable elephant’s-foot compensation',
            'Add more walls',
            'Increase print speed',
            'Switch to gyroid infill',
          ],
          answer: 0,
          explanation:
            'That is elephant’s foot — the first layer is over-squished (and/or the bed is too hot). Raise Z-offset a touch and turn on compensation.',
        },
        {
          id: 'q4',
          prompt:
            'Faint repeating ripples appear in the surface just after each sharp corner. Best fix?',
          options: [
            'Dry the filament',
            'Lower acceleration/jerk, stiffen the printer, enable input shaping',
            'Increase nozzle temperature',
            'Add a raft',
          ],
          answer: 1,
          explanation:
            'That is ringing/ghosting — frame vibration. Reduce acceleration and jerk, make the machine rigid, and use input shaping if available.',
        },
        {
          id: 'q5',
          prompt:
            'Walls have visible gaps and the top layers never fully close, on a printer that worked yesterday. Most likely?',
          options: [
            'Too many walls',
            'A partial nozzle clog or extruder skipping — under-extrusion',
            'Bed not level',
            'Layer height too high',
          ],
          answer: 1,
          explanation:
            'Sudden gaps in walls and open tops are under-extrusion. On a previously-working machine, suspect a partial clog or the extruder skipping.',
        },
        {
          id: 'q6',
          prompt:
            'You come back to a bird’s nest of stringy plastic and a part stuck to the side of the nozzle. The root cause was:',
          options: [
            'Too much retraction',
            'The part detached from the bed (or snapped off) and the printer kept extruding',
            'Infill pattern set to grid',
            'The fan running too slowly',
          ],
          answer: 1,
          explanation:
            'Spaghetti means the part left the bed. Fix it upstream: first-layer quality, brim, less early cooling, and watching the start.',
        },
      ],
    },
    {
      id: 'troubleshooting-cards',
      title: 'Flashcards: Symptom → Cause',
      summary: 'Fast recall of the common failure signatures.',
      estMinutes: 5,
      type: 'flashcards',
      cards: [
        { id: 'fc-string', front: 'Fine hairs between separate parts — first two things to check?', back: 'Filament dryness, then nozzle temperature (lower it). Retraction after that.' },
        { id: 'fc-warp', front: 'Corners lifting off the bed — the mechanism and top fixes?', back: 'Cooling shrinkage pulling pinned edges up. Brim, less cooling, enclosure/no drafts, fillet corners.' },
        { id: 'fc-shift', front: 'Print steps sideways at one height and stays offset — cause class?', back: 'Lost steps: loose belt, collision with a blob/warp, or too-high speed/acceleration.' },
        { id: 'fc-ring', front: 'Repeating ripples after sharp corners — name and fix?', back: 'Ringing/ghosting from frame vibration. Lower accel/jerk, stiffen machine, input shaping.' },
        { id: 'fc-under', front: 'Gaps in walls, holes in top layers — name and common causes?', back: 'Under-extrusion: partial clog, extruder skipping, temp too low for speed, wrong filament diameter.' },
        { id: 'fc-efoot', front: 'Bottom layers bulge wider than the walls — name and fix?', back: 'Elephant’s foot. Raise Z-offset slightly, drop bed temp after first layers, enable compensation.' },
        { id: 'fc-pillow', front: 'Holes/bumps on the top surface — cause?', back: 'Too few top solid layers (add 1–2), maybe a little more infill.' },
        { id: 'fc-spaghetti', front: 'Bird’s nest of plastic on return — what actually happened, and where is it fixed?', back: 'Part detached from the bed; printer kept extruding. Fixed upstream: first layer, brim, less early cooling, watch the start.' },
      ],
    },
  ],
}
