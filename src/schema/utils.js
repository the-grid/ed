// Parse
export function parseWrap(dom, context, type, attrs) {
  context.enterFrom(dom, type, attrs)
  context.addAll(dom.firstChild, null, true)
  context.leave()
}

// Serialize
export function wrapIn(type) {
  return (node, s) => s.renderAs(node, type)
}