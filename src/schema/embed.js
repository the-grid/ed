import {Block, Textblock, Attribute, Pos} from 'prosemirror/src/model'
import {elt} from 'prosemirror/src/dom'
import {wrapIn} from './utils'

const dinos = ["brontosaurus", "stegosaurus", "triceratops", "tyrannosaurus", "pterodactyl"]

export class Embed extends Block {}

// 
Embed.register('parseDOM', {
  tag: 'div',
  rank: 25,
  parse: function (dom, context) {
    let type = dom.getAttribute("dino-type") //!!!!
    if (!type) return false
    context.insertFrom(dom, this, {type})
  }

})

//
Embed.prototype.isNotEditable = true

//
Embed.gridToDoc = (attrs) => {
  // TODO
  //let {title, description} = attrs
  //let element = elt('div', {},
  //  elt('p', {}, (description || ''))
  //)
  //return element
}

//
//Embed.prototype.serializeDOM = wrapIn('div')
Embed.prototype.serializeDOM = node => elt("img", {
  "dino-type": node.attrs.type,
  class: "dinosaur",
  src: "dino/" + node.attrs.type + ".png",
  title: node.attrs.type
})

//
const dinoOptions = dinos.map(name => ({
  value: name,
  display: () => elt("a", {class: "dinoicon", title: name}, "dino/" + name + ".png")
}))

//
Embed.register("command", {
  name: "selectDino",
  label: "Insert dino",
  run(pm, type) {
    return pm.tr.replaceSelection(this.create({type}), true).apply()
  },
  params: [
    {name: "Dino type", type: "select", options: dinoOptions, default: dinoOptions[0]}
  ],
  display: "select",
  menuGroup: "inline",
  menuRank: 99
})







// Select on click
Embed.prototype.clicked = (_, path, dom, coords) => Pos.from(path)