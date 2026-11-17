import { gsap } from 'gsap'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/sora/600.css'
import './style.css'
import { chapters, makeStory, dataFor } from './story.js'

const $ = (id) => document.getElementById(id)
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const fullStory = makeStory(true)
let steps = makeStory()
let index = 0
let playing = false
let timer
let motion

// Un único reloj de movimiento, con posiciones calculadas y pasos reversibles.
const timeline = gsap.timeline({ paused: true })

for (const step of fullStory) {
  const at = step.id * 1.2

  timeline.addLabel('step-' + step.id, at)
  timeline.set('#packet, #moving-file', { opacity: 0 }, at)
  timeline.set('#movie-drawer, #series-drawer', { y: 0, opacity: 1 }, at)
  timeline.set('#clerk-arm', { rotation: 0, svgOrigin: '514 334' }, at)

  if (step.effect === 'request') {
    timeline.fromTo('#packet',
      { x: 1060, y: 242, opacity: 1 },
      { x: 1190, y: 242, opacity: 1, duration: .75, ease: 'power1.inOut', immediateRender: false },
      at + .05,
    ).to('#packet', { opacity: 0, duration: .1 }, at + .82)
  }

  if (step.effect === 'response') {
    timeline.fromTo('#packet',
      { x: 1190, y: 373, opacity: 1 },
      { x: 1060, y: 373, opacity: 1, duration: .75, ease: 'power1.inOut', immediateRender: false },
      at + .05,
    ).to('#packet', { opacity: 0, duration: .1 }, at + .82)
  }

  if (step.effect === 'serve') {
    timeline.fromTo('#moving-file',
      { x: 740, y: 110, opacity: 1 },
      { x: 270, y: 110, opacity: 1, duration: .75, ease: 'power2.inOut', immediateRender: false },
      at + .05,
    ).to('#moving-file', { opacity: 0, duration: .1 }, at + .82)
  }

  if (step.effect === 'drawer' || step.effect === 'store') {
    const drawer = step.active === 'series' ? '#series-drawer' : '#movie-drawer'

    timeline.fromTo(drawer, {
      y: 14,
      opacity: step.effect === 'store' ? 0 : 1,
    }, {
      y: 0, opacity: 1, duration: .65, ease: 'power2.out', immediateRender: false,
    }, at + .05)
    timeline.to('#clerk-arm', { rotation: -8, duration: .3 }, at + .05)
      .to('#clerk-arm', { rotation: 0, duration: .3 }, at + .4)
  }
}

window.__timelines = { 'mostrador-cache': timeline }

function draw() {
  const step = steps[index]
  $('stage').dataset.step = String(step.id)
  $('step-number').textContent = String(index + 1).padStart(2, '0')
  $('chapter-name').textContent = chapters[step.chapter]
  $('step-title').textContent = step.title
  $('description').textContent = step.description
  $('takeaway').textContent = step.takeaway
  $('detail').textContent = step.detail
  $('request-label').textContent = step.request
  $('clock-label').textContent = 'Reloj simulado · ' + step.clock
  $('request-count').textContent = String(step.requests)

  const hasRequest = step.request.startsWith('Dune')
  $('ticket-title').textContent = hasRequest ? 'Dune' : 'Tu consulta'
  $('ticket-type').textContent = 'Título + tipo'

  if (hasRequest) {
    $('ticket-type').textContent = step.request.includes('series') ? 'Series' : 'Películas'
  }
  $('ticket').classList.toggle('user-change', step.effect === 'user')

  for (const type of ['movie', 'series']) {
    const state = step[type]
    const drawer = $(type + '-drawer')
    drawer.classList.toggle('selected', step.focus === type)
    drawer.classList.toggle('fresh', state === 'fresh')
    drawer.classList.toggle('stale', state === 'stale')
    drawer.classList.toggle('has-file', state !== 'empty')
    drawer.toggleAttribute('hidden', state === 'empty')

    let label = 'Sin respuesta'

    if (state === 'fresh') {
      label = 'Reciente'
    }

    if (state === 'stale') {
      label = 'Necesita revisión'
    }

    $(type + '-state').textContent = label
  }

  $('empty-cabinet').toggleAttribute('hidden', step.movie !== 'empty' || step.series !== 'empty')

  $('request-route').classList.toggle('is-active', step.fetching)
  $('response-route').classList.toggle('is-active', step.effect === 'response')
  $('local-route').classList.toggle('is-active', step.effect === 'user')
  $('cache-route').classList.toggle('is-active',
    ['movie', 'series'].includes(step.focus) || ['store', 'serve'].includes(step.effect),
  )

  const results = $('visible-results')
  results.replaceChildren()

  if (step.served === 'none') {
    results.textContent = 'Sin resultados en pantalla'
  } else if (step.served === 'loading') {
    results.textContent = 'Consultando…'
  } else {
    for (const title of dataFor(step.served, step.servedVersion)) {
      const item = document.createElement('p')
      item.className = 'result-item'
      item.textContent = title
      results.append(item)
    }
  }

  $('person-view').classList.toggle('loading', ['none', 'loading'].includes(step.served))
  $('fetch-label').classList.toggle('fetching', step.fetching)
  $('fetch-label').textContent = step.fetching ? 'Petición en curso' : 'Sin petición en curso'

  const chapterIds = [...new Set(steps.map((s) => s.chapter))]
  $('chapters').innerHTML = chapterIds.map((c) =>
    '<button data-chapter="' + c + '" aria-pressed="' + (c === step.chapter) + '">' + chapters[c] + '</button>',
  ).join('')

  $('milestones').innerHTML = steps.filter((s) => s.chapter === step.chapter).map((s) =>
    '<button class="milestone" data-step="' + s.id + '"' +
    (s.id === step.id ? ' aria-current="step"' : '') +
    ' aria-label="Ir al paso ' + (s.id + 1) + ': ' + s.title + '">' +
    '<span>' + String(s.id + 1).padStart(2, '0') + '</span></button>',
  ).join('')

  $('previous').disabled = index === 0
  $('next').disabled = index === steps.length - 1
  $('play').textContent = playing ? 'Ⅱ Pausar' : '▶ Reproducir'
}

