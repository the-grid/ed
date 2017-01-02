import _ from '../util/lodash'

let lastMenuHeight = 0
let boundSpaceContent = function () {}
let boundOnScroll = function () {}

const spaceContent = function (menuEl, contentEl) {
  menuEl.style.minHeight = 'inherit'
  const menuHeight = menuEl.offsetHeight
  if (lastMenuHeight !== menuHeight) {
    lastMenuHeight = menuHeight
    contentEl.style.paddingTop = (menuHeight + 36) + 'px'
  }
}

const onScroll = function (menuEl, contentEl) {
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

      console.log('view', menuEl)

      // Fake fixed
      menuEl.style.position = 'absolute'
      boundOnScroll = onScroll.bind(this, menuEl, contentEl)
      window.addEventListener('scroll', boundOnScroll)

      // Padding for content
      boundSpaceContent = _.debounce(spaceContent, 100).bind(this, menuEl, contentEl)
      window.addEventListener('resize', boundSpaceContent)

      // init
      boundSpaceContent()
      boundOnScroll()
    }, 0)

    return {
      update: function (editorView) {
        spaceContent()
      },
      destroy: function () {
        // menuEl.style.position = 'inherit'
        window.removeEventListener('scroll', boundOnScroll)
        window.removeEventListener('resize', boundSpaceContent)
      },
    }
  },
}
