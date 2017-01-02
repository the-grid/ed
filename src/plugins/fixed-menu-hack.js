import _ from '../util/lodash'

let lastMenuHeight = 0

let spaceContent = function (menuEl, contentEl) {
  menuEl.style.minHeight = 'inherit'
  const menuHeight = menuEl.offsetHeight
  if (lastMenuHeight !== menuHeight) {
    lastMenuHeight = menuHeight
    contentEl.style.paddingTop = (menuHeight + 36) + 'px'
  }
}

let onScroll = function (menuEl, contentEl) {
  const contentTop = contentEl.getBoundingClientRect().top
  if (contentTop > 0) {
    menuEl.style.top = '0px'
    return
  }
  menuEl.style.top = (0 - contentTop) + 'px'
}

export default {
  view: function (editorView) {
    // init after editor mounted
    setTimeout(() => {
      const menuEl = editorView.content.parentNode.querySelector('.ProseMirror-menubar')
      if (!menuEl) {
        throw new Error('Trying to init FixedMenuHack without menu')
      }
      const contentEl = editorView.content

      // Fake fixed
      menuEl.style.position = 'absolute'
      onScroll = onScroll.bind(this, menuEl, contentEl)
      window.addEventListener('scroll', onScroll)

      // Padding for content
      spaceContent = _.debounce(spaceContent, 100).bind(this, menuEl, contentEl)
      window.addEventListener('resize', spaceContent)

      // init
      spaceContent()
      onScroll()
    }, 0)

    return {
      update: function (editorView) {
        spaceContent()
      },
      destroy: function () {
        // menuEl.style.position = 'inherit'
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', spaceContent)
      },
    }
  },
}
