#!/usr/bin/env python3
"""Safely prepare unpublished Canvas modules from this repository."""
from __future__ import annotations

import argparse
import getpass
import html as html_lib
import json
import mimetypes
import os
import re
import sys
import uuid
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urljoin
from urllib.request import HTTPRedirectHandler, Request, build_opener

ROOT = Path(__file__).resolve().parents[1]
COURSE_ROOT = ROOT / "course"
CANVAS_URL = "https://aulavirtual.espol.edu.ec"
HEADERS = ("Previo a la clase", "Durante la clase", "Posterior a la clase")


class CanvasError(RuntimeError): pass


def load_local_env():
    """Load simple KEY=VALUE entries from the repository's untracked .env file."""
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key, value = key.strip(), value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if key:
            os.environ.setdefault(key, value)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None


class Canvas:
    def __init__(self, base_url, token):
        self.base_url, self.token = base_url.rstrip("/") + "/", token

    def request(self, method, path, data=None, *, auth=True, follow=True, body=None, content_type=None):
        headers = {"Accept": "application/json"}
        if auth: headers["Authorization"] = f"Bearer {self.token}"
        if data is not None:
            body, headers["Content-Type"] = urlencode(data, doseq=True).encode(), "application/x-www-form-urlencoded"
        elif content_type: headers["Content-Type"] = content_type
        request = Request(urljoin(self.base_url, path.lstrip("/")), body, headers=headers, method=method)
        try:
            with (build_opener() if follow else build_opener(NoRedirect())).open(request, timeout=45) as response:
                raw, response_headers = response.read(), dict(response.headers.items())
        except HTTPError as error:
            if not follow and error.code in (301, 302, 303, 307, 308): return None, dict(error.headers.items())
            raise CanvasError(f"Canvas respondió {error.code}: {error.read().decode('utf-8', 'replace')[:240]}") from error
        except URLError as error:
            raise CanvasError(f"No se pudo conectar con Canvas: {error.reason}") from error
        if not raw: return None, response_headers
        try: return json.loads(raw.decode()), response_headers
        except json.JSONDecodeError: return raw, response_headers

    def get(self, path): return self.request("GET", path)[0]
    def post(self, path, data): return self.request("POST", path, data)[0]
    def put(self, path, data): return self.request("PUT", path, data)[0]
    def delete(self, path): return self.request("DELETE", path)[0]

    def pages(self, path):
        result, next_url = [], path
        while next_url:
            page, headers = self.request("GET", next_url)
            if not isinstance(page, list): raise CanvasError("Canvas no devolvió una lista.")
            result.extend(page); next_url = None
            for link in headers.get("Link", "").split(","):
                if 'rel="next"' in link:
                    match = re.search(r"<([^>]+)>", link)
                    if match: next_url = match.group(1)
        return result

    def upload(self, course_id, file_path, remote_name=None):
        remote_name = remote_name or file_path.name
        creation = self.post(f"/api/v1/courses/{course_id}/files", {
            "name": remote_name, "size": file_path.stat().st_size,
            "content_type": mimetypes.guess_type(file_path.name)[0] or "text/html", "locked": "true",
            "on_duplicate": "rename",
        })
        if not isinstance(creation, dict) or "upload_url" not in creation: raise CanvasError("Canvas no inició la carga.")
        body, content_type = multipart(creation["upload_params"], file_path, remote_name)
        response, headers = self.request("POST", creation["upload_url"], auth=False, follow=False, body=body, content_type=content_type)
        if isinstance(response, dict) and response.get("id"): return response
        location = next((value for key, value in headers.items() if key.lower() == "location"), None)
        if not location:
            raise CanvasError("Canvas no confirmó la carga; la respuesta no incluyó una ubicación de confirmación.")
        confirmed = self.get(location)
        if not isinstance(confirmed, dict) or not confirmed.get("id"): raise CanvasError("Canvas no devolvió el archivo cargado.")
        return confirmed


def multipart(fields, file_path, remote_name=None):
    boundary, chunks = f"----ReactGuide{uuid.uuid4().hex}", []
    for name, value in fields.items():
        chunks += [f"--{boundary}\r\n".encode(), f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(), str(value).encode(), b"\r\n"]
    mime = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
    filename = remote_name or file_path.name
    chunks += [f"--{boundary}\r\n".encode(), f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode(), f"Content-Type: {mime}\r\n\r\n".encode(), file_path.read_bytes(), b"\r\n", f"--{boundary}--\r\n".encode()]
    return b"".join(chunks), f"multipart/form-data; boundary={boundary}"


