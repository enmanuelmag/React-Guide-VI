import Foundation
import PDFKit

// Read-only native PDFKit selection checks. This does not automate Preview UI
// or claim that every viewer/selection behaves identically.
struct SelectionCase: Codable {
    let prompt: String
    let page: Int
    let scope: String
    let rect: [Double]
    let expected_reminder: String
    let expected_first_line: String
}
struct SelectionInput: Codable {
    let pdf: String
    let cases: [SelectionCase]
}
func normalized(_ value: String) -> String {
    value.split(whereSeparator: { $0.isWhitespace }).joined(separator: " ")
}
var failed = false
for name in CommandLine.arguments.dropFirst() {
    let source = URL(fileURLWithPath: name)
    let input = try JSONDecoder().decode(SelectionInput.self, from: Data(contentsOf: source))
    guard let document = PDFDocument(url: URL(fileURLWithPath: input.pdf)) else {
        fatalError("Cannot read PDF")
    }
    var results: [[String: Any]] = []
    for item in input.cases {
        let box = CGRect(x: item.rect[0], y: item.rect[1], width: item.rect[2], height: item.rect[3])
        let text = document.page(at: item.page - 1)?.selection(for: box)?.string ?? ""
        let reminder = normalized(text).contains(normalized(item.expected_reminder))
        let visible = normalized(text).contains(normalized(item.expected_first_line))
        failed = failed || !reminder || !visible
        results.append(["prompt": item.prompt, "page": item.page, "scope": item.scope,
                        "reminder_preserved": reminder, "first_line_preserved": visible,
                        "selected_text": text])
    }
    let fullSelection = (0..<document.pageCount).map { index in
        let page = document.page(at: index)!
        return page.selection(for: page.bounds(for: .mediaBox))?.string ?? ""
    }.joined(separator: "\n")
    let output = source.deletingPathExtension().appendingPathExtension("results.json")
    let data = try JSONSerialization.data(withJSONObject: ["pdf": input.pdf,
        "method": "PDFKit PDFPage.selection(for: rect).string; no UI clipboard claim",
        "full_selection_text": fullSelection, "results": results], options: [.prettyPrinted, .sortedKeys])
    try data.write(to: output)
    let count = results.filter { ($0["reminder_preserved"] as? Bool) == true && ($0["first_line_preserved"] as? Bool) == true }.count
    print("\(URL(fileURLWithPath: input.pdf).lastPathComponent): \(count)/\(results.count) native partial selections passed")
}
if failed { exit(1) }
