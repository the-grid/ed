// If we need cover support for cta widget later,
// don't add it here.

import React, {createElement as el} from 'react'
import Text from 'rebass/dist/Text'
import {widgetLeftStyle, colors} from './rebass-theme'


class WidgetUnsupported extends React.Component {
  render () {
    const {initialBlock} = this.props
    let {type} = initialBlock
    type = type || 'unsupported'

    return el('div'
    , { className: 'WidgetUnsupported'
    }
    , el('div'
      , { className: 'WidgetUnsupported-metadata',
        style: widgetLeftStyle
      }
      , el(Text
        , { color: colors.midgray,
          small: true
        }
        , type.toUpperCase() + ' not available in this editor'
        , this.renderOpen()
        )
      )
    , el('div'
      , { style: {clear: 'both'} }
      )
    )
  }
  renderOpen () {
    const {initialBlock} = this.props
    if (!initialBlock || !initialBlock.metadata || !initialBlock.metadata.isBasedOnUrl) return

    return el('span'
    , {}
    , ' ('
    , el('a'
      , { href: initialBlock.metadata.isBasedOnUrl,
        target: '_blank',
        rel: 'noreferrer noopener',
        style:
        { textDecoration: 'inherit'
        }
      }
        , 'open link'
      )
    , ')'
    )
  }}
WidgetUnsupported.propTypes =
{ initialBlock: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired
}

export default React.createFactory(WidgetUnsupported)
