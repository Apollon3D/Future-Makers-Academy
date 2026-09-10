import type { Module } from '../../types'

export const slicer: Module = {
  id: 'slicer',
  title: 'The Slicer',
  blurb: 'Where every real decision lives: layers, walls, infill, supports, speed, and G-code.',
  icon: '⌘',
  requires: ['fundamentals'],
  lessons: [
    {
      id: 'what-is-slicing',
      title: 'What Slicing Actually Does',
      summary: 'From a watertight mesh to a stack of toolpaths.',
      estMinutes: 5,
      type: 'reading',
      body: `The slicer takes your mesh and does, roughly, this:

1. **Orient and place** the model on the virtual bed.
2. **Slice** it into horizontal layers at your chosen layer height.
3. For each layer, work out the **perimeters** (the outline walls), then fill the enclosed area with **infill**, and cap exposed horizontal areas with **solid top/bottom layers**.
4. Detect steep overhangs and generate **support structures**.
5. Add **adhesion helpers** (skirt/brim/raft), then order all the moves and insert travel moves, retractions, temperature and fan commands.
6. Export **G-code** and estimate time and filament.

## The mental model

Think of every layer as a colouring-book page: the slicer draws the outline first (walls), then fills inside (infill), and only fully colours in the pages where the drawing "ends" and needs a solid surface (top/bottom).

Almost everything you tune is a trade between **time, strength, and appearance**. Keep that triangle in mind for every setting that follows.`,
      keyTakeaways: [
        'The slicer converts a mesh into per-layer walls, infill, solid surfaces, supports, and helpers.',
        'Each layer is drawn outline-first, then filled.',
        'Nearly every setting trades off time vs. strength vs. appearance.',
      ],
    },
    {
      id: 'layer-height',
      title: 'Layer Height',
      summary: 'Interactive: see time, strength, and finish move as you change it.',
      estMinutes: 6,
      type: 'interactive',
      widget: 'slicer-sim',
      intro:
        'Layer height is the vertical thickness of each printed line. It is the setting with the biggest single effect on print time and visible surface quality.',
      body: `## The rules of thumb

- **Thinner layers** (0.10–0.12 mm): smoother curves and slopes, finer detail, *much* longer prints. A 0.1 mm print takes roughly twice as long as the same part at 0.2 mm.
- **Thicker layers** (0.28–0.32 mm): fast and strong (thicker lines bond over more area) but coarse, with pronounced "stair-stepping" on anything not vertical.
- **0.2 mm** is the default for a reason — a good balance for a 0.4 mm nozzle.

## Constraints

- Stay at or below **75–80% of the nozzle diameter**. For a 0.4 mm nozzle, 0.32 mm is a sensible ceiling.
- The **first layer** is usually set thicker (0.24–0.3 mm) regardless, for adhesion tolerance.

Try the simulator: push layer height down and watch print time climb while surface quality improves.`,
    },
    {
      id: 'walls-perimeters',
      title: 'Walls & Perimeters',
      summary: 'Wall count and wall order — the biggest lever for real strength.',
      estMinutes: 5,
      type: 'reading',
      body: `The **walls** (perimeters) are the loops the nozzle traces around the outline of each layer. Wall thickness is *wall count × line width*.

## Why walls matter more than infill

For most functional parts, adding a wall does more for strength — especially stiffness and impact resistance — than raising infill by 20%. Walls are continuous, oriented along the part surface, and carry bending loads well.

- **2 walls (~0.8 mm)**: default, fine for visual parts and light duty.
- **3–4 walls**: functional parts, threads, snap-fits, anything that takes load.
- **5+ walls**: you may be better off just printing the part solid.

## Line width

Usually set to **~120% of nozzle diameter** (0.48 mm for a 0.4 nozzle). Wider lines are stronger and faster; narrower lines resolve finer features.

## Wall order

"Outer wall first" gives the best dimensional accuracy and surface (the outer wall is printed onto solid ground, not squished against inner walls). "Inner first" can improve overhang support. Most slicers default to a sensible hybrid.`,
      keyTakeaways: [
        'Wall thickness = wall count × line width.',
        'Adding walls usually beats adding infill for functional strength.',
        'Use 3–4 walls for load-bearing parts; 2 is fine for display pieces.',
      ],
    },
    {
      id: 'infill',
      title: 'Infill: Density & Pattern',
      summary: 'How the hollow interior is filled, and which pattern to pick.',
      estMinutes: 6,
      type: 'reading',
      body: `Infill is the internal lattice that supports the top surfaces and adds some strength without printing the part solid.

## Density

- **0%**: hollow. Fine for purely decorative shells.
- **10–15%**: default. Enough to hold up flat tops and give a part decent rigidity.
- **20–40%**: functional parts.
- **50–100%**: diminishing returns — strength rises far slower than print time and weight. Above ~50%, consider more walls or a solid part instead.

## Pattern

- **Grid / Lines**: fast, fine for most work, weak against side impacts (the layers of infill are not bonded to each other in Z).
- **Gyroid**: a wavy 3D pattern with near-equal strength in every direction, no internal crossing points, prints without the "ticking" of grid. Excellent default for functional parts; slightly slower.
- **Cubic / Adaptive Cubic**: good omnidirectional strength; adaptive versions add density only where the model needs it, saving time.
- **Triangles / Tri-hexagon**: strong in-plane, good for parts loaded flat.

> For a functional part: 3–4 walls, 20–30% **gyroid** infill. For a display part: 2 walls, 10% grid.`,
      widget: 'infill-compare',
      keyTakeaways: [
        'Infill above ~50% gives poor return — add walls or go solid instead.',
        'Gyroid offers near-equal strength in all directions and is a great functional default.',
        'Grid is fast but weak to side impacts.',
      ],
    },
    {
      id: 'top-bottom',
      title: 'Top & Bottom Layers',
      summary: 'Solid skins, and why "just add more layers" fixes pillowing.',
      estMinutes: 4,
      type: 'reading',
      body: `Wherever a layer has open air above or below it, the slicer replaces infill with **solid** layers to make a closed surface.

## How many?

Specified as a count *and* a minimum thickness. Aim for **≥ 5 top layers** and **≥ 4 bottom layers** at 0.2 mm, or set "minimum shell thickness" to ~1 mm and let the slicer compute the count for your layer height.

## Common failure: pillowing / top gaps

If the top surface has gaps or bumpy "pillows", it is almost always **too few top layers** — the solid skin is trying to bridge across the infill gaps and cannot span them. Fixes, in order:

1. Add top layers (6–7).
2. Raise infill density slightly (more support underneath).
3. Improve part cooling.

## Ironing

An optional top-surface pass where the hot nozzle moves slowly over the finished top with a trickle of flow, smearing it flat and filling micro-gaps. Adds time; gives a near-injection-moulded finish on flat tops.`,
      keyTakeaways: [
        'Solid top/bottom layers close off surfaces exposed to air.',
        'Pillowing/top gaps almost always means too few top layers.',
        'Ironing trades time for a very smooth flat top.',
      ],
    },
    {
      id: 'supports',
      title: 'Supports',
      summary: 'When you need them, support types, and how to make them peel off.',
      estMinutes: 6,
      type: 'reading',
      body: `The nozzle cannot print into thin air. Anything that overhangs more than about **45–50°** from vertical, or bridges too far, needs a **support** structure printed underneath and removed afterwards.

## Support styles

- **Normal / grid**: touches the whole underside of an overhang. Strong, reliable, harder to remove, worse scar.
- **Tree / organic**: branching stems that reach up to just the points that need it. Much less material and faster; better for organic shapes; can struggle with broad flat overhangs.

## Key settings

- **Support Z distance / top gap**: the vertical air gap between support and part. This is the #1 removability setting — ~0.15–0.2 mm for PLA. Too small and it fuses on; too large and the overhang droops.
- **Support overhang threshold**: the angle above which supports are generated. 45° is safe; raise to 55–60° if your printer bridges well, to reduce support.
- **Support interface / roof**: a few dense layers between support and part for a cleaner surface, at the cost of removability.
- **Support-on-build-plate-only**: never build supports on top of the model — avoids scarring visible surfaces.

> Best support is no support. The DfAM module shows how to reorient and redesign parts to avoid them entirely.`,
      keyTakeaways: [
        'Overhangs beyond ~45–50° and long bridges need support.',
        'Tree/organic supports use far less material; normal supports are more reliable for broad flat overhangs.',
        'Support Z distance is the main lever for easy removal.',
      ],
    },
    {
      id: 'adhesion-helpers',
      title: 'Skirt, Brim & Raft',
      summary: 'Three helpers with three different jobs.',
      estMinutes: 3,
      type: 'reading',
      body: `- **Skirt**: a loop printed *around* the part but not touching it. Purges the nozzle and lets you confirm the first layer looks right before the real print starts. Almost always worth having.

- **Brim**: a flat flange printed *attached to* the part’s first layer, extending outward. Adds bed-contact area to fight warping and to anchor tall thin parts. Use 5–8 mm for warpy materials or small footprints. Peels off after.

- **Raft**: a full multi-layer platform printed *under* the entire part. The part prints on top of the raft instead of the bed. Heavy, slow, wastes plastic, and can mar the bottom surface — but rescues prints on a bad bed or with a tiny contact patch. Usually a last resort now that beds and PEI sheets are better.

> Default: skirt on. Add a brim when a part lifts at the corners or has a small footprint. Reach for a raft only when nothing else sticks.`,
      keyTakeaways: [
        'Skirt = nozzle prime + first-layer check, not touching the part.',
        'Brim = extra first-layer flange attached to the part, fights warping and tipping.',
        'Raft = full platform under the part; slow and wasteful, use as a last resort.',
      ],
    },
    {
      id: 'speed-temp',
      title: 'Speed, Temperature & Cooling',
      summary: 'The interacting trio that sets surface quality and strength.',
      estMinutes: 5,
      type: 'reading',
      body: `These three settings are linked — change one and you often need to adjust another.

## Speed

- **Print speed** (40–100+ mm/s for the outer body): faster is more productive but leaves less time for each line to bond and cool, hurting overhangs, detail, and layer adhesion.
- **Outer-wall speed** is often set slower (25–50 mm/s) than infill for a cleaner visible surface.
- **First-layer speed** should always be slow (15–25 mm/s) for adhesion.

## Temperature

- Higher nozzle temp → better layer adhesion (stronger part) but more stringing, worse overhangs, and droopy fine detail.
- Run a **temperature tower** for each new filament and pick the lowest temp that still gives strong layers and clean bridges.
- Higher speed generally needs slightly higher temp to melt filament fast enough.

## Part cooling

- **PLA**: fan to 100% after layer 2–3. Essential for overhangs and detail.
- **PETG**: 30–50%. Too much cooling embrittles layer bonds.
- **ABS/ASA**: near 0% and enclosed. Cooling causes cracking.

> If overhangs curl up and detail looks melted: slow down, cool more, drop temperature 5 °C. If layers split apart: the opposite.`,
      keyTakeaways: [
        'Faster printing costs overhang quality, fine detail, and layer strength.',
        'Higher nozzle temp strengthens layers but worsens stringing and overhangs.',
        'Cooling needs are material-specific: high for PLA, moderate for PETG, near zero for ABS.',
      ],
    },
    {
      id: 'gcode',
      title: 'Reading G-code',
      summary: 'The text the printer actually runs — and why it is worth a look.',
      estMinutes: 5,
      type: 'reading',
      body: `G-code is a plain-text list of commands, one per line. You never write it by hand, but being able to read it demystifies the whole process.

## The commands you will see constantly

\`\`\`
G28            ; home all axes
G1 Z0.3 F600   ; move to Z height, feedrate 600 mm/min
G1 X120 Y100 E5.0 F1800  ; move to X/Y while extruding 5 mm of filament
G1 E-4 F2400   ; retract 4 mm of filament (anti-stringing)
M104 S210      ; set nozzle temperature, do not wait
M109 S210      ; set nozzle temperature and wait
M106 S255      ; part cooling fan to full
\`\`\`

- **G1** is a controlled move. X/Y/Z are positions, **E** is the filament axis, **F** is feedrate (speed).
- A move with an increasing **E** value is extruding; a sudden negative E jump with no X/Y is a **retraction**.
- **M** commands are machine settings (temperature, fan, messages).

## Why bother

- You can read the header your slicer writes to confirm settings actually applied.
- You can spot a bad start G-code (e.g. printing before the bed reaches temperature).
- Toolpath previews in your slicer *are* a visualisation of this G-code — the "X-ray" view showing walls, infill, and travel moves is the single best habit to build before every print.`,
      keyTakeaways: [
        'G-code is a line-by-line list of moves (G1) and machine settings (M).',
        'The E axis is filament; a negative E move with no motion is a retraction.',
        'Always preview the sliced toolpath before printing.',
      ],
    },
    {
      id: 'check-slicer',
      title: 'Checkpoint: The Slicer',
      summary: 'Apply slicer settings to real goals.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt:
            'You want a display model with the smoothest possible curved surface. Which change helps most?',
          options: [
            'Increase infill to 60%',
            'Decrease layer height to 0.12 mm',
            'Add 2 more walls',
            'Increase print speed',
          ],
          answer: 1,
          explanation:
            'Layer height controls stair-stepping on curves and slopes. Infill and walls do not affect visible surface smoothness.',
        },
        {
          id: 'q2',
          prompt:
            'A functional bracket keeps snapping under load. Best first change?',
          options: [
            'Raise infill from 20% to 90%',
            'Increase wall count from 2 to 4',
            'Lower nozzle temperature',
            'Switch infill pattern to lines',
          ],
          answer: 1,
          explanation:
            'Walls contribute more to functional strength than infill. Going from 2 to 4 walls is the efficient fix; 90% infill mostly adds time and weight.',
        },
        {
          id: 'q3',
          prompt: 'The top surface of a print has small holes and bumps. Cause?',
          options: [
            'Too few top solid layers',
            'Layer height too low',
            'Too many walls',
            'Bed temperature too high',
          ],
          answer: 0,
          explanation:
            'Pillowing/top gaps mean the solid skin cannot bridge the infill beneath it — add top layers (and maybe a little infill).',
        },
        {
          id: 'q4',
          prompt: 'Which infill pattern gives the most even strength in all directions?',
          options: ['Grid', 'Lines', 'Gyroid', 'Concentric'],
          answer: 2,
          explanation:
            'Gyroid is a 3D pattern with near-isotropic strength and no weak crossing points.',
        },
        {
          id: 'q5',
          prompt:
            'Supports fuse to the part and are very hard to remove. Which setting do you change?',
          options: [
            'Support overhang threshold angle',
            'Support Z distance / top gap (increase it slightly)',
            'Support pattern',
            'Infill density',
          ],
          answer: 1,
          explanation:
            'The vertical gap between support and part governs removability — increase it toward ~0.2 mm for PLA.',
        },
        {
          id: 'q6',
          prompt: 'A skirt is:',
          options: [
            'A flange attached to the part to fight warping',
            'A loop around but not touching the part, to prime the nozzle and check the first layer',
            'A full platform printed under the part',
            'The solid bottom layers of the part',
          ],
          answer: 1,
          explanation:
            'That attached flange is a brim; the platform under the part is a raft. A skirt just primes and previews.',
        },
      ],
    },
    {
      id: 'slicer-cards',
      title: 'Flashcards: Slicer Settings',
      summary: 'Reinforce the numbers and rules of thumb.',
      estMinutes: 5,
      type: 'flashcards',
      cards: [
        { id: 'fc-lh-default', front: 'Default layer height for a 0.4 mm nozzle, and its ceiling?', back: '0.2 mm default; keep at/below ~75–80% of nozzle = ~0.32 mm max.' },
        { id: 'fc-lh-time', front: 'Roughly how does halving layer height affect print time?', back: 'Roughly doubles it (0.1 mm ≈ 2× the time of 0.2 mm).' },
        { id: 'fc-walls-func', front: 'Wall count for a load-bearing functional part?', back: '3–4 walls. Adding walls beats adding infill for strength.' },
        { id: 'fc-infill-default', front: 'Typical default infill density, and the point of diminishing returns?', back: '10–15% default; above ~50% add walls or go solid instead.' },
        { id: 'fc-gyroid', front: 'Why choose gyroid infill?', back: 'Near-equal strength in all directions, no weak crossing points, quiet printing.' },
        { id: 'fc-top-layers', front: 'Cause of top-surface pillowing/gaps?', back: 'Too few top solid layers (skin cannot bridge the infill).' },
        { id: 'fc-support-z', front: 'Main setting for easy support removal?', back: 'Support Z distance / top gap — ~0.15–0.2 mm for PLA.' },
        { id: 'fc-brim-vs-raft', front: 'Brim vs. raft?', back: 'Brim: flat flange attached to first layer, fights warping/tipping. Raft: full platform under the whole part, last resort.' },
        { id: 'fc-cooling', front: 'Part cooling fan: PLA vs. PETG vs. ABS?', back: 'PLA ~100%, PETG ~30–50%, ABS ~0% (enclosed).' },
        { id: 'fc-first-layer-speed', front: 'First-layer print speed?', back: 'Slow — 15–25 mm/s — for adhesion, regardless of the rest of the print.' },
      ],
    },
  ],
}
