// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Checkbox from 'rebass/dist/Checkbox'
import ButtonOutline from 'rebass/dist/ButtonOutline'

import TextareaAutosize from './textarea-autosize'
import {isUrlOrBlank} from '../util/url'
import {widgetLeftStyle, colors} from './rebass-theme'

// Gets src or href from iframe or a
// http://www.regexpal.com/ test string:
// abc <iframe a="ffff" src="fooo" sss></iframe> <a hRef='http://,,,'>thing!</a> asdf < iframe   src =     http...></iframe>
const regexExtractLink = /<\s*(iframe|a)\s+[^>]*(?:src|href)\s*=[\s"']*(http[^"'\s>]+)[\s"']*[^>]*>/i

export function extractLink (htmlString) {
  const extract = regexExtractLink.exec(htmlString)
  if (!extract || !extract[1] || !extract[2]) return null
  const tag = extract[1].toLowerCase()
  const link = extract[2]
  return {tag, link}
}


class WidgetCta extends React.Component {
  constructor (props) {
    super(props)
    let state = this.stateFromBlock(props.initialBlock)
    state.showImport = false
    state.importStatus = ''
    this.state = state

    this.changeLabel = (event) => {
      this.onChange(['label'], event.target.value)
    }
    this.changeUrl = (event) => {
      this.onChange(['url'], event.target.value)
    }
    this.changeModal = (event) => {
      this.onChange(['metadata', 'canFrame'], event.target.checked)
    }
    this.toggleImport = () => {
      const {showImport} = this.state
      this.setState(
        { showImport: !showImport
        , importStatus: ''
        }
      )
    }
    this.boundImportHTML = this.importHTML.bind(this)
  }
  componentWillReceiveProps (props) {
    // TODO - this but ignore stale data from API???
    // if (!props.initialBlock) return
    // this.setState(this.stateFromBlock(props.initialBlock))
  }
  stateFromBlock (block) {
    if (!block) return {}
    const {label, url, metadata} = block
    let canFrame = false
    if (metadata && metadata.canFrame === true) {
      canFrame = true
    }
    return {label, url, canFrame}
  }
  render () {
    const {label, url, canFrame} = this.state

    return el('div'
    , { className: 'WidgetCta'
      }
    , el('div'
      , { className: 'WidgetCta-metadata'
        , style: widgetLeftStyle
        }
      , el(TextareaAutosize
        , { label: 'Label'
          , key: 'label'
          , placeholder: 'Sign up now!'
          , defaultValue: label
          , onChange: this.changeLabel
          , style: {width: '100%'}
          }
        )
      , el(TextareaAutosize
        , { label: 'Link'
          , key: 'url'
          , placeholder: 'https://...'
          , defaultValue: url
          , onChange: this.changeUrl
          , validator: isUrlOrBlank
          , style: {width: '100%'}
          }
        )
      , el(Checkbox
        , { key: 'canFrame'
          , label: 'Link can open in frame'
          , name: 'canFrame'
          , checked: (canFrame === true)
          , onChange: this.changeModal
          }
        )
      , this.renderImport()
      )
    , el('div'
      , { style: {clear: 'both'} }
      )
    )
  }
  onChange (path, value) {
    const {store} = this.context
    const {id} = this.props
    // Send change up to store
    const block = store.routeChange('MEDIA_BLOCK_UPDATE_FIELD', {id, path, value})
    // Send change to view
    this.setState(this.stateFromBlock(block))
  }
  renderImport () {
    const {showImport, importStatus} = this.state
    if (!showImport) {
      return el(ButtonOutline
      , { onClick: this.toggleImport }
      , 'Import settings from embed HTML'
      )
    }

    return el('form'
    , { onSubmit: this.boundImportHTML }
    , el(TextareaAutosize
      , { label: 'HTML'
        , defaultValue: ''
        , defaultFocus: true
        , placeholder: '<iframe src=... or <a href=... embed code from another site'
        }
      )
    , el(ButtonOutline
      , { onClick: this.toggleImport }
      , 'Cancel'
      )
    , el(ButtonOutline
      , { type: 'submit' }
      , 'Import'
      )
    , el('span', {style: {color: colors.error}}, importStatus)
    )
  }
  importHTML (event) {
    event.preventDefault()
    const {value} = event.target.querySelector('textarea')
    if (!value) return
    const extract = extractLink(value)
    if (!extract) {
      this.setState({importStatus: " We didn't find the link in this html."})
      return
    }
    const {tag, link} = extract
    if (tag === 'iframe') {
      this.onChange(['metadata', 'canFrame'], true)
    }
    if (link) {
      this.onChange(['url'], link)
    }
    this.setState({showImport: false, importStatus: ''})
  }
}
WidgetCta.propTypes =
  { initialBlock: React.PropTypes.object.isRequired
  , id: React.PropTypes.string.isRequired
  }
WidgetCta.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetCta)
