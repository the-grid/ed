import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import {Play as PlayIcon} from './icons'

import {widgetLeftStyle} from './rebass-theme'


class WidgetView extends React.Component {
  constructor (props) {
    super(props)
    const {id} = props
    this.triggerEdit = () => {
      alert(id)
    }
  }
  render () {
    // const {type, metadata} = this.props.initialBlock

    return el('div',
      {
        className: 'WidgetView',
        style: widgetLeftStyle,
      },
      this.renderPlay(),
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
        style: {
          textAlign: 'right',
          position: 'relative',
          top: '-0.5rem',
        },
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
  renderEdit () {
    return el(ButtonOutline,
      {
        className: 'WidgetView-edit',
        // style: {float: 'right'},
        onClick: this.triggerEdit,
      },
      'Edit'
    )
  }
}
WidgetView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
}
WidgetView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetView)
