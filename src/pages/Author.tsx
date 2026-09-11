import { useMemo, useState } from 'react'
import { useCustomContent } from '../store/useCustomContent'
import { parseModule } from '../content'
import { Badge, Button, Card, cn } from '../components/ui'
import { Markdown } from '../lib/markdown'
import type { Module } from '../types'

const TEMPLATE = `{
  "id": "resin-basics",
  "title": "Resin (SLA) Basics",
  "blurb": "A short intro module you authored.",
  "icon": "◆",
  "requires": ["fundamentals"],
  "lessons": [
    {
      "id": "intro",
      "title": "How Resin Printing Differs",
      "summary": "Light-cured liquid vs. melted filament.",
      "estMinutes": 5,
      "type": "reading",
      "body": "## The core difference\\n\\nSLA cures liquid photopolymer with UV light, layer by layer, instead of melting a filament.\\n\\n- Much finer detail\\n- Messier and more hazardous handling\\n- Parts need washing and post-curing",
      "keyTakeaways": ["SLA cures liquid resin with UV light", "Finer detail, messier workflow"]
    },
    {
      "id": "check",
      "title": "Checkpoint",
      "summary": "One quick question.",
      "estMinutes": 2,
      "type": "quiz",
      "questions": [
        {
          "id": "q1",
          "prompt": "SLA printing solidifies material using:",
          "options": ["A heated nozzle", "UV light", "A laser cutter", "Cold air"],
          "answer": 1,
          "explanation": "Photopolymer resin cures when exposed to UV light."
        }
      ]
    }
  ]
}`

export function Author() {
  const { customModules, addCustomModule, removeCustomModule } =
    useCustomContent()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState<string | null>(null)

  const parsed = useMemo(() => {
    if (!text.trim()) return null
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch (e) {
      return {
        ok: false as const,
        errors: [`Invalid JSON: ${(e as Error).message}`],
      }
    }
    return parseModule(json)
  }, [text])

  const existingIds = (customModules as Module[]).map((m) => m.id)

  const save = () => {
    if (!parsed?.ok || !parsed.module) return
    if (existingIds.includes(parsed.module.id)) {
      removeCustomModule(parsed.module.id)
    }
    addCustomModule(parsed.module)
    setSaved(parsed.module.id)
    setText('')
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Author</h1>
        <p className="mt-1 text-sm text-muted">
          The curriculum is data. Paste a module as JSON, preview it, and add it
          to your path — no code changes. Modules are stored in this browser.
        </p>
      </header>

      {saved && (
        <div className="rounded-lg border border-success/40 bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-4 py-3 text-sm text-success">
          Module “{saved}” added. Find it at the bottom of the{' '}
          <a href="/pathway" className="underline">
            learning path
          </a>
          .
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Module JSON
            </h2>
            <button
              type="button"
              onClick={() => setText(TEMPLATE)}
              className="text-xs text-accent hover:underline"
            >
              Insert template
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder="Paste a module object…"
            className="h-[420px] w-full resize-none rounded-lg border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-ink outline-none focus:border-accent"
          />
          {parsed && (
            <div
              className={cn(
                'rounded-lg border p-3 text-xs',
                parsed.ok
                  ? 'border-success/40 text-success'
                  : 'border-danger/40 text-danger',
              )}
            >
              {parsed.ok ? (
                '✓ Valid module.'
              ) : (
                <ul className="space-y-1">
                  {parsed.errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <Button onClick={save} disabled={!parsed?.ok}>
            {parsed?.ok && existingIds.includes((parsed.module as Module).id)
              ? 'Replace existing module'
              : 'Add module'}
          </Button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Preview
          </h2>
          {parsed?.ok && parsed.module ? (
            <Card className="max-h-[460px] overflow-y-auto">
              <div className="flex items-center gap-2">
                <span className="text-lg">{parsed.module.icon}</span>
                <h3 className="font-semibold text-ink">{parsed.module.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted">{parsed.module.blurb}</p>
              <div className="mt-4 space-y-3">
                {parsed.module.lessons.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge tone="muted">{l.type}</Badge>
                      <span className="text-sm font-medium text-ink">
                        {l.title}
                      </span>
                    </div>
                    {l.type === 'reading' && (
                      <div className="prose-lesson mt-2 text-[0.85rem]">
                        <Markdown source={l.body.slice(0, 400)} />
                      </div>
                    )}
                    {l.type === 'quiz' && (
                      <p className="mt-2 text-xs text-muted">
                        {l.questions.length} question
                        {l.questions.length === 1 ? '' : 's'}
                      </p>
                    )}
                    {l.type === 'flashcards' && (
                      <p className="mt-2 text-xs text-muted">
                        {l.cards.length} cards
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="grid h-40 place-items-center text-sm text-muted">
              Valid JSON renders here.
            </Card>
          )}

          {(customModules as Module[]).length > 0 && (
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Your modules
              </h3>
              <ul className="mt-2 space-y-1.5">
                {(customModules as Module[]).map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-ink">
                      {m.icon} {m.title}{' '}
                      <span className="text-xs text-muted">
                        ({m.lessons.length})
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCustomModule(m.id)}
                      className="text-xs text-danger hover:underline"
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Lesson types
        </h2>
        <ul className="mt-2 grid gap-2 text-sm text-text sm:grid-cols-2">
          <li>
            <code>reading</code> — <code>body</code> (markdown: <code>##</code>,{' '}
            <code>**bold**</code>, lists, <code>&gt;</code> quote, ``` code);
            optional <code>widget</code>, <code>keyTakeaways[]</code>
          </li>
          <li>
            <code>quiz</code> — <code>questions[]</code> with{' '}
            <code>prompt</code>, <code>options[]</code>, <code>answer</code>{' '}
            (index), <code>explanation</code>; optional <code>passScore</code>
          </li>
          <li>
            <code>flashcards</code> — <code>cards[]</code> with{' '}
            <code>front</code>, <code>back</code>
          </li>
          <li>
            <code>video</code> — <code>provider</code> (<code>youtube</code> /{' '}
            <code>file</code>), <code>src</code> (id/URL, <code>""</code> = coming
            soon); optional <code>credit</code>, <code>chapters[]</code>,{' '}
            <code>body</code>
          </li>
          <li>
            <code>interactive</code> — <code>widget</code> key (see Sandbox for
            available keys)
          </li>
          <li>
            <code>checklist</code> — <code>items[]</code> with <code>text</code>,
            optional <code>detail</code>
          </li>
        </ul>
      </Card>
    </div>
  )
}
