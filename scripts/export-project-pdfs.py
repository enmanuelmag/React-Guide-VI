#!/usr/bin/env python3
"""Export approved project briefs, preserving their pedagogical text markers.

Uses ReportLab, pypdf and pdfplumber from the Codex bundled Python runtime.
The Markdown subset is intentionally limited to the approved briefs. Unknown
HTML comments fail rather than silently disappearing. PDF text uses mode 3
for source checkpoint comments, outside the body layout with zero reserved height.
"""

import argparse
from collections import Counter
import hashlib
import html
import json
import re
import subprocess
from pathlib import Path

import pdfplumber
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable, KeepTogether, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output/pdf'
TEMP = ROOT / 'tmp/pdfs'
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
WIDTH = A4[0] - 96
INK = colors.HexColor('#243346')
BLUE = colors.HexColor('#164b72')
MUTED = colors.HexColor('#687585')
MARKER = re.compile(r'<!-- AHK-LEARNING-CHECKPOINT: ([^\n]+)\n(.*?)-->', re.S)


def normalize(text):
    return ' '.join(text.split())


def register_fonts():
    for name, file in [('Body', 'Arial.ttf'), ('BodyBold', 'Arial Bold.ttf'),
                       ('BodyItalic', 'Arial Italic.ttf'), ('Mono', 'Courier New.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold', italic='BodyItalic')


def styles():
    base = ParagraphStyle('body', fontName='Body', fontSize=9.3, leading=13.2,
                          textColor=INK, spaceAfter=6, splitLongWords=True)
    return {
        'body': base,
        'quote': ParagraphStyle('quote', parent=base, leftIndent=10, rightIndent=5,
                                textColor=MUTED, fontSize=8.8, leading=12.5,
                                borderColor=colors.HexColor('#bed0db'), borderWidth=0.6,
                                borderPadding=7, spaceBefore=3, spaceAfter=10),
        'list': ParagraphStyle('list', parent=base, leftIndent=14, firstLineIndent=-11,
                               spaceAfter=4),
        'cell': ParagraphStyle('cell', parent=base, fontSize=8, leading=11,
                               spaceAfter=0),
        'headcell': ParagraphStyle('headcell', parent=base, fontName='BodyBold',
                                   fontSize=8, leading=11, textColor=colors.white,
                                   spaceAfter=0),
        'h1': ParagraphStyle('h1', parent=base, fontName='BodyBold', fontSize=23,
                             leading=28, textColor=BLUE, spaceAfter=16,
                             keepWithNext=True),
        'h2': ParagraphStyle('h2', parent=base, fontName='BodyBold', fontSize=13,
                             leading=17, textColor=BLUE, spaceBefore=14,
                             spaceAfter=7, keepWithNext=True),
        'h3': ParagraphStyle('h3', parent=base, fontName='BodyBold', fontSize=10.4,
                             leading=14, textColor=INK, spaceBefore=10,
                             spaceAfter=6, keepWithNext=True),
        'code': ParagraphStyle('code', fontName='Mono', fontSize=8.2, leading=11.4,
                               leftIndent=7, rightIndent=7, borderPadding=7,
                               backColor=colors.HexColor('#f0f3f6'), spaceBefore=5,
                               spaceAfter=9),
    }


def inline(text):
    """Escape source text before introducing the supported inline formatting."""
    tokens = re.split(r'(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)', text)
    parts = []
    for token in tokens:
        if token.startswith('`') and token.endswith('`'):
            parts.append('<font name="Mono" size="8">' + html.escape(token[1:-1]) + '</font>')
        elif token.startswith('**') and token.endswith('**'):
            parts.append('<b>' + html.escape(token[2:-2]) + '</b>')
        elif re.fullmatch(r'\[[^\]]+\]\([^)]+\)', token):
            match = re.fullmatch(r'\[([^\]]+)\]\(([^)]+)\)', token)
            label, target = match.groups()
            # Local source links resolve to sibling final PDFs, not absent .md files.
            if target.endswith('.md') and '/' not in target:
                target = target[:-3] + '.pdf'
            parts.append('<a href="' + html.escape(target, quote=True) +
                         '" color="#164b72">' + html.escape(label) + '</a>')
        else:
            parts.append(html.escape(token))
    return ''.join(parts)


def wrap_by_width(text, width, font, size):
    lines, current = [], ''
    for word in text.split():
        candidate = current + (' ' if current else '') + word
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


class InvisibleCheckpoint(Flowable):
    """Register a checkpoint on its source page without reserving layout space."""

    def __init__(self, marker_id, content, enabled):
        super().__init__()
        self.marker_id = marker_id
        self.content = f'AHK-LEARNING-CHECKPOINT: {marker_id}\n' + content.strip()
        self.enabled = enabled

    def wrap(self, available_width, available_height):
        self.width = available_width
        self.height = 0
        return self.width, self.height

    def draw(self):
        if self.enabled:
            self.canv._ahk_checkpoints.append(self.content)


class PromptBlock(Preformatted):
    """Keep compact reminders inside the selectable geometry of actual prompts."""

    def __init__(self, text, style, phase, prompt_id, enabled, **kwargs):
        super().__init__(text, style, **kwargs)
        self.phase = phase
        self.prompt_id = prompt_id
        self.enabled = enabled
        skill = {'1': 'ahk-use-case', '2': 'ahk-spec', '3': 'ahk-spec-tech'}[phase]
        self.reminder = (
            f'[AHK-CONTROL F{phase}: AHK 3.0.0, {skill} y MCP obligatorios. '
            'Sin entorno, detente. Pregunta antes de decidir; '
            'no inventes respuestas ni aprobaciones.]'
        )

    def split(self, available_width, available_height):
        parts = super().split(available_width, available_height)
        return [PromptBlock('\n'.join(part.lines), part.style, self.phase,
                            self.prompt_id, self.enabled) for part in parts]

    def draw(self):
        super().draw()
        if not self.enabled:
            return
        baseline = self.height - self.style.fontSize
        self.canv.saveState()
        # Existing interline space only: no added height and no painted glyphs.
        for index in range(0, len(self.lines) - 1, 2):
            text = self.canv.beginText(self.style.leftIndent,
                                      baseline - index * self.style.leading - 2.8)
            text.setFont('Body', 2.1)
            text.setTextRenderMode(3)
            text.textLine(self.reminder)
            self.canv.drawText(text)
        self.canv.restoreState()

    def drawOn(self, canvas, x, y, _sW=0):
        super().drawOn(canvas, x, y, _sW)
        if not self.enabled or len(self.lines) < 2:
            return
        first_baseline = y + self.height - self.style.fontSize
        base = {'prompt': self.prompt_id, 'page': canvas.getPageNumber(),
                'expected_reminder': self.reminder, 'expected_first_line': self.lines[0]}
        canvas._ahk_selection_cases.append(dict(base, scope='prompt_segment', rect=[
            x + self.style.leftIndent - 1, y - 1,
            self.width - self.style.leftIndent + 2, self.height + 3]))
        for start in range(max(1, len(self.lines) - 2)):
            count = min(3, len(self.lines) - start)
            selected_baseline = first_baseline - start * self.style.leading
            first_visible = next((line for line in self.lines[start:start + count] if line.strip()), '')
            case = dict(base, scope=f'three_lines_{start + 1}',
                        expected_first_line=first_visible, rect=[
                            x + self.style.leftIndent - 1,
                            selected_baseline - (count - 1) * self.style.leading - 2,
                            self.width - self.style.leftIndent + 2,
                            (count - 1) * self.style.leading + self.style.fontSize + 3])
            canvas._ahk_selection_cases.append(case)


class BriefDocument(SimpleDocTemplate):
    def afterPage(self):
        """Paint nothing, but retain selectable text below the visible footer.

        All checkpoint text is emitted as a contiguous block after the page's
        visible content. It has no intersections with body text or footer labels.
        Its source page remains associated with the corresponding checkpoint.
        """
        blocks = self.canv._ahk_checkpoints
        if not blocks:
            return
        size = 3.6
        content = '\n'.join(blocks)
        while True:
            lines = wrap_by_width(content, WIDTH, 'Body', size)
            leading = size * 1.16
            if len(lines) * leading <= 17:
                break
            size -= 0.15
            if size < 1.2:
                raise ValueError('Checkpoint layer exceeds its non-overlapping footer area')
        self.canv.saveState()
        text = self.canv.beginText(48, 19)
        text.setFont('Body', size)
        text.setLeading(leading)
        text.setTextRenderMode(3)
        for line in lines:
            text.textLine(line)
        self.canv.drawText(text)
        self.canv.restoreState()

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name in ('h1', 'h2'):
            title = flowable.getPlainText()
            key = f'heading-{self.page}-{len(self.canv._doc.outline.__dict__)}-{id(flowable)}'
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(title, key, level=0 if flowable.style.name == 'h1' else 1)


def page_decorations(canvas, document):
    canvas._ahk_checkpoints = []
    if not hasattr(canvas, '_ahk_selection_cases'):
        canvas._ahk_selection_cases = []
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d7e0e6'))
    canvas.line(48, A4[1] - 39, A4[0] - 48, A4[1] - 39)
    canvas.setFont('Body', 7.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(48, A4[1] - 29, 'REACT GUIDE VI  /  PROYECTO')
    canvas.drawRightString(A4[0] - 48, A4[1] - 29, document.phase_label)
    canvas.line(48, 37, A4[0] - 48, 37)
    canvas.drawString(48, 25, 'Proyecto · Consigna de trabajo')
    canvas.drawRightString(A4[0] - 48, 25, str(document.page))
    canvas.restoreState()


def parse_markdown(source, enabled):
    sty = styles()
    lines = source.splitlines()
    flow, i = [], 0
    phase = re.search(r'F([123])-INICIO', source).group(1)
    prompt_count = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith('<!--'):
            block = [line]
            while '-->' not in block[-1]:
                i += 1
                block.append(lines[i])
            match = MARKER.fullmatch('\n'.join(block))
            if not match:
                raise ValueError('Unrecognized source comment')
            flow.append(InvisibleCheckpoint(*match.groups(), enabled))
            i += 1
            continue
        if line.startswith('```'):
            language = line[3:].strip()
            block = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                block.append(lines[i])
                i += 1
            if i == len(lines):
                raise ValueError('Unclosed code block')
            content = '\n'.join(block)
            if language == 'text' and 'MCP' in content and '3.0.0' in content:
                prompt_count += 1
                flow.append(PromptBlock(content, sty['code'], phase,
                                        f'F{phase}-PROMPT-{prompt_count}', enabled,
                                        maxLineLength=96, splitChars=' '))
            else:
                flow.append(Preformatted(content, sty['code'],
                                         maxLineLength=96, splitChars=' '))
            i += 1
            continue
        heading = re.match(r'^(#{1,3}) (.*)', line)
        if heading:
            level, value = heading.groups()
            flow.append(Paragraph(inline(value), sty[f'h{len(level)}']))
            i += 1
            continue
        if line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', x) for x in cells):
                    rows.append(cells)
                i += 1
            columns = len(rows[0])
            if any(len(row) != columns for row in rows):
                raise ValueError('Inconsistent table columns')
            weights = [1] * columns
            if columns == 3:
                weights = [0.9, 1.6, 1.6]
                if rows[0][0] == 'Herramienta':
                    weights = [1.4, 0.8, 2.3]
            elif columns == 4:
                weights = [0.6, 1.3, 1, 1.7]
            widths = [WIDTH * weight / sum(weights) for weight in weights]
            data = [[Paragraph(inline(cell), sty['headcell' if ri == 0 else 'cell'])
                     for cell in row] for ri, row in enumerate(rows)]
            table = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), BLUE),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f6f8')]),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 7),
                ('RIGHTPADDING', (0, 0), (-1, -1), 7),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LINEBELOW', (0, 0), (-1, -1), 0.3, colors.HexColor('#dce4e9')),
            ]))
            flow.extend([table, Spacer(1, 9)])
            continue
        if line.startswith('> '):
            flow.append(KeepTogether([Paragraph(inline(line[2:]), sty['quote'])]))
            i += 1
            continue
        item = re.match(r'^(- |\d+\. )(.*)', line)
        if item:
            prefix, value = item.groups()
            label = '•' if prefix == '- ' else prefix.strip()
            flow.append(Paragraph(html.escape(label) + ' ' + inline(value), sty['list']))
            i += 1
            continue
        block = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(
                r'^(#{1,3} |```|<!--|\||> |(?:- |\d+\. ))', lines[i]):
            block.append(lines[i])
            i += 1
        flow.append(Paragraph(inline(' '.join(block)), sty['body']))
    return flow


