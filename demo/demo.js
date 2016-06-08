/* eslint no-console: 0 */

import Ed from '../src/ed'
import fixture from './fixture'

let ed
const fixtureContent = fixture.content
const isTouchDevice = ('ontouchstart' in window)
let menu = isTouchDevice ? 'bar' : 'tip'

let apiJSON = document.querySelector('#debug-api')

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
    , onMount: () => { console.log('mount') }
    , onShareFile: onShareFileDemo
    , onShareUrl: onShareUrlDemo
    , onRequestCoverUpload: onRequestCoverUploadDemo
    , onPlaceholderCancel: onPlaceholderCancelDemo
    , onCommandsChanged: (commands) => {}
    , onDropFiles: onDropFilesDemo
    , onDropFileOnBlock: onDropFileOnBlockDemo
    , imgfloConfig: null
    }
  )
  console.log(ed)
  window.ed = ed
}
const initialContent = (window.location.hash === '#fixture' ? fixtureContent : [])
setup({menu, initialContent})

// onShareFile upload demo
let input
function onShareFileDemo (index) {
  console.log('onShareFile: app triggers native picker', index)

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
    const input = event.target
    const files = input.files
    if (!files || !files.length) return
    filesUploadSim(index, files)
  }
}

function filesUploadSim (index, files) {
  // Make placeholder blocks
  let names = []
  for (let i = 0, len = files.length; i < len; i++) {
    const file = files[i]
    const name = file.name.substr(0, file.name.indexOf('.'))
    names.push(name)
  }

  // Insert placeholder blocks into content
  console.log(`app calls ed.insertPlaceholders(${index}, ${files.length}) and gets array of ids`)
  const ids = ed.insertPlaceholders(index, files.length)

  for (let i = 0, len = files.length; i < len; i++) {
    const file = files[i]
    const url = URL.createObjectURL(file)
    ed.setCoverPreview(ids[i], url)
  }

  console.log('app uploads files now and calls `ed.updatePlaceholder(id, meta)` with updates')

  simulateProgress(
    function (progress) {
      ids.forEach(function (id, index) {
        let status = `Uploading ${names[index]}`
        ed.updatePlaceholder(id, {status, progress})
      })
    },
    function () {
      const updatedBlocks = ids.map(function (id, index) {
        return (
          { id
          , type: 'image'
          , metadata: {title: names[index]}
          }
        )
      })
      ed.setContent(updatedBlocks)
    }
  )
}

// File picker debug
document.getElementById('upload').onclick = function () {
  window.ed.pm.signal('ed.menu.file', 1)
}

// onShareUrl demo
function onShareUrlDemo (share) {
  const {block, url} = share
  console.log('onShareUrl: app shares url now and calls ed.updatePlaceholder() with updates', share)

  simulateProgress(
    function (progress) {
      const status = `Sharing ${url}`
      ed.updatePlaceholder(block, {status, progress})
    },
    function () {
      console.log('Share: mount block')
      ed.setContent([
        { id: block
        , type: 'article'
        , metadata:
          { title: 'Shared article title'
          , description: `Simulated share from ${url}`
          }
        }
      ])
      window.setTimeout(function () {
        console.log('Share: mount block + cover')
        ed.setContent([
          { id: block
          , type: 'article'
          , metadata:
            { title: 'Shared article title + cover'
            , description: `Simulated share from ${url}`
            }
          , cover:
            { src: 'http://meemoo.org/images/meemoo-illo-by-jyri-pieniniemi-400.png'
            , width: 400
            , height: 474
            }
          }
        ])
      }, 1000)
    }
  )
}

function simulateProgress (progress, complete) {
  let percent = 0
  let animate = function () {
    percent += 0.5
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
const bangOnContent = document.querySelector('#sim')
let timeout
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 1000)

  let content = ed.getContent()
  ed.setContent(content)
}
let toggleUpdates = function () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
    bangOnContent.textContent = 'Sim changes from API ▶'
  } else {
    timeout = setTimeout(simulateUpdates, 500)
    bangOnContent.textContent = 'Sim changes from API ◼︎'
  }
}
bangOnContent.onclick = toggleUpdates
bangOnContent.click()

// Load full post
function loadFixture () {
  window.location.hash = '#fixture'
  setup({menu, initialContent: fixtureContent})
}
document.querySelector('#fixture').onclick = loadFixture


function onPlaceholderCancelDemo (id) {
  console.log(`App would cancel the share or upload with id: ${id}`)
}

// Cover change

function onRequestCoverUploadDemo (id) {
  console.log('onRequestCoverUpload: app triggers native picker', id)

  // Remove old input from DOM
  if (input && input.parentNode) {
    input.parentNode.removeChild(input)
  }
  input = document.createElement('input')
  input.type = 'file'
  input.multiple = false
  input.accept = 'image/*'
  input.onchange = makeRequestCoverUploadInputOnChange(id)
  input.style.display = 'none'
  document.body.appendChild(input)
  input.click()
}

function makeRequestCoverUploadInputOnChange (id) {
  return function (event) {
    event.stopPropagation()

    const file = input.files[0]
    const src = URL.createObjectURL(file)
    ed.setCoverPreview(id, src)

    console.log('app uploads files now and calls ed.updatePlaceholder with updates')

    simulateProgress(
      function (progress) {
        let status = 'Uploading...'
        ed.updatePlaceholder(id, {status, progress})
      },
      function () {
        // Apps should have dimensions from API
        // and should not need to load the image client-side
        const img = new Image()
        img.onload = function () {
          const {width, height} = img
          ed.setCover(id, {src, width, height})
        }
        img.src = src
      }
    )
  }
}

function onDropFilesDemo (index, files) {
  console.log('onDropFiles: files dropped')
  filesUploadSim(index, files)
}

function onDropFileOnBlockDemo (id, file) {
  console.log('onDropFileOnBlock: file dropped')

  const src = URL.createObjectURL(file)
  ed.setCoverPreview(id, src)

  console.log('app uploads files now and calls ed.updatePlaceholder with updates')

  simulateProgress(
    function (progress) {
      let status = 'Uploading...'
      ed.updatePlaceholder(id, {status, progress})
    },
    function () {
      // Apps should have dimensions from API
      // and should not need to load the image client-side
      const img = new Image()
      img.onload = function () {
        const {width, height} = img
        ed.setCover(id, {src, width, height})
      }
      img.src = src
    }
  )
}
