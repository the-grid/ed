/* eslint no-console: 0 */

import Ed from '../src/ed'
import fixture from './fixture'
import uuid from 'uuid'

let ed
const content = fixture.content
const isTouchDevice = ('ontouchstart' in window)
let menu = isTouchDevice ? 'bar' : 'tip'

// ProseMirror setup
function setup (options) {
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
    onShareFile: onShareFileDemo,
    onShareUrl: onShareUrlDemo,
    imgfloConfig: null
  })
  console.log(ed)
  window.ed = ed
}
setup({menu})

// onShareFile upload demo
let input
function onShareFileDemo (index) {
  // Remove old input from DOM
  if (input && input.parentNode) {
    input.parentNode.removeChild(input)
  }
  input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = 'image/*'
  input.onchange = makeInputOnChange(index)
  input.style.display = 'none'
  document.body.appendChild(input)
  input.click()
}
function makeInputOnChange (index) {
  return function (event) {
    event.stopPropagation()

    // Make placeholder blocks
    const input = event.target
    let blocks = []
    for (let i = 0, len = input.files.length; i < len; i++) {
      let file = input.files[i]
      blocks.push({
        id: uuid.v4(),
        type: 'placeholder',
        metadata: {
          status: `Uploading... ${file.name}`
        }
      })
    }

    // Splice placeholder blocks into content
    const content = ed.getContent()
    const contentSpliced = arrayInsertAll(content, index, blocks)
    ed.setContent(contentSpliced)

    console.log('app uploads files now and calls ed.setContent() with updates')
  }
}
function arrayInsertAll (array, index, arrayToInsert) {
  let before = array.slice(0, index)
  const after = array.slice(index)
  return before.concat(arrayToInsert, after)
}

// File picker debug
document.getElementById('upload').onclick = function () {
  window.ed.pm.signal('ed.menu.file', 1)
}

// onShareUrl demo
function onShareUrlDemo (share) {
  // const {block, url} = share
  console.log(share)
  console.log('app shares url now and calls ed.setContent() with updates')
}

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
  apiJSON.value = JSON.stringify(ed.getContent(), null, 2)
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
