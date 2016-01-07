// Sync widget overlays with media blocks
import WidgetCode from './widget-code'

const WidgetTypes = {
  code: WidgetCode
}

function onDOMChanged () {
  let els = this.ed.pm.content.querySelectorAll('div[grid-type]')
  for (let i = 0, len = els.length; i < len; i++) {
    let el = els[i]
    let id = el.getAttribute('grid-id')
    let type = el.getAttribute('grid-type')
    if (!id || !type) {
      throw new Error('Bad placeholder!')
    }
    let rectangle = el.getBoundingClientRect()
    this.checkWidget(id, type, rectangle)
  }
}

function checkWidget (id, type, rectangle) {
  if (this.widgets[id]) {
    // Move it
    this.widgets[id].move(rectangle)
  } else {
    // Make it
    this.initializeWidget(id, type, rectangle)
  }
}

function initializeWidget (id, type, rectangle) {
  if (!WidgetTypes[type]) return
  this.widgets[id] = new WidgetTypes[type]({
    widgetContainer: this.el,
    initialRectangle: rectangle
  })
}

export default class PluginWidget {
  constructor (ed) {
    this.onDOMChanged = onDOMChanged.bind(this)
    this.checkWidget = checkWidget.bind(this)
    this.initializeWidget = initializeWidget.bind(this)

    this.ed = ed
    this.widgets = {}
    this.el = document.createElement('div')
    this.el.className = 'GridEdWidgets'
    document.body.appendChild(this.el)
    ed.pm.on('flushed', this.onDOMChanged)
    window.addEventListener('resize', this.onDOMChanged)
  }
  teardown () {
    ed.pm.off('flushed', this.onDOMChanged)
    this.el.parentNode.removeChild(this.el)
    window.removeEventListener('resize', this.onDOMChanged)
  }
}
