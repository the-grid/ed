// FIXME shouldn't need to copy this from prosemirror/src/serialize/dom.js ?

import {elt} from 'prosemirror/src/dom'

// Parse
export function parseWrap(dom, context, type, attrs) {
  context.enterFrom(dom, type, attrs)
  context.addAll(dom.firstChild, null, true)
  context.leave()
}

// Serialize
function renderNode(node, options, offset) {
  let dom = node.type.serializeDOM(node, options)
  for (let attr in node.type.attrs) {
    let desc = node.type.attrs[attr]
    if (desc.serializeDOM) desc.serializeDOM(dom, node.attrs[attr], options, node)
  }
  if (options.onRender && node.isBlock)
    dom = options.onRender(node, dom, offset) || dom
  return dom
}

function renderNodesInto(nodes, where, options) {
  for (let i = 0; i < nodes.length; i++) {
    if (options.path) options.path.push(i)
    where.appendChild(renderNode(nodes[i], options, i))
    if (options.path) options.path.pop()
  }
}

function wrap(node, options, type) {
  let dom = elt(type || node.type.name)
  if (!node.isTextblock)
    renderNodesInto(node.children, dom, options)
  else if (options.renderInlineFlat)
    renderInlineContentFlat(node, dom, options)
  else
    renderInlineContent(node.children, dom, options)
  return dom
}

export function wrapIn(type) {
  return (node, options) => wrap(node, options, type)
}