def sessions(selected):
    result = []
    for directory in sorted(COURSE_ROOT.iterdir()):
        match = re.match(r"^(\d{2})-", directory.name)
        if not directory.is_dir() or not match: continue
        number = int(match.group(1))
        if selected and number not in selected: continue
        source, html = directory / "pre-class-reading.md", directory / "pre-class-reading.html"
        student_html = directory / "student-guide.html"
        if not source.exists() or not html.exists() or not student_html.exists():
            raise CanvasError(f"Falta una lectura o guía HTML en {directory.name}. Ejecuta pnpm readings:generate.")
        heading = next((line[2:] for line in source.read_text(encoding="utf-8").splitlines() if line.startswith("# ")), "")
        title = re.sub(r"^Lectura previa\s*·\s*", "", heading) or f"Sesión {number:02d}"
        if title == f"Sesión {number:02d}":
            title = f"Sesión {number:02d} · {directory.name[3:].replace('-', ' ').capitalize()}"
        result.append((number, title, html, student_html, directory / "reading-check.md", directory / "teacher-guide.md"))
    if not result: raise CanvasError("No se encontraron sesiones.")
    return result


def inline_html(text):
    """Convert the small Markdown subset used in reading checks to safe HTML."""
    escaped = html_lib.escape(" ".join(text.split()))
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)


