import React, {createElement as el} from 'react'
import ButtonOutline from 'rebass/dist/ButtonOutline'

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
    return el('div',
      {
        style: {
          padding: '1rem',
          backgroundColor: 'white',
          maxWidth: 720,
          margin: 'auto',
          border: '1px solid silver',
          borderRadius: 2,
        },
      },
      el('div',
        {
          style: {
            textAlign: 'right',
            marginBottom: '1rem',
          },
        },
        el(ButtonOutline,
          {
            onClick: this.props.onClose,
          },
          'Close'
        ),
      ),
      this.renderEditor(),
    )
  }
  renderEditor () {
    const {initialBlock, coverPrefs} = this.props
    const {id, type} = initialBlock
    const Component = COMPONENTS[type] || COMPONENTS.unsupported
    return el(Component, {initialBlock, coverPrefs, id})
  }
}
WidgetEdit.propTypes = {
  initialBlock: React.PropTypes.object.isRequired,
  coverPrefs: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired,
}
WidgetEdit.contextTypes = {
  store: React.PropTypes.object,
}

export default React.createFactory(WidgetEdit)
