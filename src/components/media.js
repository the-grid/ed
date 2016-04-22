import React, {createElement as el} from 'react'

import Placeholder from './placeholder'
import AttributionEditor from './attribution-editor'
import Title from './title'
import rebassTheme from './rebass-theme'

const Components =
  { placeholder: Placeholder
  , h1: Title
  , attribution: AttributionEditor
  }

class Media extends React.Component {
  getChildContext () {
    return (
      { imgfloConfig: (this.context.imgfloConfig || this.props.imgfloConfig)
      , store: (this.context.store || this.props.store)
      , rebass: rebassTheme
      }
    )
  }
  render () {
    console.log("Media render()", this.props)
    const {type} = this.props.initialBlock
    let Component = Components[type] || Components.attribution
    return el(Component, this.props)
  }
}
Media.contextTypes =
  { imgfloConfig: React.PropTypes.object
  , store: React.PropTypes.object
  }
Media.childContextTypes =
  { imgfloConfig: React.PropTypes.object
  , rebass: React.PropTypes.object
  , store: React.PropTypes.object
  }
export default React.createFactory(Media)
