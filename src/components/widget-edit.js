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
  constructor (props) {
    super(props)
    this.refCallback = (node) => {
      this.node = node
    }
  }
  componentDidMount () {
    // autoFocus first textarea
    const textarea = this.node.querySelector('textarea')
    if (textarea) {
      textarea.focus()
    }
  }
  render () {
    const {initialBlock, coverPrefs} = this.props
    const {id, type} = initialBlock
    const Component = COMPONENTS[type] || COMPONENTS.unsupported
    return el('div',
      {ref: this.refCallback},
      el(Component,
        {
          initialBlock,
          coverPrefs,
          id,
        }
      )
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
