import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';

// Extend JSX only: names already used by this fixed teaching example.
Prism.languages.insertBefore('jsx', 'operator', {
  'demo-function': {
    pattern: /\b(?:SearchDemo|useState|useQuery|searchMedia|toMediaSearchCardModel|handleSubmit|getMessage|setDraftQuery|setDraftMediaType|setSubmittedSearch)\b/,
    alias: 'function',
  },
  'demo-variable': {
    pattern: /\b(?:draftQuery|draftMediaType|submittedSearch|input|query|cards|card|message|event|e)\b/,
    alias: 'variable',
  },
});

const escape = text => text.replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Tokenize the whole file so multiline JSX stays JSX. Wrap each line
// independently to retain fixed rows, valid spans and exact source text.
export function highlightLines(source) {
  function render(value) {
    if (typeof value === 'string') return value.split('\n').map(escape);
    if (Array.isArray(value)) {
      const lines = [''];
      for (const child of value) {
        const parts = render(child);
        lines[lines.length - 1] += parts[0];
        lines.push(...parts.slice(1));
      }
      return lines;
    }
    const classes = ['token', value.type, ...[].concat(value.alias ?? [])].join(' ');
    return render(value.content).map(line => '<span class="' + classes + '">' + line + '</span>');
  }
  return render(Prism.tokenize(source, Prism.languages.jsx));
}
