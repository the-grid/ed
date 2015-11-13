import {ProseMirror} from 'prosemirror/src/edit/main'
import {Pos, Node} from 'prosemirror/src/model'

import 'prosemirror/src/inputrules/autoinput'
import 'prosemirror/src/menu/inlinemenu'
import 'prosemirror/src/menu/menubar'
import 'prosemirror/src/menu/buttonmenu'
import 'prosemirror/src/collab'

import GridSchema from './schema'
import GridToDoc from './convert/grid-to-doc'
import DocToGrid from './convert/doc-to-grid'


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
      this.pm.on('change', options.onChange)
    }

    if (options.post) {
      this.post = options.post
    }
  }
  teardown () {
    this.pm.off('change')
    this.container.innerHTML = ''
  }
  set post (post) {
    // Cache the post object that we originally get from the API.
    // We'll need the post and block metadata later, in `get post`.
    this._post = post
    let doc = GridToDoc(post.content)
    // Cache selection to restore after DOM update
    let selection = this.pm.selection
    // Populate ProseMirror
    this.pm.setDoc(doc, selection)
  }
  get post () {
    let doc = this.pm.getContent()
    let changed = DocToGrid(doc, this._post)
    return changed
  }
}
