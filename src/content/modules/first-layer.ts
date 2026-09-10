import type { Module } from '../../types'

export const firstLayer: Module = {
  id: 'first-layer',
  title: 'Bed Adhesion & First Layer',
  blurb: 'The first 0.2 mm decides whether the next 10 hours succeed.',
  icon: '▂',
  requires: ['slicer'],
  lessons: [
    {
      id: 'why-first-layer',
      title: 'Why the First Layer Rules Everything',
      summary: 'The single highest-leverage part of any print.',
      estMinutes: 4,
      type: 'reading',
      body: `More failed prints trace back to the first layer than to any other cause. If the first layer is good, most prints just work. If it is bad, nothing above it can recover.

## What "good" looks like

- Lines are **slightly squished** — flat-topped, fused to their neighbours with no gaps between them.
- Uniform across the whole bed: no thin translucent patches, no thick ridged rope.
- Sticks firmly but comes off cleanly once the plate cools or flexes.

## What goes wrong

- **Nozzle too high**: round, separated lines that do not bond; the part detaches mid-print ("it popped off").
- **Nozzle too low**: transparent, scraped-looking lines; ridges; "elephant’s foot"; can clog or gouge the sheet.
- **Uneven**: one corner perfect, the opposite corner not touching — a levelling/tramming problem.

## The habit

Watch the first layer go down, every time. It costs two minutes and saves ten-hour failures. Keep the print paused-ready until the first layer is complete and even.`,
      widget: 'z-offset',
      keyTakeaways: [
        'A good first layer has slightly squished, fully fused, uniform lines.',
        'Too high = poor adhesion; too low = scraping, ridges, elephant’s foot.',
        'Watch every first layer — it is the cheapest insurance in printing.',
      ],
    },
    {
      id: 'tramming',
      title: 'Levelling & Tramming the Bed',
      summary: 'Making the bed physically parallel to the nozzle’s travel plane.',
      estMinutes: 5,
      type: 'reading',
      body: `"Bed levelling" is a misnomer — the bed does not need to be level with gravity, it needs to be **parallel to the plane the nozzle moves in**. Making it parallel is called *tramming*.

## Manual (knob) tramming

1. Heat the bed and nozzle to printing temperature (metal expands — trammed cold ≠ trammed hot).
2. Home the printer, then disable the steppers so you can move the head by hand.
3. Move to each corner in turn. Slide a sheet of paper between nozzle and bed; adjust the knob until you feel a slight drag.
4. Repeat the circuit **2–3 times** — adjusting one corner slightly changes the others.
5. Check the centre.

## Automatic bed levelling (ABL)

A probe (inductive, BLTouch, strain gauge, eddy current) measures a grid of points and the firmware applies a **mesh** correction, nudging Z during the print to follow a warped bed.

ABL compensates for warp — it does **not** set your nozzle-to-bed distance. You still set that with the **Z-offset** (next lesson). Also: a clean nozzle tip and consistent probing temperature matter, or the mesh is garbage.`,
      keyTakeaways: [
        'Tram the bed parallel to the nozzle’s motion plane, at printing temperature.',
        'Re-check corners 2–3 times; adjusting one affects the others.',
        'ABL corrects for a warped bed but does not replace setting the Z-offset.',
      ],
    },
    {
      id: 'z-offset',
      title: 'Dialling In the Z-Offset',
      summary: 'Interactive: adjust first-layer squish and see the result.',
      estMinutes: 5,
      type: 'interactive',
      widget: 'z-offset',
      intro:
        'The Z-offset (or "baby stepping") is the fine adjustment of the gap between nozzle and bed for the first layer. Too much gap and lines will not stick; too little and they scrape and ridge. Adjust the slider and read the cross-section.',
      body: `## Tuning method

1. Start a print of a large, thin **first-layer test patch** (or a big single-layer square).
2. While the first layer prints, adjust the live Z-offset (\`Babystep Z\` / \`Tune → Z-offset\`) in **0.01–0.02 mm** steps.
3. Lower until the lines stop showing gaps and merge into a smooth sheet; stop before they go translucent and ridged.
4. Let it cool, peel it off, look at the **underside**: it should show faint line texture, not shiny smeared plastic (too low) or visible gaps (too high).
5. Save the offset.

A correctly squished first layer is typically about **75–90% of the nominal layer height** in actual thickness.`,
    },
    {
      id: 'surfaces-adhesives',
      title: 'Build Surfaces & Adhesives',
      summary: 'PEI, glass, textured plates, and when to add glue.',
      estMinutes: 5,
      type: 'reading',
      body: `## Common surfaces

- **Smooth PEI (spring steel)**: excellent for PLA and PETG (PETG sticks *too* well — use a release agent). Flex the sheet to release parts. Degrades with finger oils — wipe with **isopropyl alcohol (IPA)**.
- **Textured PEI (powder-coated)**: very forgiving, gives a pleasant matte bottom finish, hides a slightly-too-high first layer. Great default.
- **Glass + adhesive**: dead flat, mirror-smooth bottoms, but needs glue/hairspray and parts can pop off suddenly or crack the glass.
- **Garolite / other**: specialty surfaces for nylon etc.

## Adhesives and why

- **Glue stick (PVA)**: general adhesion boost on any surface; also acts as a *release layer* so PETG/TPU do not weld to PEI or glass.
- **Hairspray / specialty sprays**: strong grip for ABS/ASA and nylon on glass.

## Cleanliness beats everything

The most common "my bed stopped sticking" cause is **skin oil**. Handle sheets by the edges; degrease with IPA (not window cleaner — it leaves residue) before a tricky print.`,
      keyTakeaways: [
        'Textured PEI is the most forgiving everyday surface.',
        'PETG/TPU need a glue-stick release layer on PEI or glass so they do not weld on.',
        'Most sudden adhesion loss is finger oil — degrease with IPA.',
      ],
    },
    {
      id: 'first-layer-checklist',
      title: 'Pre-Print First-Layer Checklist',
      summary: 'Run this before any long or important print.',
      estMinutes: 3,
      type: 'checklist',
      intro:
        'Tick these off before you commit to a multi-hour print. It becomes muscle memory fast.',
      items: [
        { id: 'c1', text: 'Bed surface degreased with IPA (or clean since last handling)', detail: 'Skin oil is the number-one cause of sudden adhesion loss.' },
        { id: 'c2', text: 'Correct surface / adhesive for the material', detail: 'PETG & TPU need a glue-stick release layer on smooth PEI or glass.' },
        { id: 'c3', text: 'Bed and nozzle at material temperature before levelling/probing', detail: 'Metal expands; a cold tram is wrong when hot.' },
        { id: 'c4', text: 'Bed mesh / tram re-checked if the printer was moved or the sheet swapped' },
        { id: 'c5', text: 'Filament confirmed dry and feeding freely', detail: 'No tangles on the spool; dry box lid closed for PETG/TPU/nylon.' },
        { id: 'c6', text: 'Sliced toolpath previewed — first layer, seams, supports look right' },
        { id: 'c7', text: 'Skirt/brim enabled appropriately for the part footprint' },
        { id: 'c8', text: 'Watched the actual first layer go down and confirmed even squish across the bed' },
      ],
    },
    {
      id: 'check-first-layer',
      title: 'Checkpoint: First Layer',
      summary: 'Diagnose first-layer problems.',
      estMinutes: 4,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt:
            'The first-layer lines are round, separated, and you can see the bed between them. The nozzle is:',
          options: ['Too close to the bed', 'Too far from the bed', 'At the right height, but too hot', 'Moving too slowly'],
          answer: 1,
          explanation:
            'Gaps between un-squished, rounded lines mean the gap is too large — lower the Z-offset.',
        },
        {
          id: 'q2',
          prompt: 'Why tram/level the bed at printing temperature?',
          options: [
            'The firmware only allows it when hot',
            'Metal expands when heated, so a cold tram is off once the bed and nozzle reach temperature',
            'The paper gauge only works when warm',
            'It saves time',
          ],
          answer: 1,
          explanation:
            'Thermal expansion changes the geometry — always tram hot, at the temperatures you will print at.',
        },
        {
          id: 'q3',
          prompt: 'Automatic bed levelling (ABL) does what exactly?',
          options: [
            'Sets the ideal nozzle-to-bed distance for you',
            'Physically levels the bed with motors',
            'Measures bed warp and corrects Z during the print to follow it',
            'Replaces the need for a Z-offset',
          ],
          answer: 2,
          explanation:
            'ABL builds a height mesh and compensates for warp. You still set the overall nozzle-to-bed distance via the Z-offset.',
        },
        {
          id: 'q4',
          prompt: 'Your smooth PEI sheet suddenly will not hold PLA. Most likely fix?',
          options: [
            'Increase bed temperature by 20 °C',
            'Degrease the sheet with isopropyl alcohol',
            'Switch to a raft',
            'Add 6 more brim lines',
          ],
          answer: 1,
          explanation:
            'Finger oil is the usual culprit. IPA restores the surface; window cleaner leaves residue and makes it worse.',
        },
        {
          id: 'q5',
          prompt: 'Printing PETG directly on smooth PEI with no release agent risks:',
          options: [
            'Warping at the corners',
            'The part welding to the sheet and tearing out a chunk on removal',
            'Under-extrusion',
            'Excess stringing',
          ],
          answer: 1,
          explanation:
            'PETG bonds extremely hard to bare PEI. Use a glue-stick layer or a textured plate as a release barrier.',
        },
      ],
    },
  ],
}
