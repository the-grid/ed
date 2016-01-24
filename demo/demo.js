import Ed from '../src/index'
import fixture from './fixture'

let ed
let content = fixture.content
let isTouchDevice = ('ontouchstart' in window)
let menu = isTouchDevice ? 'bar' : 'tip'

// ProseMirror setup
function setup (options = {menu: 'tip'}) {
  if (ed) {
    ed.teardown()
    ed = null
  }
  ed = new Ed({
    container: document.querySelector('#mirror'),
    initialContent: content,
    menutip: (options.menu === 'tip'),
    menubar: (options.menu === 'bar'),
    onChange: () => { console.log('change') },
    onAutosave: () => { console.log('autosave') },
    autosaveInterval: 1000,
    onPluginEvent: onPluginEvent
  })
  console.log(ed)
  console.log('ed.pm.options.registries', ed.pm.options.registries)
  window.ed = ed
}
function onPluginEvent (name, payload) {
  console.log(name, payload)
}
setup()

// Debug buttons

// Toggle debug
let showDebug = false
let debug = document.getElementById('debug')
let toggleDebug = document.getElementById('debug-toggle')
toggleDebug.onclick = () => {
  if (showDebug) {
    debug.style.display = 'none'
  } else {
    debug.style.display = 'block'
  }
  showDebug = !showDebug
}

// Switch menu
let toggleMenu = document.querySelector('#menu')
toggleMenu.onclick = function (event) {
  if (menu === 'tip') {
    menu = 'bar'
    toggleMenu.textContent = 'Switch to menu tooltip'
  } else {
    menu = 'tip'
    toggleMenu.textContent = 'Switch to menu bar'
  }
  setup({menu})
}

// Hydrate
let apiJSON = document.querySelector('#debug-api')
apiJSON.value = JSON.stringify(content, null, 2)
function APIToEditor () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    return console.warn('bad json')
  }
  ed.setContent(json)
}
document.querySelector('#hydrate').onclick = APIToEditor

// Dehydrate
function EditorToAPI () {
  apiJSON.value = JSON.stringify(ed.content, null, 2)
}
document.querySelector('#dehydrate').onclick = EditorToAPI

// Simulate changes from API
let timeout
const letters = 'pskzfgtaaiioo   '.split('')
let randomLetter = function () {
  return letters[ Math.floor(Math.random() * letters.length) ]
}
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 500)
  // Mutate
  let content = ed.getContent()
  let html = content[0].html
  html = html.slice(0, -4) + randomLetter() + '</p>'
  content[0].html = html
  ed.setContent(content)
}
let toggleUpdates = function () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
    document.querySelector('#sim').textContent = 'Sim changes from API ▶'
  } else {
    timeout = setTimeout(simulateUpdates, 500)
    document.querySelector('#sim').textContent = 'Sim changes from API ◼︎'
  }
}
document.querySelector('#sim').onclick = toggleUpdates
