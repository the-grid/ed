// import {HardBreak, BulletList, OrderedList, ListItem, BlockQuote, Heading, Paragraph, CodeBlock, HorizontalRule,
//         StrongMark, EmMark, CodeMark, LinkMark, Image, Pos} from 'prosemirror/src/model'
//
// import {selectedNodeAttr} from 'prosemirror/src/edit/command'

/*

// Node types

// ;; #path=schema:image:insert #kind=command
// Replace the selection with an [image](#Image) node. Takes paramers
// that specify the image's attributes:
//
// **`src`**`: string`
//   : The URL of the image.
//
// **`alt`**`: string`
//   : The alt text for the image.
//
// **`title`**`: string`
//   : A title for the image.
//
// Registers itself in the inline [menu group](#CommandSpec.menuGroup).

Image.register("command", {
  name: "insert",
  derive: {
    params: [
      {label: "Image URL", attr: "src"},
      {label: "Description / alternative text", attr: "alt",
       prefill: function(pm) { return selectedNodeAttr(pm, this, "alt") || pm.selectedText }},
      {label: "Title", attr: "title"}
    ]
  },
  label: "Insert image",
  menuGroup: "empty(30)",
  display: {
    type: "icon",
    width: 1097, height: 1024,
    path: "M365 329q0 45-32 77t-77 32-77-32-32-77 32-77 77-32 77 32 32 77zM950 548v256h-804v-109l182-182 91 91 292-292zM1005 146h-914q-7 0-12 5t-5 12v694q0 7 5 12t12 5h914q7 0 12-5t5-12v-694q0-7-5-12t-12-5zM1097 164v694q0 37-26 64t-64 26h-914q-37 0-64-26t-26-64v-694q0-37 26-64t64-26h914q37 0 64 26t26 64z"
  }
})

// ;; #path=schema:bullet_list:wrap #kind=command
// Wrap the selection in a bullet list.
//
// **Keybindings:** Alt-Right '*', Alt-Right '-'
//
// Registers itself in the block [menu group](#CommandSpec.menuGroup).

BulletList.register("command", {
  name: "wrap",
  derive: {list: true},
  label: "Wrap the selection in a bullet list",
  menuGroup: "empty(40)",
  display: {
    type: "icon",
    width: 768, height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  keys: ["Alt-Right '*'", "Alt-Right '-'"]
})

// ;; #path=schema:ordered_list:wrap #kind=command
// Wrap the selection in an ordered list.
//
// **Keybindings:** Alt-Right '1'
//
// Registers itself in the block [menu group](#CommandSpec.menuGroup).

OrderedList.register("command", {
  name: "wrap",
  derive: {list: true},
  label: "Wrap the selection in an ordered list",
  menuGroup: "empty(41)",
  display: {
    type: "icon",
    width: 768, height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  keys: ["Alt-Right '1'"]
})

*/