def build(source_path, destination, hidden):
    source = source_path.read_text()
    title = source.splitlines()[0][2:]
    doc = BriefDocument(str(destination), pagesize=A4,
                        rightMargin=48, leftMargin=48, topMargin=54, bottomMargin=50,
                        title=title, author='React Guide VI',
                        subject='Consigna del proyecto; recordatorios AHK en capa de texto no visible')
    doc.phase_label = 'FASE ' + source_path.name[:2].lstrip('0')
    doc.build(parse_markdown(source, hidden), onFirstPage=page_decorations,
              onLaterPages=page_decorations)
    if hidden:
        (TEMP / (destination.stem + '-selection-cases.json')).write_text(json.dumps(
            {'pdf': str(destination.resolve()), 'cases': doc.canv._ahk_selection_cases},
            ensure_ascii=False, indent=2) + '\n')


def verify(source_path, destination):
    source = source_path.read_text()
    reader = PdfReader(destination)
    extracted = {
        'pypdf': '\n'.join(page.extract_text() for page in reader.pages),
        'poppler': subprocess.check_output(['pdftotext', '-enc', 'UTF-8', str(destination), '-']).decode(),
        'poppler_layout': subprocess.check_output(['pdftotext', '-layout', '-enc', 'UTF-8', str(destination), '-']).decode(),
    }
    with pdfplumber.open(destination) as pdf:
        extracted['pdfplumber'] = '\n'.join(page.extract_text() or '' for page in pdf.pages)
    markers = MARKER.findall(source)
    checks = {}
    for engine, content in extracted.items():
        normal = normalize(content)
        checks[engine] = {}
        for marker_id, payload in markers:
            expected = normalize(f'AHK-LEARNING-CHECKPOINT: {marker_id} ' + payload)
            passed = expected in normal
            checks[engine][marker_id] = passed
            if not passed:
                raise AssertionError(f'{source_path.name}: {engine} lost marker {marker_id}')
        (TEMP / f'{source_path.stem}-{engine}.txt').write_text(content)
    plain_source = re.sub(r'^```[^\n]*$', '', source, flags=re.M)
    plain_source = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', plain_source)
    for engine, content in extracted.items():
        missing_words = (Counter(re.findall(r'\w+', plain_source)) -
                         Counter(re.findall(r'\w+', content)))
        if missing_words:
            raise AssertionError(f'{engine}: missing source words: {dict(missing_words)}')
    return {'source': str(source_path.relative_to(ROOT)),
            'source_sha256': hashlib.sha256(source_path.read_bytes()).hexdigest(),
            'pdf': str(destination.relative_to(ROOT)),
            'pdf_sha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
            'pages': len(reader.pages), 'markers': [x[0] for x in markers],
            'extraction': checks, 'all_source_words_preserved': True,
            'invisible_checkpoint_layout_height': 0}


