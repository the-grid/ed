import _ from '../util/lodash'

function onScroll (event) {
  const menu = document.querySelector('.ProseMirror-menubar')
  if (menu) {
    menu.style.top = window.scrollY + 'px'
    const menuHeight = menu.style.minHeight
    if (menuHeight) {
      const content = document.querySelector('.ProseMirror-content')
      content.style.paddingTop = menuHeight
    }
  }
}

export default class ShareUrl {
  constructor (ed) {
    this.onScroll = _.debounce(onScroll, 50).bind(this)
    this.ed = ed
    window.addEventListener('scroll', this.onScroll)
  }
  teardown () {
    window.removeEventListener('scroll', this.onScroll)
  }
}
