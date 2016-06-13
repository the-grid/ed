require('./app.css')

import React, {createElement as el} from 'react'

import AddCover from './add-cover'
import AddFold from './add-fold'
import Editable from './editable'
import rebassTheme from './rebass-theme'

import EdStore from '../store/ed-store'


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
      , onMount
      , onChange
      , onShareFile
      , onShareUrl
      , onRequestCoverUpload
      , onDropFiles
      , onDropFileOnBlock
      , onCommandsChanged } = props

    this._store = new EdStore(
      { initialContent
      , onMount
      , onChange
      , onShareFile
      , onShareUrl
      , onRequestCoverUpload
      , onDropFiles
      , onDropFileOnBlock
      , onCommandsChanged
      }
    )

    this.routeChange = this._store.routeChange.bind(this._store)
  }
  componentDidMount () {
    this.boundOnDragOver = this.onDragOver.bind(this)
    window.addEventListener('dragover', this.boundOnDragOver)
    this.boundOnDrop = this.onDrop.bind(this)
    window.addEventListener('drop', this.boundOnDrop)
  }
  componentWillUnmount () {
    window.removeEventListener('dragover', this.boundOnDragOver)
    window.removeEventListener('drop', this.boundOnDrop)
  }
  getChildContext () {
    const {imgfloConfig} = this.props
    return (
      { imgfloConfig: imgfloConfig
      , rebass: rebassTheme
      , store: this._store
      }
    )
  }
  render () {
    return el('div'
    , {className: 'Ed'}
    , el(AddCover, {})
    , this.renderContent()
    , el(AddFold, {})
    )
  }
  renderContent () {
    const {initialContent
      , menuBar, menuTip
      , onShareFile, onShareUrl
      , onCommandsChanged, onDropFiles} = this.props

    return el('div'
    , { className: 'Ed-Content'
      , style:
        { zIndex: 1
        }
      }
    , el(Editable
      , { initialContent
        , menuBar
        , menuTip
        , onChange: this.routeChange
        , onShareFile
        , onShareUrl
        , onCommandsChanged
        , onDropFiles
        }
      )
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
    this._store.execCommand(commandName)
  }
  insertPlaceholders (index, count) {
    return this._store.insertPlaceholders(index, count)
  }
  updatePlaceholder (id, metadata) {
    this._store.updatePlaceholder(id, metadata)
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
  get pm () {
    return this._store.pm
  }
}
App.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object
  , rebass: React.PropTypes.object
  }
App.propTypes =
  { initialContent: React.PropTypes.array.isRequired
  , onChange: React.PropTypes.func.isRequired
  , onShareFile: React.PropTypes.func.isRequired
  , onShareUrl: React.PropTypes.func.isRequired
  , onDropFiles: React.PropTypes.func.isRequired
  , onCommandsChanged: React.PropTypes.func
  , onRequestCoverUpload: React.PropTypes.func.isRequired
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , imgfloConfig: React.PropTypes.object
  }
