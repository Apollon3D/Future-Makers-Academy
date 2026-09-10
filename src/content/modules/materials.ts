import type { Module } from '../../types'

export const materials: Module = {
  id: 'materials',
  title: 'Filament & Materials',
  blurb: 'PLA, PETG, TPU, ABS/ASA — properties, printing behaviour, and how to choose.',
  icon: '❋',
  requires: ['fundamentals'],
  lessons: [
    {
      id: 'how-filament-works',
      title: 'How Filament Works',
      summary: 'Diameter, spools, moisture, and what "1.75 mm" really means.',
      estMinutes: 5,
      type: 'reading',
      body: `Filament is thermoplastic drawn into a precise thread and wound on a spool. Almost all consumer printers use **1.75 mm** filament (some older or larger machines use 2.85 mm).

## Why diameter tolerance matters

The extruder pushes a known *length* of filament to deliver a known *volume* of plastic. If the diameter wanders from 1.75 mm to 1.82 mm, every millimetre carries ~8% more plastic and you get over-extrusion. Good filament holds ±0.02 mm.

## Thermoplastic = re-meltable

Thermoplastics soften when heated and harden when cooled, repeatedly. That is what makes FDM possible — and also why a PLA part left in a hot car will sag.

## The three things that define a material

1. **Printability** — how forgiving it is: adhesion, warping, temperature window, smell.
2. **Mechanical properties** — stiffness, toughness, layer adhesion, heat resistance.
3. **Environmental resistance** — UV, moisture, chemicals, temperature.

Every filament is a compromise between these. The next lessons cover the four you will actually use.`,
      keyTakeaways: [
        'Consumer printers use 1.75 mm filament; tight diameter tolerance (±0.02 mm) prevents over/under-extrusion.',
        'Thermoplastics can be melted and re-solidified repeatedly.',
        'Choosing filament means trading off printability, mechanical properties, and environmental resistance.',
      ],
    },
    {
      id: 'video-material-comparison',
      title: 'Watch: PLA vs. PETG vs. ASA Compared',
      summary: 'A side-by-side test of the three materials on price, printability and strength.',
      estMinutes: 15,
      type: 'video',
      provider: 'youtube',
      src: 'ycGDR752fT0',
      credit: 'Thomas Sanladerer (feat. Josef Prusa)',
      intro:
        'A hands-on comparison of the materials you will actually choose between. Watch it, then the written lessons give you the specific temperatures and quirks.',
      keyTakeaways: [
        'There is no single "best" filament — each wins in different categories.',
        'Printability and strength often pull in opposite directions.',
      ],
    },
    {
      id: 'pla',
      title: 'PLA — The Default',
      summary: 'Easy to print, stiff, low heat resistance, slightly brittle.',
      estMinutes: 5,
      type: 'reading',
      body: `**PLA** (polylactic acid) is the material you should start with and the one most prints should use.

## Printing behaviour

- Nozzle **190–220 °C**, bed **50–60 °C** (or unheated with glue).
- Barely warps — large flat parts are no problem.
- Needs **good part cooling** (fan at 100% after the first few layers) for clean overhangs and sharp detail.
- Low odour.

## Mechanical character

- **High stiffness** and good dimensional accuracy — great for display models, jigs, and fixtures.
- **Brittle**: it fails suddenly rather than bending. Poor for parts that flex or take impact.
- **Low heat resistance** — softens around **55–60 °C**. Never use PLA for anything near an engine, in a hot car, or in direct summer sun.

## Good for

Prototypes, miniatures, architectural models, toys, desk organisers, low-stress brackets. If you are not sure what to use, use PLA and only switch when a specific limitation bites you.`,
      keyTakeaways: [
        'PLA prints cool, barely warps, and is dimensionally accurate.',
        'It is stiff but brittle and softens near 55–60 °C.',
        'Use strong part cooling with PLA.',
      ],
    },
    {
      id: 'petg',
      title: 'PETG — The Tough Everyday Upgrade',
      summary: 'Durable, weather-resistant, mild warping, prone to stringing.',
      estMinutes: 5,
      type: 'reading',
      body: `**PETG** (glycol-modified PET — the same polymer family as drink bottles) is the natural next step when PLA is not tough enough.

## Printing behaviour

- Nozzle **230–250 °C**, bed **70–85 °C**.
- **Mild warping** — more than PLA, far less than ABS. A brim helps on large parts.
- **Strings and oozes** readily; you will spend time tuning retraction and temperature.
- Sticks *aggressively* to smooth PEI — use a textured plate or a glue-stick release layer, or you may tear chunks out of the sheet.
- Wants **less part cooling** than PLA (around 30–50%).

## Mechanical character

- **Tough** — bends before it breaks, absorbs impact.
- Good **layer adhesion**.
- Heat resistant to roughly **70–80 °C**.
- Decent outdoor/UV and moisture resistance.

## Good for

Functional parts, outdoor fixtures, mechanical brackets, protective enclosures, parts that get handled or dropped.`,
      keyTakeaways: [
        'PETG is tougher and more heat/weather resistant than PLA.',
        'It strings easily and needs retraction tuning; use less cooling than PLA.',
        'It bonds hard to smooth PEI — use a textured plate or release agent.',
      ],
    },
    {
      id: 'tpu-abs',
      title: 'TPU & ABS/ASA — Specialists',
      summary: 'Flexible filament and high-temperature engineering plastics.',
      estMinutes: 6,
      type: 'reading',
      body: `## TPU — flexible

Thermoplastic polyurethane prints rubbery parts: phone cases, gaskets, tyres, vibration dampers, straps.

- Nozzle **220–240 °C**, bed **40–60 °C**.
- **Print slowly** (15–30 mm/s) and prefer a **direct-drive** extruder — a Bowden tube lets the soft filament buckle.
- Minimal retraction. Dries out fast, so keep it sealed.
- Comes in shore hardnesses from 85A (very soft) to 98A (semi-rigid).

## ABS / ASA — heat-resistant engineering plastics

- Nozzle **240–260 °C**, bed **95–110 °C**, and an **enclosure is essentially mandatory** — drafts cause cracking and warping.
- Emits **styrene fumes**; ventilate well. ASA is the UV-stable version for outdoor use and smells less.
- Heat resistant to roughly **95–100 °C**; can be vapour-smoothed with acetone.
- Higher shrinkage makes large flat parts hard to keep flat.

## Good for

TPU: anything that must bend or grip. ABS/ASA: under-hood automotive, enclosures near heat, outdoor parts (ASA).

> For most learners, PLA + PETG covers 90% of real needs. Reach for TPU or ABS only when a specific requirement forces it.`,
      keyTakeaways: [
        'TPU needs slow speeds and ideally direct drive; keep it dry.',
        'ABS/ASA need an enclosure and ventilation; ASA is the UV-stable outdoor choice.',
        'PLA + PETG handle most real-world parts.',
      ],
    },
    {
      id: 'moisture',
      title: 'Moisture: The Invisible Print Killer',
      summary: 'Why wet filament fails and how to dry and store it.',
      estMinutes: 4,
      type: 'reading',
      body: `Every common filament is **hygroscopic** — it absorbs water from the air. PETG, TPU, and nylon do it fast; PLA more slowly but it still happens.

## Symptoms of wet filament

- Popping or crackling sounds at the nozzle (water flashing to steam).
- Rough, hairy, or bubbly surface; weak layer bonding.
- Excessive stringing that no retraction tuning fixes.

## Drying

Use a filament dryer or an oven/food dehydrator:

- PLA: **45 °C for 4–6 h**
- PETG: **65 °C for 6 h**
- TPU: **50 °C for 4–6 h**
- ABS/ASA: **70 °C for 4 h**

## Storage

Sealed box or bag with **desiccant**, ideally with a humidity indicator. Printing straight from a dry box is best for the thirsty materials.

> If a roll that printed fine last month suddenly strings and pops, suspect moisture before you change any slicer settings.`,
      keyTakeaways: [
        'All common filaments absorb water from the air.',
        'Wet filament causes popping, rough surfaces, weak layers, and stringing.',
        'Dry filament at material-specific temperatures and store it with desiccant.',
      ],
    },
    {
      id: 'material-picker',
      title: 'Material Selector',
      summary: 'Interactive: answer a few questions, get a ranked recommendation.',
      estMinutes: 4,
      type: 'interactive',
      widget: 'material-picker',
      intro:
        'Tell the tool what the part must do and what your printer can handle. It weighs your requirements against every common FDM filament — standard, engineering, flexible, composite and specialty — and ranks them. The second tab is a full reference of all of them with temperatures and trade-offs.',
    },
    {
      id: 'check-materials',
      title: 'Checkpoint: Materials',
      summary: 'Match materials to real requirements.',
      estMinutes: 4,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt:
            'You need a bracket that will sit on a car dashboard in summer sun. Best choice?',
          options: ['PLA', 'ASA', 'Standard PLA with more infill', 'PVA'],
          answer: 1,
          explanation:
            'Dashboard temperatures exceed PLA’s ~55 °C softening point. ASA handles the heat and resists UV.',
        },
        {
          id: 'q2',
          prompt: 'A phone case that must flex to snap on needs:',
          options: ['PLA', 'PETG', 'TPU', 'ABS'],
          answer: 2,
          explanation:
            'TPU is the flexible option. The others are rigid and would crack when flexed.',
        },
        {
          id: 'q3',
          prompt:
            'Your PETG suddenly strings badly and pops at the nozzle, though it printed fine before. First thing to check?',
          options: [
            'Increase retraction distance to 8 mm',
            'Dry the filament — it has absorbed moisture',
            'Replace the nozzle',
            'Lower the bed temperature',
          ],
          answer: 1,
          explanation:
            'Popping plus new stringing on a previously good roll is the classic moisture signature. Dry it first.',
        },
        {
          id: 'q4',
          prompt: 'Which material realistically requires an enclosure?',
          options: ['PLA', 'PETG', 'ABS', 'TPU'],
          answer: 2,
          explanation:
            'ABS warps and cracks in drafts; an enclosure keeps the ambient temperature stable.',
        },
        {
          id: 'q5',
          prompt: 'A good all-round choice for a functional outdoor hose clip:',
          options: [
            'PLA — it is stiff',
            'PETG — tough, weather and UV tolerant enough, easy enough to print',
            'TPU — it is durable',
            'Cast acrylic',
          ],
          answer: 1,
          explanation:
            'PETG balances toughness, moderate heat and UV resistance, and printability for outdoor functional parts.',
        },
      ],
    },
    {
      id: 'materials-cards',
      title: 'Flashcards: Material Properties',
      summary: 'Lock in temperatures and use-cases with spaced repetition.',
      estMinutes: 5,
      type: 'flashcards',
      intro:
        'These cards enter your review queue and come back on a spaced schedule. Rate each one honestly.',
      cards: [
        { id: 'fc-pla-temp', front: 'Typical PLA nozzle / bed temperature?', back: '190–220 °C nozzle, 50–60 °C bed (or unheated with adhesive).' },
        { id: 'fc-pla-weak', front: 'PLA’s two big weaknesses?', back: 'Brittleness (fails suddenly) and low heat resistance (softens ~55–60 °C).' },
        { id: 'fc-petg-temp', front: 'Typical PETG nozzle / bed temperature?', back: '230–250 °C nozzle, 70–85 °C bed.' },
        { id: 'fc-petg-quirk', front: 'Two printing quirks of PETG?', back: 'Strings/oozes readily; bonds very hard to smooth PEI (use textured plate or release agent).' },
        { id: 'fc-tpu-extruder', front: 'What extruder type suits TPU and why?', back: 'Direct drive — a Bowden tube lets the soft filament buckle. Also print slowly (15–30 mm/s).' },
        { id: 'fc-abs-need', front: 'What does ABS/ASA essentially require?', back: 'An enclosure (stable ambient temp) and good ventilation for fumes.' },
        { id: 'fc-asa-vs-abs', front: 'When choose ASA over ABS?', back: 'Outdoor use — ASA is UV-stable and lower-odour.' },
        { id: 'fc-wet-signs', front: 'Three signs of wet filament?', back: 'Popping/crackling at nozzle, rough/hairy surface with weak layers, stringing that retraction tuning cannot fix.' },
      ],
    },
  ],
}
