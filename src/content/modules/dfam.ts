import type { Module } from '../../types'

export const dfam: Module = {
  id: 'dfam',
  title: 'Design for FDM (DfAM)',
  blurb: 'Design parts that print well: orientation, overhangs, tolerances, and avoiding supports.',
  icon: '◈',
  level: 'level-3',
  requires: ['level-2-exam'],
  lessons: [
    {
      id: 'anisotropy',
      title: 'Orientation & the Layer-Adhesion Weakness',
      summary: 'FDM parts are much weaker across layers than along them.',
      estMinutes: 6,
      type: 'reading',
      body: `An FDM part is not a solid block — it is a stack of welded lines. Those welds between layers are the weakest link.

## Anisotropy

- **Along the layers (X/Y)**: the plastic is nearly as strong as the raw material.
- **Across the layers (Z)**: often only **30–60%** as strong. A load that tries to peel layers apart will split the part along a layer line.

## Design consequences

- **Orient the part so the main load runs along the layers, not across them.** A hook should be printed lying on its back so the pull is in-plane, not standing up so the pull peels layers.
- Where a part *must* take load across layers, compensate: more walls, higher temperature for better weld, thicker sections, generous fillets to spread stress.
- Threads, pins, and snap-fit arms are all layer-adhesion-critical — think about their orientation before you slice.

## The trade with surface and support

The strongest orientation often needs the most support or puts the ugly seam on a visible face. Designing for FDM is constantly balancing strength vs. supports vs. finish — there is rarely a free lunch, only an informed choice.`,
      keyTakeaways: [
        'FDM parts are 30–60% weaker across layers than along them.',
        'Orient parts so the main load runs along the layer lines.',
        'Where cross-layer load is unavoidable, add walls, heat, thickness, and fillets.',
      ],
    },
    {
      id: 'video-design-tips',
      title: 'Watch: Designing the Best 3D Printed Parts',
      summary: 'A tour of design-for-FDM tips: orientation, overhangs, tolerances, and more.',
      estMinutes: 14,
      type: 'video',
      provider: 'youtube',
      src: '2_nVzoHC9YM',
      intro:
        'An overview of the design habits this module unpacks one by one. Watch it first for the big picture, then work through the lessons.',
      keyTakeaways: [
        'Orientation is decided before you slice — it drives strength, supports and finish.',
        'Most forced overhangs can be designed away with chamfers and teardrops.',
      ],
    },
    {
      id: 'overhangs',
      title: 'The 45° Rule & Overhangs',
      summary: 'Interactive: sweep the overhang angle and watch it fail.',
      estMinutes: 5,
      type: 'interactive',
      widget: 'overhang-dial',
      intro:
        'Each layer is laid partly on top of the one below. If a wall leans out too far, each new line has too little support under it, droops, and curls. Sweep the angle and see where a well-tuned printer stops coping.',
      body: `## The rule

Measured from vertical: walls up to about **45°** print cleanly on most machines. Many well-cooled printers manage **55–60°**. Past that, the surface roughens and then fails.

## Designing around it

- **Chamfer instead of overhang**: replace a flat horizontal underside with a 45° chamfer and it needs no support.
- **Teardrop holes**: a horizontal hole’s top half is a severe overhang — reshape it into a teardrop/pointed arch so every part is ≤ 45°.
- **Split and glue / print in two orientations**: cut the model where a joint is invisible and print each half flat-side-down.
- **Filleted transitions**: a gradual curve up to a flat top prints far better than a sharp step.`,
    },
    {
      id: 'bridging',
      title: 'Bridging',
      summary: 'Printing a flat span across a gap with nothing underneath.',
      estMinutes: 4,
      type: 'reading',
      body: `A **bridge** is a straight run of extrusion between two supported ends with open air below. Surface tension and fast cooling let the strand hold itself up — within limits.

## What works

- Most printers bridge **cleanly up to ~5–10 mm**; tuned machines with good cooling go further.
- The slicer detects bridges and applies **bridge settings**: 100% fan, slower speed, and it aligns those lines to span the shortest distance.

## Design guidance

- Keep unsupported spans short. Break a wide opening into two with a central rib.
- A bridge is always a bit rough and droops slightly in the middle — do not put a bridge on a sealing or mating face.
- If you can turn a bridge into two 45° slopes meeting at the top (an arch), do that instead — it needs no bridge settings and no support.
- Bridging the **first layer above a hole** to close it off ("bridge infill") is normal and expected.`,
      keyTakeaways: [
        'Bridges self-support across short spans (~5–10 mm) using cooling and tension.',
        'The slicer applies full cooling and slow, aligned moves to bridges automatically.',
        'Keep spans short, keep bridges off mating faces, prefer an arch where possible.',
      ],
    },
    {
      id: 'tolerances',
      title: 'Tolerances, Clearances & Fits',
      summary: 'How much gap to design between parts that must fit together.',
      estMinutes: 5,
      type: 'reading',
      body: `Extruded plastic spreads slightly, corners round off, and holes shrink. Nominal CAD dimensions do not come out exact.

## Typical numbers (0.4 mm nozzle, PLA/PETG)

- **Clearance (loose / moving fit)**: 0.4–0.5 mm total gap (0.2–0.25 mm per side).
- **Clearance (snug / assembly fit)**: 0.15–0.25 mm total.
- **Press fit / no gap**: design 0.0 and expect to sand, or oversize the pin by ~0.1 mm.
- **Holes print undersized** by 0.1–0.3 mm — bore them out or add that to the CAD diameter. This is "hole compensation" or "X/Y size compensation" in the slicer.

## Practical approach

- Print a **tolerance test** (a comb of pins/slots at 0.1 mm increments) once for each material + printer and reuse the result.
- Add clearance to the *feature*, not by scaling the whole part.
- First layer squish widens the bottom (elephant’s foot) — chamfer the bottom of pins and holes, or use compensation.`,
      keyTakeaways: [
        'Design ~0.2 mm per side clearance for assembly fits, ~0.25 mm for moving fits.',
        'Printed holes come out undersized — compensate in CAD or the slicer.',
        'Run a tolerance test once per material/printer and reuse the numbers.',
      ],
    },
    {
      id: 'support-reduction',
      title: 'Designing Supports Away',
      summary: 'The best support is the one you never print.',
      estMinutes: 5,
      type: 'reading',
      body: `Supports cost material and time, scar the surface, and can fail. A part redesigned to avoid them is almost always better.

## Tactics

1. **Reorient.** Rotate the part so overhangs point down onto the bed or become printable slopes. Often solves everything at once.
2. **Chamfer horizontal undersides** to 45°.
3. **Teardrop or diamond horizontal holes.**
4. **Split the model** at an invisible seam and print halves flat; join with glue, a dowel, or a printed-in captive nut.
5. **Add a sacrificial rib or web** you cut off afterward, where a real support would be hard to remove.
6. **Use the "support blocker/enforcer"** tools to place support only exactly where a reorientation still leaves one bad spot.
7. **Print-in-place** hinges/joints with designed clearance instead of assembling supported parts.

> Spend five minutes rotating the part in the slicer and toggling support preview before accepting a forest of supports.`,
      keyTakeaways: [
        'Reorienting the part is the highest-value support-avoidance move.',
        'Chamfers and teardrop holes remove the most common forced overhangs.',
        'Splitting at an invisible seam lets both halves print flat and support-free.',
      ],
    },
    {
      id: 'part-consolidation',
      title: 'Part Consolidation',
      summary: 'Redesign an assembly of many parts into one printed piece.',
      estMinutes: 4,
      type: 'reading',
      body: `Traditional manufacturing pushes designers toward many simple parts joined with fasteners, because complexity is expensive to machine or mould. Additive manufacturing inverts that: **complexity is free**, but assembly and fasteners are not.

## The opportunity

A bracket that was 5 machined plates + 8 screws can often become **one printed part** with the ribs, bosses, cable clips, and mounting tabs all integrated. Benefits:

- Fewer failure points (no loosening fasteners), lighter, faster to "assemble".
- Internal features — channels, conformal shapes, captured nuts — that no other process can make in one piece.

## The limits

- One-piece means one orientation — you cannot optimise layer direction for every feature at once.
- A big monolithic part that warps or fails wastes far more than a small one.
- Serviceability: consolidating away a part you need to replace is a mistake.

## Middle ground

Consolidate the parts that never need to come apart; keep deliberate joints (snap-fits, screw bosses, print-in-place hinges) where you need assembly, adjustment, or replacement.`,
      keyTakeaways: [
        'Additive makes geometric complexity cheap but keeps assembly costly — so combine parts.',
        'Consolidation cuts fasteners, weight, and failure points and enables impossible internal features.',
        'Keep deliberate joints where you need serviceability or per-feature layer orientation.',
      ],
    },
    {
      id: 'check-dfam',
      title: 'Checkpoint: Design for FDM',
      summary: 'Design decisions for printable, strong parts.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt:
            'A J-shaped hook will hang a load from its tip. How should it be oriented on the bed?',
          options: [
            'Standing upright as it will be used',
            'Lying on its side/back so the pulling load runs along the layers, not across them',
            'At 45° to balance strength and support',
            'Orientation does not matter for strength',
          ],
          answer: 1,
          explanation:
            'Printed upright, the load peels the layers apart (weak Z direction). Lying flat puts the tension in-plane where the part is strong.',
        },
        {
          id: 'q2',
          prompt: 'A horizontal hole through a part prints with a collapsed, messy top. Best design fix?',
          options: [
            'Add supports inside the hole',
            'Reshape the hole into a teardrop so no surface exceeds ~45°',
            'Increase infill',
            'Print slower',
          ],
          answer: 1,
          explanation:
            'The top of a round horizontal hole is a near-horizontal overhang. A teardrop/pointed top keeps every surface printable without support.',
        },
        {
          id: 'q3',
          prompt: 'For two parts that must slide against each other, a good total designed clearance is about:',
          options: ['0.02 mm', '0.2 mm per side (~0.4 mm total)', '1.5 mm total', '0 mm — sand to fit'],
          answer: 1,
          explanation:
            'Around 0.2–0.25 mm per side gives a working moving fit with a 0.4 mm nozzle in PLA/PETG.',
        },
        {
          id: 'q4',
          prompt: 'Which is a genuine reason NOT to consolidate an assembly into one printed part?',
          options: [
            'Printed parts cannot have ribs',
            'You lose the ability to optimise layer orientation for every feature, and you cannot service/replace a sub-part',
            'Fasteners are always stronger',
            'Single parts always warp',
          ],
          answer: 1,
          explanation:
            'One part means one orientation and no serviceability. Consolidate what never comes apart; keep joints where you need assembly or replacement.',
        },
        {
          id: 'q5',
          prompt: 'A flat overhanging ledge on the side of a part needs support. The cleanest fix is usually to:',
          options: [
            'Chamfer the underside to 45° so it becomes self-supporting',
            'Print at 0.28 mm layer height',
            'Add a raft',
            'Increase wall count',
          ],
          answer: 0,
          explanation:
            'Replacing the flat underside with a 45° chamfer removes the overhang entirely — no support, better surface.',
        },
      ],
    },
  ],
}
