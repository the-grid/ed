import uuid from 'uuid'
import {isUrl} from '../util/url'


export default class ShareUrl {
  constructor (pm, options) {
    this.boundTestPrevUrl = this.testPrevUrl.bind(this)
    const {ed} = options
    this.ed = ed
    this.pm = pm
    this.pm.on.change.add(this.boundTestPrevUrl)
  }
  detach () {
    this.pm.on.change.remove(this.boundTestPrevUrl)
  }
  testPrevUrl () {
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
    // TODO this will be fixed in PM 082
    // const url = prevNode.textContent.trim()
    if (!prevNode.content.content[0] || !prevNode.content.content[0].text) return
    const url = prevNode.content.content[0].text.trim()
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
}
