import Reveal from "reveal.js"
import RevealHighlight from "reveal.js/plugin/highlight"
import RevealNotes from "reveal.js/plugin/notes"
import "reveal.js/reveal.css"
import "../styles/main.css"
import { mountSlideChrome } from "../components/slide-chrome.js"
import { revealOptions } from "./options.js"

const deck = new Reveal({
  ...revealOptions,
  plugins: [RevealHighlight, RevealNotes],
})

mountSlideChrome()

window.RevealDeck = deck
window.deckReady = deck.initialize().then(() => {
  document.documentElement.dataset.deckReady = "true"
  return deck
})
