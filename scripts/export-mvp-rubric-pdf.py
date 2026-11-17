#!/usr/bin/env python3
"""Export the oral MVP rubric directly from its Markdown source."""

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Projects/04-rubrica-defensa-mvp.md'
OUTPUT = ROOT / 'output/pdf/04-rubrica-defensa-mvp.pdf'
FONT_DIR = Path('/System/Library/Fonts/Supplemental')


def inline(text):
    escaped = html.escape(text)
    return re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', escaped)


def main():
    for name, filename in [('Body', 'Arial.ttf'), ('BodyBold', 'Arial Bold.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold')
    ink = colors.HexColor('#17243b')
    blue = colors.HexColor('#263d99')
    body = ParagraphStyle('Body', fontName='Body', fontSize=9.3, leading=12.6,
                          textColor=ink, spaceAfter=5)
    title = ParagraphStyle('Title', parent=body, fontName='BodyBold',
                           fontSize=22, leading=26, spaceAfter=13)
    heading = ParagraphStyle('Heading', parent=body, fontName='BodyBold',
                             fontSize=12, leading=16, textColor=blue,
                             spaceBefore=10, spaceAfter=7, keepWithNext=True)
    cell = ParagraphStyle('Cell', parent=body, fontSize=8.1, leading=10.7,
                          spaceAfter=0)
    headcell = ParagraphStyle('Headcell', parent=cell, fontName='BodyBold',
                              textColor=colors.white)
    story = []
    lines = SOURCE.read_text().splitlines()
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        index += 1
        if not line:
            continue
        if line.startswith('# '):
            story.append(Paragraph(inline(line[2:]), title))
        elif line.startswith('## '):
            if line == '## Tabla de calificación':
                story.append(PageBreak())
            story.append(Paragraph(inline(line[3:]), heading))
        elif line.startswith('|'):
            rows = [line]
            while index < len(lines) and lines[index].startswith('|'):
                rows.append(lines[index])
                index += 1
            data = []
            for row in rows:
                values = [value.strip() for value in row.strip('|').split('|')]
                if all(re.fullmatch(r':?-+:?', value) for value in values):
                    continue
                if len(values) != 6:
                    raise ValueError('Rubric must have six columns')
                style = headcell if not data else cell
                data.append([Paragraph(inline(value), style) for value in values])
            table = Table(data, colWidths=[42, 76, 108, 174, 52, 51],
                          repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), blue),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1),
                 [colors.HexColor('#f0f3f9'), colors.white]),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 5),
                ('RIGHTPADDING', (0, 0), (-1, -1), 5),
                ('TOPPADDING', (0, 0), (-1, -1), 7),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
                ('LINEBELOW', (0, 0), (-1, -1), .4, colors.HexColor('#d4daea')),
            ]))
            story.extend([table, Spacer(1, 4)])
        else:
            if line.startswith('- '):
                line = '- ' + line[2:]
            story.append(Paragraph(inline(line), body))

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#d4daea'))
        canvas.line(46, 34, A4[0] - 46, 34)
        canvas.setFont('Body', 8)
        canvas.setFillColor(ink)
        canvas.drawString(46, 22, 'React Guide VI / MVP / Propuesta de rúbrica oral')
        canvas.drawRightString(A4[0] - 46, 22, str(doc.page))
        canvas.restoreState()

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4,
                            leftMargin=46, rightMargin=46,
                            topMargin=38, bottomMargin=45,
                            title='Rúbrica general: explicación del MVP',
                            author='React Guide VI')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == '__main__':
    main()
