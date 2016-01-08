import {InputRule} from 'prosemirror/src/inputrules'
import {Pos} from 'prosemirror/src/model'

import {iFrame} from '../schema/iframe'

window._focusCodeMirror = (el) => {
  el.contentWindow.document.getElementsByTagName('textarea')[1].focus()
}

iFrame.register(
  'autoInput',
  new InputRule('startCodeBlock', /^__$/, '_',
    function (pm, _, pos) {
      pm.tr.setBlockType(
        pos,
        pos,
        this,
        {
          'data-embed-type': 'ced',
          params: '',
          src: '../../node_modules/@the-grid/ced/editor/index.html',
          onload: 'window._focusCodeMirror(this);'
        }
      )
      .delete(new Pos(pos.path, 0), pos)
      .apply()
    }
  )
)

export default class CodeEmbedder {
  constructor (ed) {}
  teardown () {}
}
