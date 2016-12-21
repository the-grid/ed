import _ from '../util/lodash'

function onScroll (event) {
  if (!this.menuEl) return
  const contentTop = this.contentEl.getBoundingClientRect().top
  if (contentTop > 0) {
    this.menuEl.style.top = '0px'
    return
  }
  this.menuEl.style.top = (0 - contentTop) + 'px'
}

function spaceContent () {
  if (!this.menuEl) return
  this.menuEl.style.minHeight = 'inherit'
  const menuHeight = this.menuEl.offsetHeight
  if (this.menuHeight !== menuHeight) {
    this.menuHeight = menuHeight
    this.contentEl.style.paddingTop = (menuHeight + 36) + 'px'
  }
}


export default {
  state: {
    init: function (config, instance) {
      // Padding for all
      this.spaceContent = _.debounce(spaceContent, 100).bind(this)

      // Fake fixed
      this.onScroll = onScroll.bind(this)
      window.addEventListener('scroll', this.onScroll)
      window.addEventListener('resize', this.spaceContent)

      // init after editor mounted
      setTimeout(() => {
        this.menuEl = this.props.elMirror.querySelector('.ProseMirror-menubar')
        if (!this.menuEl) {
          throw new Error("Trying to init FixedMenuHack without menu")
        }
        this.contentEl = this.props.elMirror.querySelector('.ProseMirror-content')

        this.menuEl.style.position = 'absolute'
        this.spaceContent()
        this.onScroll()
      }, 0)
    },
    applyAction: function (action) {
      console.log(action)
      if (action.type === 'selection') {
        this.spaceContent()
      }
    },
  },
  // detach () {
  //   if (!this.menuEl) {
  //     return
  //   }
  //   window.removeEventListener('scroll', this.onScroll)
  //   window.removeEventListener('resize', this.spaceContent)
  //   this.updater.detach()
  // }
}
