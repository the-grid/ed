import _ from '../util/lodash'

function onScroll (event) {
  const contentTop = this.pm.wrapper.getBoundingClientRect().top
  if (contentTop > 0) {
    this.menuEl.style.top = '0px'
    return
  }
  this.menuEl.style.position = 'absolute'
  this.menuEl.style.top = (0 - contentTop) + 'px'
}

function spaceContent () {
  this.menuEl.style.minHeight = 'inherit'
  const menuHeight = this.menuEl.offsetHeight
  if (this.menuHeight !== menuHeight) {
    this.menuHeight = menuHeight
    this.contentEl.style.paddingTop = (menuHeight + 36) + 'px'
  }
}


export default class FixedMenuBarHack {
  constructor (pm, options) {
    this.pm = pm

    this.menuEl = pm.wrapper.querySelector('.ProseMirror-menubar')
    if (!this.menuEl) {
      return
    }
    this.contentEl = pm.content

    // Padding for all
    this.spaceContent = _.debounce(spaceContent, 250).bind(this)
    const {selectionChange} = pm.on
    this.updater = pm.updateScheduler([selectionChange], this.spaceContent)
    this.updater.force()

    // Fake fixed
    this.menuEl.style.position = 'absolute'
    this.onScroll = onScroll.bind(this)
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.spaceContent)
  }
  detach () {
    if (!this.menuEl) {
      return
    }
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.spaceContent)
    this.updater.detach()
  }
}
