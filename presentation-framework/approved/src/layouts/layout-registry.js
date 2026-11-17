export const GEOMETRY_IDS = new Set(
  Array.from({ length: 18 }, (_, index) => `G${String(index + 1).padStart(2, "0")}`),
)

export const SEMANTIC_IDS = new Set(
  Array.from({ length: 59 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`),
)

export function readSemanticIds(section) {
  return (section.dataset.semantic ?? "")
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean)
}
