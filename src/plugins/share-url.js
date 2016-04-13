import {nodeAboveSelection} from '../util/pm'
import uuid from 'uuid'
import {isUrl} from '../util/url'

function testPrevUrl () {
  // Entered into a new block
  const currentPos = nodeAboveSelection(this.ed.pm)
  // Only test top-level blocks
  if (!currentPos || (currentPos.path.length !== 0) || (currentPos.offset < 1)) return
  const index = currentPos.offset - 1
  const prevBlock = this.ed.pm.doc.child(index)
  if (!prevBlock) return
  const url = prevBlock.textContent.trim()
  if (!url || !isUrl(url)) return
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
