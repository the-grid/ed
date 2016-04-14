export function isCollapsed (pm) {
  const {anchor, head} = pm.selection
  return (anchor === head)
}
