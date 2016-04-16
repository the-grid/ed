import uuid from 'uuid'
import {isUrl} from '../util/url'

function testPrevUrl () {
  // Entered into a new block, collapsed selection
  const selection = this.ed.pm.selection
  if (!selection.empty) return

  // Current position (under potential url line)
  const currentNode = this.ed.pm.doc.childBefore(selection.anchor)
  if (!currentNode || currentNode.index < 1) return

  // Potential url line
  const index = currentNode.index - 1
  const prevNode = this.ed.pm.doc.maybeChild(index)
  if (!prevNode || prevNode.type.name !== 'paragraph') return

  // Test if url
  const url = prevNode.textContent.trim()
  if (!url || !isUrl(url)) return

  // Make share
  const id = uuid.v4()
  const block =
    { id
    , type: 'placeholder'
    , metadata:
      { status: `Sharing... ${url}`
      , percent: 0
      }
    }
  this.ed.routeChange('PLUGIN_URL', {index, id, block, url})
}

export default class ShareUrl {
  constructor (options) {
    this.testPrevUrl = testPrevUrl.bind(this)
    const {pm, ed} = options
    this.ed = ed
    this.pm = pm
    this.pm.on('change', this.testPrevUrl)
  }
  teardown () {
    this.pm.off('change', this.testPrevUrl)
  }
}
