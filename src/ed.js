import {createElement as el} from 'react'
import ReactDOM from 'react-dom'
import './util/react-tap-hack'
import _ from './util/lodash'
import uuid from 'uuid'

import {isMediaType} from './convert/types'
import {indexToPos, indexOfId} from './util/pm'

import DocToGrid from './convert/doc-to-grid'

import App from './components/app'

function noop () {}


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
    if (!options.onShareUrl) {
      throw new Error('Missing options.onShareUrl')
    }
    if (!options.onShareFile) {
      throw new Error('Missing options.onShareFile')
    }
    if (!options.onRequestCoverUpload) {
      throw new Error('Missing options.onRequestCoverUpload')
    }
    if (!options.container) {
      throw new Error('Missing options.container')
    }

    // Initialize store
    this._events = {}
    this._content = {}
    this._coverPreviews = {}
    this._initializeContent(options.initialContent)
    options.store = this

    // Events
    this.on('change', options.onChange)
    options.onChange = this.routeChange.bind(this)
    this.onShareUrl = options.onShareUrl
    this.onShareFile = options.onShareFile
    this.onPlaceholderCancel = options.onPlaceholderCancel || noop
    this.onCommandsChanged = options.onCommandsChanged
    this.onRequestCoverUpload = options.onRequestCoverUpload

    // Listen for first render
    this.on('plugin.widget.initialized', options.onMount || noop)

    // Setup main DOM structure
    this.container = options.container
    this.app = el(App, options)
    ReactDOM.render(this.app, options.container)
  }
  teardown () {
    ReactDOM.unmountComponentAtNode(this.container)
  }
  routeChange (type, payload) {
    switch (type) {
      case 'EDITABLE_INITIALIZE':
        this._editableInitialize(payload)
        break
      case 'MEDIA_BLOCK_UPDATE':
        this._updateMediaBlock(payload)
        this.trigger('change')
        break
      case 'MEDIA_BLOCK_UPDATE_META':
        const mutatedBlock = this._updateMetaByPath(payload)
        this.trigger('change')
        return mutatedBlock
      case 'MEDIA_BLOCK_REMOVE':
        this._removeMediaBlock(payload)
        this.trigger('change')
        break
      case 'MEDIA_BLOCK_REQUEST_COVER_UPLOAD':
        this.onRequestCoverUpload(payload)
        break
      case 'DEDUPE_IDS':
        this._dedupeIds()
        this.trigger('change')
        break
      case 'PLUGIN_URL':
        const {index, id, block, url} = payload
        this._replaceBlock(index, block)
        this.onShareUrl({block: id, url})
        break
      case 'EDITABLE_CHANGE':
        this.trigger('change')
        break
      case 'ADD_IMAGE_TOP':
        this.onShareFile(0)
        break
      case 'ADD_FOLD_DELIMITER':
        this._convertToFullPost()
        break
      case 'PLACEHOLDER_CANCEL':
        this._placeholderCancel(payload)
        break
      default:
        throw new Error(`ed.routeChange '${type}' does not exist`)
    }
  }
  _editableInitialize (editableView) {
    if (this.editableView) {
      throw new Error('Ed._editableInitialize should only be called once')
    }
    this.editableView = editableView
    this.pm = editableView.pm

    this.pm.focus()
  }
  _initializeContent (content) {
    for (let i = 0, len = content.length; i < len; i++) {
      const block = content[i]
      if (!block || !block.id) {
        continue
      }
      this._content[block.id] = block
    }
  }
  execCommand (commandName) {
    if (!this.pm) {
      throw new Error('ProseMirror not set up yet')
    }
    this.pm.execCommand(commandName)
  }
  on (eventName, func) {
    let events = this._events[eventName]
    if (!events) {
      events = this._events[eventName] = []
    }
    events.push(func)
  }
  off (eventName, func) {
    const events = this._events[eventName]
    if (!events) {
      return
    }
    const index = events.indexOf(func)
    if (index > -1) {
      events.splice(index, 1)
    }
  }
  trigger (eventName, payload) {
    const events = this._events[eventName]
    if (!events) {
      return
    }
    for (let i = 0, len = events.length; i < len; i++) {
      events[i](payload)
    }
  }
  _updateMetaByPath ({id, path, value}) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not update this block')
    }
    // MUTATION
    let parent = block.metadata
    for (let i = 0, length = path.length; i < length - 1; i++) {
      parent = parent[path[i]]
    }
    parent[path[path.length - 1]] = value

    return block
  }
  _updateMediaBlock (block) {
    // Widgets and components route here
    if (!block || !block.id) {
      throw new Error('Can not update this block')
    }
    const currentBlock = this.getBlock(block.id)
    if (!currentBlock) {
      throw new Error('Can not find this block')
    }

    // MUTATION
    this._content[block.id] = block
  }
  _removeMediaBlock (id) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not find this block id')
    }

    const index = indexOfId(this.pm.doc, id)
    if (index === -1) {
      throw new Error('Can not find node with this id')
    }
    const nodeToRemove = this.pm.doc.child(index)
    const pos = indexToPos(this.pm.doc, index)
    this.pm.tr
      .delete(pos, pos + nodeToRemove.nodeSize)
      .apply()

    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
  }
  _dedupeIds () {
    let ids = []
    for (let i = 0, len = this.pm.doc.childCount; i < len; i++) {
      const node = this.pm.doc.child(i)
      if (!node.attrs || !node.attrs.id) {
        continue
      }
      let id = node.attrs.id
      if (ids.indexOf(id) !== -1) {
        const block = this.getBlock(id)
        let blockClone = _.cloneDeep(block)
        id = uuid.v4()
        blockClone.id = id
        this._replaceBlock(i, blockClone)
      }
      ids.push(id)
    }
    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
  }
  getBlock (id) {
    return this._content[id]
  }
  _replaceBlock (index, block) {
    if (!this.pm) {
      throw new Error('pm not ready')
    }

    const {type, id} = block
    if (!isMediaType(type)) {
      throw new Error('_replaceBlock with non-media blocks not yet implemented.')
    }
    const replaceNode = this.pm.doc.maybeChild(index)
    if (!replaceNode) {
      throw new Error('Node to replace not found.')
    }

    this._initializeContent([block])

    const node = this.pm.schema.nodes.media.create({id, type})
    const pos = indexToPos(this.pm.doc, index)
    this.pm.tr
      // Delete the node to replace
      .delete(pos, pos + replaceNode.nodeSize)
      // Insert the block
      .insert(pos, node)
      .apply()

    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
  }
  _insertBlocks (index, blocks) {
    if (!this.pm) {
      throw new Error('pm not ready')
    }

    this._initializeContent(blocks)

    for (let i = 0, len = blocks.length; i < len; i++) {
      const block = blocks[i]
      const {type, id} = block
      if (!isMediaType(type)) {
        throw new Error('_insertBlocks with non-media blocks not yet implemented.')
      }

      const node = this.pm.schema.nodes.media.create({id, type})
      const pos = indexToPos(this.pm.doc, index + i)
      this.pm.tr.insert(pos, node).apply()
    }

    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
  }
  insertPlaceholders (index, count) {
    let toInsert = []
    let ids = []
    const fold = this.indexOfFold()
    const starred = (fold === -1 || index < fold)
    for (let i = 0, length = count; i < length; i++) {
      const id = uuid.v4()
      ids.push(id)
      const block =
        { id
        , type: 'placeholder'
        , metadata: {starred}
        }
      toInsert.push(block)
    }
    this._insertBlocks(index, toInsert)
    return ids
  }
  indexOfFold () {
    const blocks = this.getContent()
    for (let i = 0, len = blocks.length; i < len; i++) {
      const block = blocks[i]
      if (!block.metadata || !block.metadata.starred) {
        return i
      }
    }
    return -1
  }
  updatePlaceholder (id, metadata) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not update this placeholder block')
    }
    if (block.type !== 'placeholder' && block.type !== 'image' && block.type !== 'article') {
      throw new Error('Block is not a placeholder block')
    }
    // Mutation
    const {status, progress, failed} = metadata
    if (status != null) block.metadata.status = status
    if (progress != null) block.metadata.progress = progress
    if (failed != null) block.metadata.failed = failed
    // Let content widgets know to update
    this.trigger('media.update')
  }
  _placeholderCancel (id) {
    this._removeMediaBlock(id)
    // Event
    this.onPlaceholderCancel(id)
  }
  setCoverPreview (id, src) {
    const block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not set image preview for block id that does not exist')
    }
    this._coverPreviews[id] = src
  }
  getCoverPreview (id) {
    return this._coverPreviews[id]
  }
  setCover (id, cover) {
    const block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not find block to set cover')
    }
    // MUTATION
    block.cover = cover
    if (block.metadata && block.metadata.progress != null) {
      block.metadata.progress = null
    }
    // Let widgets know to update
    this.trigger('media.update')
  }
  _convertToFullPost () {
    let addTitle = true
    let addFold = true
    let endPos = 0
    for (let i = 0, len = this.pm.doc.childCount; i < len; i++) {
      const node = this.pm.doc.child(i)
      if (node.type.name === 'heading' && node.attrs.level === 1) {
        addTitle = false
      }
      if (node.type.name === 'horizontal_rule') {
        addFold = false
      }
      endPos += node.nodeSize
    }
    if (addTitle) {
      const titleNode = this.pm.schema.nodes.heading.create({level: 1})
      this.pm.tr
        .insert(0, titleNode)
        .apply()
      endPos += titleNode.nodeSize
    }
    if (addFold) {
      const ruleNode = this.pm.schema.nodes.horizontal_rule.create()
      const pNode = this.pm.schema.nodes.paragraph.create()
      this.pm.tr
        .insert(endPos, ruleNode)
        .insert(endPos + ruleNode.nodeSize, pNode)
        .apply()
    }

    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
    // Focus first textblock
    try {
      this.pm.checkPos(1, true)
      this.pm.setTextSelection(1)
    } catch (error) {}
    this.pm.focus()
    this.pm.scrollIntoView()
  }
  getContent () {
    const doc = this.pm.getContent()
    const content = DocToGrid(doc, this._content)
    return content
  }
  setContent (content) {
    this._applyTransform(content)
    this._initializeContent(content)
    // Let widgets know to update
    this.trigger('media.update')
    // Trigger event for widget system
    setTimeout(() => this.pm.signal('draw'), 0)
  }
  _applyTransform (content) {
    for (let i = 0, len = content.length; i < len; i++) {
      const block = content[i]
      const {id, type} = block
      if (!isMediaType(type)) {
        continue
      }
      const currentBlock = this._content[id]
      if (!currentBlock) {
        this._insertBlocks(i, [block])
        continue
      }
      if (currentBlock.type !== type) {
        const index = indexOfId(this.pm.doc, id)
        if (index === -1) {
          continue
        }
        this._replaceBlock(index, block)
        continue
      }
    }
  }
}
