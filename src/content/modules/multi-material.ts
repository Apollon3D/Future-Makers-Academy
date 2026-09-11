import type { Module } from '../../types'

export const multiMaterial: Module = {
  id: 'multi-material',
  title: 'Multi-Material & Specialty Printing',
  blurb: 'Printing in more than one material or colour — how the hardware actually does it.',
  icon: '⬡',
  level: 'level-3',
  requires: ['level-2-exam'],
  lessons: [
    {
      id: 'why-multi-material',
      title: 'What Multi-Material Printing Buys You',
      summary: 'Beyond looking cool: real engineering and aesthetic reasons to combine materials.',
      estMinutes: 4,
      type: 'reading',
      body: `A single-material print is a compromise — one filament has to be rigid enough for the structure, flexible enough for a hinge, and the right colour for every label, all at once. Multi-material printing removes that compromise:

- **Soluble supports** — print complex, enclosed, or overhanging geometry with PVA/BVOH supports that dissolve away in water, leaving surfaces a mechanical support could never reach.
- **Mixed stiffness** — a rigid PLA/PETG body with TPU grips, seals, or living-hinge sections in one printed assembly.
- **Multi-colour** — logos, labels, dials, and multi-colour art without painting.
- **Combined properties** — a conductive filament trace embedded in an otherwise insulating part, for simple circuits.

The next lessons cover the hardware approaches: **dual extrusion**, **automatic material systems (AMS/MMU)**, and **single-extruder colour-change** techniques — each with different trade-offs in cost, waste, and reliability.`,
      keyTakeaways: [
        'Multi-material printing removes the "one filament for every requirement" compromise.',
        'Common uses: soluble supports, mixed stiffness in one part, multi-colour, embedded conductive traces.',
      ],
    },
    {
      id: 'dual-extrusion',
      title: 'Dual Extrusion & IDEX',
      summary: 'Two independent hotends, and the two ways machines arrange them.',
      estMinutes: 6,
      type: 'reading',
      body: `## Dual extruder, single toolhead

Two hotends mounted close together on one moving carriage, each with its own filament path. Whichever nozzle is not currently printing must be lifted or otherwise kept clear so it does not drag through the part — handled either by physically raising the idle nozzle or by very precise Z-offset matching between the two.

**Trade-off**: simpler mechanically and cheaper than IDEX, but the idle nozzle still oozes a little near the part, and its dead weight sits on the gantry all the time, affecting speed and ringing.

## IDEX (Independent Dual Extruder)

Each hotend rides its **own** X-axis carriage, fully independent. This unlocks modes a single-carriage dual extruder cannot do:

- **Duplication mode** — both toolheads print an identical part simultaneously, mirrored across the bed, doubling throughput for small parts.
- **Mirror mode** — genuinely mirrored (left/right) parts printed together.
- The idle head parks fully out of the way, eliminating idle-nozzle ooze entirely.

**Trade-off**: more expensive, more complex to calibrate (each carriage needs its own offset calibration), and takes more build volume for the same part size since both carriages need travel room.

## The universal dual-extrusion challenge: oozing and priming

Whichever architecture, switching which nozzle is "live" needs a **priming tower** or **purge/wipe routine** printed off to the side — a small sacrificial structure that catches ooze and re-primes flow before the nozzle returns to the actual part. Skipping this shows up as blobs and colour bleed at every material transition.`,
      keyTakeaways: [
        'A single-carriage dual extruder is simpler but the idle nozzle still oozes near the part.',
        'IDEX gives independent carriages, unlocking duplication/mirror printing and eliminating idle-nozzle ooze.',
        'Any dual-extrusion setup needs a priming tower or purge routine at material transitions.',
      ],
    },
    {
      id: 'ams-mmu',
      title: 'Automatic Material Systems (AMS / MMU)',
      summary: 'Feeding several filaments through one nozzle, automatically.',
      estMinutes: 6,
      type: 'reading',
      body: `Rather than multiple hotends, these systems feed **multiple filaments through a single hotend**, one at a time, automatically swapping which spool is loaded.

## How it works, generally

1. Several spools sit in a feeder unit (Bambu Lab's **AMS**, Prusa's **MMU**, and similar third-party units all follow this pattern).
2. A selector mechanism picks which filament to feed toward the toolhead.
3. When the slicer's G-code calls for a material change, the system retracts the current filament back out of the shared path, then feeds the new one down to the hotend.
4. Like dual extrusion, a **purge** of the old colour/material happens (often into a purge bucket or a printed tower) before the new filament reaches the nozzle cleanly.

## What it is good at

- Many colours from one hotend without the cost or bulk of multiple toolheads.
- Automatic filament-runout continuation — some systems auto-switch to a backup spool of the same material.
- Compact — no second gantry or carriage needed.

## What it costs you

- **Purge waste**: every material swap wastes some filament and time flushing the shared melt path clean — a print with dozens of colour changes can spend a meaningful fraction of its filament and time on purging alone.
- **Single melt path**: unlike true dual extrusion, you cannot print two materials into the same layer simultaneously — swaps are sequential.
- Compatible filament matters: very different melting/printing temperatures between loaded materials can complicate purging and reliability.

## Choosing between the approaches

For **mostly-one-material parts with occasional colour accents**, an AMS/MMU-style system is usually the more practical, lower-cost choice. For **structural multi-material parts** (e.g. rigid body + soluble support, or rigid body + flexible seal) where reliability of the *second* material's properties matters more than color count, dedicated dual extrusion or IDEX is often the more robust choice.`,
      keyTakeaways: [
        'AMS/MMU systems feed multiple filaments through one shared hotend, one at a time.',
        'They excel at multi-colour work but pay a purge-waste cost at every material swap.',
        'True dual extrusion/IDEX suits structural multi-material parts better than an AMS/MMU-style system.',
      ],
    },
    {
      id: 'single-extruder-color',
      title: 'Colour Changes Without a Second Material System',
      summary: 'Manual swaps, colour-change filament, and single-nozzle tricks.',
      estMinutes: 5,
      type: 'reading',
      body: `You do not need dual extrusion or an AMS to get multiple colours — most slicers support a **manual filament change**, called out at a specific layer height.

## Manual colour change

1. In the slicer, add a colour/pause change at the layer height where the new colour should start.
2. The printer pauses, parks the nozzle, and (depending on firmware) may prompt you to change filament.
3. Swap the spool, purge the old colour out by hand (extrude a short length until the new colour flows clean), then resume.

Works on any single-extruder printer, costs nothing extra, but requires you to be present at each swap — impractical for prints with many colour changes.

## Gradient / colour-changing filament

Filament manufactured to shift colour along its length (by distance or by a colour-changing effect from heat/UV) needs **no pauses at all** — you get a gradient or colour effect purely from feeding the spool forward, at the cost of having no control over exactly where each colour lands.

## Vase-mode and single-wall tricks

For single-wall ("vase mode") prints, some slicers support **very short automatic pauses to swap filament** at chosen heights without a full multi-material setup — a lightweight way to get a striped effect on decorative prints.

## When manual swaps make sense

For a one-off gift or display piece with two or three colour bands, a manual pause costs a few minutes of attention and no hardware investment — often the more sensible choice than justifying an AMS purchase for an occasional need.`,
      keyTakeaways: [
        'A manual pause-and-swap at a chosen layer works on any single-extruder printer.',
        'Colour-changing/gradient filament needs no pauses but offers no placement control.',
        'For occasional multi-colour needs, manual swaps often beat investing in extra hardware.',
      ],
    },
    {
      id: 'check-multi-material',
      title: 'Checkpoint: Multi-Material Printing',
      summary: 'Pick the right multi-material approach for the job.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt: 'What is the key hardware difference between a single-carriage dual extruder and IDEX?',
          options: [
            'IDEX uses no hotends at all',
            'IDEX gives each hotend its own independent carriage/axis, enabling duplication and mirror modes',
            'Single-carriage dual extrusion is always faster',
            'There is no real difference',
          ],
          answer: 1,
          explanation: 'Independent carriages let IDEX machines park the idle head fully clear and even print two parts in parallel.',
        },
        {
          id: 'q2',
          prompt: 'AMS/MMU-style systems feed multiple filaments through:',
          options: [
            'Multiple independent hotends simultaneously',
            'One shared hotend, one filament at a time',
            'A single nozzle with no purging needed',
            'Two nozzles printing the same layer at once',
          ],
          answer: 1,
          explanation: 'These systems share a single melt path, swapping which filament feeds into it — always one at a time, with a purge at each swap.',
        },
        {
          id: 'q3',
          prompt: 'The main downside of AMS/MMU-style multi-colour printing is:',
          options: [
            'It cannot produce more than 2 colours',
            'Purge waste and time at every material swap, since the melt path is shared',
            'It requires a completely different slicer',
            'It cannot print PLA',
          ],
          answer: 1,
          explanation: 'Every swap needs the old material purged clean from the shared hotend before the new one is reliable.',
        },
        {
          id: 'q4',
          prompt: 'For a rigid body with a genuinely load-bearing flexible TPU seal, which approach is more robust?',
          options: [
            'An AMS/MMU-style single-hotend system',
            'Dedicated dual extrusion or IDEX',
            'Manual pause-and-swap',
            'Colour-changing gradient filament',
          ],
          answer: 1,
          explanation: 'Structural multi-material parts where the second material’s properties matter benefit from a dedicated, reliable second melt path rather than a shared, purge-dependent one.',
        },
        {
          id: 'q5',
          prompt: 'A manual filament-change pause in the slicer is most sensible for:',
          options: [
            'An unattended overnight print with 40 colour changes',
            'A one-off piece with two or three colour bands and no extra hardware',
            'Structural dual-material parts',
            'Prints that must run fully unattended',
          ],
          answer: 1,
          explanation: 'Manual swaps cost attention at each pause, so they suit occasional, low-change-count jobs rather than frequent or unattended ones.',
        },
      ],
    },
  ],
}
