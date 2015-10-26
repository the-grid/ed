import {ProseMirror} from "prosemirror/src/edit/main"
import {Pos, Node} from "prosemirror/src/model"
import {fromDOM} from "prosemirror/src/parse/dom"
import {defaultSchema as schema} from "prosemirror/src/model"

import "prosemirror/src/inputrules/autoinput"
import "prosemirror/src/menu/inlinemenu"
import "prosemirror/src/menu/menubar"
import "prosemirror/src/menu/buttonmenu"
import "prosemirror/src/collab"

import fixture from './fixture'
import GridToDOM from '../src/GridToDOM'


// ProseMirror setup

let pm = window.pm = new ProseMirror({
  place: document.querySelector('#mirror'),
  autoInput: true,
  inlineMenu: true,
  // menuBar: {float: true},
  buttonMenu: {followCursor: true}
})

pm.on('change', function () {
  console.log( 'change', pm.getContent() )
})


// Debug buttons

function toEd () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    console.warn('bad json')
  }
  let dom = GridToDOM(json.content)
  let doc = fromDOM(schema, dom)
  pm.setContent(doc);
}
document.querySelector("#button-to-ed").onclick = toEd

// Simulate changes from API
let timeout;
const letters = 'pskzfgtaaiioo   '.split('')
let randomLetter = function () {
  return letters[ Math.floor(Math.random()*letters.length) ];
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

let apiJSON = document.querySelector("#api")
apiJSON.value = JSON.stringify(fixture, null, 2)
toEd()