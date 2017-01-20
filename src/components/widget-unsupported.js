// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'


class WidgetUnsupported extends React.Component {
  render () {
    const {initialBlock, onMouseDown} = this.props
    let {type} = initialBlock
    type = type || 'unsupported'

    return el('div',
      {
        className: 'WidgetUnsupported',
        style: {
          border: '1px solid silver',
          borderRadius: 2,
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
        },
        onMouseDown,
      },
      el('div',
        {className: 'WidgetUnsupported-metadata'},
        el('div',
          {
            style: {
              fontSize: '80%',
              color: 'silver',
            },
          },
          type.toUpperCase() + ' not available in this editor',
          this.renderOpen()
        )
      ),
      el('div',
        { style: {clear: 'both'} }
      )
    )
  }
  renderOpen () {
    const {initialBlock} = this.props
    if (!initialBlock || !initialBlock.metadata || !initialBlock.metadata.isBasedOnUrl) return

    return el('span'
    , {}
    , ' ('
    , el('a', {
      href: initialBlock.metadata.isBasedOnUrl,
      target: '_blank',
      rel: 'noreferrer noopener',
      // style: { textDecoration: 'inherit' },
    }
    , 'open link'
    )
    , ')'
    )
  }}
WidgetUnsupported.propTypes = {
  initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  onMouseDown: React.PropTypes.func,
}

export default React.createFactory(WidgetUnsupported)
