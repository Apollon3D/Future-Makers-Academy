import type { Module } from '../../types'

export const maintenanceCare: Module = {
  id: 'maintenance-care',
  title: 'Printer Maintenance & Care',
  blurb: 'A schedule and a mindset for keeping a machine reliable for years, not months.',
  icon: '⚒',
  level: 'level-2',
  requires: ['level-1-exam', 'first-layer'],
  lessons: [
    {
      id: 'maintenance-mindset',
      title: 'Maintenance Is Cheaper Than Repair',
      summary: 'Why a five-minute habit beats a five-hour rebuild.',
      estMinutes: 4,
      type: 'reading',
      body: `Almost every dramatic printer failure — a fire, a stripped gear, a snapped belt mid-print — was preceded by a small warning sign that a five-minute check would have caught. Maintenance is not about ceremony; it is about looking at the same handful of wear points on a schedule so problems get caught while they are still cheap.

## The three kinds of upkeep

1. **Every print**: a glance, not a task — is the bed clean, is filament feeding, does the first layer look right.
2. **Periodic** (weekly to every few months): things that wear slowly — belts, lubrication, bolts, wiring — checked on a calendar, not "when something breaks."
3. **As-needed**: consumables and wear parts you replace when they show symptoms, not on a fixed schedule (a nozzle, a hotend fan, a heat break liner).

## Keep a log

A one-line note per print — filament, anything you changed, anything odd — turns "it broke and I don't know why" into "it broke right after I switched nozzles," which is a problem you can actually solve.

This module gives you the schedule and the reasoning; the **Workshop** section has the same maintenance tasks broken down part-by-part for your specific printer, with a due-date tracker.`,
      keyTakeaways: [
        'Most catastrophic failures had an earlier, cheap-to-fix warning sign.',
        'Split upkeep into every-print checks, periodic tasks, and as-needed replacements.',
        'A short print log turns mystery failures into diagnosable ones.',
      ],
    },
    {
      id: 'lubrication',
      title: 'Lubrication: What, Where, How Often',
      summary: 'The right grease or oil for each moving part — and where NOT to lubricate.',
      estMinutes: 6,
      type: 'reading',
      body: `Lubrication reduces friction and wear on parts that slide or roll against each other. Using the wrong product, or lubricating the wrong thing, causes its own problems — so this is a "know the rules" job, not a "more is better" one.

## Linear rods and rails

- **Smooth steel rods with bearings/bushings**: a light machine oil or PTFE-based lubricant, applied sparingly and wiped mostly off — a thin film, not a wet coat that attracts dust.
- **Linear rails**: manufacturer-specified grease (usually a lithium or PTFE grease), applied to the rail, not flooded into the carriage.

## Leadscrews (Z axis)

A thicker **PTFE or lithium grease** suits the coarser thread of a leadscrew better than thin oil, which migrates away too fast. Wipe off the old, discoloured grease before reapplying — grease that has picked up plastic dust becomes a grinding paste, not a lubricant.

## What NOT to lubricate

- **V-slot wheels (POM/Delrin)**: these are designed to run dry against the aluminium extrusion. Oil on them attracts grit that then grinds into the wheel and the rail.
- **Belts and pulleys**: never lubricate a belt — it degrades the rubber and does nothing useful.
- **Stepper motor shafts / couplers**: no lubrication needed; check tightness instead.

## Products to avoid entirely

**WD-40** is a light penetrating oil/solvent, not a lubricant — it displaces old grease without properly replacing it and evaporates, leaving things drier than before. Use it (if at all) only to clean off old grime, then apply the correct grease afterward.`,
      keyTakeaways: [
        'Match the lubricant to the mechanism: light oil/PTFE for rods, grease for rails and leadscrews.',
        'Never oil V-wheels or belts — both are designed to run clean and dry.',
        'WD-40 is a cleaner/penetrant, not a substitute for proper grease.',
      ],
    },
    {
      id: 'motion-upkeep',
      title: 'Belts, Wheels & Frame Bolts',
      summary: 'The recurring checks that prevent ringing, shifting, and slop.',
      estMinutes: 5,
      type: 'reading',
      body: `These are the checks from the Workshop's individual part pages, gathered into one routine you can run in under ten minutes.

## Belt tension

Pluck each belt like a guitar string. It should ring with a clear pitch, not thud dully. Compare X and Y (or the two CoreXY belts) by ear or with a phone tuner app — on a CoreXY machine, the two belts should match each other closely or the toolhead will skew.

## Wheel / bearing preload

Rock the toolhead and the bed by hand (machine off). There should be **no play**, but every wheel should still spin freely with a fingertip. Too loose causes ringing and inconsistent walls; too tight strains the motor and flat-spots the wheels.

## Frame bolts

New printers ship under-torqued from the factory more often than not. A full pass with the correct hex key — especially at the corners of the gantry and the base — is worth doing in the first week of ownership and every few months after, particularly if the machine gets moved.

## A simple quarterly routine

1. Pluck-test every belt; tension any that thud.
2. Rock-test every axis for play; adjust eccentric nuts as needed.
3. Torque-check accessible frame bolts.
4. Wipe and re-grease rods/rails/leadscrews per the previous lesson.
5. Print a calibration cube or ringing test; compare to your last one.`,
      keyTakeaways: [
        'A properly tensioned belt rings with a clear pitch; a slack one thuds.',
        'Every axis should have zero play but every wheel should still spin by hand.',
        'Re-torque frame bolts periodically, especially after moving the printer.',
      ],
    },
    {
      id: 'hotend-care',
      title: 'Hotend & Nozzle Care',
      summary: 'Cold pulls, nozzle swaps, and catching heat-creep before it jams a print.',
      estMinutes: 6,
      type: 'reading',
      body: `The hotend is the part under the most thermal stress, and small neglect compounds — a slightly dirty nozzle becomes a clog, a slowing fan becomes heat creep, a degraded PTFE liner becomes a jam.

## The cold pull

A simple, tool-free way to clear light debris from the melt zone:

1. Heat to the filament's normal printing temperature.
2. Manually feed a stiff, clean length of filament through (often a slightly higher-temp material like nylon works well as a "cleaning" filament, but the same material is fine too) until it flows clean.
3. Cool the hotend to roughly 90–100 °C (still soft, no longer freely liquid) for PLA, or the equivalent "just below flow" point for your material.
4. Pull the filament straight out firmly. If it comes out with a clean, tapered tip, the melt zone is clear. If it has a rough or dark tip, repeat.

## Routine nozzle care

- Wipe the hot nozzle tip with a brass brush periodically — built-up carbon changes flow and can drag across prints.
- Re-tighten the nozzle **hot**, snug against the heat break, any time it has been removed — a loose nozzle leaks and eventually forms a heat-creep blob.
- Treat nozzles as a consumable: replace at the first sign of a worn, oval bore, especially after any abrasive filament.

## Catching heat creep early

If a printer that worked fine for hours starts jamming/clicking only after a while, suspect the **hotend cooling fan** (a slowing fan lets heat creep up past the heat break) before you suspect anything else — it is the most common cause of this exact symptom.`,
      keyTakeaways: [
        'A cold pull clears light debris without disassembly.',
        'Re-tighten a reinstalled nozzle hot, snug against the heat break.',
        'New jamming after a long healthy stretch usually points at the hotend cooling fan.',
      ],
    },
    {
      id: 'electrical-safety',
      title: 'Electrical & Fire Safety',
      summary: 'The checks that matter most, because the failure mode is a house fire.',
      estMinutes: 5,
      type: 'reading',
      body: `Most 3D printer maintenance is about print quality. This lesson is about the small number of checks that matter because getting them wrong is a genuine safety issue, not just a bad print.

## The heated bed and its wiring

The bed draws far more current than anything else on the machine. Loose connections under load create resistance, and resistance under high current creates heat — the classic cause of a melted connector or a wiring fire.

- Periodically check (machine **unplugged**, cold) that the bed's power connector and screw terminals are tight and show no discolouration, melting, or a burnt smell.
- A connector that runs noticeably warm to the touch during a print is not normal — investigate before the next print, not after.
- Prefer factory or reputable-brand upgrade cables/connectors rated for the current draw; a bargain connector on a high-current circuit is a false economy.

## Never leave it unsupervised carelessly

- A smoke detector in the room the printer lives in is cheap insurance.
- Many printers support a "power loss recovery" or a network-connected smart plug that can be monitored or remotely cut — useful, but not a substitute for the wiring checks above.
- Never disable **thermal runaway protection** in firmware "to fix an error" — that protection exists specifically to shut off power if a heater or thermistor fails, which is the exact scenario that starts fires.

## When something smells or looks wrong

Burnt-plastic or burnt-electronics smell, a tripped breaker, or scorched wiring insulation are all "stop and investigate now" signals, not "monitor and see" ones.`,
      keyTakeaways: [
        'The heated bed circuit carries the most current — check its wiring for tightness and heat damage regularly.',
        'A warm-to-the-touch connector during a print is a warning sign, not normal.',
        'Never disable thermal runaway protection — it is the safeguard against exactly this failure mode.',
      ],
    },
    {
      id: 'check-maintenance',
      title: 'Checkpoint: Maintenance & Care',
      summary: 'Match the maintenance task to the mechanism.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt: 'Which of these should generally be lubricated?',
          options: ['V-slot POM wheels', 'GT2 belts', 'A leadscrew, with an appropriate grease', 'Stepper motor shafts'],
          answer: 2,
          explanation: 'Leadscrews benefit from grease; V-wheels run dry by design and belts should never be lubricated.',
        },
        {
          id: 'q2',
          prompt: 'A belt that "thuds" dully instead of ringing when plucked is:',
          options: ['Correctly tensioned', 'Too tight', 'Too loose', 'Not a meaningful test'],
          answer: 2,
          explanation: 'A properly tensioned belt rings with a clear pitch; a dull thud means it needs tightening.',
        },
        {
          id: 'q3',
          prompt: 'A printer that ran fine for hours suddenly starts jamming/clicking. What should you suspect first?',
          options: [
            'The build plate material',
            'The hotend cooling fan slowing down and allowing heat creep',
            'The Wi-Fi connection',
            'The slicer profile',
          ],
          answer: 1,
          explanation: 'New jamming after a healthy stretch is the classic heat-creep signature — check the hotend fan first.',
        },
        {
          id: 'q4',
          prompt: 'What should you do if you find a heated-bed connector that runs warm to the touch during a print?',
          options: [
            'Ignore it — bed connectors always run warm',
            'Turn up the bed temperature to compensate',
            'Treat it as a warning sign and investigate the wiring before the next print',
            'Apply WD-40 to the connector',
          ],
          answer: 2,
          explanation: 'Unusual heat at a connector indicates resistance from a loose or damaged connection — a fire risk that needs investigating.',
        },
        {
          id: 'q5',
          prompt: 'Why should you never disable thermal runaway protection?',
          options: [
            'It slows down print starts',
            'It is the safeguard that cuts power if a heater or thermistor fails — exactly the scenario that causes fires',
            'It only matters for ABS printing',
            'It has no real safety purpose',
          ],
          answer: 1,
          explanation: 'Thermal runaway protection exists specifically to prevent an uncontrolled heater from starting a fire.',
        },
      ],
    },
  ],
}