def verify_visual(destination):
    import pypdfium2 as pdfium
    from PIL import Image, ImageDraw

    actual = pdfium.PdfDocument(destination)
    reference = pdfium.PdfDocument(TEMP / (destination.stem + '-control.pdf'))
    if len(actual) != len(reference):
        raise AssertionError('Hidden text changed pagination')
    cards = []
    for i in range(len(actual)):
        picture = actual[i].render(scale=1.25).to_pil().convert('RGB')
        control = reference[i].render(scale=1.25).to_pil().convert('RGB')
        if picture.tobytes() != control.tobytes():
            raise AssertionError(f'Visible checkpoint on {destination.name}, page {i + 1}')
        picture.save(TEMP / f'{destination.stem}-page-{i + 1:02d}.png')
        thumbnail = picture.copy()
        thumbnail.thumbnail((350, 495))
        card = Image.new('RGB', (370, 530), '#dce2e8')
        card.paste(thumbnail, ((370 - thumbnail.width) // 2, 22))
        ImageDraw.Draw(card).text((10, 510), f'{destination.name[:2]} / pagina {i + 1}', fill='black')
        cards.append(card)
    for start in range(0, len(cards), 8):
        sheet = Image.new('RGB', (1480, 1060), 'white')
        for i, card in enumerate(cards[start:start + 8]):
            sheet.paste(card, ((i % 4) * 370, (i // 4) * 530))
        sheet.save(TEMP / f'{destination.stem}-contact-{start // 8 + 1}.png')
    return {'all_pages_pixel_identical_to_control': True, 'pages_compared': len(actual)}


def verify_copy(source):
    copied = TEMP / (source.stem + '-preview-copy.txt')
    content = copied.read_text()
    normal = normalize(content)
    checks = {}
    for marker_id, payload in MARKER.findall(source.read_text()):
        checks[marker_id] = normalize('AHK-LEARNING-CHECKPOINT: ' + marker_id + ' ' + payload) in normal
    if not all(checks.values()):
        raise AssertionError(f'Preview clipboard lost a checkpoint: {source.name}')
    return {'viewer': 'macOS Preview', 'operation': 'Select All, Copy; read system pasteboard',
            'characters': len(content), 'checkpoint_payloads': checks,
            'scope': 'Full document selection; arbitrary partial selections are not guaranteed'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--controls', action='store_true', help='Build matching PDFs without hidden text')
    parser.add_argument('--verify-only', action='store_true', help='Verify existing final PDFs without rebuilding')
    parser.add_argument('--check-copies', action='store_true', help='Verify text captured through Preview copy')
    parser.add_argument('--check-partial-selections', action='store_true',
                        help='Verify prompt rectangles using native macOS PDFKit')
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    TEMP.mkdir(parents=True, exist_ok=True)
    register_fonts()
    reports = []
    for source in sorted((ROOT / 'Projects').glob('*.md')):
        if len(MARKER.findall(source.read_text())) != 6:
            raise ValueError('Expected six source checkpoints per approved brief')
        destination = OUTPUT / (source.stem + '.pdf')
        if not args.verify_only:
            build(source, destination, True)
            if args.controls:
                build(source, TEMP / (source.stem + '-control.pdf'), False)
        report = verify(source, destination)
        if args.controls:
            report['visual'] = verify_visual(destination)
        if args.check_copies:
            report['clipboard'] = verify_copy(source)
        reports.append(report)
        print(source.stem, reports[-1]['pages'], 'pages; all six markers preserved in four extractors')
    if args.check_partial_selections:
        cases = [TEMP / (Path(report['pdf']).stem + '-selection-cases.json') for report in reports]
        subprocess.run(['swift', str(ROOT / 'scripts/verify-project-pdf-selections.swift'),
                        *map(str, cases)], check=True)
        for report, case_path in zip(reports, cases):
            result = json.loads(case_path.with_suffix('.results.json').read_text())
            source = ROOT / report['source']
            full = normalize(result['full_selection_text'])
            footer = {marker_id: normalize('AHK-LEARNING-CHECKPOINT: ' + marker_id + ' ' + payload) in full
                      for marker_id, payload in MARKER.findall(source.read_text())}
            if not all(footer.values()):
                raise AssertionError('PDFKit lost a full-document checkpoint')
            plain = re.sub(r'^```[^\n]*$', '', source.read_text(), flags=re.M)
            plain = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', plain)
            missing = Counter(re.findall(r'\w+', plain)) - Counter(re.findall(r'\w+', full))
            if missing:
                raise AssertionError(f'PDFKit lost source words: {dict(missing)}')
            tested = result['results']
            report['partial_selection'] = {
                'method': result['method'], 'cases_passed': len(tested),
                'prompts': sorted({item['prompt'] for item in tested}),
                'scopes': ['prompt segments on each page', 'all consecutive three-line windows'],
                'all_reminders_preserved': all(item['reminder_preserved'] for item in tested),
                'all_first_visible_lines_preserved': all(item['first_line_preserved'] for item in tested),
                'full_document_checkpoint_payloads': footer,
                'all_source_words_preserved_full_selection': True,
                'visible_layout_changed': False,
                'limitations': 'No guarantee for isolated words/lines, unrelated body fragments, other viewers or OCR',
            }
    (OUTPUT / 'verification.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