function stop() {
  playing = false
  clearTimeout(timer)
  $('play').textContent = '▶ Reproducir'
}

function go(target, automatic = false) {
  if (!automatic) {
    stop()
  }

  motion?.kill()
  index = Math.max(0, Math.min(steps.length - 1, target))
  draw()

  const at = steps[index].id * 1.2
  timeline.seek(at)

  if (reduced.matches) {
    timeline.seek(at + 1.05)
  } else {
    motion = timeline.tweenTo(at + 1.05, { duration: 1.05, ease: 'none' })
  }
}

function schedule() {
  clearTimeout(timer)

  if (!playing) {
    return
  }

  timer = setTimeout(() => {
    go(index + 1, true)

    if (index === steps.length - 1) {
      stop()
    } else {
      schedule()
    }
  }, Number($('speed').value) * 1000)
}

function togglePlay() {
  if (playing) {
    stop()
    return
  }

  if (index === steps.length - 1) {
    go(0)
  }

  playing = true
  $('play').textContent = 'Ⅱ Pausar'
  schedule()
}

$('previous').onclick = () => go(index - 1)
$('next').onclick = () => go(index + 1)
$('play').onclick = togglePlay
$('restart').onclick = () => go(0)
$('speed').onchange = schedule
$('include-extra').onchange = () => {
  steps = makeStory($('include-extra').checked)
  go(Math.min(index, steps.length - 1))
}
$('chapters').onclick = (event) => {
  const button = event.target.closest('[data-chapter]')

  if (button) {
    go(steps.findIndex((s) => s.chapter === Number(button.dataset.chapter)))
  }
}
$('milestones').onclick = (event) => {
  const button = event.target.closest('[data-step]')

  if (button) {
    go(Number(button.dataset.step))
    $('milestones').querySelector('[aria-current]').focus({ preventScroll: true })
  }
}
$('help').onclick = () => {
  stop()
  $('help-dialog').showModal()
}
$('close-help').onclick = () => $('help-dialog').close()
$('fullscreen').onclick = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await document.documentElement.requestFullscreen()
    }
  } catch {
    $('fullscreen').textContent = 'Usa pantalla completa del navegador'
  }
}

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey ||
      event.target.matches('input, select, textarea') || $('help-dialog').open) {
    return
  }

  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End', ' '].includes(event.key)) {
    return
  }

  if (event.key === ' ' && event.target.closest('button')) {
    return
  }

  event.preventDefault()
  const focusedMilestone = event.target.closest('.milestone')

  if (event.key === 'ArrowRight') {
    go(index + 1)
  }

  if (event.key === 'ArrowLeft') {
    go(index - 1)
  }

  if (event.key === 'Home') {
    go(0)
  }

  if (event.key === 'End') {
    go(steps.length - 1)
  }

  if (event.key === ' ') {
    togglePlay()
  }

  if (focusedMilestone) {
    $('milestones').querySelector('[aria-current]').focus({ preventScroll: true })
  }
})

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stop()
  }
})
reduced.addEventListener('change', () => go(index))
go(0)

