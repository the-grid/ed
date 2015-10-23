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

let pm = window.pm = new ProseMirror({
  place: document.querySelector('#wysiwym'),
  autoInput: true,
  inlineMenu: true,
  // menuBar: {float: true},
  buttonMenu: {followCursor: true}
})

function toEd () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    console.warn('bad json')
  }
  let dom = GridToDOM(json.content)
  let doc = fromDOM(schema, dom)
  pm.setDoc(doc);
}

document.querySelector("#button-to-ed").onclick = toEd

// Initial doc
let apiJSON = document.querySelector("#api")
apiJSON.value = JSON.stringify(fixture, null, 2)
toEd()