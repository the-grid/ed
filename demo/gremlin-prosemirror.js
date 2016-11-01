import configurable from 'gremlins.js/src/utils/configurable'

function randomChar () {
  return String.fromCharCode(0x00FF * Math.random())
}

function randomFromArray (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}


const config =
  { logger: null,
    randomizer: null
  }

function pmSelecter (pm) {
  const max = pm.doc.nodeSize
  const anchor = config.randomizer.natural({max})
  const head = config.randomizer.natural({max})
  try {
    pm.setTextSelection(anchor, head)
  } catch (e) {}
}

function pmSelecterCollapsed (pm) {
  const max = pm.doc.nodeSize
  const anchor = config.randomizer.natural({max})
  try {
    pm.setTextSelection(anchor)
  } catch (e) {}
}

function pmSelecterNode (pm) {
  const max = pm.doc.nodeSize
  const pos = config.randomizer.natural({max})
  try {
    pm.setNodeSelection(pos)
  } catch (e) {}
}

function pmFocuser (pm) {
  pm.focus()
}

function pmTyper (pm) {
  pm.tr.typeText(randomChar()).apply()
}

function pmSplitter (pm) {
  const max = pm.doc.nodeSize
  const pos = config.randomizer.natural({max})
  try {
    pm.tr.split(pos).apply()
  } catch (e) {}
}

function pmFormatter (pm) {
  const icons = document.body.querySelectorAll('.ProseMirror-icon')
  if (!icons.length) return

  const icon = randomFromArray(icons)
  const event = new MouseEvent('mousedown')
  icon.dispatchEvent(event)
}

const subgremlins =
  [ pmSelecter,
    pmSelecterCollapsed,
    pmSelecterNode,
    pmTyper,
    pmFocuser,
    pmSplitter,
    pmFormatter
  ]

function pmGremlin () {
  const {pm} = window.ed
  const gremlin = randomFromArray(subgremlins)
  gremlin(pm)
}

configurable(pmGremlin, config)

export default pmGremlin
