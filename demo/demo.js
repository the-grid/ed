/* eslint no-console: 0 */

import Ed from '../src/ed'
import fixture from './fixture'

let ed
const fixtureContent = fixture.content
const isTouchDevice = ('ontouchstart' in window)
let menu = isTouchDevice ? 'bar' : 'tip'

// ProseMirror setup
function setup (options) {
  if (ed) {
    ed.teardown()
    ed = null
  }
  if (options.initialContent) {
    apiJSON.value = JSON.stringify(options.initialContent, null, 2)
  }
  ed = new Ed(
    { container: document.querySelector('#app')
    , initialContent: (options.initialContent || [])
    , menuTip: (options.menu === 'tip')
    , menuBar: (options.menu === 'bar')
    , onChange: () => { console.log('change') }
    , onAutosave: () => { console.log('autosave') }
    , autosaveInterval: 1000
    , onShareFile: onShareFileDemo
    , onShareUrl: onShareUrlDemo
    , imgfloConfig: null
    }
  )
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
    let names = []
    for (let i = 0, len = input.files.length; i < len; i++) {
      let file = input.files[i]
      names.push(file.name)
    }

    // Insert placeholder blocks into content
    const ids = ed.insertPlaceholders(index, names.length)

    console.log('app uploads files now and calls ed.updatePlaceholder with updates')

    simulateProgress(
      function (percent) {
        ids.forEach(function (id, index) {
          let status = `Uploading ${names[index]}`
          ed.updatePlaceholder(id, status, percent)
        })
      },
      function () {
        const updatedBlocks = ids.map(function (id, index) {
          return (
            { id
            , type: 'image'
            , metadata: {title: names[index]}
            , cover:
              { src: 'http://meemoo.org/images/meemoo-illo-by-jyri-pieniniemi-400.png'
              , width: 400
              , height: 474
              }
            }
          )
        })
        ed.setContent(updatedBlocks)
      }
    )
  }
}

// File picker debug
document.getElementById('upload').onclick = function () {
  window.ed.pm.signal('ed.menu.file', 1)
}

// onShareUrl demo
function onShareUrlDemo (share) {
  const {block, url} = share
  console.log(share)
  console.log('app shares url now and calls ed.setContent() with updates')

  simulateProgress(
    function (percent) {
      const status = `Sharing ${url}`
      ed.updatePlaceholder(block, status, percent)
    },
    function () {
      ed.setContent([
        { id: block
        , type: 'article'
        , metadata:
          { title: 'Shared article title'
          , description: `Simulated share from ${url}`
          }
        , cover:
          { src: 'http://meemoo.org/images/meemoo-illo-by-jyri-pieniniemi-400.png'
          , width: 400
          , height: 474
          }
        }
      ])
    }
  )
}

function simulateProgress (progress, complete) {
  let percent = 0
  let animate = function () {
    percent++
    if (percent < 100) {
      // Loop animation
      requestAnimationFrame(animate)
      // Update placeholder status
      progress(percent)
    } else {
      // Change placeholder to article block
      complete()
    }
  }
  animate()
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
apiJSON.value = '[]'
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

// Load full post
function loadFixture () {
  setup({menu, initialContent: fixtureContent})
}
document.querySelector('#fixture').onclick = loadFixture

