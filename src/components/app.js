require('./app.css')

import React, {createElement as el} from 'react'

import determineFold from '../convert/determine-fold'

import Editable from './editable'
import FoldTitle from './fold-title'
import FoldMedia from './fold-media'

class App extends React.Component {
  constructor (props) {
    super(props)
    const {initialContent} = this.props
    const {title, media, fold, rest} = determineFold(initialContent)
    this.state = {title, media, fold, rest}
  }
  getChildContext () {
    return {
      imgfloConfig: this.props.imgfloConfig
    }
  }
  render () {
    const {initialContent, onChange, menubar, menutip} = this.props
    const {fold, rest} = this.state
      
    return el('div', {className: 'Ed'},
      el('div', {className: 'Ed-Media'},
        this.renderMedia()
      ),
      el('div', {className: 'Ed-Title'},
        this.renderTitle()
      ),
      el('div', {className: 'Ed-FoldContent'},
        el(Editable, {
          initialContent: fold,
          isFold: true,
          menubar,
          menutip,
          onChange
        })
      ),
      el('div', {className: 'Ed-FoldAdd'},
        this.renderMediaAdd(),
        this.renderTitleAdd(),
        this.renderHelp()
      ),
      el('hr', {className: 'Ed-FoldSeparator'}),
      el(Editable, {
        className: 'Ed-FullContent',
        initialContent: rest,
        isFold: false,
        menubar,
        menutip,
        onChange
      })
    )
  }
  renderMedia () {
    const {onChange} = this.props
    const {media} = this.state
    if (!media) return
    return el(FoldMedia, {
      initialBlock: media,
      onChange
    })
  }
  renderTitle () {
    const {onChange} = this.props
    const {title} = this.state
    if (!title) return
    return el(FoldTitle, {
      initialBlock: title,
      onChange
    })
  }
  renderMediaAdd () {
    const {media} = this.state
    if (media) return
    return el('button', {
      children: 'Add Media'
    })
  }
  renderTitleAdd () {
    const {title} = this.state
    if (title) return
    return el('button', {
      children: 'Add Title',
      onClick: this.addTitle.bind(this)
    })
  }
  addTitle () {
    this.setState({
      title: {
        type: 'h1',
        html: '<h1></h1>',
        metadata: {starred: true}
      }
    })
  }
  renderHelp () {
    return el('button', {
      className: 'Ed-Help',
      title: 'Welcome to your post editor.\n' +
        'Everything above the "fold" line will show in your main page feed, ' +
        'while everything below the line will show in the post\'s page.',
      children: '?'
    })
  }
}
App.childContextTypes = {
  imgfloConfig: React.PropTypes.object
}
App.propTypes = {
  initialContent: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  menubar: React.PropTypes.bool,
  menutip: React.PropTypes.bool,
  imgfloConfig: React.PropTypes.object
}
export default React.createFactory(App)
