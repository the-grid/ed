import React, {createElement as el} from 'react'

import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import Message from 'rebass/dist/Message'
import Space from 'rebass/dist/Space'
import Progress from 'rebass/dist/Progress'

import {Play as PlayIcon} from './icons'
import Image from './image'

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
    const {type} = this.props.initialBlock

    return el('div',
      {
        className: `WidgetView WidgetView-${type}`,
        style: {
          padding: '1rem',
          backgroundColor: 'white',
        },
      },
      this.renderPlay(),
      this.renderUnsalvageable(),
      this.renderFailed(),
      this.renderProgress(),
      el('div', {style: {display: 'flex'}},
        this.renderCover(),
        this.renderFields(),
      ),
      this.renderEdit(),
    )
  }
  renderPlay () {
    const block = this.props.initialBlock
    if (!block || !block.type || !block.metadata || !block.metadata.isBasedOnUrl) return
    const {type} = block
    if (['interactive', 'video', 'audio'].indexOf(type) < 0) return

    return el('div',
      {
        style: descriptionStyle,
      },
      el('a', {
        href: block.metadata.isBasedOnUrl,
        target: '_blank',
        rel: 'noreferrer noopener',
        style: {
          textDecoration: 'inherit',
          textTransform: 'uppercase',
        },
      },
      type + ' ',
      el(PlayIcon)
      )
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
      (caption && (description !== caption) && el('p', {style: descriptionStyle}, caption))
    )
  }
  renderEdit () {
    return el('div',
      {
        style: {clear: 'both'},
      },
      el(ButtonOutline,
        {
          onClick: this.props.triggerEdit,
        },
        'Edit'
      )
    )
  }
}
WidgetView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  triggerEdit: React.PropTypes.func,
}
WidgetView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetView)
