import {InputRule} from "prosemirror/src/inputrules"
import {CodeBlock, Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {Tooltip} from "prosemirror/src/ui/tooltip"

import {iFrame} from '../schema/iframe'
import {Embed, CodeMirror} from "../schema"

// Block.register("autoInput", new InputRule("autoDino", /^```$/, "`", function(pm, match, pos) {
//   console.log("adsfkjhasdkjfhaskdjfh:::::", match)
//   let start = pos.move(-match[0].length)
//   // pm EditorTransform
//   pm.tr.delete(start, pos).insertInline(start, this.create({type: match[1]})).apply()
// }))


window._focusCodeMirror = (el) => {
  el.contentWindow.document.getElementsByTagName('textarea')[1].focus()
}

iFrame.register(
  "autoInput",
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

export default class CodeEmbedder {}
