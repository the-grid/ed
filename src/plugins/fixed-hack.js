import {UpdateScheduler} from 'prosemirror/src/ui/update'
import _ from '../util/lodash'

function onScroll (event) {
  this.menuEl.style.top = window.scrollY + 'px'
}

function spaceContent () {
  const menuHeight = this.menuEl.style.minHeight
  if (this.menuHeight !== menuHeight) {
    this.menuHeight = menuHeight
    this.contentEl.style.paddingTop = menuHeight
  }
}

export default class FixedMenuBarHack {
  constructor (ed) {
    this.menuEl = document.querySelector('.ProseMirror-menubar')
    if (!this.menuEl) {
      return
    }
    this.contentEl = document.querySelector('.ProseMirror-content')

    // Padding for all
    this.spaceContent = _.debounce(spaceContent, 250).bind(this)
    this.updater = new UpdateScheduler(ed.pm, 'selectionChange activeMarkChange commandsChanged', this.spaceContent)
    this.updater.force()

    // Fake fixed for iOS
    const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent)
    if (!isIOS) {
      return
    }
    this.menuEl.style.position = 'absolute'
    this.onScroll = onScroll.bind(this)
    this.ed = ed
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
