import {nodeAboveSelection} from '../util/pm'
import uuid from 'uuid'

function checkUrl (string) {
  return string.match(/^https?:\/\/[^\s]+\.[^\s]+$/)
}

function testPrevUrl () {
  // Entered into a new block
  const currentPos = nodeAboveSelection(this.ed.pm)
  // Only test top-level blocks
  if (!currentPos || (currentPos.path.length !== 0) || (currentPos.offset < 1)) return
  const prevIndex = currentPos.offset - 1
  const prevBlock = this.ed.pm.doc.child(prevIndex)
  if (!prevBlock) return
  const prevText = prevBlock.textContent.trim()
  if (prevText && checkUrl(prevText)) {
    const id = uuid.v4()
    const block = {
      id,
      type: 'placeholder',
      metadata: {
        status: `Sharing... ${prevText}`
      }
    }
    this.ed.replaceBlock(prevIndex, block)
    this.ed.pm.signal('ed.plugin.url', {block: id, url: prevText})
  }
}

export default class ShareUrl {
  constructor (ed) {
    this.testPrevUrl = testPrevUrl.bind(this)
    this.ed = ed
    this.ed.pm.on('change', this.testPrevUrl)
  }
  teardown () {
    this.ed.pm.off('change', this.testPrevUrl)
  }
}
