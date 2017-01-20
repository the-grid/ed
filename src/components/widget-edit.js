import React, {createElement as el} from 'react'

import AttributionEditor from './attribution-editor'
import WidgetUnsupported from './widget-unsupported'
import WidgetCta from './widget-cta'

const COMPONENTS = {
  cta: WidgetCta,
  image: AttributionEditor,
  video: AttributionEditor,
  article: AttributionEditor,
  interactive: AttributionEditor,
  quote: AttributionEditor,
  unsupported: WidgetUnsupported,
}


class WidgetEdit extends React.Component {
  render () {
    const {initialBlock, coverPrefs} = this.props
    const {id, type} = initialBlock
    const Component = COMPONENTS[type] || COMPONENTS.unsupported
    return el(Component,
      {
        initialBlock,
        coverPrefs,
        id,
      }
    )
  }
}
WidgetEdit.propTypes = {
  initialBlock: React.PropTypes.object.isRequired,
  coverPrefs: React.PropTypes.object.isRequired,
}
WidgetEdit.contextTypes = {
  store: React.PropTypes.object,
}

export default React.createFactory(WidgetEdit)
