import React, {createElement as el} from 'react'
import Media from './media'
import Button from 'rebass/dist/Button'
import uuid from 'uuid'

class FoldMedia extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = {}
    if (props.initialBlock) {
      this.state =
        { block: props.initialBlock
        , id: props.initialBlock.id
        }
    }
    const {store} = context
    store.on('fold.media.change', (block) => {
      this.setState({block, id: block.id})
    })
  }
  render () {
    const {block, id} = this.state
    return el('div'
    , { className: 'FoldMedia'
      , style:
        { margin: '0 auto'
        , padding: '1rem'
        , maxWidth: 800
        }
      }
    , (block
      ? el(Media, {initialBlock: block, id})
      : this.renderAddMedia()
      )
    )
  }
  renderAddMedia () {
    return (
      [ el(Button
        , { key: 'title'
          , onClick: this.addTitle.bind(this)
          }
        , 'Add title'
        )
      , el(Button
        , { key: 'share' }
        , 'Share link'
        )
      , el(Button
        , { key: 'upload' }
        , 'Upload photo'
        )
      ]
    )
  }
  addTitle () {
    const {store} = this.context
    store.routeChange('FOLD_MEDIA_INIT'
    , { id: uuid.v4()
      , type: 'h1'
      , metadata: {starred: true}
      , html: '<h1></h1>'
      }
    )
  }
}
FoldMedia.contextTypes = { store: React.PropTypes.object }
FoldMedia.propTypes = { initialBlock: React.PropTypes.object }
export default React.createFactory(FoldMedia)
