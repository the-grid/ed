// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'

import {widgetLeftStyle} from './rebass-theme'


class WidgetCtaView extends React.Component {
  render () {
    const {label, url} = this.props.initialBlock

    return el('div',
      {
        className: 'WidgetCtaView',
        style: {
          padding: '1rem',
          backgroundColor: 'white',
        },
      },
      el(Button,
        {
          className: 'WidgetCtaView-preview',
          title: url,
        },
        label || 'label',
      ),
      el(ButtonOutline,
        {
          className: 'WidgetCtaView-edit',
          style: {float: 'right'},
        },
        'Edit'
      )
    )
  }
}
WidgetCtaView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
}
WidgetCtaView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetCtaView)
