import { type ReactNode, Fragment } from 'react'

/**
 * A deliberately tiny markdown renderer for lesson bodies. Supports:
 *   ## / ###  headings
 *   paragraphs
 *   - or *     unordered lists
 *   1.         ordered lists
 *   >          blockquote (rendered as a note callout)
 *   ```        fenced code blocks
 *   inline: **bold**, `code`, [text](url)
 *
 * No raw HTML is interpreted, so lesson content is safe to author freely.
 */

let keySeq = 0
const k = () => `md-${keySeq++}`

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Split on **bold**, `code`, and [label](href) while keeping delimiters.
  const regex =
    /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  const parts = text.split(regex)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={k()}>{part.slice(2, -2)}</strong>)
    } else if (
      part.startsWith('*') &&
      part.endsWith('*') &&
      part.length > 2
    ) {
      nodes.push(<em key={k()}>{part.slice(1, -1)}</em>)
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(<code key={k()}>{part.slice(1, -1)}</code>)
    } else if (part.startsWith('[')) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
      if (m) {
        nodes.push(
          <a key={k()} href={m[2]} target="_blank" rel="noreferrer">
            {m[1]}
          </a>,
        )
      } else {
        nodes.push(<Fragment key={k()}>{part}</Fragment>)
      }
    } else {
      nodes.push(<Fragment key={k()}>{part}</Fragment>)
    }
  }
  return nodes
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []

  let i = 0
  let para: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let quote: string[] = []

  const flushPara = () => {
    if (para.length) {
      blocks.push(<p key={k()}>{renderInline(para.join(' '))}</p>)
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      const Tag = list.ordered ? 'ol' : 'ul'
      const captured = list
      blocks.push(
        <Tag key={k()}>
          {captured.items.map((it) => (
            <li key={k()}>{renderInline(it)}</li>
          ))}
        </Tag>,
      )
      list = null
    }
  }
  const flushQuote = () => {
    if (quote.length) {
      blocks.push(
        <blockquote
          key={k()}
          className="my-4 rounded-r-md border-l-2 border-accent bg-accent-soft px-4 py-3 text-[0.97rem]"
        >
          {quote.map((q) => (
            <p key={k()} className="my-1">
              {renderInline(q)}
            </p>
          ))}
        </blockquote>,
      )
      quote = []
    }
  }
  const flushAll = () => {
    flushPara()
    flushList()
    flushQuote()
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushAll()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push(
        <pre
          key={k()}
          className="my-4 overflow-x-auto rounded-md border border-border bg-surface-3 p-3 text-[0.82rem] leading-relaxed"
        >
          <code className="!bg-transparent !p-0">{code.join('\n')}</code>
        </pre>,
      )
      continue
    }

    if (trimmed === '') {
      flushAll()
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      flushAll()
      blocks.push(<h3 key={k()}>{renderInline(trimmed.slice(4))}</h3>)
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushAll()
      blocks.push(<h2 key={k()}>{renderInline(trimmed.slice(3))}</h2>)
      i++
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushPara()
      flushList()
      quote.push(trimmed.slice(2))
      i++
      continue
    }

    const ulMatch = /^[-*]\s+(.*)$/.exec(trimmed)
    const olMatch = /^\d+\.\s+(.*)$/.exec(trimmed)
    if (ulMatch || olMatch) {
      flushPara()
      flushQuote()
      const ordered = Boolean(olMatch)
      if (!list || list.ordered !== ordered) {
        flushList()
        list = { ordered, items: [] }
      }
      list.items.push((ulMatch ?? olMatch)![1])
      i++
      continue
    }

    flushList()
    flushQuote()
    para.push(trimmed)
    i++
  }

  flushAll()
  return <>{blocks}</>
}
