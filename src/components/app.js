import React, {createElement as el} from 'react'

import AddCover from './add-cover'
import AddFold from './add-fold'
import Editable from './editable'
import rebassTheme from './rebass-theme'

import EdStore from '../store/ed-store'
import {edCommands} from '../menu/ed-menu'

import cxs from 'cxs'

const className = cxs(
  { 'font-family': '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif'
  , 'button:hover':
    { 'color': '#222 !important' }
  , '*':
    { 'box-sizing': 'border-box'
    , 'line-height': '1.5'
    }
  }
)

console.log(className, cxs.css, cxs.options)


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
    , { className: 'Ed ' + className }
    , el(AddCover, {})
    , this.renderContent()
    , el(AddFold, {})
    )
  }
  renderContent () {
    const { initialContent
      , menuBar
      , menuTip
      , onShareFile
      , onShareUrl
      , onCommandsChanged
      , onDropFiles
      , widgetPath
      , coverPrefs } = this.props

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
        , widgetPath
        , coverPrefs
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
    const item = edCommands[commandName]
    if (!item) {
      throw new Error('commandName not found')
    }
    item.spec.run(this._store.pm)
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
  , onDropFiles: React.PropTypes.func
  , onCommandsChanged: React.PropTypes.func
  , onRequestCoverUpload: React.PropTypes.func.isRequired
  , menuBar: React.PropTypes.bool
  , menuTip: React.PropTypes.bool
  , imgfloConfig: React.PropTypes.object
  , widgetPath: React.PropTypes.string
  , coverPrefs: React.PropTypes.object
  }
App.defaultProps = { widgetPath: './node_modules/' }
