// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import IframeInfo from '../plugins/iframe-info'

function preventDefault (event) {
  event.preventDefault()
}

class WidgetIframe extends React.Component {
  constructor (props) {
    super(props)
    const {widget} = props
    const info = IframeInfo[widget]
    if (!info) {
      throw new Error('Tried to load Ed iframe widget that does not exist: ' + widget)
    }

    this.state = {
      height: info.initialHeight,
    }

    this.loaded = false
    this.iframeLoaded = this.iframeLoaded.bind(this)
    this.setIframeRef = (ref) => { this.iframe = ref }
    this.getFromIframe = this.getFromIframe.bind(this)
    window.addEventListener('message', this.getFromIframe)
  }
  componentWillUnmount () {
    window.removeEventListener('message', this.getFromIframe)
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.removeEventListener('dragover', preventDefault)
      this.iframe.contentWindow.removeEventListener('drop', preventDefault)
    }
  }
  render () {
    const {id, widget} = this.props
    const {widgetPath} = this.context
    const {height} = this.state
    return el('iframe', {
      key: id,
      className: 'WidgetIframe',
      src: widgetPath + IframeInfo[widget].src,
      style: {
        width: '100%',
        height: height + 'px',
        border: 'none',
      },
      onLoad: this.iframeLoaded,
      ref: this.setIframeRef,
    })
  }
  iframeLoaded (event) {
    if (this.loaded) return
    this.loaded = true

    // Swallow file drop on iframe widgets
    this.iframe.contentWindow.addEventListener('dragover', preventDefault)
    this.iframe.contentWindow.addEventListener('drop', preventDefault)

    const {initialBlock} = this.props
    this.sendToIframe('setblock', initialBlock)
  }
  sendToIframe (topic, payload) {
    if (!this.loaded) return
    this.iframe.contentWindow.postMessage({topic, payload}, '*')
  }
  getFromIframe (message) {
    // Gets hit with all iframe widget messages, so filter early
    if (!message || !message.source || !message.source.frameElement) return
    if (!this.iframe || this.iframe !== message.source.frameElement) return
    const messageId = message.data.id
    if (!messageId) throw new Error('Iframe widget message missing message.data.id')
    const {id} = this.props
    if (id !== messageId) throw new Error('Iframe message id does not match frame id')

    const {topic, payload} = message.data
    switch (topic) {
      case 'changed':
        let block = payload
        if (id !== block.id) throw new Error('Iframe block id does not match frame id')
        this.context.store.routeChange('MEDIA_BLOCK_UPDATE', block)
        break
      case 'height':
        if (isNaN(payload)) {
          throw new Error('Iframe height message with non-numeric payload')
        }
        this.setState({height: payload})
        break
      case 'cursor':
      default:
        break
    }
  }
}
WidgetIframe.contextTypes = {
  widgetPath: React.PropTypes.string,
  store: React.PropTypes.object,
}
WidgetIframe.propTypes = {
  initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  widget: React.PropTypes.string.isRequired,
}

export default React.createFactory(WidgetIframe)
