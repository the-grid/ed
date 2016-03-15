import {UpdateScheduler} from 'prosemirror/src/ui/update'
import _ from '../util/lodash'

function onScroll (event) {
  const contentTop = this.pm.wrapper.getBoundingClientRect().top
  if (contentTop > 0) {
    this.menuEl.style.top = '0px'
    return
  }
  this.menuEl.style.top = (0 - contentTop) + 'px'
}

function spaceContent () {
  const menuHeight = this.menuEl.style.minHeight
  if (this.menuHeight !== menuHeight) {
    this.menuHeight = menuHeight
    this.contentEl.style.paddingTop = menuHeight
  }
}

export default class FixedMenuBarHack {
  constructor (options) {
    const {pm} = options
    this.pm = pm

    this.menuEl = pm.wrapper.querySelector('.ProseMirror-menubar')
    if (!this.menuEl) {
      return
    }
    this.contentEl = pm.content

    // Padding for all
    this.spaceContent = _.debounce(spaceContent, 250).bind(this)
    this.updater = new UpdateScheduler(pm, 'selectionChange activeMarkChange commandsChanged', this.spaceContent)
    this.updater.force()

    // Fake fixed
    this.menuEl.style.position = 'absolute'
    this.onScroll = onScroll.bind(this)
    window.addEventListener('scroll', this.onScroll)
  }
  teardown () {
    if (!this.menuEl) {
      return
    }
    this.menuEl.style.position = 'fixed'
    this.menuEl.style.top = '0px'
    window.removeEventListener('scroll', this.onScroll)
    this.updater.detach()
  }
}
