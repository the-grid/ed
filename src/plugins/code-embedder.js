import {InputRule} from "prosemirror/src/inputrules"
import {CodeBlock, Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {Tooltip} from "prosemirror/src/ui/tooltip"

import {Embed} from "../schema"


//

// Block.register("autoInput", new InputRule("autoDino", /^```$/, "`", function(pm, match, pos) {
//   console.log("adsfkjhasdkjfhaskdjfh:::::", match)
//   let start = pos.move(-match[0].length)
//   // pm EditorTransform
//   pm.tr.delete(start, pos).insertInline(start, this.create({type: match[1]})).apply()
// }))

CodeBlock.register("autoInput", new InputRule("startCodeBlock", /^__$/, "_", function(pm, _, pos) {
  setAs(pm, pos, this, {params: ""})
}))


function setAs(pm, pos, type, attrs) {
  pm.tr.setBlockType(pos, pos, type, attrs)
       .delete(new Pos(pos.path, 0), pos)
       .apply()
}