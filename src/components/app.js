require('./app.css')

import React, {createElement as el} from 'react'

import AddCover from './add-cover'
import AddFold from './add-fold'
import Editable from './editable'
import rebassTheme from './rebass-theme'
import WidgetEdit from './widget-edit'

import EdStore from '../store/ed-store'
import {edCommands} from '../menu/ed-menu'
import {pseudoFixedStyle} from '../util/browser'


export default class App extends React.Component {
  constructor (props) {
    super(props)

    if (!props.initialContent) {
      throw new Error('Missing props.initialContent')
    }
    if (!props.onChange) {
      throw new Error('Missing props.onChange')
    }
    if (!props.onShareUrl) {
      throw new Error('Missing props.onShareUrl')
    }
    if (!props.onShareFile) {
      throw new Error('Missing props.onShareFile')
    }
    if (!props.onRequestCoverUpload) {
      throw new Error('Missing props.onRequestCoverUpload')
    }

    const { initialContent
      , onChange
      , onShareFile
      , onShareUrl
      , onRequestCoverUpload
      , onDropFiles
      , onDropFileOnBlock
      , onCommandsChanged } = props

    this._store = new EdStore(
      { initialContent,
        onChange,
        onShareFile,
        onShareUrl,
        onRequestCoverUpload,
        onDropFiles,
        onDropFileOnBlock,
        onCommandsChanged,
      }
    )

    this.routeChange = this._store.routeChange.bind(this._store)

    this._store.on('media.block.edit.open', (blockID) => {
      // TODO expose prop for native editors?
      this.setState({blockToEdit: blockID})
      this.blur()
    })
    this.closeMediaBlockModal = () => {
      this.setState({blockToEdit: null})
    }

    this.state = {
      blockToEdit: null,
    }
  }
  componentDidMount () {
    this.boundOnDragOver = this.onDragOver.bind(this)
    window.addEventListener('dragover', this.boundOnDragOver)
    this.boundOnDrop = this.onDrop.bind(this)
    window.addEventListener('drop', this.boundOnDrop)
    if (this.props.onMount) {
      this.props.onMount(this)
    }
  }
  componentWillUnmount () {
    window.removeEventListener('dragover', this.boundOnDragOver)
    window.removeEventListener('drop', this.boundOnDrop)
  }
  getChildContext () {
    const {imgfloConfig} = this.props
    return (
    { imgfloConfig: imgfloConfig,
      rebass: rebassTheme,
      store: this._store,
    }
    )
  }
  render () {
    return el('div',
      {className: 'Ed'},
      this.renderContent(),
      // this.renderHints(),
      this.renderModal()
    )
  }
  renderContent () {
    const { initialContent
      , menuBar
      , onShareFile
      , onShareUrl
      , onCommandsChanged
      , onDropFiles
      , widgetPath
      , coverPrefs } = this.props

    return el('div'
    , { className: 'Ed-Content',
      style:
      { zIndex: 1,
      },
    }
    , el(Editable
      , { initialContent,
        menuBar,
        onChange: this.routeChange,
        onShareFile,
        onShareUrl,
        onCommandsChanged,
        onDropFiles,
        widgetPath,
        coverPrefs,
      }
      )
    )
  }
  renderHints () {
    return el('div'
    , { className: 'Ed-Hints',
    }
    , el(AddCover, {})
    , el(AddFold, {})
    )
  }
  renderModal () {
    const {blockToEdit} = this.state
    if (!blockToEdit) return
    const initialBlock = this._store.getBlock(blockToEdit)
    if (!initialBlock) return
    const {coverPrefs} = this.props

    let position = pseudoFixedStyle()
    position.backgroundColor = 'rgba(255,255,255,0.85)'
    position.zIndex = 4
    position.overflowY = 'auto'

    return el('div',
      {
        className: 'Ed-Modal',
        style: position,
        onClick: this.closeMediaBlockModal,
      },
      el(WidgetEdit, {
        initialBlock,
        coverPrefs,
        onClose: this.closeMediaBlockModal,
      })
    )
  }
  onDragOver (event) {
    // Listening to window
    event.preventDefault()
  }
  onDrop (event) {
    // Listening to window, for drops not caught by content
    event.preventDefault()
  }
  // Exposed methods
  getContent () {
    return this._store.getContent()
  }
  setContent (content) {
    this._store.setContent(content)
  }
  execCommand (commandName) {
    const item = edCommands[commandName]
    if (!item) {
      throw new Error('commandName not found')
    }
    const {state, dispatch} = this._store.pm.editor
    item.spec.run(state, dispatch)
  }
  insertPlaceholders (index, count) {
    return this._store.insertPlaceholders(index, count)
  }
  updatePlaceholder () {
    throw new Error('updatePlaceholder is deprecated: use updateProgress')
  }
  updateProgress (id, metadata) {
    this._store.updateProgress(id, metadata)
  }
  setCoverPreview (id, src) {
    this._store.setCoverPreview(id, src)
  }
  setCover (id, cover) {
    this._store.setCover(id, cover)
  }
  indexOfFold () {
    return this._store.indexOfFold()
  }
  blur () {
    this.pm.editor.content.blur()
    window.getSelection().removeAllRanges()
  }
  get pm () {
    return this._store.pm
  }
}
App.childContextTypes =
{ imgfloConfig: React.PropTypes.object,
  store: React.PropTypes.object,
  rebass: React.PropTypes.object,
}
App.propTypes =
{ initialContent: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onShareFile: React.PropTypes.func.isRequired,
  onShareUrl: React.PropTypes.func.isRequired,
  onDropFiles: React.PropTypes.func,
  onCommandsChanged: React.PropTypes.func,
  onRequestCoverUpload: React.PropTypes.func.isRequired,
  imgfloConfig: React.PropTypes.object,
  widgetPath: React.PropTypes.string,
  coverPrefs: React.PropTypes.object,
  menuBar: React.PropTypes.bool,
  onMount: React.PropTypes.func,
  onDropFileOnBlock: React.PropTypes.func,
}
App.defaultProps =
{ widgetPath: './node_modules/',
  menuBar: true,
  coverPrefs: {},
}
