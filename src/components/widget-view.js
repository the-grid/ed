import React, {createElement as el} from 'react'

import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import Message from 'rebass/dist/Message'
import Space from 'rebass/dist/Space'
import Progress from 'rebass/dist/Progress'

import Icon from './icons'
import Image from './image'
import AttributionView from './attribution-view'

import blockMetaSchema from '../schema/block-meta'

const titleStyle = {fontSize: '100%', margin: '0 0 1rem 0'}
const descriptionStyle = {fontSize: '80%', margin: '0 0 1rem 0'}


class WidgetView extends React.Component {
  constructor (props, context) {
    super(props, context)
    const {id} = props
    const {store} = context
    this.onUploadRequest = () => {
      store.routeChange('MEDIA_BLOCK_REQUEST_COVER_UPLOAD', id)
    }
  }
  render () {
    const {initialBlock} = this.props
    const {type} = initialBlock

    return el('div',
      {
        className: `WidgetView WidgetView-${type}`,
        style: {
          border: '1px solid silver',
          borderRadius: 2,
          padding: '1rem',
          backgroundColor: 'white',
          whiteSpace: 'normal',
        },
      },
      this.renderType(),
      this.renderUnsalvageable(),
      this.renderFailed(),
      this.renderProgress(),
      el('div', {style: {display: 'flex'}},
        this.renderCover(),
        this.renderFields()
      ),
      this.renderEdit(),
    )
  }
  renderType () {
    const block = this.props.initialBlock
    if (!block || !block.type) return
    const {type} = block

    let typeEl = el('span',
      {
        style: {
          color: 'silver',
          textTransform: 'uppercase',
          marginRight: '0.5rem',
          verticalAlign: 'middle',
        },
        spellcheck: 'no',
      },
      type
    )
    let iconEl
    switch (type) {
      case 'interactive':
      case 'video':
      case 'audio':
        iconEl = el(Icon, {icon: 'play'})
        break
      // case 'quote':
      //   iconEl = el('span', {style: {
      //     fontSize: '2rem',
      //     verticalAlign: 'top',
      //     display: 'inline-block',
      //     height: '0.5em',
      //   }}, '“')
      //   break
      default:
        iconEl = el(Icon, {icon: 'link'})
        break
    }

    if (block.metadata && block.metadata.isBasedOnUrl) {
      // Wrap in link
      typeEl = el('a',
        {
          href: block.metadata.isBasedOnUrl,
          target: '_blank',
          rel: 'noreferrer noopener',
          style: {
            color: 'gray',
            textDecoration: 'none',
            textTransform: 'uppercase',
          },
        },
        typeEl,
        iconEl,
      )
    }

    return el('div',
      {
        style: descriptionStyle,
      },
      typeEl
    )
  }
  canChangeCover () {
    const block = this.props.initialBlock
    if (!block) return false
    const {type} = block
    const schema = blockMetaSchema[type] || blockMetaSchema.default
    return schema.changeCover
  }
  renderUnsalvageable () {
    const block = this.props.initialBlock
    if (!block || !block.cover || !block.cover.unsalvageable) return

    let upload
    if (this.canChangeCover()) {
      upload = el(Button,
        {
          onClick: this.onUploadRequest,
          rounded: true,
          color: 'error',
          backgroundColor: 'white',
        },
        'Upload New Image'
      )
    }

    return el(Message,
      {theme: 'error'},
      'We were unable to measure this image.',
      el(Space, {auto: true}),
      upload
    )
  }
  renderFailed () {
    const {id} = this.props
    const {store} = this.context
    const meta = store.getProgressInfo(id)
    if (!meta || !meta.failed) return

    let upload
    if (this.canChangeCover()) {
      upload = el(Button,
        {
          onClick: this.onUploadRequest,
          rounded: true,
          color: 'error',
          backgroundColor: 'white',
        },
        'Upload New Image'
      )
    }

    return el(Message,
      {theme: 'error'},
      'Upload failed, please try again.',
      el(Space, {auto: true}),
      upload
    )
  }
  renderProgress () {
    const {id} = this.props
    const {store} = this.context
    const meta = store.getProgressInfo(id)
    if (!meta) return
    const {progress, failed} = meta
    if (progress == null) return

    const color = (failed === true ? 'error' : 'info')
    return el(Progress,
      {
        value: progress / 100,
        style: {margin: '8px 0'},
        color,
      }
    )
  }
  renderCover () {
    const block = this.props.initialBlock
    if (!block) return
    const {id, cover, metadata} = block
    const {store} = this.context
    const preview = store.getCoverPreview(id)
    if (!cover && !preview) return
    if (cover && cover.unsalvageable) return
    let src, width, height, title
    if (cover) {
      src = cover.src
      width = cover.width
      height = cover.height
    }
    if (metadata) {
      title = metadata.title
    }
    if (preview) {
      src = preview
    }
    if (!src) return
    let props = {src, width, height, title}
    return el('div',
      {
        style: {
          flex: '1',
          padding: '0 1rem 1rem 0',
        },
      },
      el(Image, props)
    )
  }
  renderFields () {
    const block = this.props.initialBlock
    if (!block) return
    const {metadata} = block
    if (!metadata) return
    const {title, description, caption} = metadata
    return el('div',
      {style: {flex: '2'}},
      (title && el('h1', {style: titleStyle}, title)),
      (description && el('p', {style: descriptionStyle}, description)),
      (caption && (description !== caption) && el('p', {style: descriptionStyle}, caption)),
      el('div',
        {
          style: {
            fontSize: '80%',
            margin: '0 0 1rem 0',
            opacity: 0.5,
          },
        },
        el(AttributionView, {metadata})
      )
    )
  }
  renderEdit () {
    return el('div',
      {
        style: {clear: 'both'},
      },
      el(ButtonOutline,
        {
          onClick: this.props.onClickEdit,
        },
        'Edit'
      )
    )
  }
}
WidgetView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  onClickEdit: React.PropTypes.func,
}
WidgetView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetView)
