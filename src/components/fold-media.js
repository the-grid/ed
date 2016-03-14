import React, {createElement as el} from 'react'
import Media from './media'
import ButtonOutline from 'rebass/dist/ButtonOutline'
import Panel from 'rebass/dist/Panel'
import uuid from 'uuid'

class FoldMedia extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = {helpOpen: false}
    if (props.initialBlock) {
      this.state.block = props.initialBlock
      this.state.id = props.initialBlock.id
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
    const {helpOpen} = this.state

    return el('div'
    , {}
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addTitle.bind(this)
        }
      , 'Add title'
      )
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addTitle.bind(this)
        }
      , 'Share link'
      )
    , el(ButtonOutline
      , { style: { marginRight: -1 }
        , onClick: this.addTitle.bind(this)
        }
      , 'Upload photo'
      )
    , el(ButtonOutline
      , { onClick: this.toggleHelp.bind(this)
        }
      , '?'
      )
    , el(Panel
      , { style:
          { display: (helpOpen ? 'block' : 'none')
          , marginTop: -1
          }
        , theme: 'info'
        }
      , 'Welcome to your post editor. ' +
        'Above the line is the primary representation ' +
        'of your post. Below the line is the rest of ' +
        'the post that will show on the post page.'
      )
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
  toggleHelp () {
    const helpOpen = !this.state.helpOpen
    this.setState({helpOpen})
  }
}
FoldMedia.contextTypes = { store: React.PropTypes.object }
FoldMedia.propTypes = { initialBlock: React.PropTypes.object }
export default React.createFactory(FoldMedia)
