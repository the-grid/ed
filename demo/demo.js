import {ProseMirror} from "prosemirror/src/edit/main"
import {Pos, Node} from "prosemirror/src/model"
import {fromDOM} from "prosemirror/src/parse/dom"
// import {defaultSchema as schema} from "prosemirror/src/model"
import schema from "../src/GridSchema"

import "prosemirror/src/inputrules/autoinput"
import "prosemirror/src/menu/inlinemenu"
import "prosemirror/src/menu/menubar"
import "prosemirror/src/menu/buttonmenu"
import "prosemirror/src/collab"

import fixture from './fixture'
import GridToDOM from '../src/GridToDOM'
import DocToGrid from '../src/DocToGrid'
let lastAPI = fixture


// ProseMirror setup
let pm = window.pm = new ProseMirror({
  place: document.querySelector('#mirror'),
  autoInput: true,
  inlineMenu: true,
  // menuBar: {float: true},
  buttonMenu: {followCursor: true},
  schema: schema
})

pm.on('change', function () {
  console.log( 'change', pm.getContent() )
})

console.log(pm)


// Debug buttons

// Hydrate
let apiJSON = document.querySelector("#api")
function APIToEditor () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    return console.warn('bad json')
  }
  let dom = GridToDOM(json.content)
  let doc = fromDOM(schema, dom)
  pm.setContent(doc)
  lastAPI = json
}
document.querySelector("#hydrate").onclick = APIToEditor

// Dehydrate
function EditorToAPI () {
  let doc = pm.getContent()
  let changed = DocToGrid(doc, lastAPI)
  apiJSON.value = JSON.stringify(changed, null, 2)
  lastAPI = changed
}
document.querySelector("#dehydrate").onclick = EditorToAPI

// Simulate changes from API
let timeout
const letters = 'pskzfgtaaiioo   '.split('')
let randomLetter = function () {
  return letters[ Math.floor(Math.random()*letters.length) ]
}
let toggleUpdates = function () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  } else {
    timeout = setTimeout(simulateUpdates, 500)
  }
}
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 500)
  // Mutate
  let transform = pm.tr
  let last = transform.before.content[0].content[0].text.length
  let position = new Pos([0], last)
  transform.insertText(position, randomLetter())
  pm.apply(transform)
}
document.querySelector("#sim").onclick = toggleUpdates


// Initial doc
apiJSON.value = JSON.stringify(lastAPI, null, 2)
APIToEditor()

