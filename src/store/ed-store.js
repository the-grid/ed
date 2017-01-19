import _ from '../util/lodash'
import uuid from 'uuid'

import {isMediaType} from '../convert/types'
import {indexToPos, indexOfId} from '../util/pm'

import DocToGrid from '../convert/doc-to-grid'
import IframeInfo from '../plugins/iframe-info'
import EdSchema from '../schema/ed-schema'

function noop () {}


export default class EdStore {
  constructor (options) {
    if (!options) {
      throw new Error('Missing options')
    }

    // Initialize store
    this._events = {}
    this._content = {}
    this._coverPreviews = {}
    this._progressInfo = {}
    this._initializeContent(options.initialContent)

    // Events
    this.on('change', options.onChange)
    options.onChange = this.routeChange.bind(this)
    this.onShareUrl = options.onShareUrl
    this.onPlaceholderCancel = options.onPlaceholderCancel || noop
    this.onCommandsChanged = options.onCommandsChanged
    this.onRequestCoverUpload = options.onRequestCoverUpload
    options.onDropFiles = options.onDropFiles || noop
    this.onDropFileOnBlock = options.onDropFileOnBlock || noop

    this.onShareFile = options.onShareFile || noop
    this.on('command.menu.file', this.onShareFile)
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
      case 'MEDIA_BLOCK_UPDATE_FIELD':
        const mutatedBlock = this._updateFieldByPath(payload)
        this.trigger('media.update.id', payload.id)
        this.trigger('change')
        return mutatedBlock
      case 'MEDIA_BLOCK_REMOVE':
        this._removeMediaBlock(payload)
        this.trigger('change')
        break
      case 'MEDIA_BLOCK_REQUEST_COVER_UPLOAD':
        this.onRequestCoverUpload(payload)
        break
      case 'MEDIA_BLOCK_COVER_REMOVE':
        const noCoverBlock = this._removeCover(payload)
        this.trigger('change')
        return noCoverBlock
      case 'MEDIA_BLOCK_DROP_FILE':
        this.onDropFileOnBlock(payload.id, payload.file)
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
      case 'ADD_MEDIA':
        this._addMedia(payload)
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

    this.pm.editor.focus()
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
    this.pm.editor.execCommand(commandName)
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
  _updateFieldByPath ({id, path, value}) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not update this block')
    }
    if (!path || !path.length) {
      throw new Error('Invalid update path')
    }
    // MUTATION
    let parent = block
    for (let i = 0, length = path.length; i < length - 1; i++) {
      const key = path[i]
      if (!parent[key]) {
        parent[key] = {}
      }
      parent = parent[key]
    }
    const key = path[path.length - 1]
    parent[key] = value

    if (value === undefined) {
      if (key === 0) {
        // HACK only for author array
        parent.shift()
      } else {
        delete parent[key]
      }
    }

