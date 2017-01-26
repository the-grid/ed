import React, {createElement as el} from 'react'
import imgflo from 'imgflo-url'
import Avatar from 'rebass/dist/Avatar'

class AttributionView extends React.Component {
  constructor (props) {
    super(props)
    this.renderAuthor = this.renderAuthor.bind(this)
  }
  render () {
    const {metadata} = this.props
    if (!metadata) return null

    return el('div', {},
      this.renderAuthors(),
      this.renderPublisher(),
      this.renderVia()
    )
  }
  renderAuthors () {
    const {metadata} = this.props
    const {author} = metadata
    if (!author || !author.length) return null
    return el('span', {},
      'by ',
      author.map(this.renderAuthor),
    )
  }
  renderAuthor (author, i) {
    const {name, avatar} = author
    const {imgfloConfig} = this.context
    let avatarEl
    if (avatar && avatar.src) {
      let {src} = avatar
      if (imgfloConfig) {
        const params = {
          input: src,
          width: 24,
        }
        src = imgflo(imgfloConfig, 'passthrough', params)
      }
      avatarEl = el(Avatar,
        {
          src,
          size: 24,
          style: {verticalAlign: 'middle'},
        }
      )
    }
    return el('span', {key: `author${i}`},
      avatarEl,
      ' ',
      (name || 'Credit')
    )
  }
  renderPublisher () {
    const {metadata} = this.props
    const {publisher} = metadata
    if (!publisher || !publisher.name) return null
    return el('span', {},
      ' on ',
      publisher.name
    )
  }
  renderVia () {
    const {metadata} = this.props
    const {via} = metadata
    if (!via || !via.name) return null
    return el('span', {},
      ' via ',
      via.name
    )
  }
}
AttributionView.propTypes = {
  metadata: React.PropTypes.object,
}
AttributionView.contextTypes =
  { imgfloConfig: React.PropTypes.object }

export default React.createFactory(AttributionView)