def answer_key(guide_path):
    """Read only the private answer-key section; it is never uploaded."""
    text = guide_path.read_text(encoding="utf-8")
    heading = re.search(r"^## (?:Clave|Respuestas).*?(?:lectura|cuestionario).*?$", text, re.I | re.M)
    if not heading:
        raise CanvasError(f"No se encontró la clave privada en {guide_path.parent.name}.")
    end = re.search(r"^## ", text[heading.end():], re.M)
    section = text[heading.end(): heading.end() + end.start() if end else len(text)]
    answers = {}
    for number, answer in re.findall(r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|", section, re.M):
        answers[int(number)] = answer
    for block in re.finditer(r"^### Pregunta\s+(\d+).*?(?=^### |\Z)", section, re.M | re.S | re.I):
        match = re.search(r"(?:Respuesta|Correcta)\*{0,2}:?\s*\*{0,2}\s*([^\n*]+)", block.group(0), re.I)
        if match:
            answers[int(block.group(1))] = match.group(1)
    for number, answer in re.findall(r"^\s*(\d+)\.\s+\*\*([^*]+)\*\*", section, re.M):
        answers[int(number)] = answer
    normalized = {}
    for number, answer in answers.items():
        match = re.search(r"\b(Verdadero|Falso|[A-D])\b", answer, re.I)
        if match:
            normalized[number] = match.group(1).capitalize()
    return normalized


def reading_questions(reading_path, guide_path):
    """Turn reading-check.md plus its private key into Canvas question payloads."""
    source = reading_path.read_text(encoding="utf-8")
    blocks = list(re.finditer(r"^### (?:Pregunta\s+)?(\d+)(?:\b|\.).*?\n(.*?)(?=^### |\Z)", source, re.M | re.S | re.I))
    key = answer_key(guide_path)
    questions = []
    for block in blocks:
        number, body = int(block.group(1)), block.group(2).strip()
        option_matches = list(re.finditer(r"^\s*(?:[-*]\s*)?([A-D])\.\s+(.+)$", body, re.M))
        true_false = re.findall(r"^\s*[-*]\s*(Verdadero|Falso)\s*$", body, re.M | re.I)
        if option_matches:
            options = [(match.group(1), match.group(2).strip()) for match in option_matches]
            prompt = body[:option_matches[0].start()].strip()
            question_type = "multiple_choice_question"
        elif len(true_false) == 2:
            options = [(value.capitalize(), value.capitalize()) for value in true_false]
            first = re.search(r"^\s*[-*]\s*(?:Verdadero|Falso)\s*$", body, re.M | re.I)
            prompt = body[:first.start()].strip()
            question_type = "true_false_question"
        else:
            raise CanvasError(f"No se pudieron leer las opciones de la pregunta {number} en {reading_path.parent.name}.")
        correct = key.get(number)
        labels = {label for label, _ in options}
        if correct not in labels:
            raise CanvasError(f"La clave de la pregunta {number} no coincide con sus opciones en {reading_path.parent.name}.")
        questions.append({"number": number, "text": inline_html(prompt), "type": question_type,
                          "options": options, "correct": correct})
    if not questions:
        raise CanvasError(f"No se encontraron preguntas en {reading_path.parent.name}.")
    if len(questions) != len(key):
        raise CanvasError(f"La lectura y su clave no tienen el mismo número de preguntas en {reading_path.parent.name}.")
    return questions


def plan(items, with_quizzes):
    print("Vista previa local: no se contacta Canvas ni se pide token.\n")
    for _, title, html, student_html, reading_check, guide in items:
        print(f"- {title}\n  - {HEADERS[0]}: {html.name}\n  - {HEADERS[1]}: {student_html.name}\n  - {HEADERS[2]}")
        if with_quizzes:
            print(f"    - Control de lectura: {len(reading_questions(reading_check, guide))} preguntas autocorregibles")
    print(f"\nTotal: {len(items)} módulos. Con --apply todos serán borradores no publicados.")


def subheader(canvas, course_id, module_id, items, title, position):
    existing = next((x for x in items if x.get("type") == "SubHeader" and x.get("title") == title), None)
    if existing:
        if existing.get("position") != position:
            updated = canvas.put(f"/api/v1/courses/{course_id}/modules/{module_id}/items/{existing['id']}", {"module_item[position]": position})
            items[items.index(existing)] = updated
        return
    items.append(canvas.post(f"/api/v1/courses/{course_id}/modules/{module_id}/items", {
        "module_item[type]": "SubHeader", "module_item[title]": title,
        "module_item[position]": position, "module_item[published]": "false",
    }))
    print(f"    Añadió: {title}")


def add_file(canvas, course_id, module_id, items, title, file_path, position, remote_name, replace=False):
    existing = next((item for item in items if item.get("type") == "File" and item.get("title") == title), None)
    if existing and not replace:
        if existing.get("position") != position:
            updated = canvas.put(f"/api/v1/courses/{course_id}/modules/{module_id}/items/{existing['id']}", {"module_item[position]": position})
            items[items.index(existing)] = updated
        print(f"    Conserva {title.lower()} existente.")
        return
    uploaded = canvas.upload(course_id, file_path, remote_name)
    if existing:
        canvas.delete(f"/api/v1/courses/{course_id}/modules/{module_id}/items/{existing['id']}")
        items.remove(existing)
        items.append(canvas.post(f"/api/v1/courses/{course_id}/modules/{module_id}/items", {
            "module_item[type]": "File", "module_item[title]": title, "module_item[content_id]": uploaded["id"],
            "module_item[position]": position, "module_item[indent]": 1, "module_item[published]": "false",
        }))
        print(f"    Reemplazó: {title.lower()} ({remote_name})")
        return
    items.append(canvas.post(f"/api/v1/courses/{course_id}/modules/{module_id}/items", {
        "module_item[type]": "File", "module_item[title]": title, "module_item[content_id]": uploaded["id"],
        "module_item[position]": position, "module_item[indent]": 1, "module_item[published]": "false",
    }))
    print(f"    Subió: {file_path.name}")


def ensure_quiz(canvas, course_id, module_id, module_items, title, questions):
    quizzes = canvas.pages(f"/api/v1/courses/{course_id}/quizzes?per_page=100")
    quiz = next((item for item in quizzes if item.get("title") == title), None)
    settings = {
        "quiz[title]": title, "quiz[description]": "<p>Control de lectura posterior a la clase.</p>",
        "quiz[quiz_type]": "practice_quiz", "quiz[published]": "false",
        "quiz[time_limit]": "5", "quiz[allowed_attempts]": "1",
        "quiz[one_question_at_a_time]": "true", "quiz[cant_go_back]": "true",
        "quiz[shuffle_answers]": "true",
        "quiz[show_correct_answers]": "false",
    }
    if quiz is None:
        quiz = canvas.post(f"/api/v1/courses/{course_id}/quizzes", settings)
        print(f"    Creó cuestionario: {title}")
    else:
        quiz = canvas.put(f"/api/v1/courses/{course_id}/quizzes/{quiz['id']}", settings)
        print(f"    Reutiliza cuestionario: {title}")
    existing = canvas.pages(f"/api/v1/courses/{course_id}/quizzes/{quiz['id']}/questions?per_page=100")
    existing_names = {item.get("question_name") for item in existing}
    for question in questions:
        name = f"Pregunta {question['number']}"
        if name in existing_names:
            continue
        payload = [
            ("question[question_name]", name), ("question[question_text]", question["text"]),
            ("question[question_type]", question["type"]),
            ("question[position]", str(question["number"])), ("question[points_possible]", "1"),
        ]
        for index, (label, option) in enumerate(question["options"]):
            payload.extend([
                (f"question[answers][{index}][answer_text]", inline_html(option)),
                (f"question[answers][{index}][answer_weight]", "100" if label == question["correct"] else "0"),
            ])
        canvas.post(f"/api/v1/courses/{course_id}/quizzes/{quiz['id']}/questions", payload)
    if not any(item.get("type") == "Quiz" and item.get("title") == title for item in module_items):
        module_items.append(canvas.post(f"/api/v1/courses/{course_id}/modules/{module_id}/items", {
            "module_item[type]": "Quiz", "module_item[title]": title, "module_item[content_id]": quiz["id"],
            "module_item[position]": 7, "module_item[indent]": 1, "module_item[published]": "false",
        }))
        print("    Añadió el cuestionario al módulo.")


def publish_drafts(canvas, course_id, entries, with_quizzes, replace_materials):
    course = canvas.get(f"/api/v1/courses/{course_id}?include[]=permissions")
    print(f"Curso: {course.get('name', course_id)} ({course_id})\nSolo se crearán borradores no publicados.\n")
    modules = canvas.pages(f"/api/v1/courses/{course_id}/modules?per_page=100")
    for number, title, html, student_html, reading_check, guide in entries:
        module = next((x for x in modules if x.get("name") == title), None)
        if module is None:
            module = canvas.post(f"/api/v1/courses/{course_id}/modules", {"module[name]": title, "module[position]": number, "module[published]": "false"})
            modules.append(module); print(f"  Creó módulo: {title}")
        else: print(f"  Reutiliza módulo: {title}")
        items = canvas.pages(f"/api/v1/courses/{course_id}/modules/{module['id']}/items?per_page=100")
        subheader(canvas, course_id, module["id"], items, HEADERS[0], 1)
        prefix = f"sesion-{number:02d}"
        add_file(canvas, course_id, module["id"], items, "Lectura previa", html, 2,
                 f"{prefix}-lectura-previa.html", replace_materials)
        subheader(canvas, course_id, module["id"], items, HEADERS[1], 3)
        add_file(canvas, course_id, module["id"], items, "Guía de clase", student_html, 4,
                 f"{prefix}-guia-de-clase.html", replace_materials)
        deck_pdf = html.parent / "presentation" / "artifacts" / "presentation.pdf"
        if deck_pdf.exists():
            add_file(canvas, course_id, module["id"], items, "Diapositivas", deck_pdf, 5,
                     f"{prefix}-diapositivas.pdf", replace_materials)
        subheader(canvas, course_id, module["id"], items, HEADERS[2], 6)
        if with_quizzes:
            ensure_quiz(canvas, course_id, module["id"], items,
                        f"Control de lectura · Sesión {number:02d}", reading_questions(reading_check, guide))


def main():
    parser = argparse.ArgumentParser(description="Prepara módulos borrador de Canvas para React Guide VI.")
    parser.add_argument("--canvas-url", default=CANVAS_URL)
    parser.add_argument("--course-id")
    parser.add_argument("--list-courses", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--with-quizzes", action="store_true", help="Crea controles de lectura autocorregibles no calificados.")
    parser.add_argument("--replace-materials", action="store_true", help="Sustituye lecturas, guías y diapositivas existentes.")
    parser.add_argument("--session", type=int, choices=range(1, 20), action="append", metavar="NN")
    args = parser.parse_args()
    load_local_env()
    if args.list_courses and args.apply: parser.error("Usa --list-courses o --apply, no ambos.")
    if args.apply and not args.course_id: parser.error("--apply requiere --course-id.")
    if args.replace_materials and not args.apply: parser.error("--replace-materials requiere --apply.")
    try:
        entries = sessions(set(args.session) if args.session else None)
        if not args.list_courses and not args.apply: return plan(entries, args.with_quizzes)
        access_token = os.getenv("CANVAS_TOKEN") or getpass.getpass("Token de Canvas (oculto): ")
        if not access_token.strip(): raise CanvasError("No se recibió un token.")
        canvas = Canvas(args.canvas_url, access_token.strip())
        if args.list_courses:
            for course in canvas.pages("/api/v1/courses?enrollment_type=teacher&per_page=100"):
                print(f"{course.get('id')}: {course.get('name')} ({course.get('course_code', 'sin código')})")
        else:
            publish_drafts(canvas, args.course_id, entries, args.with_quizzes, args.replace_materials)
            print("\nListo. Revisa los borradores antes de publicar algo.")
    except CanvasError as error:
        print(f"Error: {error}", file=sys.stderr); raise SystemExit(1)


if __name__ == "__main__":
    main()