    return block
  }
  _removeCover (id) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not find this block id')
    }
    const preview = this.getCoverPreview(id)
    if (preview) {
      delete this._coverPreviews[id]
    }
    if (block.cover) {
      // MUTATION
      delete block.cover
    }
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

    const index = indexOfId(this.pm.editor.state.doc, id)
    if (index === -1) {
      throw new Error('Can not find node with this id')
    }
    const nodeToRemove = this.pm.editor.state.doc.child(index)
    const pos = indexToPos(this.pm.editor.state.doc, index)

    const state = this.pm.editor.state
    const dispatch = this.pm.editor.dispatch

    dispatch(
      state.tr
        .delete(pos, pos + nodeToRemove.nodeSize)
    )
  }
  _dedupeIds () {
    let ids = []
    for (let i = 0, len = this.pm.editor.state.doc.childCount; i < len; i++) {
      const node = this.pm.editor.state.doc.child(i)
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
  }
  getBlock (id) {
    return this._content[id]
  }
  _replaceBlock (index, block) {
    if (!this.pm) {
      throw new Error('pm not ready')
    }

    const {type, id, metadata} = block
    let widget
    if (metadata && metadata.widget) {
      widget = metadata.widget
    } else {
      widget = type
    }
    if (!isMediaType(type)) {
      throw new Error('_replaceBlock with non-media blocks not yet implemented.')
    }
    const replaceNode = this.pm.editor.state.doc.maybeChild(index)
    if (!replaceNode) {
      throw new Error('Node to replace not found.')
    }

    this._initializeContent([block])

    let initialHeight = 72
    const info = IframeInfo[type]
    if (info) {
      initialHeight = info.initialHeight
    }

    const node = EdSchema.nodes.media.create(
      { id,
        type,
        widget,
        initialHeight,
        // initialFocus,
      }
    )
    const pos = indexToPos(this.pm.editor.state.doc, index)

    const state = this.pm.editor.state
    const dispatch = this.pm.editor.dispatch

    dispatch(
      state.tr
        // Delete the node to replace
        .delete(pos, pos + replaceNode.nodeSize)
        // Insert the block
        .insert(pos, node)
    )

    // if (initialFocus) {
    //   // Hide tooltip
    //   this.pm.content.blur()
    // }
  }
  _insertBlocks (index, blocks) {
    this._initializeContent(blocks)

    let nodes = []

    for (let i = 0, len = blocks.length; i < len; i++) {
      const block = blocks[i]
      const {type, id, metadata} = block
      let widget
      if (metadata && metadata.widget) {
        widget = metadata.widget
      } else {
        widget = type
      }
      if (!isMediaType(type)) {
        throw new Error('_insertBlocks with non-media blocks not yet implemented.')
      }
      const node = EdSchema.nodes.media.create(
        { id,
          type,
          widget,
        }
      )
      nodes.push(node)
    }

    const state = this.pm.editor.state
    const dispatch = this.pm.editor.dispatch
    const pos = indexToPos(state.doc, index)
    dispatch(
      state.tr.insert(pos, nodes)
    )

    // if (initialFocus) {
    //   // Hide tooltip
    //   this.pm.content.blur()
    // }
  }
  _addMedia ({index, type, widgetType}) {
    let block =
      { id: uuid.v4(),
        type,
        html: '',
        metadata: {},
      }
    if (widgetType) {
      block.metadata.widget = widgetType
    }
    this._insertBlocks(index, [block])
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
        { id,
          type: 'placeholder',
          metadata: {starred},
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
  updateProgress (id, metadata) {
    let block = this.getBlock(id)
    if (!block) {
      throw new Error('Can not find this block')
    }
    if (block.type !== 'placeholder' && block.type !== 'image' && block.type !== 'article') {
      throw new Error('Block is not a placeholder, image, or article block')
    }
    if (!this._progressInfo[id]) {
      this._progressInfo[id] = {}
    }
    const meta = this._progressInfo[id]
    const {status, progress, failed} = metadata
    if (status !== undefined) meta.status = status
    if (progress !== undefined) meta.progress = progress
    if (failed !== undefined) meta.failed = failed
    // Let content widgets know to update
    this.trigger('media.update.id', id)
  }
  getProgressInfo (id) {
    return this._progressInfo[id]
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
    // Let content widgets know to update
    this.trigger('media.update.id', id)
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
    // Let widgets know to update
    this.trigger('media.update.id', id)
  }
  _convertToFullPost () {
    throw new Error('_convertToFullPost not updated to PM 0.17.x')
  }
  getContent () {
    return DocToGrid(this.pm.editor.state.doc, this._content)
  }
  setContent (content) {
    this._applyTransform(content)
    // Let widgets know to update
    this.trigger('media.update')
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
      if (this._applyTransformCheckBlock(currentBlock, block)) {
        const index = indexOfId(this.pm.editor.state.doc, id)
        if (index === -1) {
          continue
        }
        this._replaceBlock(index, block)
        continue
      }
    }
  }
  // Whitelisted changes that we accept from API... otherwise could be stale data
  _applyTransformCheckBlock (currentBlock, block) {
    if (currentBlock.type !== block.type) return true
    if (!currentBlock.cover && block.cover) return true
    if (currentBlock.cover && block.cover && currentBlock.cover.src !== block.cover.src) return true
    return false
  }
}
