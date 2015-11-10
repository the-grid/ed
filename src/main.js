import {ProseMirror} from 'prosemirror/src/edit/main'
import {Pos, Node} from 'prosemirror/src/model'
import {fromDOM} from 'prosemirror/src/parse/dom'

import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/inlinemenu'
import 'prosemirror/src/menu/menubar'
import 'prosemirror/src/menu/buttonmenu'
import 'prosemirror/src/collab'

import GridSchema from './GridSchema'
import GridToDOM from './GridToDOM'
import DocToGrid from './DocToGrid'


export default class Ed {
  constructor (options) {
    if (!options.container) options.container = document.body
    this.container = options.container

    this.pm = new ProseMirror({
      place: this.container,
      autoInput: true,
      inlineMenu: true,
      buttonMenu: {followCursor: true},
      schema: GridSchema
    })

    if (options.onChange) {
      this.pm.on('change', function () {
        // FIXME this.post?
        options.onChange( 'change' )
      })
    }

    if (options.post) this.post = options.post
  }
  teardown () {
    this.pm.off('change')
    this.container.innerHTML = ''
  }
  set post (post) {
    this._post = post
    let dom = GridToDOM(post.content)
    let doc = fromDOM(GridSchema, dom)
    this.pm.setDoc(doc, this.pm.selection)
  }
  get post () {
    let doc = this.pm.getContent()
    let changed = DocToGrid(doc, this._post)
    return changed
  }
}
