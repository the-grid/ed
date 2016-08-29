// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Checkbox from 'rebass/dist/Checkbox'
import ButtonOutline from 'rebass/dist/ButtonOutline'

import TextareaAutosize from './textarea-autosize'
import {isUrlOrBlank} from '../util/url'
import {widgetLeftStyle} from './rebass-theme'


class WidgetCta extends React.Component {
  constructor (props) {
    super(props)
    this.state =
      { block: props.initialBlock
      , showImport: false
      }

    this.changeLabel = (event) => {
      this.onChange(['label'], event.target.value)
    }
    this.changeUrl = (event) => {
      this.onChange(['url'], event.target.value)
    }
    this.changeModal = (event) => {
      this.onChange(['openAsModal'], event.target.checked)
    }
    this.toggleImport = () => {
      const {showImport} = this.state
      this.setState({showImport: !showImport})
    }
  }
  componentWillReceiveProps (props) {
    this.setState({block: props.initialBlock})
  }
  render () {
    const {block} = this.state
    const {metadata} = block
    const {label, url, openAsModal} = metadata

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
        , { key: 'openAsModal'
          , label: 'Open link as modal iframe'
          , name: 'openAsModal'
          , checked: (openAsModal === true)
          , onChange: this.changeModal
          }
        )
      // , this.renderImport()
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
    const block = store.routeChange('MEDIA_BLOCK_UPDATE_META', {id, path, value})
    // Send change to view
    this.setState({block})
  }
  renderImport () {
    const {showImport} = this.state
    if (!showImport) {
      return el(ButtonOutline
      , { onClick: this.toggleImport }
      , 'Import settings from embed HTML'
      )
    }

    return el('form'
    , { onSubmit: this.importHTML }
    , el(ButtonOutline
      , { onClick: this.toggleImport }
      , 'Cancel'
      )
    , el(TextareaAutosize
      , { defaultFocus: true
        , placeholder: '<iframe src=... or <a href=... embed code from another site'
        }
      )
    , el(ButtonOutline
      , { type: 'submit' }
      , 'Import'
      )
    )
  }
  importHTML (event) {
    event.preventDefault()
    const {value} = event.target.querySelector('textarea')
    console.log(event.target, value)
    // TODO parse dat
  }
}
WidgetCta.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetCta)
