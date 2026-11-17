import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-tsx.js';

// Extend JSX only: names already used by this fixed teaching example.
Prism.languages.insertBefore('tsx', 'operator', {
  'demo-function': {
    pattern: /\b(?:App|BrowserRouter|Routes|Route|Navigate|Link|Outlet|PublicLayout|SearchPage|MediaDetailPage|NotFoundPage|useParams|toMediaDetailInput|useState|useMediaSearch|renderSearchContent|handleSubmit)\b/,
    alias: 'function',
  },
  'demo-variable': {
    pattern: /\b(?:draftQuery|draftMediaType|submittedSearch|detailInput|params|item|items|props|mediaSearch|event)\b/,
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
  return render(Prism.tokenize(source, Prism.languages.tsx));
}
