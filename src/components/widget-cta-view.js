// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'


class WidgetCtaView extends React.Component {
  render () {
    const {label, url} = this.props.initialBlock

    return el('div',
      {
        className: 'WidgetView WidgetView-cta',
        style: {
          padding: '1rem',
          backgroundColor: 'white',
        },
      },
      el(Button,
        {
          title: url,
        },
        label || 'label',
      ),
      el(ButtonOutline,
        {
          style: {float: 'right'},
          onClick: this.props.triggerEdit,
        },
        'Edit'
      )
    )
  }
}
WidgetCtaView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  triggerEdit: React.PropTypes.func,
}
WidgetCtaView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetCtaView)
