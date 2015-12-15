// Serialize
export function wrapIn(type) {
  return (node, s) => s.renderAs(node, type)
}