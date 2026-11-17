import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { repositoryRoot } from "./deck-context.mjs"

const courseDirectory = path.join(repositoryRoot, "course")
const documents = [
  { source: "pre-class-reading.md", output: "pre-class-reading.html", label: "Lectura previa", footer: "Material de preparación" },
  { source: "student-guide.md", output: "student-guide.html", label: "Guía estudiantil", footer: "Material de trabajo en clase" },
]

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\`([^\`]+)\`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, href) => (
      href.endsWith(".md") ? `<strong>${label}</strong>` : `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`
    ))
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n")
  const parts = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim()
      const code = []
      index += 1
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index])
        index += 1
      }
      parts.push(`<pre><code class="language-${escapeHtml(language)}">${escapeHtml(code.join("\n"))}</code></pre>`)
      index += 1
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      parts.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (line.startsWith("> ")) {
      const quote = []
      while (index < lines.length && lines[index].startsWith("> ")) {
        quote.push(lines[index].slice(2))
        index += 1
      }
      parts.push(`<blockquote>${quote.map(renderInline).join("<br>")}</blockquote>`)
      continue
    }

    if (line.startsWith("|")) {
      const table = []
      while (index < lines.length && lines[index].startsWith("|")) table.push(lines[index++])
      const cells = (row) => row.split("|").slice(1, -1).map((cell) => cell.trim())
      const rows = table.filter((row) => !/^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(row))
      const [head, ...body] = rows.map(cells)
      if (head) parts.push(`<div class="table-wrap"><table><thead><tr>${head.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`)
      continue
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line)
    if (unordered) {
      const items = []
      while (index < lines.length) {
        const item = /^[-*]\s+(.+)$/.exec(lines[index])
        if (!item) break
        items.push(`<li>${renderInline(item[1])}</li>`)
        index += 1
      }
      parts.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line)
    if (ordered) {
      const items = []
      while (index < lines.length) {
        const item = /^\d+\.\s+(.+)$/.exec(lines[index])
        if (!item) break
        items.push(`<li>${renderInline(item[1])}</li>`)
        index += 1
      }
      parts.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s|^[-*]\s|^\d+\.\s|^> |^```/.test(lines[index])) {
      paragraph.push(lines[index])
      index += 1
    }
    parts.push(`<p>${paragraph.map(renderInline).join(" ")}</p>`)
  }

  return parts.join("\n")
}

function documentTemplate({ content, session, title, label, footer }) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(label)} de ${escapeHtml(session)} para React Guide VI">
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        --paper: #fbfbfe;
        --paper-2: #f3f5fb;
        --ink: #17233f;
        --ink-2: #45536f;
        --muted: #66738d;
        --rule: #d5dced;
        --accent: #354f9f;
        --accent-soft: #e7ecfb;
        --code: #17233f;
        --code-ink: #f5f7fc;
        --success: #287d72;
        --display: Sora, Aptos Display, "Segoe UI", sans-serif;
        --body: "IBM Plex Sans", Aptos, "Segoe UI", sans-serif;
        --mono: "JetBrains Mono", Consolas, monospace;
      }

      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: var(--paper-2); font-family: var(--body); font-size: 18px; line-height: 1.6; }
      .page { width: min(100% - 32px, 960px); margin: 32px auto; overflow: hidden; border: 1px solid var(--rule); border-radius: 12px; background: var(--paper); box-shadow: 0 16px 48px rgb(24 36 63 / 10%); }
      header { padding: 56px 64px 48px; color: var(--paper); background: linear-gradient(135deg, var(--accent), #263b7c); }
      .label { margin: 0 0 12px; color: #dbe4ff; font-family: var(--mono); font-size: 13px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
      header h1 { max-width: 18ch; margin: 0; font-family: var(--display); font-size: clamp(34px, 6vw, 58px); letter-spacing: -.045em; line-height: 1.04; }
      header .rule { width: 80px; height: 4px; margin-top: 28px; background: #8ee0cf; }
      main { padding: 56px 64px 72px; }
      main > h1 { display: none; }
      h2, h3 { font-family: var(--display); letter-spacing: -.03em; line-height: 1.15; }
      h2 { margin: 56px 0 18px; padding-top: 18px; border-top: 2px solid var(--rule); font-size: 30px; }
      h2:first-child { margin-top: 0; }
      h3 { margin: 32px 0 12px; color: var(--accent); font-size: 22px; }
      p { max-width: 72ch; margin: 0 0 18px; }
      ul, ol { max-width: 72ch; margin: 0 0 22px; padding-left: 1.4em; }
      li { margin: 8px 0; padding-left: .25em; }
      li::marker { color: var(--accent); font-weight: 700; }
      a { color: var(--accent); font-weight: 600; text-decoration-thickness: 2px; text-underline-offset: 3px; }
      strong { color: var(--ink); }
      code { padding: .14em .36em; border-radius: 4px; background: var(--accent-soft); color: #263b7c; font-family: var(--mono); font-size: .88em; }
      pre { margin: 24px 0; padding: 24px; overflow-x: auto; border-radius: 8px; background: var(--code); color: var(--code-ink); box-shadow: inset 4px 0 var(--success); }
      pre code { padding: 0; background: transparent; color: inherit; font-size: .82em; line-height: 1.55; }
      blockquote { max-width: 72ch; margin: 24px 0; padding: 16px 20px; border-left: 4px solid var(--success); background: #ecf8f5; color: var(--ink-2); }
      .table-wrap { max-width: 100%; margin: 24px 0; overflow-x: auto; border: 1px solid var(--rule); border-radius: 8px; }
      table { width: 100%; border-collapse: collapse; font-size: .9em; }
      th, td { padding: 12px 14px; border-bottom: 1px solid var(--rule); text-align: left; vertical-align: top; }
      th { background: var(--accent-soft); color: var(--accent); font-family: var(--display); }
      tbody tr:last-child td { border-bottom: 0; }
      footer { display: flex; gap: 12px; align-items: center; padding: 20px 64px; border-top: 1px solid var(--rule); color: var(--muted); font-size: 14px; }
      footer::before { width: 9px; height: 9px; border-radius: 50%; background: var(--success); content: ""; }
      @media (max-width: 700px) { .page { width: 100%; margin: 0; border: 0; border-radius: 0; } header, main { padding: 36px 24px; } footer { padding: 18px 24px; } body { font-size: 17px; } }
      @media print { body { background: white; } .page { width: 100%; margin: 0; border: 0; box-shadow: none; } a { color: inherit; } }
    </style>
  </head>
  <body>
    <article class="page">
      <header>
        <p class="label">React Guide VI · ${escapeHtml(label)}</p>
        <h1>${escapeHtml(title)}</h1>
        <div class="rule"></div>
      </header>
      <main>${content}</main>
      <footer>${escapeHtml(footer)} · ${escapeHtml(session)}</footer>
    </article>
  </body>
</html>
`
}

const sessions = (await readdir(courseDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .sort((left, right) => left.name.localeCompare(right.name, "es"))

for (const session of sessions) {
  const directory = path.join(courseDirectory, session.name)
  for (const document of documents) {
    const markdown = await readFile(path.join(directory, document.source), "utf8")
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? `${document.label} · Sesión ${session.name.slice(0, 2)}`
    const output = documentTemplate({
      content: renderMarkdown(markdown), session: `Sesión ${session.name.slice(0, 2)}`,
      title, label: document.label, footer: document.footer,
    })
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, document.output), output, "utf8")
    console.log(`Generated: course/${session.name}/${document.output}`)
  }
}
