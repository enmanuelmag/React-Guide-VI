export function mountSlideChrome(root = document) {
  const sections = [...root.querySelectorAll(".reveal .slides > section")]

  sections.forEach((section, index) => {
    if (section.dataset.chrome === "none") return

    const frame = section.querySelector(":scope > .slide-frame")
    if (!frame) return

    const signature = document.createElement("span")
    signature.className = "slide-signature"
    signature.setAttribute("aria-hidden", "true")

    const folio = document.createElement("span")
    folio.className = "slide-folio"
    folio.textContent = String(index + 1).padStart(2, "0")
    folio.setAttribute("aria-hidden", "true")

    frame.append(signature, folio)
  })
}
