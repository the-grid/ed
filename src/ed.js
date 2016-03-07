require('./ed.css')
require('./menu/menu.css')

import ReactDOM from 'react-dom'
import './util/react-tap-hack'
import uuid from 'uuid'

import GridToDoc from './convert/grid-to-doc'
import DocToGrid from './convert/doc-to-grid'

import App from './components/app'


export default class Ed {
  constructor (options) {
    if (!options) {
      throw new Error('Missing options')
    }
    if (!options.initialContent) {
      throw new Error('Missing options.initialContent array')
    }
    if (!options.onChange) {
      throw new Error('Missing options.onChange')
    }
    this.container = options.container
    options.onEditableInit = this.onEditableInit.bind(this)
    // Setup main DOM structure
    this.app = ReactDOM.render(App(options), options.container)
  }
  onEditableInit (pm) {
    this.pm = pm
  }
  teardown () {
    ReactDOM.unmountComponentAtNode(this.container)
  }
  getBlock (id) {
    return getItemWithId(this._content, id)
  }
  replaceBlock (index, block) {
    let content = this.getContent()
    // MUTATION
    content.splice(index, 1, block)
    // Render
    this._setMergedContent(content)
  }
  insertBlocks (index, blocks) {
    const content = this.getContent()
    // MUTATION
    const newContent = arrayInsertAll(content, index, blocks)
    // Render
    this._setMergedContent(newContent)
    // Signal
    this.onChange()
  }
  insertPlaceholders (index, count) {
    let toInsert = []
    let ids = []
    for (let i = 0, length = count; i < length; i++) {
      const id = uuid.v4()
      ids.push(id)
      toInsert.push(
        { id
        , type: 'placeholder'
        , metadata: {}
        }
      )
    }
    this.insertBlocks(index, toInsert)
    return ids
  }
  updatePlaceholder (id, status, progress) {
    let block = this.getBlock(id)
    // Mutation
    if (status != null) block.metadata.status = status
    if (progress != null) block.metadata.progress = progress
    // Let widgets know to update
    this.pm.signal('ed.content.changed')
  }
  getContent () {
    let doc = this.pm.getContent()
    return DocToGrid(doc, this._content)
  }
  setContent (content) {
    const merged = mergeContent(this.getContent(), content)
    this._setMergedContent(merged)
  }
  _setMergedContent (content) {
    this._content = content
    let doc = GridToDoc(this._content)
    // Cache selection to restore after DOM update
    let selection = fixSelection(this.pm.selection, doc)
    // Populate ProseMirror
    this.pm.setDoc(doc, selection)
    // Let widgets know to update
    this.pm.signal('ed.content.changed')
  }
}

// Util

function getIndexWithId (array, id) {
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i]
    if (item.id === id) {
      return i
    }
  }
  return -1
}

function getItemWithId (array, id) {
  let index = getIndexWithId(array, id)
  if (index === -1) return
  return array[index]
}

function arrayInsertAll (array, index, arrayToInsert) {
  let before = array.slice(0, index)
  const after = array.slice(index)
  return before.concat(arrayToInsert, after)
}

function mergeContent (oldContent, newContent) {
  // Only add new placeholders and update exiting placeholders
  let merged = oldContent.slice()
  // New placeholders
  for (let i = 0, len = newContent.length; i < len; i++) {
    const block = newContent[i]
    if (block.type === 'placeholder') {
      const index = getIndexWithId(merged, block.id)
      if (index > -1) {
        merged.splice(index, 1, block)
      } else {
        merged.splice(i, 0, block)
      }
    }
  }
  // Old placeholders
  for (let i = 0, len = merged.length; i < len; i++) {
    const block = merged[i]
    if (block.type === 'placeholder') {
      const index = getIndexWithId(newContent, block.id)
      if (index > -1) {
        merged.splice(i, 1, newContent[index])
      }
    }
  }
  return merged
}

// Can't restore selection to a non-focuable (Media) div
function fixSelection (selection, doc) {
  let index = selection.anchor.path[0]
  if (doc.content.content[index] && doc.content.content[index].type.contains !== null) {
    return selection
  }
  while (doc.content.content[index] && doc.content.content[index].type.contains === null) {
    index++
  }
  if (!doc.content.content[index]) {
    return
  }
  // MUTATION
  selection.anchor.path = [index]
  selection.head.path = [index]
  return selection
}
