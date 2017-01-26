// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Button from 'rebass/dist/Button'
import ButtonOutline from 'rebass/dist/ButtonOutline'


class WidgetCtaView extends React.Component {
  render () {
    const {initialBlock} = this.props
    const {label, url} = initialBlock

    return el('div',
      {
        className: 'WidgetView WidgetView-cta',
        style: {
          border: '1px solid silver',
          borderRadius: 2,
          padding: '1rem',
          backgroundColor: 'white',
        },
      },
      el(Button,
        {
          style: {
            fontSize: '200%',
            padding: '1.5rem',
            marginBottom: '1rem',
            display: 'block',
          },
          title: url,
          big: true,
          onClick: this.props.onClickEdit,
        },
        label || 'label',
      ),
      el(ButtonOutline,
        {
          onClick: this.props.onClickEdit,
        },
        'Edit'
      )
    )
  }
}
WidgetCtaView.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  onClickEdit: React.PropTypes.func,
}
WidgetCtaView.contextTypes =
  { store: React.PropTypes.object }

export default React.createFactory(WidgetCtaView)
